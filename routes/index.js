const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')



/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res, next)=>{
    res.render('signup')
})

router.post("/signup", (req, res, next)=>{
    const {username, password} = req.body

    if(!username || !password){
        res.render('signup', {msg: 'Please enter all fields'})
        return
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    UserModel.create({username, password : hash})
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            next(err)
        })
})

router.get('/login', (req, res, next)=>{
    res.render('login.hbs')
})

router.post("/login", (req, res, next) => {

    const {username, password} = req.body
    
    UserModel.findOne({username : username})
      .then((result)=>{
          if (result){
              bcrypt.compare(password, result.password)
                .then((isMatching)=>{
                    if(isMatching){
                        req.session.loggedInUser = result
                        req.session.areyoutired = false
                        res.redirect('/main')
                    }
                    else {
                      res.render('login.hbs', {msg: 'Password dont macth'})
                    }
                })
                .catch((err)=>{
                    next(err)
                })
          }
          else {
              res.render('login.hbs', {msg: 'Username does not exist'})
          }
      })
      .catch((err)=>{
        next(err)
      })
   
  });

  const checkLoggedInUser = (req, res, next) => {
    console.log(req.session.loggedInUser)
    if (req.session.loggedInUser) {
       next()
    }
    else {
        res.redirect('/signin')
    }
    
}

  router.get('/main',checkLoggedInUser, (req, res) => {
    let username = req.session.loggedInUser.username
    res.render('main', {username})
  })

  router.get('/private',checkLoggedInUser, (req, res)=>{
      res.render('private')
  })

  router.get('/logout', (req, res) => {
    req.session.destroy()
		res.redirect('/login')
})


module.exports = router;
