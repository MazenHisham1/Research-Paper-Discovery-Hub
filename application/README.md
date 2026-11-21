# ResearchHub Application Codebase 🚀

This directory contains the entire runnable software application for the **Research Paper Discovery Hub**.

## Structure

```text
application/
├── frontend/             # React 19 + TypeScript + Vite + Ant Design X client
├── server/               # Node.js streaming & multi-provider AI backend (server.mjs)
├── ResearchHub/          # ASP.NET Core 10 Web API backend (.NET C#)
├── .env.example          # Environment variables template
└── ResearchHub.slnx      # Solution file for Visual Studio
```

## Running the Application

### 1. Backend Server (Node.js)
```bash
cd server
npm start
# or: node server.mjs
```
Runs at: `http://localhost:5023`

### 2. Frontend Client
```bash
cd frontend
pnpm install
pnpm dev
```
Runs at: `http://localhost:3000`

### 3. Alternative .NET Backend
```bash
cd ResearchHub
dotnet run
```
Runs at: `http://localhost:5023` (Swagger at `/swagger`)

For the full project overview, API key instructions, and academic milestones, see the root [README.md](../../README.md).
