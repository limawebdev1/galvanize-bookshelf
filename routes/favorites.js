'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
var cookieSession = require('cookie-session');
var bcrypt = require('bcrypt');
// YOUR CODE HERE

const authorize = function(req, res, next){
  if(!req.session.userInfo){
    res.type('text/plain');
    res.status('401');
    res.send('Unauthorized');
  }else{
    next();
  }
}

router.get('/', authorize, (req, res) => {
  knex('favorites')
  .innerJoin('books', 'favorites.book_id', 'books.id')
  .where('favorites.user_id', 1)
  .then((favorites) => {
    var total = [];
    for(var i = 0; i < favorites.length; i++){
      var obj = {};
      obj.id = favorites[i].id;
      obj.book_id = favorites[i].book_id;
      obj.user_id = favorites[i].user_id;
      obj.author = favorites[i].author;
      obj.created_at = favorites[i].created_at;
      obj.updated_at = favorites[i].updated_at;
      obj.title = favorites[i].title;
      obj.description = favorites[i].description;
      obj.genre = favorites[i].genre;
      obj.cover_url = favorites[i].cover_url
      total.push(obj);
    }
    res.json(humps.camelizeKeys(total));
  });
});

router.get('/:id', authorize, (req, res) => {
  knex('favorites')
  .where('book_id', req.query.bookId)
  .then((favorites) => {
    if(favorites.length === 0){
      res.send(false);
    }else{
      res.send(true);
    }
  })
});

router.post('/', authorize, (req, res) => {
  knex('favorites')
  .returning(['id', 'book_id', 'user_id'])
  .insert({
    'user_id': 1,
    'book_id': req.body.bookId
  }).then((favorite) => {
    res.send(humps.camelizeKeys(favorite[0]));
  })
});

router.delete('/', authorize, (req, res) => {
  knex('favorites')
  .returning(['book_id', 'user_id'])
  .where('book_id', req.body.bookId)
  .del().then((favorite) => {
    res.json(humps.camelizeKeys(favorite[0]));
  })
})
module.exports = router;
