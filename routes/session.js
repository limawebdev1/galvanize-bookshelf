'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
var cookieSession = require('cookie-session');
var bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  if(req.session.userInfo !== undefined){
    res.send(true);
  }else{
    res.send(false);
  }
});

router.post('/', (req, res) => {
  knex('users')
  .where('email', req.body.email)
  .then((user) => {
    if(user.length === 0){
      res.type('text/plain');
      res.status(400);
      res.send("Bad email or password");
    }
    else{
      var check = bcrypt.compareSync(req.body.password, user[0].hashed_password);
      if(check){
        var obj = {};
        obj.id = user[0].id;
        obj.email = user[0].email;
        obj.firstName = user[0].first_name;
        obj.lastName = user[0].last_name;
        delete user[0].hashed_password;
        req.session.userInfo = user[0];
        res.json(obj);
      }
      else{
        res.type('text/plain');
        res.status('400');
        res.send('Bad email or password');
      }
    }
  });
});

router.delete('/', (req, res) => {
  req.session = null;
  res.send(true);
});


module.exports = router;
