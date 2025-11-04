# Sistema de Validação de Feed

## 🎯 Objetivo
Garantir que o feed sempre verifique se a informação já existe no banco de dados (Supabase) antes de inserir novos artigos, evitando duplicatas.

## 🔒 Proteções Implementadas

### 1. Validação por URL Único
- **Schema Prisma**: O campo `url` no modelo `Article` é definido como `@unique`
- **Garantia**: O PostgreSQL/Supabase impede inserções duplicadas no nível do banco de dados
- **Localização**: `apps/api/prisma/schema.prisma`

```prisma
model Article {
  id           String   @id @default(cuid())
  sourceId     String
  url          String   @unique  // 👈 Garante unicidade
  // ... outros campos
}
```

### 2. Verificação no RSS Ingestor
- **Localização**: `apps/workers/src/rssIngestor.ts`
- **Processo**:
  1. Para cada artigo do RSS feed
  2. Verifica se já existe no banco usando `findUnique({ where: { url } })`
  3. Se existir, pula (skip) o artigo
  4. Se não existir, insere no banco

### 3. Logs Detalhados
O worker agora fornece logs completos:
- ✨ Novos artigos adicionados
- ℹ️ Artigos ignorados (já existem)
- ❌ Erros encontrados
- 📊 Resumo final com estatísticas

## 📡 Endpoints da API

### GET /v1/feed
Lista os artigos do feed com paginação e filtros.

**Query Parameters**:
- `search`: Busca por título ou descrição
- `category`: Filtra por categoria
- `limit`: Limite de resultados (máx 100)
- `page`: Página atual

### POST /v1/feed/refresh
Endpoint informativo sobre o sistema de atualização automática.

### GET /v1/feed/stats
Retorna estatísticas do feed:
- Total de artigos
- Total de fontes ativas
- Artigos recentes (últimas 24h)
- Estatísticas por fonte

## ⚙️ Funcionamento Automático

O worker (`apps/workers/src/index.ts`) executa automaticamente:
1. **Inicialização**: Executa ingestão imediata ao iniciar
2. **Agendamento**: Roda a cada 5 minutos via cron job
3. **Verificação**: A cada execução, verifica todas as fontes ativas
4. **Validação**: Só insere artigos novos (não duplicados)

## 🚀 Como Usar

### Iniciar o Worker
```bash
cd apps/workers
pnpm install
pnpm dev
```

### Iniciar a API
```bash
cd apps/api
pnpm install
pnpm dev
```

### Consultar Estatísticas
```bash
curl http://localhost:8080/v1/feed/stats
```

## 🛡️ Proteção Contra Duplicatas

### Nível 1: Aplicação
```typescript
const existing = await prisma.article.findUnique({
  where: { url: item.link },
});

if (existing) {
  // Pula o artigo
  continue;
}
```

### Nível 2: Banco de Dados
```sql
-- O PostgreSQL garante via constraint UNIQUE
ALTER TABLE "Article" ADD CONSTRAINT "Article_url_key" UNIQUE ("url");
```

## 📊 Exemplo de Saída do Worker

```
📡 Checking 3 sources...
🛰️ Fetching from TechCrunch...
✨ New article added: Breaking: New AI Model Released...
ℹ️ Article already exists: OpenAI Announces GPT-5...
✨ New article added: Startup Raises $100M...
✅ TechCrunch: 2 new, 1 skipped

🎉 Ingestion Summary:
   ✨ New articles: 5
   ℹ️ Skipped (already exist): 15
   ❌ Errors: 0
```

## 🔄 Fluxo Completo

```
┌─────────────┐
│ RSS Sources │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  RSS Parser     │
│  (5 min cron)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Check if URL   │◄──── SELECT WHERE url = ?
│  exists in DB   │
└──────┬──────────┘
       │
       ├─── Exists? → Skip ✓
       │
       └─── New? → Insert ✨
                    │
                    ▼
              ┌──────────────┐
              │  Supabase    │
              │  PostgreSQL  │
              └──────────────┘
```

## 🧪 Testando a Validação

1. Execute o worker uma primeira vez
2. Observe os logs: todos serão "new articles"
3. Execute novamente imediatamente
4. Observe os logs: todos serão "skipped (already exist)"

Isso confirma que a validação está funcionando corretamente!
