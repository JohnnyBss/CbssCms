let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }
  let parameter = '/' + pageNumber + '/' + sysConfig.pageSize + '/' + sysConfig.bankID + '/' + sysConfig.branchID;

  service.get(parameter, function (result) {
    let renderData = commonService.buildRenderData('营业网点新闻管理', pageNumber, result);
    res.render('news', renderData);
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('news');
  let newsID = req.query.newsID;

  service.delete(newsID, function (result) {
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