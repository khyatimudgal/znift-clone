import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import taskRoutes from './routes/tasks.js'
import logRoutes from './routes/logs.js'

dotenv.config()

const app = express()
app.set('trust proxy', 1)

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())
app.use(cookieParser())

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use('/api/tasks', taskRoutes)
app.use('/api/logs', logRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB CONNECTED"))
  .catch(err => console.log(err))

  const PORT = process.env.PORT || 5001

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

