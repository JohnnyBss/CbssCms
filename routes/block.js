let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  let moduleID = req.query.moduleID;
  let pageNumber = req.query.pageNumber;
  let service;
  let parameter;
  if(pageNumber === undefined){
    pageNumber = 1;
  }
  if(moduleID === undefined || moduleID === '0'){
    service = new commonService.commonInvoke('block');
    service.getPageData(pageNumber, function (result) {
      let renderData = commonService.buildRenderData('考评项目管理', pageNumber, result);
      renderData.moduleID = 0;
      res.render('block', renderData);
    });
  }else{
    service = new commonService.commonInvoke('blockOfModule');
    parameter = pageNumber + '/' + sysConfig.pageSize + '/' + moduleID;
    service.get(parameter, function (result) {
      let renderData = commonService.buildRenderData('考评项目管理', pageNumber, result);
      renderData.moduleID = moduleID;
      res.render('block', renderData);
    });
  }
});

router.get('/ofModule', function(req, res, next) {
  let service = new commonService.commonInvoke('blockOfModule');
  let parameter = '1/9999/' + req.query.moduleID;

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

router.get('/checkName', function (req, res, next) {
  let service = new commonService.commonInvoke('blockExist');
  let parameter = req.query.blockName;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        exist: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('block');
  let data = {
    moduleID: req.body.moduleID,
    blockName: req.body.blockName,
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

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('block');
  let data = {
    blockID: req.body.blockID,
    moduleID: req.body.moduleID,
    blockName: req.body.blockName,
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

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('block');
  let blockID = req.query.blockID;

  service.delete(blockID, function (result) {
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