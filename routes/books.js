'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

router.get('/', (_req, res) => {
  knex('books').orderBy('title', 'asc').then((books) => {
    res.send(humps.camelizeKeys(books));
  });
});

router.get('/:id', (req, res) => {
  knex('books').where('id', req.params.id).then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  });
});

router.post('/', (req, res) => {
  knex('books')
  .returning(['id','title', 'author', 'genre', 'description', 'cover_url'])
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }).then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  });
});

router.patch('/:id', (req, res) => {
  knex('books')
  .where('id', req.params.id)
  .returning(['id','title', 'author', 'genre', 'description', 'cover_url'])
  .update({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }).then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  });
});

router.delete('/:id', (req, res) => {
  knex('books')
  .returning(['title', 'author', 'genre', 'description', 'cover_url'])
  .where('id', req.params.id).del().then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  });
});











// YOUR CODE HERE
// router.get('/', function(_req, res) {
//  knex('books').orderBy('title').then((books) => {
//   res.send(humps.camelizeKeys(books));
//  });
// });
//
// router.get('/:id', function(req, res) {
//  knex('books').where('books.id', req.params.id).first().then((books) => {
//   res.send(humps.camelizeKeys(books));
//  });
// });
//
// router.post('/', function(req, res) {
//  console.log(typeof req.body.title);
//  knex('books')
//   .returning(['id', 'author', 'cover_url', 'description', 'genre', 'title'])
//   .insert({
//    author: req.body.author,
//    cover_url: req.body.coverUrl,
//    description: req.body.description,
//    genre: req.body.genre,
//    title: req.body.title
//  }).then((obj) => {
//    console.log(JSON.stringify(humps.camelizeKeys(obj[0])));
//    res.send(JSON.stringify(humps.camelizeKeys(obj[0])));
//   });
// });
module.exports = router;
