const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")

const Jokes = require("../jokes/jokes-model.js");
const { isValid } = require("../jokes/jokes-service.js")
const {jwtSecret} = require("../../config/secrets.js")
const mw = require('../middleware/middleware')

router.post('/register', mw.userName, (req, res) => {
  const credentials = req.body;


  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds); 
    credentials.password = hash;

    Jokes.add(credentials)
    .then(user => {
      res.status(201).json({data: user});
    })
    .catch(error => {
      res.status(500).json({message: error.message})
    });
  } else {
    res.status(400).json({message: "username and password required"})
  }
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(isValid(req.body)){
    Jokes.findBy({username: username})
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = makeToken(user)
        res.status(200).json({ 
          message: `welcome, ${user.username}`,
          token            
        });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
  } else {
    res.status(400).json({
      message: "username and password required",
    });
  }
});

function makeToken(user){
  const payload = { 
    subject:user.id,
    username:user.username,
    role:user.role 
  }
  const options = { 
    expiresIn: "5000s"
  }
  return jwt.sign(payload,jwtSecret,options) 
}
module.exports = router;
