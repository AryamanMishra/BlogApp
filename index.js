const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')

const User = require('./models/user');

const mongoose = require('mongoose');
const alert = require('alert');
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('CONNECTION CONFIRMED')
})
.catch(err => {
    console.log('Connection refused')
    console.log(err)
})

app.use(express.static(__dirname + '/public'));
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.get('/', (req,res) => {
    res.render('home')
})



app.get('/users/existing', (req,res) => {
    res.render('users/existing')
})

app.post('/existing', (req,res) => {
    let userTocheck = req.body
    const findUser = User.findOne({name:userTocheck.name,age:parseInt(userTocheck.age),email:userTocheck.email})
        .then((data) => {
            alert(`Welcome ${data.name}`)
            res.redirect(`/users/${data._id}`)
            console.log('success')
            console.log(data)
        })
        .catch (err => {
            alert('User by these credentials does not exist, please sign up')
            res.redirect('/')
            //console.log(err)
            //console.log('fail')
        })
})

app.get('/users/new', (req,res) => {
    res.render('users/newUser')
})
app.post('/user', (req,res) => {
    const newUser = new User(req.body)
    newUser.save().then(() => {
        console.log('User logged in')
        console.log(req.body)
    })
    .catch(err => {
        console.log('error')
    })
    res.redirect(`/users/${newUser._id}`)
})

app.get('/users/:id', async(req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        console.log(user)
        res.render('users/userDetails', {user})
    }
    catch {
        res.render('users/userDetailserror')
    }
})

app.get('*', (req,res) => {
    res.send('The website is still in progrees so hold down!!');
})







app.listen(3000,() => {
    console.log('APP IS LIVE')
})
