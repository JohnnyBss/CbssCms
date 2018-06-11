$(document).ready(function () {
  let _newsTextEditType = 'add';
  let _updPartObj = null;
  let _partID = 0;
  let _saveType = 'add';
  let _updNewsID = 0;
  function initPage() {
    $('.date-picker').datepicker({
      autoclose: true,
      todayHighlight: true
    });
    setDefaultDate();
    initUploadPlugin('#file-upload-image', ['png','jpg', 'jpeg'], false);
    initUploadPlugin('#file-upload-thumbnail', ['png','jpg', 'jpeg'], false);
    initUploadPlugin('#file-upload-video', ['webm'], true);
    showData();
  }

  function setDefaultDate(){
    let date = new Date().format('yyyy-MM-dd');
    $('#id-date-picker-1').val(date);
  }

  function initUploadPlugin(selector, fileType, multiple){
    $(selector).initUpload({
      "uploadUrl":"/editNews/fileUpload",//上传文件信息地址
      //"deleteFileUrl":"/editNews/deleteFile?fileName=",//上传文件信息地址
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
    let newsID = $('#hidden-newsID').val();
    let saveType = $('#hidden-saveType').val();
    _saveType = saveType;
    _updNewsID = newsID;
    if(saveType === 'upd'){
      $.ajax({
        url: 'editNews/updNews?newsID=' + newsID,
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            $('#form-field-newsTitle').val(res.data.newsTitle);
            $('#id-date-picker-1').val(res.data.newsDate);
            $('div.news-title-thumbnail img').attr('src', res.data.thumbnailUrl);
            $.each(res.data.newsContentList, function (index, content) {
              addNewsPart(content.newsContent, content.newsContentType);
            });
          }
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  }

  $('#btn-show-add-text').click(function () {
    _newsTextEditType = 'add';
    $('#from-field-news-text').val('');
    $('#modal-newsText').modal('show');
  });

  $('#btn-show-add-image').click(function () {
    $('#modal-newsImage').modal('show');
  });

  $('#btn-show-upload-video').click(function () {
    $('#video-upload-modal').modal('show');
  });

  function addNewsPart(newsContent, newsType){
    _partID++;
    let html = '';

    switch (newsType){
      case 'T':
        html =
            '<div class="part" data-type="T" id="part' + _partID + '">\n' +
            '  <p>' + newsContent + '</p>\n' +
            '  <div class="option">\n' +
            '    <a href="javascript:" class="part-text">\n' +
            '      <i class="icon-pencil"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-remove">\n' +
            '      <i class="icon-trash"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-up">\n' +
            '      <i class="icon-circle-arrow-up"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-down">\n' +
            '      <i class="icon-circle-arrow-down"></i>\n' +
            '    </a>\n' +
            '  </div>\n' +
            '</div>';
        break;
      case 'I':
        html =
            '<div class="part" data-type="I" id="part' + _partID + '">\n' +
            '  <img src="' + newsContent + '" alt="">' +
            '  <div class="option">\n' +
            '    <a href="javascript:" class="part-remove">\n' +
            '      <i class="icon-trash"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-up">\n' +
            '      <i class="icon-circle-arrow-up"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-down">\n' +
            '      <i class="icon-circle-arrow-down"></i>\n' +
            '    </a>\n' +
            '  </div>\n' +
            '</div>';
        break;
      case 'V':
        html =
            '<div class="part" data-type="V" id="part' + _partID + '">\n' +
            '  <video src="' + newsContent + '" controls="controls">\n' +
            '    您使用的浏览器不支持视频播放，请使用Chrome浏览器。' +
            '  </video>\n' +

            '  <div class="option">\n' +
            '    <a href="javascript:" class="part-remove">\n' +
            '      <i class="icon-trash"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-up">\n' +
            '      <i class="icon-circle-arrow-up"></i>\n' +
            '    </a>\n' +
            '    <a href="javascript:" class="part-down">\n' +
            '      <i class="icon-circle-arrow-down"></i>\n' +
            '    </a>\n' +
            '  </div>\n' +
            '</div>';
        break;
    }

    $('.detail').append(html);

    //修改局部文字
    $('.detail .part[id=part' + _partID + ']').on("click","a.part-text", function() {
      _newsTextEditType = 'upd';
      _updPartObj = $(this).parent().parent().find('p');
      let newsText = $(this).parent().parent().find('p').text();
      $('#from-field-news-text').val(newsText);
      $('#modal-newsText').modal('show');
    });

    //删除局部内容
    $('.detail .part[id=part' + _partID + ']').on("click","a.part-remove", function() {
      let currentPart = $(this).parent().parent();
      let currentPartType = $(this).parent().parent().attr('data-type');
      if(currentPartType === 'I'){
        let imageUrl = $(currentPart).find('img').attr('src');
        let imageName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        $.ajax({
          url: 'editNews/deleteFile?fileName=' + imageName,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              $(currentPart).remove();
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
          }
        });
      }else{
        $(this).parent().parent().remove();
      }
    });

    //向下移动内容
    $('.detail .part[id=part' + _partID + ']').on("click","a.part-down", function() {
      let currentPartObj = $(this).parent().parent();
      moveDown(currentPartObj);
    });

    //向上移动内容
    $('.detail .part[id=part' + _partID + ']').on("click","a.part-up", function() {
      let currentPartObj = $(this).parent().parent();
      moveUp(currentPartObj);
    });
  }

  function changePartText(newsText){
    $(_updPartObj).text(newsText);
  }

  function moveUp(obj){
    //1 取得前一个part元素
    let preObj = $(obj).prev('div.part');
    if(preObj.length === 0){
      layer.msg('这部分已经在最前面啦。');
      return false;
    }
    //2 将当前元素插入到上一个元素之前
    $(preObj).before(obj);
  }

  function moveDown(obj){
    //1 拿到下一个part元素
    let nextObj = $(obj).next('div.part');
    if(nextObj.length === 0){
      layer.msg('这部分已经在最后面啦。');
      return false;
    }
    //2 将当前元素插入到下一个元素之后
    $(nextObj).after(obj);
  }

  $('#btn-add-text').click(function () {
    let newsText = $.trim($('#from-field-news-text').val());
    if(newsText.length === 0){
      layer.msg('请输入新闻的文字内容');
      return false;
    }
    if(_newsTextEditType === 'add'){
      addNewsPart(newsText, 'T');
    }else{
      changePartText(newsText);
    }
    $('#modal-newsText').modal('hide');
  });

  $('#btn-add-image').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }
    let fileList = uploadTools.uploadedList;
    addNewsPart(fileList[0], 'I');
    uploadTools.isUploaded = false;
    $('#modal-newsImage').modal('hide');
  });

  $('#btn-save-upload-video').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传视频。');
      return false;
    }
    let fileList = uploadTools.uploadedList;
    addNewsPart(fileList[0], 'V');
    uploadTools.isUploaded = false;
    $('#video-upload-modal').modal('hide');
  });

  $('#btn-upload-thumbnail').click(function () {
    $('#modal-newsThumbnail').modal('show');
  });

  $('#btn-add-thumbnail').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }
    let fileList = uploadTools.uploadedList;
    $('div.news-title-thumbnail img').attr('src', fileList[0]);
    uploadTools.isUploaded = false;
    $('#modal-newsThumbnail').modal('hide');
  });

  $('#btn-save').click(function () {
    if(!checkData()){
      return false;
    }
    saveNews();
  });

  function checkData(){
    let newsTitle = $.trim($('#form-field-newsTitle').val());
    let newsDate = $.trim($('#id-date-picker-1').val());
    let newsThumbnailUrl = $('div.news-title-thumbnail img').attr('src');
    let newsContentCount = $('div.detail').children().length;

    if(newsTitle.length === 0){
      layer.msg('请填写新闻标题。');
      return false;
    }
    if(newsDate.length === 0){
      layer.msg('请填写新闻日期。');
      return false;
    }

    if(newsThumbnailUrl === '/images/upload/demo.jpg'){
      layer.msg('请添加新闻标题图片。');
      return false;
    }

    if(newsContentCount === 0){
      layer.msg('请添加新闻内容（文字或者图片）。');
      return false;
    }
    return true;
  }

  function saveNews(){
    let newsTitle = $.trim($('#form-field-newsTitle').val());
    let newsDate = $.trim($('#id-date-picker-1').val());
    let newsThumbnailUrl = $('div.news-title-thumbnail img').attr('src');
    let newsContentArray = $('div.detail').children('div.part');
    let newsContentObj = [];

    $.each(newsContentArray, function (index, content) {
      let contentType = $(content).attr('data-type');
      let newsContent = '';
      switch (contentType){
        case 'T':
          newsContent = $(content).find('p').text();
          break;
        case 'I':
          newsContent = $(content).find('img').attr('src');
          break;
        case 'V':
          newsContent = $(content).find('video').attr('src');
          break;
      }

      newsContentObj.push({
        newsContentType: contentType,
        newsContent: newsContent,
        loginUser: getLoginUser()
      });
    });

    if(_saveType === 'add'){
      $.ajax({
        url: 'editNews',
        type: 'post',
        dataType: 'json',
        data: {
          newsTitle: newsTitle,
          newsDate: newsDate,
          thumbnailUrl: newsThumbnailUrl,
          newsContentJson: JSON.stringify(newsContentObj),
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            layer.alert('保存成功, 3秒后返回新闻列表页面', {icon: 6});
            $('#btn-save').attr('disabled', 'disabled');
            setTimeout('location.href="/news"',3000);
          }
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }else{
      $.ajax({
        url: 'editNews',
        type: 'put',
        dataType: 'json',
        data: {
          newsID: _updNewsID,
          newsTitle: newsTitle,
          newsDate: newsDate,
          thumbnailUrl: newsThumbnailUrl,
          newsContentJson: JSON.stringify(newsContentObj),
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            layer.alert('保存成功, 3秒后返回新闻列表页面', {icon: 6});
            $('#btn-save').attr('disabled', 'disabled');
            setTimeout('location.href="/news"',3000);
          }
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }

  }

  initPage();
});