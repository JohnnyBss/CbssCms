$(document).ready(function () {
  const _option = $('#hidden-option').val();
  const _moduleID = $('#hidden-moduleID').val();
  let _uploadVideoUrlList = [];
  let _uploadImageUrlList = [];
  let _uploadAudioUrlList = [];
  let _appendTextList = [];

  let _temp_video_id = 0;
  let _temp_image_id = 0;
  let _temp_audio_id = 0;
  let _temp_text_id = 0;


  function initPage() {
    checkItemIdIsValid();
    setPageStatus();
    initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], true);
    initUploadPlugin('#file-upload-file', ['mp3'], true);
    initUploadPlugin('#file-upload-video', ['mp4', 'webm'], true);
    showData();
  }

  function initUploadPlugin(selector, fileType, multiple){
    $(selector).initUpload({
      "uploadUrl":"/advertiseDetail/fileUpload",//上传文件信息地址
      //"deleteFileUrl":"/advertiseDetail/deleteFile?fileName=",//上传文件信息地址
      "ismultiple": multiple,
      "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
      "maxFileNumber": 10,//文件个数限制，为整数\
    });
  }

  function checkItemIdIsValid() {
    if(_option !== 'add' && _option !== 'upd'){
      disabledPage();
      return false;
    }

    if (_option === 'upd' && (_moduleID === 'undefined' || _moduleID === '' || isNaN(_moduleID))) {
      disabledPage();
      return false;
    }
    return true;
  }

  function disabledPage() {
    $('.content-list button').attr('disabled', 'disabled');
    $('#btn-save').attr('disabled', 'disabled');
    $('#btn-delete').attr('disabled', 'disabled');
    layer.msg('参数不正确，操作被禁止。');
  }

  function setPageStatus() {
    if(_option === 'upd'){
      $('#btn-delete').show();
    }
  }

  function showData(){
    if(_option !== 'upd'){
      return false;
    }
    let imageArray = [];
    let videoArray = [];
    let audioArray = [];

    if(!checkItemIdIsValid()){
      return false;
    }

    $.ajax({
      url: '/advertiseDetail/data?moduleID=' + _moduleID,
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }

        if(res.data === null){
          $('#btn-delete').hide();
          layer.msg('参数不正确，未查询到数据。');
          return false;
        }else{
          $('#btn-delete').show();
        }

        $('#advertise-title').val(res.data.moduleName);
        $.each(res.data.advertiseDetailList4Video, function (index, video) {
          videoArray.push(video.detailContent);
        });

        $.each(res.data.advertiseDetailList4Image, function (index, image) {
          imageArray.push(image.detailContent);
        });

        $.each(res.data.advertiseDetailList4Audio, function (index, audio) {
          audioArray.push(audio.detailContent);
        });

        $.each(res.data.advertiseDetailList4Text, function (index, text) {
          appendText(text.detailContent);
        });

        appendImage(imageArray);
        appendVideo(videoArray);
        appendFile(audioArray);
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }


  function clearUploadStatus(){
    uploadTools.isUploaded = false;
  }

  function removeItemFromArray(array, key){
    for (let i = 0; i < array.length; i++) {
      if(array[i].key === parseInt(key)){
        array.splice(i,1);
        break;
      }
    }
  }

  //=============================视频处理===================================
  /**
   * 弹出上传视频的对话框
   */
  $('#btn-show-upload-video').click(function () {
    $('#video-upload-modal').modal('show');
  });

  /**
   * 将上传的视频加载到页面
   */
  $('#btn-save-upload-video').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传视频。');
      return false;
    }
    appendVideo(uploadTools.uploadedList);
    $('#video-upload-modal').modal('hide');
    clearUploadStatus();
  });

  /**
   * 将视频加载到页面并动态添加删除事件
   * @param fileList 已上传的视频列表
   */
  function appendVideo(fileList){
    $.each(fileList, function (index, file) {
      _temp_video_id++;
      _uploadVideoUrlList.push({key: _temp_video_id, content: file});
      $('.content-video .detail').append(
          '<div class="content-hover group-video port-1 effect-1" data-detail-id="' + _temp_video_id + '">\n' +
          '  <div class="video-box">\n' +
          '    <video src="' + file + '" controls="controls" style="width: 100%">\n' +
          '      您使用的浏览器不支持视频播放，请使用Chrome浏览器。' +
          '    </video>\n' +
          '  </div>\n' +
          '  <div class="video-desc" data-detail-id = "' + _temp_video_id + '">\n' +
          '    <p>' + file.substr(file.lastIndexOf('/')+1) + '</p>\n' +
          '  </div>\n' +
          '  <div class="video-option">\n' +
          '    <a href="javascript:" class="del-video" data-detail-id="' + _temp_video_id + '">\n' +
          '      <i class="icon-trash red"></i>\n' +
          '    </a>\n' +
          '  </div>\n' +
          '</div>');

      //删除视频事件
      $('.content-video .detail .group-video[data-detail-id=' + _temp_video_id + ']').on('click','a.del-video', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这个视频吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/advertiseDetail/deleteFile?fileName=' + file.substr(file.lastIndexOf('/')+1),
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                removeItemFromArray(_uploadVideoUrlList, detailId);
                $('.content-video .detail .group-video[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });
    });
  }

  //=============================图片处理===================================
  /**
   * 弹出上传图片的对话框
   */
  $('#btn-show-upload-image').click(function () {
    $('#image-upload-modal').modal('show');
  });

  /**
   * 将上传的图片加载到页面中
   */
  $('#btn-save-upload-images').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }

    appendImage(uploadTools.uploadedList);
    $('#image-upload-modal').modal('hide');
    clearUploadStatus();
  });

  /**
   * 将上传的图片加载到页面并动态添加删除事件
   * @param fileList 已上传的图片列表
   */
  function appendImage(fileList){
    $.each(fileList, function (index, file) {
      _temp_image_id++;
      _uploadImageUrlList.push({key: _temp_image_id, content: file});
      $('.content-image .detail').append(
          '<div class="content-hover group-image port-1 effect-1" data-detail-id="' + _temp_image_id + '">\n' +
          '  <div class="image-box">\n' +
          '    <img src="' + file + '" alt="">\n' +
          '  </div>\n' +
          '  <div class="text-desc" data-detail-id="' + _temp_image_id + '">\n' +
          '    <a href="javascript:" class="option del-image" data-detail-id="' + _temp_image_id + '">删除图片</a>\n' +
          '  </div>\n' +
          '  <div class="image-desc" data-detail-id="' + _temp_image_id + '">\n' +
          '    <p>' + file.substr(file.lastIndexOf('/')+1) + '</p>\n' +
          '  </div>\n' +
          '</div>');

      //删除图片事件
      $('.content-image .detail .text-desc[data-detail-id=' + _temp_image_id + ']').on('click','a.del-image', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这张图片吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/advertiseDetail/deleteFile?fileName=' + file.substr(file.lastIndexOf('/')+1),
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                removeItemFromArray(_uploadImageUrlList, detailId);
                $('.content-image .detail .group-image[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });
    });
  }

  //=============================音频处理===================================
  /**
   * 弹出上传MP3的对话框
   */
  $('#btn-show-upload-file').click(function () {
    $('#file-upload-modal').modal('show');
  });

  /**
   * 将上传的MP3地址保存到数据库
   */
  $('#btn-save-upload-files').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传mp3格式的音频文件。');
      return false;
    }
    appendFile(uploadTools.uploadedList);
    $('#file-upload-modal').modal('hide');
    clearUploadStatus();
  });

  /**
   * 将文件加载到页面并动态添加删除事件
   * @param fileList 已上传的文件列表
   */
  function appendFile(fileList){
    $.each(fileList, function (index, file) {
      _temp_audio_id++;
      _uploadAudioUrlList.push({key: _temp_audio_id, content: file});
      $('.content-file .detail').append(
          '<div class="content-hover group-audio port-1 effect-1" data-detail-id="' + _temp_audio_id + '">\n' +
          '  <div class="video-box">\n' +
          '    <audio src="' + file + '" controls="controls" style="width: 100%">\n' +
          '      您使用的浏览器不支持音频播放，请使用Chrome浏览器。' +
          '    </audio>\n' +
          '  </div>\n' +
          '  <div class="video-desc" data-detail-id = "' + _temp_audio_id + '">\n' +
          '    <p>' + file.substr(file.lastIndexOf('/')+1) + '</p>\n' +
          '  </div>\n' +
          '  <div class="video-option">\n' +
          '    <a href="javascript:" class="del-audio" data-detail-id="' + _temp_audio_id + '">\n' +
          '      <i class="icon-trash red"></i>\n' +
          '    </a>\n' +
          '  </div>\n' +
          '</div>');

      //删除文件事件
      $('.content-file .detail .group-audio[data-detail-id='+ _temp_audio_id + ']').on('click','a.del-audio', function() {
        let detailId = $(this).attr('data-detail-id');
        let confirmMsg = '您确定要删除这个音频吗？';
        bootbox.confirm(confirmMsg, function(result) {
          if(result) {
            $.ajax({
              url: '/advertiseDetail/deleteFile?fileName=' + file.substr(file.lastIndexOf('/')+1),
              type: 'delete',
              success: function (res) {
                if(res.err){
                  layer.msg(res.msg);
                  return false;
                }
                removeItemFromArray(_uploadAudioUrlList, detailId);
                $('.content-file .detail .group-audio[data-detail-id="' + detailId + '"]').remove();
              },
              error: function(XMLHttpRequest){
                layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
              }
            });
          }
        });
      });
    });
  }

  //=============================文字处理===================================
  /**
   * 淡出添加文字的对话框
   */
  $('#btn-show-add-text').click(function () {
    $('#text-modal').modal('show');
  });

  /**
   * 将文字信息添加到页面中
   */
  $('#btn-save-text').click(function () {
    let text = $.trim($('#from-field-text').val());
    if(text.length === 0){
      layer.msg('请输入文字内容。');
      return false;
    }
    appendText(text);
    $('#text-modal').modal('hide');
    $('#from-field-text').val('');
  });

  /**
   * 将说明文字加载到页面并动态添加删除事件
   */
  function appendText(text){
    _temp_text_id++;
    _appendTextList.push({key: _temp_text_id, content: text});
    $('.content-text .detail').append(
        '<div class="group-text" data-detail-id = ' + _temp_text_id + '>\n' +
        '  <div class="text-desc" data-detail-id = "' + _temp_text_id + '">\n' +
        '    <p style="margin-top: 10px">' + text + '</p>\n' +
        '  </div>\n' +
        '  <div class="text-option">\n' +
        '    <a href="javascript:" class="del-text" data-detail-id="' + _temp_text_id + '">\n' +
        '      <i class="icon-trash red"></i>\n' +
        '    </a>\n' +
        '  </div>\n' +
        '</div>');

    //删除文本内容事件
    $('.content-text .detail .group-text[data-detail-id=' + _temp_text_id + ']').on('click','a.del-text', function() {
      let detailId = $(this).attr('data-detail-id');
      let confirmMsg = '您确定要删除这部分内容吗？';
      bootbox.confirm(confirmMsg, function(result) {
        if(result) {
          removeItemFromArray(_appendTextList, detailId);
          $('.content-text .detail .group-text[data-detail-id="' + detailId + '"]').remove();
        }
      });
    });
  }

  /**
   * 数据校验
   * @returns {boolean} 校验结果
   */
  function checkData(){
    let title = $.trim($('#advertise-title').val());
    if(title.length === 0){
      layer.msg('请填写标题');
      return false;
    }
    if(_uploadVideoUrlList.length === 0
        && _uploadImageUrlList.length === 0
        && _uploadAudioUrlList.length === 0
        && _appendTextList.length === 0){
      layer.msg('请展示设置内容');
      return false;
    }
    return true;
  }

  /**
   * 保存数据
   */
  function save(){
    let reqType = _option === 'add' ? 'POST' : 'PUT';
    let contentArray = [];

    $.each(_uploadVideoUrlList, function (index, video) {
      contentArray.push({
        detailType: 'V',
        detailContent: video.content
      });
    });

    $.each(_uploadImageUrlList, function (index, image) {
      contentArray.push({
        detailType: 'I',
        detailContent: image.content
      });
    });

    $.each(_uploadAudioUrlList, function (index, audio) {
      contentArray.push({
        detailType: 'A',
        detailContent: audio.content
      });
    });

    $.each(_appendTextList, function (index, text) {
      contentArray.push({
        detailType: 'T',
        detailContent: text.content
      });
    });

    $.ajax({
      url: '/advertiseDetail',
      type: reqType,
      dataType: 'json',
      data:{
        moduleID: _moduleID,
        moduleName: $.trim($('#advertise-title').val()),
        detailJson: JSON.stringify(contentArray),
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/advertise';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });

  }

  $('#btn-save').click(function () {
    if(!checkData()){
      return false;
    }
    save();
  });

  /**
   * 删除事件
   */
  $('#btn-delete').click(function () {
    let confirmMsg = '您确定要删当前内容吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: 'advertiseDetail?moduleID=' + _moduleID,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              location.href = '/advertise';
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
          }
        });
      }
    });
  });

  initPage();
});