var express = require('express')
var user = require('./user.controller.js')
var passportConf = require('./passport.controller.js')
var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var fs = require('fs')
var path = require('path')
var multer = require('multer')
var middleware = require('../../middleware.js')
var app = express()
app.use(bodyParser.json())
app.use(methodOverride())
app.use(expressValidator())

var upload = multer({ dest: 'client/uploads/' })
app.post('/photos/upload', upload.single('file'), function (req, res, next) {
  if (req.file) {
    var filePath = path.resolve(__dirname, '../../../client/uploads/')
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        return res.status(400).send(err)
      }
      var createDir = filePath + '/' + req.file.originalname
      fs.writeFile(createDir, data, function (err) {
        if (err) {
          return res.status(400).send(err)
        } else {
          return res.status(201).send()
        }
      })
    })
  }
})

app.post('/authenticate', user.postAuthenticate)
app.get('/authenticate', user.getAuthenticate)
app.post('/login', user.postLogin)
app.get('/logout', user.logout)
app.get('/forgot', user.getForgot)
app.post('/forgot', user.postForgot)
app.get('/reset/:token', user.getReset)
app.post('/reset/:token', user.postReset)
app.get('/signup', user.getSignup)
app.post('/signup', user.postSignup)
app.get('/account', middleware.isAuthenticated, user.getAccount)
app.post('/account/profile', middleware.isAuthenticated, user.postUpdateProfile)
app.post('/account/password', middleware.isAuthenticated, user.postUpdatePassword)
app.post('/account/delete', middleware.isAuthenticated, user.postDeleteAccount)

module.exports = app
