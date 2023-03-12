import express from 'express'
const app = express()
import ejs from 'ejs'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import Student from './models/StudentModel.js'
import methodOverride from 'method-override'
import { reject } from 'async'

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

// link to database
mongoose
  .connect('mongodb://127.0.0.1:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connect succeed')
  })
  .catch((e) => {
    console.log(e)
  })

// homepage
app.get('/', (req, res) => {
  res.send('You are on the home page')
})

app.get('/students', async (req, res) => {
  try {
    let data = await Student.find()
    res.render('students.ejs', { data })
  } catch {
    res.send('ERROR FINDING')
  }
})

app.get('/students/insert', (req, res) => {
  res.render('studentInsert.ejs')
})

app.post('/students/insert', (req, res) => {
  let { id, name, age, merit, other } = req.body
  let newStudent = new Student({
    id,
    name,
    age,
    scholarship: { merit, other },
  })
  newStudent
    .save()
    .then(() => {
      console.log('succeed')
      res.render('accept.ejs')
    })
    .catch((e) => {
      console.log(falied)
      console.log(e)
      res.render('reject.ejs')
    })
})

app.get('/students/delete', (req, res) => {
  try {
    res.render('delete.ejs')
  } catch {
    res.send('Failed to open delete page')
  }
})
app.delete('/students/delete', async (req, res) => {
  try {
    let { id } = req.body
    await Student.findOneAndDelete({ id })
    res.redirect(`/students`)
  } catch {
    res.send('Failed to delete')
  }
})

app.get('/students/:id', async (req, res) => {
  try {
    let { id } = req.params
    let data = await Student.findOne({ id })
    if (data !== null) {
      res.render('studentPage.ejs', { data })
    } else {
      res.send('Can not find this Student')
    }
  } catch (e) {
    res.send('ERROR')
    console.log(e)
  }
})

app.get('/students/edit/:id', async (req, res) => {
  let { id } = req.params
  let data = await Student.findOne({ id })
  if (data !== null) {
    res.render('edit.ejs', { data })
  } else {
    res.render('reject.ejs')
  }
})

app.put('/students/edit/:id', async (req, res) => {
  let { id, name, age, merit, other } = req.body
  try {
    await Student.findOneAndUpdate(
      { id },
      { id, name, age, scholarship: { merit, other } },
      { new: true, runValidators: true },
    )
    res.redirect(`/students/${id}`)
  } catch (e) {
    res.send('Error To Updata')
    console.log(e)
  }
})

app.get('/*', (req, res) => {
  res.status(404)
  res.send('404 NOT FOUND')
})

app.listen(3000, () => {
  console.log('server is running at port 3000')
})
