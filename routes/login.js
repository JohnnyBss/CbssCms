var express = require('express');
var router = express.Router();
var commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('login', { title: '用户登录', layout: null });
});

router.post('/', function (req, res, next) {
  var service = new commonService.commonInvoke('login');
  var param = req.body.userName + '/' + req.body.password;

  service.get(param, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      if(result.content.responseType === 'Failed'){
        res.json({
          err: false,
          pass: false,
          msg: result.content.responseMessage
        });
      }else{
        res.json({
          err: false,
          pass: true,
          userInfo: result.content.responseData,
          msg: result.content.responseMessage
        });
      }
    }
  })
});

module.exports = router;