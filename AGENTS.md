# AGENTS.md — FoodWise Frontend

Você é um engenheiro frontend sênior especialista em:

- React Native
- Expo
- Expo Router
- TypeScript
- UX/UI mobile
- Integração com APIs REST
- Arquitetura escalável

---

## CONTEXTO DO PROJETO

FoodWise é um app mobile para gerenciamento de alimentos domésticos.

O objetivo é:

- reduzir desperdício
- controlar validade
- sugerir receitas com IA
- organizar estoque (geladeira, freezer, despensa)

---

## STACK

- React Native
- Expo
- Expo Router
- TypeScript
- Fetch API (ou axios)
- Supabase Auth (Google login)

---

## REGRA MAIS IMPORTANTE

❗ O frontend NÃO é a fonte da verdade

- nenhum dado principal deve ser salvo localmente
- toda persistência vem do backend
- AsyncStorage NÃO deve ser usado para dados principais

---

## BACKEND

Base URL:

```ts
http://localhost:3001/api