import express from 'express'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ id: user._id, username: user.username, email: user.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/streak', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, completed: true }).select('updatedAt')

    const key = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const days = new Set(tasks.map(t => key(new Date(t.updatedAt))))

    if (days.size === 0) return res.json({ streak: 0 })

    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)

    // streak is broken if neither today nor yesterday has a completion
    if (!days.has(key(today)) && !days.has(key(yesterday))) {
      return res.json({ streak: 0 })
    }

    // walk back from the most recent active day (today, or yesterday if not yet today)
    let cursor = days.has(key(today)) ? new Date(today) : new Date(yesterday)
    let count = 0
    while (days.has(key(cursor))) {
      count++
      cursor.setDate(cursor.getDate() - 1)
    }

    res.json({ streak: count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
