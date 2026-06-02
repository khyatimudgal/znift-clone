import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true},

  dueDate: {type: Date, default: Date.now},

  priority: {type: String, enum: ['high', 'medium', 'low'], default: 'medium'},

  completed: {type: Boolean, default: false},

  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

  archived: {type: Boolean, default: false},
  archivedAt: {type: Date, default: null},

}, { timestamps: true })

export default mongoose.model('Task', taskSchema)
