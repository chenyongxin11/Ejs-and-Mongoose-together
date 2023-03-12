import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    default: 15,
    max: [80, 'too old in this school'],
  },
  scholarship: {
    merit: {
      type: Number,
      default: 0,
      max: [10000, 'too much'],
    },
    other: {
      type: Number,
      default: 0,
    },
  },
})

const Student = mongoose.model('Student', studentSchema)

export default Student
