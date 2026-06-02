import express from 'express'
import Task from '../models/Task.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, archived: false }).sort({ dueDate: 1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/archived', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, archived: true }).sort({ archivedAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const { title, dueDate, priority, completed } = req.body
    const task = await Task.create({
      title,
      dueDate: dueDate || Date.now(),
      priority: priority || 'medium',
      completed: completed || false,
      user: req.user.id,
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id', protect, async (req, res) => {
  try {
    const allowed = ['title', 'dueDate', 'priority']
    const update = {}
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k] })

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    task.completed = !task.completed
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id/archive', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { archived: true, archivedAt: new Date() },
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id/restore', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { archived: false, archivedAt: null },
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/archived/all', protect, async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.user.id, archived: true })
    res.json({ deleted: result.deletedCount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
