$(document).ready(function () {
  function initPage() {
    initUploadPlugin('#file-upload-logo', ['png','jpg', 'jpeg'], false);
    loadDefaultLogo();
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

  function loadDefaultLogo() {
    $.ajax({
      url: '/logo/current',
      type: 'GET',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.data === null){
          layer.msg('未设置当前默认Logo。');
          return false;
        }
        $('.client-logo').attr('src', res.data.logoUrl);
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  $('#btn-show-upload').click(function () {
    $('#modal-system-logo').modal('show');
  });

  $('#btn-add-logo').click(function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }
    let imgUrl = uploadTools.uploadedList[0];

    $.ajax({
      url: '/logo',
      type: 'post',
      dataType: 'json',
      data: {
        logoUrl: imgUrl,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          uploadTools.isUploaded = false;
          $('#modal-system-logo').modal('hide');
          $('.client-logo').attr('src', imgUrl);
          layer.msg('上传成功。');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  });

  initPage();
});