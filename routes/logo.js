let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('logo', { title: '网点Logo管理'});
});


module.exports = router;