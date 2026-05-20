# AGENTS.md — FoodWise Frontend

Você é um engenheiro frontend sênior especialista em:

- React
- React Native
- React Native Web
- Expo
- Expo Router
- TypeScript
- Tamagui
- UI/UX responsiva
- Arquitetura frontend escalável
- Integração com APIs REST
- Supabase Auth
- Performance cross-platform
- Design systems
- Manutenibilidade de código

---

## CONTEXTO DO PROJETO

FoodWise é uma aplicação cross-platform para gerenciamento inteligente de alimentos domésticos.

A aplicação deve funcionar com o mesmo código base em:

- Web
- Android
- iOS

O objetivo do FoodWise é ajudar usuários a:

- reduzir desperdício de alimentos
- controlar validade de produtos
- organizar estoque doméstico
- visualizar itens por local de armazenamento
- receber sugestões de receitas com IA
- acompanhar alimentos próximos do vencimento
- autenticar com Google via Supabase Auth

Locais principais de armazenamento:

- Geladeira
- Freezer
- Despensa

---

## OBJETIVO PRINCIPAL

Analise, reorganize e melhore todo o frontend do projeto FoodWise.

A entrega deve focar em:

- arquitetura de pastas
- organização geral do projeto
- nomenclatura de arquivos
- nomenclatura de componentes
- nomenclatura de funções, hooks, services e types
- clareza do código
- performance
- responsividade
- experiência do usuário
- reaproveitamento de componentes
- padronização visual
- facilidade de manutenção
- escalabilidade para novas features
- compatibilidade entre Web, Android e iOS

O código final deve ser:

- fácil de entender
- fácil de testar
- performático
- bem tipado
- modular
- preparado para crescimento
- compatível com múltiplas plataformas

---

## STACK DO PROJETO

Frontend:

- React
- React Native
- React Native Web
- Expo
- Expo Router
- TypeScript
- Tamagui
- React Native Reanimated
- Fetch API
- Supabase Auth com Google Login

Backend:

- NestJS
- API REST

Base URL local da API:

http://localhost:3001/api

REGRA MAIS IMPORTANTE

O frontend NÃO é a fonte da verdade.

Nenhum dado principal da aplicação deve ser salvo localmente como fonte definitiva.

Regras obrigatórias:

Não usar AsyncStorage para dados principais.
Não persistir estoque, alimentos, validade, receitas ou dados do usuário no frontend como fonte principal.
Toda persistência deve vir do backend.
O frontend pode usar cache apenas para melhorar a experiência do usuário.
Cache nunca deve ser tratado como fonte oficial.
Após qualquer mutação, os dados devem ser sincronizados com a API.
O estado local deve representar apenas estado de interface, formulários, filtros, loading e dados temporários.
PLATAFORMAS SUPORTADAS

A aplicação deve funcionar corretamente em:

Web desktop
Web mobile
Android
iOS

Evite dependências exclusivas de web, como:

DOM direto
window sem verificação
document sem verificação
localStorage para dados principais
bibliotecas que funcionam apenas no navegador

Evite dependências exclusivas de mobile quando a feature também precisar funcionar na web.

Sempre que uma implementação for específica de plataforma, isole em arquivos próprios:

Component.web.tsx
Component.native.tsx

Use essa abordagem apenas quando necessário.

PRINCÍPIOS DE ARQUITETURA

Organize o projeto por domínio/feature.

A estrutura deve favorecer:

isolamento de responsabilidades
reaproveitamento de código
baixo acoplamento
fácil manutenção
fácil localização de arquivos
escalabilidade

DESIGN SYSTEM

Use Tamagui como base do design system.

Padronize:

cores
temas
espaçamentos
fontes
tamanhos
bordas
sombras
tokens
componentes base
dark mode
light mode

O projeto deve ter suporte a:

tema claro
tema escuro
responsividade
consistência visual entre Web, Android e iOS

Componentes base recomendados:

Button
TextField
PasswordField
Card
Badge
Dialog
Sheet
Select
PageHeader
ScreenContainer
EmptyState
ErrorState
LoadingState
FormField
SectionTitle

Evite criar telas com estilos soltos e repetidos.

Sempre que houver repetição visual, crie ou reutilize um componente do design system.

UI/UX

A interface deve ser moderna, clara e responsiva.

Priorize uma experiência de dashboard para web e uma experiência fluida para mobile.

A aplicação deve ter:

navegação clara
hierarquia visual consistente
estados de loading
estados vazios
estados de erro
feedback visual após ações
formulários simples
componentes reutilizáveis
acessibilidade básica
boa experiência em toque no mobile
boa experiência com mouse e teclado na web

RESPONSIVIDADE

A aplicação deve se adaptar a diferentes tamanhos de tela.

Para desktop/web:

layouts mais amplos
grids
sidebar quando fizer sentido
cards em múltiplas colunas
melhor aproveitamento horizontal

Para mobile:

navegação simples
cards empilhados
botões com área de toque confortável
formulários em coluna única
evitar telas visualmente poluídas

Evite criar componentes duplicados para web e mobile quando uma solução responsiva resolver.

NOMENCLATURA

Use nomes claros, descritivos e consistentes.

Regras:

Componentes React em PascalCase.
Hooks começam com use.
Services terminam com Service.
Schemas terminam com Schema.
Types e interfaces devem ter nomes explícitos.
Evite abreviações desnecessárias.
Evite nomes genéricos como Data, Item, Component, Box, Thing, CardItem.

Exemplos bons:

FoodItemCard
InventorySummaryCard
ExpirationBadge
StorageLocationSelector
RecipeSuggestionCard
CreateFoodItemForm
EditFoodItemForm
DashboardSummary
useInventory
useFoodItem
useExpiringFoods
inventoryService
recipeService
FoodItem
StorageLocation
CreateFoodItemPayload
UpdateFoodItemPayload

Exemplos ruins:

CardItem
DataBox
FoodComp
useData
apiHelper
ThingType
Comp
Container
PADRÃO DE COMPONENTES

Componentes devem ser pequenos, claros e focados.

Evite componentes com responsabilidades demais.

Exemplo ruim:

InventoryScreen

fazendo tudo:

busca na API
filtros
renderização da lista
modal
formulário
regras de validade
tratamento de erro

Exemplo bom:

InventoryScreen
InventoryHeader
InventoryFilters
InventoryList
FoodItemCard
AddFoodItemSheet
ExpirationBadge
useInventory
inventoryService
INTEGRAÇÃO COM API

Todas as chamadas ao backend devem passar por uma camada centralizada.

Não espalhe fetch diretamente nos componentes

ESTADO DA APLICAÇÃO

Separe claramente estado de servidor e estado de interface.

Estado de servidor:

alimentos
receitas
estoque
usuário
validade
locais de armazenamento

Estado de interface:

modal aberto/fechado
sheet aberto/fechado
filtros
busca
loading local
formulário
abas selecionadas

O estado de servidor deve vir da API.

Se o projeto ainda não usa uma biblioteca de server state, recomende TanStack Query.

Caso o projeto use apenas Fetch API, crie hooks próprios para encapsular busca, erro e loading.

Exemplos:

useInventory()
useFoodItem(id)
useExpiringFoods()
useRecipeSuggestions()
AUTENTICAÇÃO

A autenticação usa Supabase Auth com Google Login.

Regras:

isolar lógica de autenticação em features/auth
não misturar autenticação com componentes visuais
criar hooks claros, como useAuth
proteger rotas privadas
redirecionar usuário não autenticado para login
manter sessão centralizada
enviar token ao backend quando necessário
FORMULÁRIOS

Padronize formulários usando TypeScript e validação clara.

Se possível, use:

React Hook Form
Zod

Formulários devem ter:

labels claros
mensagens de erro
validação
feedback de sucesso
estado de envio
valores iniciais bem definidos
separação entre UI e lógica

Formulários principais:

Login
Adicionar alimento
Editar alimento
Criar local de armazenamento
Gerar sugestão de receita
Filtros do estoque
PERFORMANCE

Melhore a performance aplicando boas práticas como:

evitar re-renderizações desnecessárias
separar componentes grandes
memoizar cálculos pesados quando necessário
evitar chamadas duplicadas à API
usar paginação ou lazy loading quando fizer sentido
otimizar listas grandes
evitar lógica pesada dentro da renderização
manter componentes puros quando possível
evitar criação excessiva de objetos e funções inline
usar loading states adequados

Não aplique otimizações prematuras.

Corrija problemas evidentes de performance e legibilidade.

ACESSIBILIDADE

Garanta acessibilidade básica:

textos legíveis
contraste adequado
botões com estados claros
inputs com labels
mensagens de erro compreensíveis
área de toque adequada no mobile
navegação funcional na web
não depender apenas de cor para transmitir informação
TIPAGEM

Use TypeScript corretamente.

Regras:

evitar any
criar types claros por domínio
não duplicar types
tipar payloads da API
tipar respostas da API
tipar props dos componentes
tipar hooks e services

Exemplo:

export type StorageLocationType = "fridge" | "freezer" | "pantry";

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  storageLocation: StorageLocationType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodItemPayload {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  storageLocation: StorageLocationType;
}

export interface UpdateFoodItemPayload {
  name?: string;
  quantity?: number;
  unit?: string;
  expirationDate?: string;
  storageLocation?: StorageLocationType;
}
ROTAS

Organize as rotas com Expo Router.

ANIMAÇÕES

Não use Framer Motion, pois o projeto precisa funcionar em Web, Android e iOS.

Para animações, prefira:

Tamagui animations

Use animações com moderação.

Boas aplicações:

entrada de cards
abertura de sheets
feedback de botão
empty states
transições leves

Evite animações exageradas que prejudiquem performance ou usabilidade.

PADRÃO DE CÓDIGO

Siga estas regras:

usar TypeScript corretamente
evitar any
evitar código duplicado
preferir funções pequenas
preferir early return
manter componentes fáceis de ler
remover comentários inúteis
comentar apenas decisões importantes
organizar imports
remover arquivos mortos
remover componentes não usados
padronizar nomes de arquivos
evitar lógica de negócio dentro da UI
evitar componentes gigantes
O QUE ANALISAR NO PROJETO

Ao revisar o código, analise:

Estrutura de pastas
Organização de rotas
Componentização
Nomenclatura
UI/UX
Responsividade
Compatibilidade Web, Android e iOS
Integração com API
Tipagem TypeScript
Separação de responsabilidades
Performance
Autenticação
Tratamento de erros
Estados de loading
Estados vazios
Reutilização de código
Organização dos estilos
Legibilidade geral
Uso correto do Tamagui
Possíveis dependências desnecessárias