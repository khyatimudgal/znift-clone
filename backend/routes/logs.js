import express from 'express'
import Log from '../models/Log.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get ('/', protect, async (req, res) => {
  try {
    const logs = await Log.find ({ user: req.user.id})
    res.json(logs)

  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.post ('/', protect, async (req, res) => {
  try {
    const {title} = req.body
    const log = await Log.create({
      title,
      user: req.user.id
    })

    res.status(201).json(log)

  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

export default router