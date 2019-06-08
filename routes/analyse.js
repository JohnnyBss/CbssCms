let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('analyse', {title: '业务分析'});
});

router.get('/financial', function(req, res, next) {
  let service = new commonService.commonInvoke('analyse4financial');
  let parameter = req.query.fromDate + ' 00:00:00' + '/' + req.query.toDate + ' 23:59:59';

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  })
});

router.get('/lobby', function(req, res, next) {
  let service = new commonService.commonInvoke('analyse4lobby');
  let parameter = req.query.fromDate + ' 00:00:00' + '/' + req.query.toDate + ' 23:59:59';

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  })
});

module.exports = router;