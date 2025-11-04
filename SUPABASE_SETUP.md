# 🔧 Guia: Configurar Supabase no Projeto

## ⚠️ Problema Identificado

Os dados estão sendo salvos em um banco **PostgreSQL local** (`localhost:5432`) em vez do **Supabase**. 

Para resolver isso, você precisa atualizar a variável `DATABASE_URL` para apontar para o Supabase.

---

## 📝 Passo a Passo

### 1️⃣ Obter a Connection String do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **"Project Settings"** (⚙️ ícone de engrenagem no canto inferior esquerdo)
4. Clique em **"Database"** no menu lateral
5. Role até a seção **"Connection string"**
6. Selecione a aba **"URI"**
7. Copie a string que se parece com:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha do seu projeto Supabase!

---

### 2️⃣ Atualizar os Arquivos .env

Você precisa atualizar a `DATABASE_URL` em **3 arquivos**:

#### 📁 `.env` (raiz do projeto)
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
REDIS_URL="redis://localhost:6379"
PORT=8080
NODE_ENV=development
```

#### 📁 `apps/api/.env`
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
REDIS_URL="redis://localhost:6379"
PORT=8080
NODE_ENV=development
```

#### 📁 `apps/workers/.env`
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
REDIS_URL="redis://localhost:6379"
NODE_ENV=development
```

---

### 3️⃣ Rodar as Migrations no Supabase

Depois de configurar a `DATABASE_URL`, rode as migrations para criar as tabelas no Supabase:

```powershell
cd apps\api
npx prisma migrate deploy
```

Ou force o reset (cuidado, isso apaga dados):

```powershell
cd apps\api
npx prisma migrate reset --force
```

---

### 4️⃣ (Opcional) Migrar Dados do Banco Local para o Supabase

Se você quiser manter os 20 artigos que já estão no banco local, você pode migrá-los:

1. Adicione uma variável temporária no `.env` do workers:

```env
SUPABASE_DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

2. Execute o script de migração:

```powershell
cd apps\workers
npx tsx src/migrate-to-supabase.ts
```

---

### 5️⃣ Inserir as Fontes (Sources) no Supabase

Você precisa ter as fontes RSS cadastradas. Execute o seed:

```powershell
cd apps\api
npx prisma db seed
```

Se não tiver seed configurado, rode este script:

```powershell
cd apps\workers
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.source.createMany({
  data: [
    {
      name: 'BBC News',
      country: 'UK',
      language: 'en',
      baseUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
      type: 'rss',
      enabled: true
    },
    {
      name: 'G1',
      country: 'BR',
      language: 'pt',
      baseUrl: 'https://g1.globo.com/rss/g1/',
      type: 'rss',
      enabled: true
    }
  ],
  skipDuplicates: true
}).then(() => { console.log('✅ Sources criadas!'); p.\$disconnect(); });
"
```

---

### 6️⃣ Testar a Conexão

```powershell
cd apps\workers
npx tsx src/test-connection.ts
```

Você deve ver:
```
✅ Conectado ao SUPABASE!
```

---

### 7️⃣ Rodar o Worker para Inserir Artigos

```powershell
cd apps\workers
npm run dev
```

Ou uma vez só:

```powershell
cd apps\workers
npx tsx src/run-ingest.ts
```

---

## ✅ Verificação Final

Depois de configurar tudo:

1. Acesse o Prisma Studio conectado ao Supabase:

```powershell
cd apps\api
npx prisma studio
```

2. Ou verifique direto no painel do Supabase:
   - https://supabase.com/dashboard
   - Vá em **"Table Editor"**
   - Verifique as tabelas `Article` e `Source`

---

## 🆘 Problemas Comuns

### "Error: P1001: Can't reach database server"
- Verifique se a senha está correta na connection string
- Verifique se seu IP está na whitelist do Supabase (Settings > Database > Connection pooling)

### "Error: P3009: migrate found failed migrations"
- Execute: `npx prisma migrate reset --force`

### Tabelas não aparecem no Supabase
- Execute as migrations: `npx prisma migrate deploy`
- Ou force: `npx prisma db push`

---

## 🎯 Resumo dos Comandos

```powershell
# 1. Atualizar DATABASE_URL nos 3 arquivos .env

# 2. Criar tabelas no Supabase
cd apps\api
npx prisma migrate deploy

# 3. Testar conexão
cd ..\workers
npx tsx src/test-connection.ts

# 4. Inserir fontes RSS
cd ..\api
npx prisma db seed

# 5. Rodar ingestão
cd ..\workers
npx tsx src/run-ingest.ts

# 6. Verificar dados
cd ..\api
npx prisma studio
```

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me envie:
1. A mensagem de erro completa
2. A saída do comando `npx tsx src/test-connection.ts`
3. Confirme se você consegue acessar o Supabase Dashboard
