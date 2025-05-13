# Desafio Técnico Front-End - AAWZ Partners

Este projeto é uma aplicação fullstack desenvolvida para o desafio técnico da AAWZ Partners.

## ✨ Tecnologias Utilizadas

### Front-end
- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)
- [ApexCharts](https://apexcharts.com/)

### Back-end
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [fs-extra](https://www.npmjs.com/package/fs-extra)
- Persistência em arquivo local `db.json`

---

## 📂 Estrutura do Projeto

```
projeto-aawz/
├── frontend/       # Vue + Vuetify + Charts
└── backend/        # Node.js + API REST + JSON
```

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/LuizBaixo/desafio-aawz.git
cd desafio-aawz
```

### 2. Rodar o back-end

```bash
cd backend
npm install
node server.js
```

A API ficará disponível em: [http://localhost:3001/users](http://localhost:3001/users)

### 3. Rodar o front-end

```bash
cd ../frontend
npm install
npm run dev
```

Acesse o sistema em: [http://localhost:5173](http://localhost:5173)

---

## ✅ Funcionalidades implementadas

- Cadastro de usuário com:
  - Nome
  - E-mail
  - Endereço preenchido automaticamente via CEP
  - Origem (Digital/Físico)
  - Estado (dropdown)
- Máscara de CEP
- Tabela com paginação
- Edição de usuários com modal
- Exclusão de usuários com confirmação
- Feedback visual com `v-snackbar`
- Gráficos com ApexCharts:
  - Distribuição por estado
  - Distribuição por origem

---

## 📧 Contato

Luiz Gustavo Baixo  
e-mail: luigbaixo@gmail.com