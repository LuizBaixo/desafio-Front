const fs = require('fs-extra')
const path = require('path')
const DB_PATH = path.join(__dirname, '../db.json')

const readData = async () => await fs.readJson(DB_PATH)
const writeData = async (data) => await fs.writeJson(DB_PATH, data, { spaces: 2 })

module.exports = { readData, writeData }