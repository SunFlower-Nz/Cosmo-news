<h1 align="center">🪐 Cosmo — Connected to the World</h1>

<p align="center">
  <b>A modern, intelligent, and global news application.</b><br>
  Stay connected with everything happening around the world — fast, simple, and beautifully designed.
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-React_Native-000000?style=flat-square&logo=expo&logoColor=white" /></a>
  <a href="https://www.fastify.io/"><img src="https://img.shields.io/badge/Fastify-Framework-000000?style=flat-square&logo=fastify&logoColor=white" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" /></a>
</p>

---

## 🌐 Overview

**Cosmo** is a full-stack news application designed to centralize information from multiple sources around the globe.  
It combines a **mobile app**, a **powerful backend**, and an **automated ingestion system**, delivering curated content by **country**, **category**, and **topic** — all in real time.

---

## ✨ Key Features

- 🌍 **News by Country & Category** — Follow only what matters to you  
- ⚡ **Fast Feed** — Infinite scroll with smart caching  
- 📰 **Reading Mode** — Clean, distraction-free article view  
- 💾 **Offline Reading** — Save and read later  
- 🌓 **Dark Mode** — Elegant and eye-comforting design  
- 🧭 **Multi-source Integration** — RSS and API adapters  
- 🔔 **Future: Notifications & AI summaries (TL;DR)**  

---

## 🧠 Philosophy

> “Information is universal — and so should be access to it.”

Cosmo aims to **democratize access to knowledge**, bringing global events closer to each person in their own language, with a smooth, modern experience.

---

## ⚙️ Architecture

```
Mobile App (React Native + Expo)
            ↓
   API Gateway (Fastify / Node.js)
            ↓
   Ingestion Workers (RSS / APIs)
            ↓
      Database (PostgreSQL)
            ↓
      Cache Layer (Redis)
```

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend (App)** | React Native · Expo · TypeScript · React Query · NativeWind |
| **Backend (API)** | Node.js · Fastify · Prisma ORM · Zod · Swagger |
| **Workers** | BullMQ · RSS Parser · Node-Cron |
| **Database / Cache** | PostgreSQL · Redis |
| **Dev Tools** | Docker · PNPM · TurboRepo · Husky · ESLint · Prettier |

---

## 🗂️ Repository Structure

```
apps/
  api/      → Fastify + Prisma backend
  mobile/   → React Native (Expo) app
  workers/  → RSS ingestion workers
packages/
  config/   → Shared TypeScript and ESLint configs
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20  
- PNPM ≥ 9  
- Docker + Docker Compose

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/SunFlower-Nz/Cosmo-news.git
cd Cosmo-news

# 2. Start database and cache
docker compose up -d

# 3. Install dependencies
pnpm install

# 4. Run API + Workers in dev mode
pnpm dev

# 5. Run mobile app
cd apps/mobile
pnpm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API
PORT=8080
DATABASE_URL=postgresql://news:news@localhost:5432/news
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

Create a `.env` file in `apps/mobile`:

```env
# Mobile App
EXPO_PUBLIC_API=http://192.168.0.10:8080
DEFAULT_COUNTRY=BR
```

---

## 🧪 Quality & Testing

| Tool | Purpose |
|------|---------|
| **ESLint + Prettier** | Linting and formatting |
| **Vitest** | Unit tests |
| **Supertest** | API integration tests |
| **Husky + Lint-Staged** | Pre-commit hooks |
| **TurboRepo** | Monorepo orchestration |

---

## 📈 Roadmap

- [x] Project setup & monorepo foundation
- [x] API base (Fastify + Swagger + Prisma)
- [x] Database + seed (categories, sources)
- [ ] RSS ingestion (BR + Global)
- [ ] `/v1/feed` & `/v1/search` endpoints
- [ ] Expo app: Home / Explore / Saved / Search tabs
- [ ] Offline mode and caching
- [ ] Notifications and trending topics
- [ ] AI-powered summaries (TL;DR)
- [ ] Text-to-speech reading mode

---

## 🧭 Philosophy of Design

Cosmo follows **minimalism + clarity**:

- Every pixel should serve purpose
- Typography and color create focus, not noise
- Navigation should feel intuitive and organic, not forced
- Performance and accessibility are first-class citizens

---

## 💡 Future Enhancements

- 🧠 AI summaries & topic clustering
- 🗣️ Text-to-Speech (TTS) playback
- 🕵️ Smart alerts by keyword
- 📊 Personal reading insights
- 🌐 Multilingual support (EN / PT / ES)
- 🔒 Privacy-first analytics (anonymous usage metrics)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit with conventional commits
4. Submit a PR with a clear description

```bash
git checkout -b feat/new-feature
git commit -m "feat: add category filter"
git push origin feat/new-feature
```

## 🧾 License

MIT License — feel free to use, modify, and share.

---

<p align="center">
  <b>Cosmo — You connected to the world.</b><br>
  🌌 Follow the flow of information. Understand the world, effortlessly.
</p>
