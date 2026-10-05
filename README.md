# PetCare

Bem-vindo(a) ao **PetCare**!

O PetCare é um aplicativo mobile desenvolvido com o objetivo de facilitar a organização e o acompanhamento das principais informações relacionadas à saúde e aos cuidados de um pet.

---

## Integrantes do grupo

- **Ali Andrea Mamani Molle** - RM 558052
- **Guilherme Linard F. R. Gozzi** - RM 555768
- **Lucas Vasquez Silva** - RM 555159

## Funções do grupo

- **Ali Andrea Mamani Molle** - Design das telas no Figma e desenvolvimento da aplicação
- **Guilherme Linard F. R. Gozzi** - Apresentação e pitch do projeto
- **Lucas Vasquez Silva** - Documentação e organização do README

---

# Sobre o projeto
## Problema

Muitos tutores possuem dificuldade para organizar e acompanhar as informações relacionadas à saúde e à rotina de seus pets.

Dados como vacinas, consultas veterinárias, medicamentos e outros cuidados podem ficar espalhados em carteiras de vacinação, documentos, mensagens ou anotações.

Essa falta de organização pode dificultar a consulta ao histórico do animal e o acompanhamento de informações importantes relacionadas aos seus cuidados.

O **PetCare** foi desenvolvido para centralizar essas informações em um único aplicativo, oferecendo ao tutor uma maneira simples de acompanhar os principais dados do seu pet.

---

## Público-alvo

O aplicativo é destinado principalmente a:

- Tutores de cães, gatos e outros animais domésticos;
- Pessoas que desejam organizar informações relacionadas à saúde de seus pets;
- Tutores que desejam acompanhar vacinas, consultas e medicamentos;
- Pessoas que buscam acesso rápido às principais informações do animal.

---

## Proposta de valor

O PetCare oferece uma forma simples e organizada de centralizar informações importantes sobre o pet.

A aplicação permite que o tutor tenha acesso aos principais dados do animal, acompanhe seu histórico e registre novos cuidados em um único lugar.

---

# ⚙️ Funcionalidades

O aplicativo possui as seguintes funcionalidades:

- Cadastro e login de usuário;
- Persistência da sessão do usuário;
- Visualização da tela inicial com informações do pet;
- Visualização do perfil do pet;
- Edição dos dados do pet;
- Edição de informações adicionais do pet;
- Visualização e edição dos dados do tutor;
- Visualização das vacinas cadastradas;
- Visualização das consultas;
- Agendamento de novas consultas;
- Visualização de medicamentos;
- Cadastro de novos medicamentos;
- Navegação entre as principais áreas do aplicativo;
- Logout da conta;
- Exclusão da conta do usuário;
- Integração com banco de dados em nuvem.

---

# Protótipo e Design

O design das telas foi desenvolvido no **Figma**, buscando uma interface simples, amigável e adequada à proposta do PetCare.

🔗 **Figma:**  
https://www.figma.com/design/bZG6NRVWyeoYYrk2EbvFjO/PetCare?node-id=2-72&t=zX17zzY9CjTEKIqZ-1

---
**Vídeo de demonstração:**  

[Assistir ao vídeo](https://youtube.com/shorts/ky3bTRFH9E4?feature=share)
---

#  APK

O aplicativo também foi gerado em formato **APK para Android**, permitindo sua instalação e execução diretamente em dispositivos compatíveis.

🔗 **Download do APK:**  
**[[ADICIONAR LINK DO APK AQUI](https://expo.dev/accounts/aliandreas-team/projects/petcare/builds/60325ac2-8640-43ba-9e5c-bc8aa4b8d67c)]**

---

# Tecnologias utilizadas

- **React Native** - Desenvolvimento da aplicação mobile;
- **Expo** - Ambiente e ferramentas para desenvolvimento e execução;
- **Expo Router** - Navegação entre as telas;
- **TypeScript** - Desenvolvimento e tipagem do código;
- **Supabase** - Banco de dados e autenticação;
- **AsyncStorage** - Persistência local da sessão;
- **EAS Build** - Geração do APK Android;
- **Figma** - Prototipação e design das telas;
- **Git e GitHub** - Versionamento e armazenamento do projeto.

---

# Banco de dados

O projeto utiliza o **Supabase** como serviço de backend.

A integração é utilizada para armazenar e consultar informações relacionadas a:

- Usuários e perfis;
- Pets;
- Vacinas;
- Consultas;
- Medicamentos.

O Supabase também é utilizado para a autenticação dos usuários da aplicação.

As credenciais e chaves utilizadas para conexão com o serviço são armazenadas por meio de **variáveis de ambiente** e não são disponibilizadas no repositório.

---

# Estrutura do projeto

```text
PetCare/
│
├── assets/
│   └── images/
│
├── constants/
│   └── colors.ts
│
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── home.tsx
│   │   ├── vacinas.tsx
│   │   ├── consultas.tsx
│   │   ├── medicamentos.tsx
│   │   ├── perfil.tsx
│   │   ├── agendar-consulta.tsx
│   │   ├── adicionar-medicamento.tsx
│   │   ├── editar-pet.tsx
│   │   ├── editar-informacoes-pet.tsx
│   │   └── editar-dono.tsx
│   │
│   ├── components/
│   │   ├── TopMenu.tsx
│   │   └── BottomMenu.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   └── lib/
│       └── supabase.ts
│
├── app.json
├── eas.json
├── package.json
└── README.md
```

---

# Como executar o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/AliAndrea1/fiap-mdi-PetCare.git
```

## 2. Entre na pasta do projeto

```bash
cd fiap-mdi-PetCare
```

## 3. Instale as dependências

```bash
npm install
```

## 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto contendo as variáveis necessárias para conexão com o Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
EXPO_PUBLIC_SUPABASE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
```

> Por segurança, os valores reais das credenciais não estão disponíveis no repositório.

## 5. Execute o projeto

```bash
npx expo start
```

O aplicativo poderá ser executado utilizando o **Expo Go** em um dispositivo compatível.

---

# Testes e validação

Durante o desenvolvimento foram realizados testes das principais funcionalidades da aplicação, incluindo:

- Cadastro e autenticação;
- Persistência da sessão;
- Consulta de dados armazenados no Supabase;
- Edição das informações do tutor e do pet;
- Cadastro e consulta de consultas veterinárias;
- Cadastro e consulta de medicamentos;
- Visualização das vacinas;
- Navegação entre as telas;
- Logout e exclusão de conta;
- Instalação e execução do APK Android.

O funcionamento geral da aplicação também pode ser visualizado no vídeo de demonstração disponibilizado neste README.

---

# Disciplina

Projeto desenvolvido para a disciplina de **Mobile Development & IoT** da FIAP.

---

## 🐾 PetCare

**Cuidar também é organizar.**
