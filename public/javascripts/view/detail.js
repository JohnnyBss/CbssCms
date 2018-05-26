$(document).ready(function () {
  let _itemID = $('#hidden-itemID').val();
  let _flag = $('#hidden-flag').val();
  let _itemIdValid = true;
  let _detailId4Memo = 0;
  function initPage() {
    setDropDownList();
    setBreadcrumbs();
    // setReadonlyStatus();
    initUploadPlugin('#file-upload-image', ['png','jpg', 'jpeg'], true);
    initUploadPlugin('#file-upload-file', ['pdf'], true);
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

  // function setReadonlyStatus() {
  //   if(_flag === 's'){
  //     $('#btn-back').hide();
  //     $('#btn-show-upload-image').hide();
  //     $('#btn-show-upload-file').hide();
  //     $('#btn-save').hide();
  //     $('#btn-delete').hide();
  //   }
  // }

  function checkItemIdIsValid() {
    if(_itemID === 'undefined' || _itemID === '' || isNaN(_itemID)){
      $('#btn-show-upload-image').attr('disabled', 'disabled');
      $('#btn-show-upload-file').attr('disabled', 'disabled');
      $('#btn-save').attr('disabled', 'disabled');
      $('#btn-delete').attr('disabled', 'disabled');
      _itemIdValid = false;
      layer.msg('参数不正确，操作被禁止。');
    }
  }

  function setDropDownList(){
    let selectYear = $('#select-year').find('strong');
    let selectQuarter = $('#select-quarter').find('strong');

    // Get initial value
    selectYear.text($('#select-year').val());
    selectQuarter.text($('#select-quarter').val());
    // Initialize Selectric and bind to 'change' event
    $('#select-year').selectric().on('change', function() {
      selectYear.text($(this).val());
    });
    $('#select-quarter').selectric().on('change', function() {
      selectQuarter.text($(this).val());
    });
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
    if(!_itemIdValid){
      return false;
    }
    $.ajax({
      url: '/detail/data?itemID=' + _itemID + '&year=' + $('#select-year').val() + '&quarter=' + $('#select-quarter').val(),
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        $('.detail-content').empty();
        if(res.dataList.length === 0){
          $('#btn-save').attr('disabled', 'disabled');
          $('#btn-delete').attr('disabled', 'disabled');
        }else{
          $('#btn-save').removeAttr('disabled');
          $('#btn-delete').removeAttr('disabled');
        }
        $.each(res.dataList, function (index, data) {
          switch (data.contentType){
            case 'I':
              $('.detail-content').append(
                  '<div class="content-hover port-1 effect-1" data-detail-id="' + data.detailID + '">\n' +
                  '  <div class="image-box">\n' +
                  '    <img src="' + data.content + '" alt="">\n' +
                  '  </div>\n' +
                  '  <div class="text-desc">\n' +
                  '    <h3>操作说明</h3>\n' +
                  '    <p>您可以对该图片添加说明文字，或者删除该图片</p>\n' +
                  '    <a href="javascript:" class="option add-memo" data-detail-id="' + data.detailID + '">添加说明</a>\n' +
                  '    <a href="javascript:" class="option del-image" data-detail-id="' + data.detailID + '">删除图片</a>\n' +
                  '  </div>\n' +
                  '  <div class="image-desc" data-detail-id="' + data.detailID + '">\n' +
                  '    <p></p>\n' +
                  '  </div>\n' +
                  '</div>');
              break;
            case 'F':
              let fileName = data.content.substr(data.content.lastIndexOf('/') + 1);
              $('.detail-content').append(
                  '<div class="group-file" data-detail-id="' + data.detailID + '">\n' +
                  '  <img src="/images/icons/pdf.png" alt="">\n' +
                  '  <a href="' + data.content + '" target="_blank">' + fileName + '</a>\n' +
                  '  <i class="icon-trash del-file" data-detail-id="' + data.detailID + '"></i>' +
                  '</div>');
              break;
          }
        });

        //添加图片说明事件
        $(".detail-content .text-desc").on("click","a.add-memo", function() {
          _detailId4Memo = $(this).attr('data-detail-id');
          let memo = $('div.image-desc[data-detail-id="' + _detailId4Memo + '"]').find('p').text();
          $('#from-field-image-memo').val(memo);
          $('#image-memo-modal').modal('show');
        });

        //删除图片事件
        $(".detail-content .text-desc").on("click","a.del-image", function() {
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


        //删除文件事件
        $(".detail-content .group-file").on("click","i.del-file", function() {
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

        showMemo();
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function showMemo() {
    $.each($('.content-hover'), function (index, obj) {
      let imageID = $(obj).attr('data-detail-id');
      $.ajax({
        url: '/detail/imageMemo?itemID=' + _itemID + '&textMapDetail=' + imageID,
        type: 'get',
        success: function (res) {
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          $(obj).find('div.image-desc').find('p').text(res.data === null ? '' : res.data.content);
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    })
  }

  function saveDetailInfo(itemID, contentType, content, textMapDetail, year, quarter){
    let saveResult = false;
    $.ajax({
      url: '/detail',
      type: 'post',
      dataType: 'json',
      async: false,
      data:{
        itemID: itemID,
        contentType: contentType,
        content: content,
        textMapDetail: textMapDetail,
        year: year,
        quarter: quarter,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          saveResult = true;
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });

    return saveResult;
  }

  function clearUploadStatus(){
    uploadTools.isUploaded = false;

  }

  $('#btn-save-memo').click(function () {
    let memo = $.trim($('#from-field-image-memo').val());
    if(memo.length === 0){
      layer.msg('请输入图片说明文字。');
      return false;
    }
    let result = saveDetailInfo(_itemID, 'T', memo, _detailId4Memo, $('#select-year').val(), $('#select-quarter').val());
    if(result){
      $('div.image-desc[data-detail-id="' + _detailId4Memo + '"]').find('p').text(memo);
      $('#image-memo-modal').modal('hide');
      layer.msg('保存成功！');
    }
  });

  /**
   * 返回事件
   */
  $('#btn-back').click(function () {
    location.href = '/item'; //todo 需要传回节点编号
  });

  /**
   * 上传图片事件
   */
  $('#btn-show-upload-image').click(function () {
    $('#image-upload-modal').modal('show');
  });

  /**
   * 上传文件事件
   */
  $('#btn-show-upload-file').click(function () {
    $('#file-upload-modal').modal('show');
  });

  /**
   * 保存事件
   */
  $('#btn-save').click(function () {
    $.ajax({
      url: '/item',
      type: 'post',
      dataType: 'json',
      data:{
        itemName: $('#select-year').val() + '年第' + $('#select-quarter').val() + '季度',
        itemType: 'D',
        parentItemID: _itemID,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          layer.alert('提交成功！', {icon: 6});
          $('#btn-save').attr('disabled', 'disabled');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  });

  /**
   * 删除事件
   */
  $('#btn-delete').click(function () {
    let year = $('#select-year').val();
    let quarter = $('#select-quarter').val();
    let confirmMsg = '您确定要删当前考评点' + year + '年第' + quarter + '季度的详细数据吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: 'detail/deleteOfItem?itemID=' + _itemID + '&year=' + year + '&quarter=' + quarter,
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
   * 将上传的图片地址保存到数据库
   */
  $('#btn-save-upload-images').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }

    let fileList = uploadTools.uploadedList;
    let saveResult = false;

    $.each(fileList, function (index, file) {
      saveResult = saveDetailInfo(_itemID, 'I', file, 0, $('#select-year').val(), $('#select-quarter').val());
    });

    if(saveResult){
      // $('#image-upload-modal').modal('hide');
      // showData();
      // layer.msg('保存成功！');
      location.reload();
    }
    clearUploadStatus();
  });

  /**
   * 将上传的PDF地址保存到数据库
   */
  $('#btn-save-upload-files').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传PDF文件。');
      return false;
    }

    let fileList = uploadTools.uploadedList;
    let saveResult = false;

    $.each(fileList, function (index, file) {
      saveResult = saveDetailInfo(_itemID, 'F', file, 0, $('#select-year').val(), $('#select-quarter').val());
    });

    if(saveResult){
      location.reload();
      // $('#file-upload-modal').modal('hide');
      // showData();
      // layer.msg('保存成功！');
    }
    //clearUploadStatus();
  });

  $('.johnny-select').change(function () {
    showData();
  });

  initPage();
});