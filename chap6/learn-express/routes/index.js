var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

// localhost:3000/params/1234?limit=5&skip=10 호출 시 출력 : 
// {"id":"1234"}, {"limit":"5","skip":"10"}
router.get('/params/:id', function (req, res) {
  console.log(req.params, req.query);
  res.status(200).send(`${ JSON.stringify(req.params) }, ${ JSON.stringify(req.query) }`);
});

module.exports = router;