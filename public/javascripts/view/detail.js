$(document).ready(function () {
  let _itemID = $('#hidden-itemID').val();
  let _itemIdValid = true;

  function initPage() {
    setBreadcrumbs();
    initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], true);
    initUploadPlugin('#file-upload-file', ['pdf'], true);
    initUploadPlugin('#file-upload-video', ['mp4', 'webm'], true);
    checkItemIdIsValid();
    showData();
  }

  function setBreadcrumbs() {
    let param = $('#hidden-breadcrumbs').val();
    let arr = param.split('_-_');
    if(arr.length === 0){
      return false;
    }

    $('.page-header h1').append('考评内容管理');
    $.each(arr, function (index, n) {
      if(index === 0){
        $('.page-header h1').append('<small>' + '<i class="icon-double-angle-right"></i>' + n + '</small>');
      }else{
        $('.page-header h1').append('<small>' + '<i class="icon-angle-right"></i>' + n + '</small>');
      }
    })
  }

  function checkItemIdIsValid() {
    if(_itemID === 'undefined' || _itemID === '' || isNaN(_itemID)){
      $('.content-list button').attr('disabled', 'disabled');
      $('#btn-save').attr('disabled', 'disabled');
      $('#btn-delete').attr('disabled', 'disabled');
      _itemIdValid = false;
      layer.msg('参数不正确，操作被禁止。');
    }
  }

  function initUploadPlugin(selector, fileType, multiple){
    $(selector).initUpload({
      "uploadUrl":"/detail/fileUpload",//上传文件信息地址
      "deleteFileUrl":"/detail/deleteFile?fileName=",//上传文件信息地址
      //"beforeUpload": beforeUploadFun,//在上传前执行的函数
      "ismultiple": multiple,
      "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
      //"size":350,//文件大小限制，单位kb,默认不限制
      "maxFileNumber": 10,//文件个数限制，为整数
      //"filelSavePath":"",//文件上传地址，后台设置的根目录
      //"onUpload":onUploadFun，//在上传后执行的函数
      //autoCommit:true,//文件是否自动上传
    });
  }

  function showData(){
    let textArray = [];
    let imageArray = [];
    let videoArray = [];
    let fileArray = [];

    if(!_itemIdValid){
      return false;
    }
    $.ajax({
      url: '/detail/data?itemID=' + _itemID,
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }

        if(res.dataList.length === 0){
          $('#btn-delete').hide();
        }else{
          $('#btn-delete').show();
        }

        $.each(res.dataList, function (index, data) {
          switch (data.contentType){
            case 'T':
              textArray.push(data);
              break;
            case 'I':
              imageArray.push(data);
              break;
            case 'F':
              fileArray.push(data);
              break;
            case 'V':
              videoArray.push(data);
              break;
          }
        });

        appendText(textArray);
        appendImage(imageArray);
        appendVideo(videoArray);
        appendFile(fileArray);
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function saveDetailInfo(itemID, contentType, content, sequence){
    let saveRes = {
      success: false,
      detailId: 0
    };
    $.ajax({
      url: '/detail',
      type: 'post',
      dataType: 'json',
      async: false,
      data:{
        itemID: itemID,
        sequence: sequence,
        contentType: contentType,
        content: content,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          saveRes = {
            success: true,
            detailId: res.detailId
          };
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });

    return saveRes;
  }

  function clearUploadStatus(){
    uploadTools.isUploaded = false;
  }

  /**
   * 保存上传的文件
   * @param fileType 文件类型
   * @param fileList 文件列表
   * @returns {Array} 保存成功的文件列表
   */
  function saveUploadFileList(fileType, fileList) {
    let result = {};
    let successFileList = [];
    let currentSequence = getCurrentSequence(fileType);
    $.each(fileList, function (index, file) {
      result = saveDetailInfo(_itemID, fileType, file, currentSequence);
      if(result.success){
        currentSequence++;
        successFileList.push({
          detailID: result.detailId,
          content: file
        });
      }else{
        layer.msg('文件保存失败：' + file);
      }
    });
    return successFileList;
  }

  function getCurrentSequence(fileType) {
    let currentSequence = 0;
    switch (fileType){
      case 'T':
        currentSequence = $('.content-text .detail .group-text').length + 1;
        break;
      case 'V':
        currentSequence = $('.content-video .detail .content-hover').length + 1;
        break;
      case 'I':
        currentSequence = $('.content-image .detail .content-hover').length + 1;
        break;
      case 'F':
        currentSequence = $('.content-file .detail .group-file').length + 1;
        break;
    }

    return currentSequence;
  }

  /**
   * 将说明文字加载到页面并动态添加删除事件
   */
  function appendText(textList){
    $.each(textList, function (index, text) {
      $('.content-text .detail').append(
          '<div class="group-text" data-detail-id="' + text.detailID + '">\n' +
          '  <div class="text-desc" data-detail-id = "' + text.detailID + '">\n' +
          '    <p style="margin-top: 10px">' + text.content + '</p>\n' +
          '  </div>\n' +
          '  <div class="text-option">\n' +
          '   <p>' +
          '     <a href="javascript:" class="del-text" data-detail-id="' + text.detailID + '">\n' +
          '      <i class="icon-trash red"></i>\n' +
          '     </a>\n' +
          '     <a href="javascript:" class="change-position-up" data-detail-id="' + text.detailID + '">\n' +
          '       <i class="icon-circle-arrow-up change-position"></i>\n' +
          '     </a>\n' +
          '     <a href="javascript:" class="change-position-down" data-detail-id="' + text.detailID + '">\n' +
          '       <i class="icon-circle-arrow-down change-position"></i>\n' +
          '     </a>\n' +
          '   </p>' +
          '  </div>\n' +
          '</div>');

      //删除文本内容事件
      $('.content-text .detail .group-text[data-detail-id=' + text.detailID + ']').on('click','a.del-text', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这部分内容吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/detail/deleteDetailImage?itemID=' + _itemID + '&detailID=' + detailId,
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                $('.group-text[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });

      $('.content-text .detail .group-text[data-detail-id=' + text.detailID + ']').on('click','a.change-position-up', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent().parent();
        let previousFileObj = $(this).parent().parent().parent().prev();
        if(previousFileObj.length === 0){
          layer.msg('已经在最前面了。');
          return false;
        }
        let previousId = $(previousFileObj).attr('data-detail-id');
        $(previousFileObj).before($(currentFileObj));

        reverseSequence(detailId, previousId);
      });

      $('.content-text .detail .group-text[data-detail-id=' + text.detailID + ']').on('click','a.change-position-down', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent().parent();
        let nextFileObj = $(this).parent().parent().parent().next();
        if(nextFileObj.length === 0){
          layer.msg('已经在最后面了。');
          return false;
        }

        let nextId = $(nextFileObj).attr('data-detail-id');
        $(nextFileObj).after($(currentFileObj));

        reverseSequence(detailId, nextId);
      });
    });
  }

  /**
   * 将图片加载到页面并动态添加删除事件
   * @param fileList 已上传的图片列表
   */
  function appendImage(fileList){
    $.each(fileList, function (index, file) {
      $('.content-image .detail').append(
          '<div class="content-hover port-1 effect-1" data-detail-id="' + file.detailID + '">\n' +
          '  <div class="image-box">\n' +
          '    <img src="' + file.content + '" alt="">\n' +
          '  </div>\n' +
          '  <div class="text-desc" data-detail-id="' + file.detailID + '">\n' +
          '    <a href="javascript:;" class="option del-image" data-detail-id="' + file.detailID + '">删除图片</a>\n' +
          '    <a href="javascript:;" class="option change-position-up" data-detail-id="' + file.detailID + '">上移</a>\n' +
          '    <a href="javascript:;" class="option change-position-down" data-detail-id="' + file.detailID + '">下移</a>\n' +
          '  </div>\n' +
          '  <div class="image-desc" data-detail-id="' + file.detailID + '">\n' +
          '    <p>' + file.content.substr(file.content.lastIndexOf('/')+1) + '</p>\n' +
          '  </div>\n' +
          '</div>');

      //删除图片事件
      $('.content-image .detail .text-desc[data-detail-id=' + file.detailID + ']').on('click','a.del-image', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这张图片吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/detail/deleteDetailImage?itemID=' + _itemID + '&detailID=' + detailId,
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                $('.content-hover[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });

      $('.content-image .detail .text-desc[data-detail-id=' + file.detailID + ']').on('click','a.change-position-up', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent();
        let previousFileObj = $(this).parent().parent().prev();
        if(previousFileObj.length === 0){
          layer.msg('已经在最前面了。');
          return false;
        }
        let previousId = $(previousFileObj).attr('data-detail-id');
        $(previousFileObj).before($(currentFileObj));
        reverseSequence(detailId, previousId);
      });

      $('.content-image .detail .text-desc[data-detail-id=' + file.detailID + ']').on('click','a.change-position-down', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent();
        let nextFileObj = $(this).parent().parent().next();
        if(nextFileObj.length === 0){
          layer.msg('已经在最后面了。');
          return false;
        }

        let nextId = $(nextFileObj).attr('data-detail-id');
        $(nextFileObj).after($(currentFileObj));
        reverseSequence(detailId, nextId);
      });
    });
  }

  /**
   * 将视频加载到页面并动态添加删除事件
   * @param fileList 已上传的视频列表
   */
  function appendVideo(fileList){
    $.each(fileList, function (index, file) {
      $('.content-video .detail').append(
          '<div class="content-hover group-video port-1 effect-1" data-detail-id="' + file.detailID + '">\n' +
          '  <div class="video-box">\n' +
          '    <video src="' + file.content + '" controls="controls" style="width: 100%">\n' +
          '      您使用的浏览器不支持视频播放，请使用Chrome浏览器。' +
          '    </video>\n' +
          '  </div>\n' +
          '  <div class="video-desc" data-detail-id = "' + file.detailID + '">\n' +
          '    <p>' + file.content.substr(file.content.lastIndexOf('/')+1) + '</p>\n' +
          '  </div>\n' +
          '  <div class="video-option">\n' +
          '   <p>' +
          '     <a href="javascript:" class="del-video" data-detail-id="' + file.detailID + '">\n' +
          '       <i class="icon-trash red"></i>\n' +
          '     </a>\n' +
          '     <a href="javascript:" class="change-position-up" data-detail-id="' + file.detailID + '">\n' +
          '       <i class="icon-circle-arrow-up change-position"></i>\n' +
          '     </a>\n' +
          '     <a href="javascript:" class="change-position-down" data-detail-id="' + file.detailID + '">\n' +
          '       <i class="icon-circle-arrow-down change-position"></i>\n' +
          '     </a>\n' +
          '   </p>' +
          '  </div>\n' +
          '</div>');

      //删除视频事件
      $('.content-video .detail .group-video[data-detail-id=' + file.detailID + ']').on('click','a.del-video', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这个视频吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/detail/deleteDetailImage?itemID=' + _itemID + '&detailID=' + detailId,
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                $('.content-hover[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });

      $('.content-video .detail .group-video[data-detail-id=' + file.detailID + ']').on('click','a.change-position-up', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent().parent();
        let previousFileObj = $(this).parent().parent().parent().prev();
        if(previousFileObj.length === 0){
          layer.msg('已经在最前面了。');
          return false;
        }
        let previousId = $(previousFileObj).attr('data-detail-id');
        $(previousFileObj).before($(currentFileObj));

        reverseSequence(detailId, previousId);

      });

      $('.content-video .detail .group-video[data-detail-id=' + file.detailID + ']').on('click','a.change-position-down', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent().parent();
        let nextFileObj = $(this).parent().parent().parent().next();
        if(nextFileObj.length === 0){
          layer.msg('已经在最后面了。');
          return false;
        }

        let nextId = $(nextFileObj).attr('data-detail-id');
        $(nextFileObj).after($(currentFileObj));

        reverseSequence(detailId, nextId);
      });

    });
  }

  /**
   * 将文件加载到页面并动态添加删除事件
   * @param fileList 已上传的文件列表
   */
  function appendFile(fileList){
    $.each(fileList, function (index, file) {
      $('.content-file .detail').append(
          '<div class="group-file" data-detail-id="' + file.detailID + '">\n' +
          '  <img src="/images/icons/pdf.png" alt="">\n' +
          '  <a href="' + file.content + '" target="_blank"><span>' + file.content.substr(file.content.lastIndexOf('/')+1) + '</span></a>\n' +
          '  <p>' +
          '    <i class="icon-trash del-file" data-detail-id="' + file.detailID + '"></i>' +
          '    <i class="icon-circle-arrow-up change-position" data-detail-id="' + file.detailID + '"></i>' +
          '    <i class="icon-circle-arrow-down change-position" data-detail-id="' + file.detailID + '"></i>' +
          '  </p>' +
          '</div>');

      //删除文件事件
      $('.content-file .detail .group-file[data-detail-id='+ file.detailID + ']').on('click','i.del-file', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这个文件吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/detail/deleteDetailImage?itemID=' + _itemID + '&detailID=' + detailId,
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                $('.group-file[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });

      //向上移动
      $('.content-file .detail .group-file[data-detail-id='+ file.detailID + ']').on('click','i.icon-circle-arrow-up', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent();
        let previousFileObj = $(this).parent().parent().prev();
        if(previousFileObj.length === 0){
          layer.msg('已经在最前面了。');
          return false;
        }
        let previousId = $(previousFileObj).attr('data-detail-id');
        $(previousFileObj).before($(currentFileObj));

        reverseSequence(detailId, previousId);
      });

      //向下移动
      $('.content-file .detail .group-file[data-detail-id='+ file.detailID + ']').on('click','i.icon-circle-arrow-down', function() {
        let detailId = $(this).attr('data-detail-id');
        let currentFileObj = $(this).parent().parent();
        let nextFileObj = $(this).parent().parent().next();
        if(nextFileObj.length === 0){
          layer.msg('已经在最后面了。');
          return false;
        }

        let nextId = $(nextFileObj).attr('data-detail-id');
        $(nextFileObj).after($(currentFileObj));

        reverseSequence(detailId, nextId);
      });

    });
  }

  function reverseSequence(first_id, second_id){
    $.ajax({
      url: '/detail/reverseSequence',
      type: 'put',
      dataType: 'json',
      data:{
        firstDetailID: first_id,
        secondDetailID: second_id,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  /**
   * 删除事件
   */
  $('#btn-delete').click(function () {
    let confirmMsg = '您确定要删当前内容吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: 'detail/deleteOfItem?itemID=' + _itemID,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              location.reload();
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
          }
        });
      }
    });
  });

  /**
   * 淡出添加文字的对话框
   */
  $('#btn-show-add-text').click(function () {
    $('#text-modal').modal('show');
  });

  /**
   * 将文字信息保存到数据库
   */
  $('#btn-save-text').click(function () {
    let text = $.trim($('#from-field-text').val());
    if(text.length === 0){
      layer.msg('请输入文字内容。');
      return false;
    }
    let textList = [];
    let currentSequence = getCurrentSequence('T');
    let result = saveDetailInfo(_itemID, 'T', text,currentSequence);
    if(!result.success){
      layer.msg('保存文字信息失败。');
      return false;
    }

    textList.push({detailID: result.detailId, content: text});
    appendText(textList);
    $('#text-modal').modal('hide');
    $('#from-field-text').val('');
  });

  /**
   * 弹出上传图片的对话框
   */
  $('#btn-show-upload-image').click(function () {
    $('#image-upload-modal').modal('show');
  });

  /**
   * 将上传的图片地址保存到数据库
   */
  $('#btn-save-upload-images').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }

    let fileList = saveUploadFileList('I', uploadTools.uploadedList);
    appendImage(fileList);
    $('#image-upload-modal').modal('hide');
    clearUploadStatus();
  });

  /**
   * 弹出上传文件的对话框
   */
  $('#btn-show-upload-file').click(function () {
    $('#file-upload-modal').modal('show');
  });

  /**
   * 将上传的视频地址保存到数据库
   */
  $('#btn-save-upload-video').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传视频。');
      return false;
    }
    let fileList = saveUploadFileList('V', uploadTools.uploadedList);
    appendVideo(fileList);
    $('#video-upload-modal').modal('hide');
    clearUploadStatus();
  });

  /**
   * 弹出上传视频的对话框
   */
  $('#btn-show-upload-video').click(function () {
    $('#video-upload-modal').modal('show');
  });

  /**
   * 将上传的PDF地址保存到数据库
   */
  $('#btn-save-upload-files').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传PDF文件。');
      return false;
    }
    let fileList = saveUploadFileList('F', uploadTools.uploadedList);
    appendFile(fileList);
    $('#file-upload-modal').modal('hide');
    clearUploadStatus();
  });

  initPage();
});