var express = require('express');
var router = express.Router();
var User = require('../models').User;

/* GET home page. */
router.get('/', function (req, res, next) {

  //USERS 테이블에서 모든 사용자 검색 후, sequelize.pug 랜더링 하면서 users 로 보내줌
  User.findAll()
    .then((users) => {
      res.render('sequelize', {
        users
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });

  //res.render('index', { title: 'Express' });
});

module.exports = router;