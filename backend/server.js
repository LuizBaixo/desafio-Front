require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { readData, writeData } = require('./db/db')

const app = express()
const PORT = process.env.SERVER_PORT || 3001

app.use(cors())
app.use(express.json())

// GET todos os usuários
app.get('/users', async (req, res) => {
  const data = await readData()
  res.json(data.users)
})

// POST novo usuário com validação
app.post('/users', async (req, res) => {
  const { name, email, cep, address, origin, state } = req.body
  if (!name || !email || !cep || !address || !origin || !state) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
  }

  const data = await readData()
  const lastId = data.users.length ? Math.max(...data.users.map(u => u.id)) : 0
  const newUser = { ...req.body, id: lastId + 1 }
  data.users.push(newUser)
  await writeData(data)
  res.status(201).json(newUser)
})

// PUT atualizar usuário com validação
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, cep, address, origin, state } = req.body
  if (!name || !email || !cep || !address || !origin || !state) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
  }

  const data = await readData()
  const index = data.users.findIndex((u) => u.id === id)
  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado.' })

  data.users[index] = { ...data.users[index], ...req.body }
  await writeData(data)
  res.json(data.users[index])
})

// DELETE remover usuário
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = await readData()
  data.users = data.users.filter((u) => u.id !== id)
  await writeData(data)
  res.status(204).send()
})

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})