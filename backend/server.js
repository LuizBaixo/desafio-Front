const express = require('express')
const cors = require('cors')
const fs = require('fs-extra')
const app = express()
const PORT = 3001
const DB_PATH = './db.json'

app.use(cors())
app.use(express.json())

// Helpers
const readData = async () => await fs.readJson(DB_PATH)
const writeData = async (data) => await fs.writeJson(DB_PATH, data, { spaces: 2 })

// GET todos os usuários
app.get('/users', async (req, res) => {
  const data = await readData()
  res.json(data.users)
})

// POST novo usuário
app.post('/users', async (req, res) => {
  const data = await readData()
  const newUser = { ...req.body, id: Date.now() }
  data.users.push(newUser)
  await writeData(data)
  res.status(201).json(newUser)
})

// PUT atualizar usuário
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = await readData()
  const index = data.users.findIndex(u => u.id === id)

  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' })

  data.users[index] = { ...data.users[index], ...req.body }
  await writeData(data)
  res.json(data.users[index])
})

// DELETE remover usuário
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = await readData()
  data.users = data.users.filter(u => u.id !== id)
  await writeData(data)
  res.status(204).send()
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
