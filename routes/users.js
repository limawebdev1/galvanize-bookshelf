'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');

router.post('/', (req, res) => {
  knex('users')
  .returning(['id','first_name','last_name', 'email'])
  .insert({
      'first_name': req.body.firstName,
      'last_name': req.body.lastName,
      'email': req.body.email,
      'hashed_password': bcrypt.hashSync(req.body.password,8)
  }).then((user) => {
    req.session.userInfo = user[0];
    res.send(humps.camelizeKeys(user[0]));
  });
});

module.exports = router;
