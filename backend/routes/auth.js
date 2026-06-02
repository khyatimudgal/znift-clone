import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const isProd = process.env.NODE_ENV === 'production'
const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
}

router.post('/register', async(req, res) => {
  try{
    const {username, email, password} = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
      return res.status(400).json({message: 'User already exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: "7d"}
    )
    
    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      message: "User created successfully",
      user: {id: user._id, username: user.username, email: user.email}
    })
  } catch(err) {
    res.status(500).json({message: err.message})
  }

})

router.post('/login', async(req, res) => {
  try{
    const {email, password} = req.body

    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message:"Invalid credentials"})
    }

    const isMatch = await bcrypt.compare (password, user.password)

    if(!isMatch) {
      return res.status(400).json({message: 'Invalid Credentials'})
    }

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    )

    res.cookie('token', token, cookieOptions)

    res.status(200).json({
      message: 'Login successful',
      user: {id:user._id, username: user.username, email:user.email}
    })

  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.post ('/logout', (req, res) => {
  res.clearCookie('token')
  res.status(200).json({message: 'Logged out successfully'})
})

router.delete('/account', protect, async (req, res) => {
  try {
    await Task.deleteMany({ user: req.user.id })
    await User.findByIdAndDelete(req.user.id)
    res.clearCookie('token', { secure: isProd, sameSite: isProd ? 'none' : 'lax' })
    res.status(200).json({ message: 'Account deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router