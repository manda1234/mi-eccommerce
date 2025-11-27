const express = require("express")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 4000

const User = require("./models/User")

app.use(cors())
app.use(express.json())

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/users/:id", async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/users", async (req, res) => {
  const { name, email, role } = req.body
  const errors = {}

  if (!name) errors.name = "Name wajib diisi"
  if (!email) errors.email = "Email wajib diisi"
  if (!role) errors.role = "Role wajib diisi"

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors })
  }

  try {
    const newUser = await User.create({ name, email, role })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/", (req, res) => {
  res.send("API User Service Running")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
