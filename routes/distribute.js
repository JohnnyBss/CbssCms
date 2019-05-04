let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('distribute');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, function (result) {
    let renderData = commonService.buildRenderData('理财业务分流', pageNumber, result);
    res.render('distribute', renderData);
  });
});

module.exports = router;