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
module.exports = router;
