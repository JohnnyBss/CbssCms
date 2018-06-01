let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('item', {title: '考评内容管理'});
  res.render('index', { title: '主页' });
});

module.exports = router;
