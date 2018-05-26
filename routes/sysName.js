let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('sysName', {title: '客户端系统名称'});
});

router.get('/current', function(req, res, next) {
  let service = new commonService.commonInvoke('sysName');

  service.get(sysConfig.systemID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('sysName');
  let data = {
    sysNameID: sysConfig.systemID,
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    sysName: req.body.sysName,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

module.exports = router;