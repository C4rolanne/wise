# FoodWise - explicacao tecnica do projeto

Este arquivo explica como o projeto esta estruturado e como ele funciona atualmente em nivel de codigo e logica.

FoodWise e um app frontend cross-platform feito com React, React Native, Expo, Expo Router, TypeScript e Tamagui. A mesma base de codigo atende Web, Android e iOS.

O objetivo do app e ajudar o usuario a controlar alimentos domesticos, acompanhar validade, organizar itens por local de armazenamento, receber sugestoes com IA e autenticar com Google usando Supabase Auth.

## Principio principal

O frontend nao e a fonte da verdade.

Os dados principais da aplicacao ficam no backend NestJS via API REST. O frontend apenas consome, exibe, filtra temporariamente e envia mutacoes para o backend.

Dados principais:

- alimentos
- estoque
- validade
- usuario
- sugestoes vindas da API
- dados de perfil

Esses dados nao devem ser persistidos no frontend como fonte oficial.

O frontend pode guardar estados temporarios, como:

- loading
- erro
- formulario
- filtros
- modal/sheet aberto
- idioma/tema da sessao
- mensagens locais do chat enquanto a tela esta aberta

## Stack atual

- React
- React Native
- React Native Web
- Expo
- Expo Router
- TypeScript
- Tamagui
- Supabase Auth
- Fetch API
- Expo Image Picker
- Expo Web Browser

Backend esperado:

```txt
http://localhost:3001/api
```

No Android emulator, o frontend usa:

```txt
http://10.0.2.2:3001/api
```

## Estrutura de pastas

```txt
app/
  _layout.tsx
  index.tsx
  inventory.tsx
  refrigerator.tsx
  freezer.tsx
  pantry.tsx
  scan.tsx
  profile.tsx
  auth/callback.tsx
  (tabs)/
    _layout.tsx
    dashboard.tsx
    assistant.tsx

hooks/
  useAuth.ts
  useFoods.ts
  useUser.ts
  useImageAnalysis.ts
  useChat.ts

services/
  api.ts
  auth.service.ts
  foods.service.ts
  users.service.ts
  ai.service.ts
  supabase.ts

src/
  lib/api/apiClient.ts
  shared/
    i18n/
    navigation/
    theme/
    ui/
  features/
    inventory/
      components/
      screens/
      services/

types/
  api.ts
  food.ts
  user.ts
  ai.ts

utils/
  foodDisplay.ts
```

## Rotas e telas

O projeto usa Expo Router. Cada arquivo dentro de `app/` representa uma rota.

### `app/_layout.tsx`

E o layout raiz da aplicacao.

Responsabilidades:

- inicializar o `TamaguiProvider`
- inicializar o tema claro/escuro
- envolver o app com `AppPreferencesProvider`
- registrar as rotas com `Stack`
- esconder headers nativos para usar layout proprio

Fluxo simplificado:

```tsx
<TamaguiProvider>
  <AppPreferencesProvider>
    <RootStack />
  </AppPreferencesProvider>
</TamaguiProvider>
```

O `RootStack` usa o tema atual vindo de `useAppPreferences()`.

### `app/index.tsx`

Tela inicial e entrada do login.

Ela:

- mostra o logo/pet animado
- mostra botoes de tema e idioma
- verifica se ja existe sessao
- redireciona usuario autenticado para `/(tabs)/dashboard`
- chama `signInWithGoogle()` quando o usuario clica no botao de login

Trecho importante:

```ts
if (!loading && isAuthenticated) {
  router.replace("/(tabs)/dashboard");
}
```

### `app/inventory.tsx`

Tela principal de CRUD do estoque.

Ela permite:

- listar alimentos
- filtrar por local
- filtrar por validade
- criar alimento
- editar alimento
- excluir alimento

Usa:

- `useFoods()`
- `InventoryFilters`
- `FoodItemCard`
- `FoodItemEditorForm`
- `Sheet` do Tamagui para abrir formulario

### `app/refrigerator.tsx`, `app/freezer.tsx`, `app/pantry.tsx`

Essas telas reaproveitam a mesma tela de estoque por local:

```tsx
<StorageInventoryScreen storage="refrigerator" />
<StorageInventoryScreen storage="freezer" />
<StorageInventoryScreen storage="pantry" />
```

A diferenca entre elas é apenas o filtro `storage`.

### `app/(tabs)/dashboard.tsx`

Atualmente funciona como dashboard inicial e aponta para a geladeira:

```tsx
<StorageInventoryScreen storage="refrigerator" />
```

### `app/(tabs)/assistant.tsx`

Tela do assistente de IA.

Ela:

- mostra conversa local
- envia mensagens para `/ai/chat`
- exibe resposta do assistente
- exibe receitas, avisos e alimentos priorizados quando a API retorna esses campos

### `app/scan.tsx`

Tela de analise de imagem.

Ela:

- pede permissao de camera ou galeria
- captura/seleciona imagem
- envia base64 para `/ai/analyze-image`
- recebe sugestao de alimento
- preenche formulario
- usuario revisa
- salva no backend com `createFood()`

A IA nao salva automaticamente. Ela apenas sugere.

### `app/profile.tsx`

Tela de perfil.

Ela:

- carrega usuario com `/users/me`
- permite editar nome
- salva com `PATCH /users/me`
- permite logout

## Layout principal

O layout interno das telas autenticadas fica em:

```txt
src/shared/navigation/AppShell.tsx
```

Responsabilidades do `AppShell`:

- sidebar no desktop
- menu lateral no mobile
- animacao push/pull do menu mobile
- header com titulo/subtitulo
- botoes de tema e idioma
- centralizacao do conteudo
- largura maxima por tela

No desktop, a sidebar fica sempre visivel.

No mobile, o menu abre com `Animated.spring`, vindo da esquerda para a direita, e fecha voltando para a esquerda.

## Login e autenticacao

O login usa Supabase Auth com Google.

Camadas envolvidas:

```txt
app/index.tsx
  -> hooks/useAuth.ts
    -> services/auth.service.ts
      -> services/supabase.ts
```

### `services/supabase.ts`

Cria o client Supabase:

```ts
createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

No web:

- usa `window.localStorage` para sessao Supabase

No Android/iOS:

- usa `AsyncStorage` para sessao Supabase

Importante: esse uso de storage e para sessao de autenticacao. Nao e fonte da verdade para alimentos, estoque ou usuario.

Variaveis necessarias:

```txt
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### `services/auth.service.ts`

Contem a logica real de auth.

Funcoes principais:

```ts
getSession()
getAccessToken()
signInWithGoogle()
signOut()
onAuthStateChange()
me()
```

#### Fluxo do Google Login

1. Cria URL de callback:

```ts
const redirectTo = Linking.createURL("auth/callback");
```

2. Pede ao Supabase a URL de OAuth:

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo,
    skipBrowserRedirect: true,
  },
});
```

3. Abre o navegador:

```ts
WebBrowser.openAuthSessionAsync(data.url, redirectTo);
```

4. Quando o login termina, o Supabase redireciona para o callback.

5. O service extrai parametros da URL.

Se vier `code`, troca por sessao:

```ts
supabase.auth.exchangeCodeForSession(code);
```

Se vier `access_token` e `refresh_token`, seta a sessao diretamente:

```ts
supabase.auth.setSession({
  access_token,
  refresh_token,
});
```

6. A sessao fica salva pelo Supabase.

### `hooks/useAuth.ts`

Hook usado pelas telas.

Estados mantidos:

```ts
session
user
loading
error
```

Valores expostos:

```ts
isAuthenticated
accessToken
signInWithGoogle
signOut
refresh
```

Fluxo ao montar:

1. chama `refresh()`
2. `refresh()` chama `authService.getSession()`
3. se existe sessao, chama `authService.me()`
4. `authService.me()` chama o backend em `/auth/me`
5. registra `onAuthStateChange()` para reagir a mudancas de sessao

O estado `isAuthenticated` e calculado assim:

```ts
Boolean(session)
```

### Como as telas sao protegidas

Nao existe um guard central unico.

Cada tela protegida chama `useAuth()` e decide o que renderizar.

Exemplo logico:

```ts
if (loading) {
  return <LoadingState />;
}

if (!isAuthenticated) {
  return <LoginRequiredState />;
}

return <ConteudoProtegido />;
```

Isso aparece em telas como:

- `StorageInventoryScreen`
- `inventory.tsx`
- `scan.tsx`
- `profile.tsx`
- `assistant.tsx`

## Cliente HTTP e API

O cliente central fica em:

```txt
src/lib/api/apiClient.ts
```

Ele e reexportado em:

```txt
services/api.ts
```

Funcao principal:

```ts
apiRequest<T>(path, options)
```

Responsabilidades:

- montar URL final
- montar query params
- serializar body como JSON
- adicionar `Content-Type`
- buscar token Supabase
- adicionar header `Authorization`
- fazer `fetch`
- parsear JSON
- normalizar erros de API

Por padrao, toda request e autenticada:

```ts
authenticated = true
```

Antes de chamar o backend:

```ts
const { data } = await supabase.auth.getSession();
const token = data.session?.access_token;
```

Se nao houver token:

```ts
throw new ApiError(401, "Usuario nao autenticado");
```

Se houver token:

```ts
Authorization: Bearer <token>
```

## Estoque e alimentos

Tipos principais:

```txt
types/food.ts
```

Principais tipos:

```ts
Food
FoodStorage
FoodValidityStatus
FoodFilters
CreateFoodInput
UpdateFoodInput
```

Locais possiveis:

```ts
"refrigerator" | "freezer" | "pantry"
```

### Service de estoque

Fica em:

```txt
src/features/inventory/services/inventoryService.ts
```

Endpoints:

```txt
GET    /foods
GET    /foods/:id
POST   /foods
PATCH  /foods/:id
DELETE /foods/:id
```

O metodo `list()` aceita filtros:

```ts
inventoryService.list({
  storage,
  validityStatus,
});
```

Esses filtros viram query params.

Exemplo:

```txt
GET /foods?storage=freezer
```

### Hook `useFoods`

Fica em:

```txt
hooks/useFoods.ts
```

Ele encapsula a logica de tela para alimentos.

Estados:

```ts
foods
loading
saving
error
success
```

Funcoes:

```ts
refresh()
createFood(input)
updateFood(id, input)
deleteFood(id)
```

Quando o hook monta, ele chama `refresh()`.

Quando cria, edita ou exclui, ele chama o service e depois executa `refresh()` novamente.

Isso garante que a tela volte a sincronizar com o backend depois de uma mutacao.

### Tela `inventory.tsx`

Controla:

- filtros locais
- abertura/fechamento do sheet
- alimento em edicao
- dados do formulario
- validacao simples antes de salvar
- alerta de sucesso/erro

Fluxo de criacao:

```txt
usuario clica em adicionar
-> abre Sheet
-> preenche FoodItemEditorForm
-> valida campos obrigatorios
-> createFood(payload)
-> POST /foods
-> refresh()
-> fecha Sheet
```

Fluxo de edicao:

```txt
usuario clica em editar
-> preenche formulario com dados do alimento
-> updateFood(id, payload)
-> PATCH /foods/:id
-> refresh()
-> fecha Sheet
```

Fluxo de exclusao:

```txt
usuario clica em excluir
-> Alert de confirmacao
-> deleteFood(id)
-> DELETE /foods/:id
-> refresh()
```

## Telas por local de armazenamento

Arquivo:

```txt
src/features/inventory/screens/StorageInventoryScreen.tsx
```

Essa tela e reutilizada por:

- geladeira
- freezer
- despensa
- dashboard

Ela recebe:

```ts
storage: FoodStorage
```

E chama:

```ts
useFoods({ storage })
```

Ela tambem:

- atualiza ao focar na tela com `useFocusEffect`
- permite pull-to-refresh
- mostra loading
- mostra erro
- mostra estado vazio
- renderiza `FlatList` com `FoodItemCard`

## Componentes de inventario

### `FoodItemCard`

Arquivo:

```txt
src/features/inventory/components/FoodItemCard.tsx
```

Exibe:

- nome do alimento
- categoria
- local de armazenamento
- status de validade
- data de fabricacao
- data de validade
- botoes de editar/excluir quando passados por props

### `FoodItemEditorForm`

Arquivo:

```txt
src/features/inventory/components/FoodItemEditorForm.tsx
```

Formulario reutilizado para:

- criar alimento
- editar alimento
- revisar sugestao de IA

Campos:

- nome
- categoria
- local
- data de fabricacao
- data de validade

Tambem contem helpers:

```ts
emptyFoodItemEditorForm
toFoodItemEditorFormData(food)
toCreateFoodPayload(form)
```

### `InventoryFilters`

Arquivo:

```txt
src/features/inventory/components/InventoryFilters.tsx
```

Renderiza filtros de:

- local
- validade

O estado fica na tela `inventory.tsx`.

### `StorageLocationSelector`

Arquivo:

```txt
src/features/inventory/components/StorageLocationSelector.tsx
```

Renderiza atalhos para:

- geladeira
- freezer
- despensa

Usa `router.push()` para navegar.

## Perfil de usuario

Hook:

```txt
hooks/useUser.ts
```

Service:

```txt
services/users.service.ts
```

Endpoints:

```txt
GET   /users/me
PATCH /users/me
```

Fluxo:

```txt
profile.tsx
-> useUser()
-> usersService.me()
-> apiRequest("/users/me")
```

Para atualizar:

```txt
update({ name, fullName })
-> PATCH /users/me
-> atualiza estado local com resposta da API
```

## Scan e analise de imagem com IA

Tela:

```txt
app/scan.tsx
```

Hook:

```txt
hooks/useImageAnalysis.ts
```

Service:

```txt
services/ai.service.ts
```

Endpoint:

```txt
POST /ai/analyze-image
```

Fluxo:

```txt
usuario tira foto ou escolhe imagem
-> Expo Image Picker retorna asset
-> hook exige base64
-> envia imageBase64 e mimeType para API
-> API retorna sugestao
-> tela preenche formulario
-> usuario revisa
-> createFood()
-> POST /foods
```

Estados do hook:

```ts
imageUri
result
suggestion
loading
error
```

Funcoes:

```ts
takePhoto()
pickImage()
analyzeAsset(asset)
reset()
```

## Assistente de IA

Tela:

```txt
app/(tabs)/assistant.tsx
```

Hook:

```txt
hooks/useChat.ts
```

Service:

```txt
services/ai.service.ts
```

Endpoint:

```txt
POST /ai/chat
```

Fluxo:

```txt
usuario digita mensagem
-> sendMessage(content)
-> adiciona mensagem do usuario no estado local
-> envia historico simplificado para API
-> recebe resposta
-> adiciona mensagem do assistente
```

A resposta pode conter:

- texto
- receitas
- avisos
- alimentos priorizados

O chat e estado local da interface. Atualmente nao e persistido no backend.

## Tema, paleta e visual

Arquivos:

```txt
src/shared/theme/appTheme.ts
src/shared/theme/AppPreferencesProvider.tsx
```

A paleta base fica em:

```ts
foodWisePalette
```

Ela foi criada com referencia visual a comida:

- apricot: laranja pastel principal
- herb: verde de alimentos/frescor
- tomato: erros/danger
- honey: avisos/warning
- blueberry: informacao
- neutral: fundos e textos

Os temas sao derivados dessa paleta:

```ts
appThemes.light
appThemes.dark
```

Para alterar a identidade visual sem quebrar o sistema, altere primeiro `foodWisePalette` e depois, se necessario, o mapeamento em `appThemes`.

Raios padronizados:

```ts
appRadii = {
  sm,
  md,
  lg,
  xl,
  pill,
}
```

Componentes usam esses raios para manter o visual arredondado.

### Preferencias do app

`AppPreferencesProvider` guarda:

```ts
colorScheme
language
colors
toggleColorScheme()
toggleLanguage()
```

Essas preferencias sao usadas por:

- `AppShell`
- tela inicial
- componentes visuais
- sistema de traducao

## Traducoes

Arquivos:

```txt
src/shared/i18n/translations.ts
src/shared/i18n/useTranslation.ts
```

Idiomas atuais:

- `pt-BR`
- `en`

Uso:

```ts
const { t } = useTranslation();
t("inventory.title");
```

Algumas traducoes aceitam parametros:

```ts
t("common.itemsCount", { count: foods.length })
```

## Componentes compartilhados de UI

Pasta:

```txt
src/shared/ui
```

Principais componentes:

- `AppButton`
- `AppCard`
- `FormField`
- `PickerField`
- `Badge`
- `StateView`
- `SectionTitle`
- `ScreenContainer`
- `PageHeader`

Eles centralizam estilo, tema, cores e comportamento visual.

Exemplo:

- `AppButton` ja aplica cursor pointer no web
- `AppCard` ja usa superficie e sombra do tema
- `FormField` ja usa cores do tema
- `StateView` padroniza loading, erro e vazio

## Guia rapido para alterar UI

Este projeto nao usa `div`, `button`, `className` e Tailwind como em Next.js.

Em React Native/Tamagui, o mapeamento mental e:

```txt
div flex-row      -> XStack
div flex-col      -> YStack
p, span, h1       -> Text, H1
button            -> AppButton ou Button do Tamagui
onClick           -> onPress
className         -> props Tamagui + style={{ ... }}
border rounded    -> borderRadius, borderWidth, borderColor
hover             -> hoverStyle ou onHoverIn/onHoverOut
active/click      -> pressStyle
```

### Onde mudar o layout principal

Header, sidebar, menu mobile e area de conteudo ficam em:

```txt
src/shared/navigation/AppShell.tsx
```

Se quiser mudar:

- header
- logo depois do login
- itens da sidebar
- animacao do menu lateral
- alinhamento dos botoes do topo
- largura maxima do conteudo

edite o `AppShell`.

### Onde mudar botoes

O botao padrao do app fica em:

```txt
src/shared/ui/AppButton.tsx
```

Use assim:

```tsx
<AppButton onPress={handleSave}>
  Salvar
</AppButton>
```

Com icone:

```tsx
<AppButton
  leftIcon={<MaterialCommunityIcons name="plus" size={18} color={colors.primaryText} />}
  onPress={openSheet}
>
  Adicionar
</AppButton>
```

Botao circular de icone:

```tsx
<AppButton
  circular
  icon={<MaterialCommunityIcons name="menu" size={24} color={colors.text} />}
  onPress={openMenu}
/>
```

Tons disponiveis:

```tsx
<AppButton tone="primary" />
<AppButton tone="secondary" />
<AppButton tone="danger" />
<AppButton tone="ghost" />
```

Tambem existe `chromeless`, usado para botoes visuais de icone:

```tsx
<AppButton chromeless circular icon={...} onPress={...} />
```

### Eventos de botao

Em React Native, use `onPress`, nao `onClick`.

```tsx
<AppButton onPress={() => router.push("/inventory")}>
  Ir para estoque
</AppButton>
```

Para estado pressionado, use `pressStyle` dentro do componente base ou em um componente Tamagui:

```tsx
pressStyle={{ scale: 0.96, opacity: 0.9 }}
```

Para hover no web:

```tsx
hoverStyle={{ scale: 1.02 }}
```

Para animacoes de hover mais controladas, use `Animated.Value` com `onHoverIn` e `onHoverOut`, como os itens da sidebar em `AppShell.tsx`.

### Bordas e linhas

Em vez de classes como `border border-gray-200 rounded-xl`, use:

```tsx
style={{
  borderWidth: 1,
  borderColor: colors.surfaceStrong,
  borderRadius: appRadii.lg,
}}
```

Neste projeto, a preferencia visual atual e evitar muitas linhas de borda. Use primeiro:

- cor de fundo diferente
- sombra leve
- espacamento
- radius

Use borda quando precisar separar estados, erro ou foco.

### Animacoes

Microinteracoes simples:

- `hoverStyle`
- `pressStyle`
- Tamagui animations

Animacoes com mais controle:

- `Animated` do React Native

Atualmente o projeto usa `Animated` para:

- pet/logo da tela inicial
- menu lateral mobile
- hover/seleção animada da sidebar
- `AppBottomSheet`

### Bottom sheet seguro

O formulario de criar/editar alimento usa:

```txt
src/shared/ui/AppBottomSheet.tsx
```

Ele foi criado com `Modal + Animated` para evitar um erro interno do `Sheet` do Tamagui no web:

```txt
Cannot read properties of undefined (reading 'setValue')
```

Use `AppBottomSheet` quando precisar de painel inferior com fallback seguro.

## Utilitarios de exibicao

Arquivo:

```txt
utils/foodDisplay.ts
```

Contem helpers para:

- nomes de categorias
- formatacao de data
- status de validade
- labels traduziveis

Funcoes importantes:

```ts
getCategoryName(category, t?)
formatDate(dateString, notInformedLabel?)
getFoodStatusValue(food)
getFoodStatusLabel(food, t?)
```

## Fluxo geral de dados

Fluxo padrao:

```txt
Tela
-> Hook
-> Service
-> apiRequest
-> Backend REST
```

Com autenticacao:

```txt
apiRequest
-> supabase.auth.getSession()
-> pega access_token
-> adiciona Authorization: Bearer token
-> fetch()
```

Exemplo de listagem de alimentos:

```txt
StorageInventoryScreen
-> useFoods({ storage })
-> inventoryService.list(filters)
-> apiRequest("/foods", { query: filters })
-> GET /foods?storage=refrigerator
-> atualiza foods
-> renderiza FlatList
```

Exemplo de criacao de alimento:

```txt
inventory.tsx
-> FoodItemEditorForm
-> handleSubmit()
-> createFood(payload)
-> inventoryService.create(payload)
-> POST /foods
-> refresh()
-> GET /foods
-> atualiza tela
```

## Tratamento de loading, erro e vazio

O padrao atual e:

- hooks controlam `loading`, `error`, `saving`
- telas decidem qual estado renderizar
- `StateView` centraliza visual de loading, erro e vazio

Exemplo logico:

```ts
if (loading) return <StateView loading title="..." />;
if (error) return <StateView title="..." description={error} />;
if (foods.length === 0) return <StateView title="..." />;
return <FlatList data={foods} />;
```

## Observacoes importantes

- Existem services antigos em `services/foods.service.ts` e service novo em `src/features/inventory/services/inventoryService.ts`.
- O hook `useFoods` usa atualmente o `inventoryService` dentro de `src/features/inventory`.
- `services/api.ts` apenas reexporta o `apiClient`.
- O app ainda nao usa TanStack Query; os hooks proprios fazem controle de server state.
- O uso de `AsyncStorage`/`localStorage` existe para sessao Supabase, nao para persistir dados oficiais da aplicacao.
- A protecao de rotas e feita por tela, nao por middleware global.
- O frontend depende do backend estar rodando e aceitando o token Supabase no header Authorization.

## Como executar

Instalar dependencias:

```bash
npm install
```

Rodar web:

```bash
npm run web
```

Rodar Expo geral:

```bash
npm start
```

Validar TypeScript:

```bash
npx tsc --noEmit
```

Rodar lint:

```bash
npm run lint
```
