var express = require('express');
var router = express.Router();
var commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('changePassword', { title: '修改密码'});
});

router.get('/userInfo', function(req, res, next) {
  let service = new commonService.commonInvoke('user');
  service.get(req.query.userID, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        userInfo: result.content.responseData
      });
    }
  });
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changePassword');
  let data = {
    userID: req.body.userID,
    password: req.body.password,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;