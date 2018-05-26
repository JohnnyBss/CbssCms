var serviceInvoke = require('../common/serviceInvokeUtils');
var sysConfig = require('../config/sysConfig');
var apiConfig = require('../config/apiConfig');
var pagingUtils = require('../common/pagingUtils');

exports.commonInvoke = function(apiName) {
  this.pageSize = sysConfig.pageSize;
  this.host = apiConfig.StoreService.host;
  this.port = apiConfig.StoreService.port;
  this.path = apiConfig.StoreService.path[apiName];
  this.getPageData = function (pageNumber, callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + pageNumber + '/' + this.pageSize, callback)
  };
  this.getAll = function (callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + 1 + '/' + 9999, callback)
  };
  this.get = function (param, callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + param, callback)
  };
  this.add = function (data, callback) {
    serviceInvoke.post(data, this.host, this.port, this.path, callback);
  };
  this.change = function (data, callback) {
    serviceInvoke.put(data, this.host, this.port, this.path, callback);
  };
  this.delete = function (id, callback) {
    serviceInvoke.delete(this.host, this.port, this.path + '/' + id, callback);
  }
};

exports.buildRenderData = function (title, pageNumber, serviceResult) {
  var renderData = {};
  if(serviceResult.err || !serviceResult.content.result){
    renderData = {
      title: title,
      totalCount: 0,
      paginationArray:[],
      dataList: []
    };
  }else{
    var paginationArray = pagingUtils.getPaginationArray(pageNumber, serviceResult.content.totalCount);
    var prePaginationNum = pagingUtils.getPrePaginationNum(pageNumber);
    var nextPaginationNum = pagingUtils.getNextPaginationNum(pageNumber, serviceResult.content.totalCount);
    if(serviceResult.content.responseData === null){
      renderData = {
        title: title,
        totalCount: serviceResult.content.totalCount,
        currentPageNum: pageNumber,
        dataList: serviceResult.content.responseData
      }
    }else{
      if(prePaginationNum > 0 && nextPaginationNum > 0){
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          dataList: serviceResult.content.responseData
        }
      }else if(prePaginationNum === 0 && nextPaginationNum === -1){
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          currentPageNum: pageNumber,
          dataList: serviceResult.content.responseData
        }
      }else if(prePaginationNum === 0) {
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          dataList: serviceResult.content.responseData
        }
      }else{
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          currentPageNum: pageNumber,
          dataList: serviceResult.content.responseData
        }
      }
    }
  }

  return renderData;
};