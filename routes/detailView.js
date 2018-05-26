let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  let itemID = req.query.itemID;
  let breadcrumbs = req.query.breadcrumbs;
  let year = req.query.year;
  let quarter = req.query.quarter;
  res.render('detailView', {
    title: '考评点明细管理',
    itemID: itemID,
    year: year,
    quarter: quarter,
    breadcrumbs: breadcrumbs});
});

module.exports = router;