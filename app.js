
const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const User = require('./user')
const Trip = require('./trip')

let users = []

var session = require('express-session')

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// setting the body parser to use url encoded
app.use(bodyParser.urlencoded({extended :false}))

// setting the templating engine to use mustache
app.engine('mustache',mustacheExpress())

// setting the mustache pages directory
app.set('views','./views')

// set the view engine to mustache
app.set('view engine','mustache')

app.get('/',function(req,res){
  res.render('index')
})

// login route to show the login page
app.get('/login',function(req,res){
  res.render('login')
})

app.get('/trips',function(req,res){
  //res.render('trips',{trips:req.session.user.trips})

// sending a user object instead of trips
res.render('trips',{user :req.session.user})

})

app.post('/trips',function(req,res){

  let name = req.body.name
  let imageURL = req.body.imageURL

  let trip = new Trip(name,imageURL)

  let user = req.session.user
  user.trips.push(trip)

  res.redirect('/trips')


})

app.post('/login',function(req,res){

  let username = req.body.username
  let password = req.body.password

  let user = users.find(function(user){
    return user.username == username && user.password == password
  })

  if(req.session) {
    req.session.user = user
  }

  res.redirect('/trips')

})

// registration
app.post('/register',function(req,res){

  let username = req.body.username
  let password = req.body.password

  let user = new User(username,password)

  // put user in an array. We are using array as kind of a database

  users.push(user)

  res.redirect('/login')

})



app.listen(3000,function() {
  console.log("server is running!")
})
