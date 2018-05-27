let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('logo', { title: '网点Logo管理'});
});

router.get('/current', function(req, res, next) {
  let service = new commonService.commonInvoke('logo4Branch');
  let parameter = sysConfig.bankID + '/' + sysConfig.branchID;

  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  })
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('logo');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    logoUrl: req.body.logoUrl,
    status: 'A',
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
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