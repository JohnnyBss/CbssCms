var app = new Vue({
  el: '#app',
  data: {
    option: $('#hidden_option').val(),
    userID: $('#hidden_userID').val(),
    userName: '',
    cellphone: '',
    photoUrl: 'images/user_photo_default.jpeg',
    resumeUrl: '',
    selectedRole: 0,
    roles:[
      {value: 0, text: '管理员'},
      {value: 1, text: '普通职员'},
      {value: 2, text: '理财经理'},
      {value: 3, text: '大堂经理'},
      {value: 4, text: '营运主管'}
    ],
    originalCellphone: '',
    cellphoneValid: false,
    saveType: $('#hidden_option').val()
  },
  computed: {
    enabledSave: function () {
      return this.userName.length > 0
          && this.cellphone.length > 0
          && (this.cellphone === this.originalCellphone || this.cellphoneValid);
    }
  },
  methods: {
    initPage: function(){
      this.loadUserInfo();
      this.initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], '/userDetail/photoUpload', false);
      this.initUploadPlugin('#file-upload-resume', ['png','jpg','JPG', 'jpeg'], '/userDetail/resumeUpload', false);
    },
    initUploadPlugin: function(selector, fileType, uploadPath, multiple){
      $(selector).initUpload({
        "uploadUrl": uploadPath,//上传文件信息地址
        //"deleteFileUrl":"/advertiseDetail/deleteFile?fileName=",//上传文件信息地址
        "ismultiple": multiple,
        "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
        "maxFileNumber": 10,//文件个数限制，为整数\
      });
    },
    loadUserInfo: function(){
      if(this.option !== 'upd'){
        return false;
      }
      $.ajax({
        url: '/user/data?userID=' + this.userID,
        type: 'GET',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.data === null){
            layer.msg('该用户不存在或已删除。');
            return false;
          }
          app.$data.userName = res.data.userName;
          app.$data.cellphone = res.data.cellphone;
          app.$data.originalCellphone = res.data.cellphone;
          app.$data.selectedRole = res.data.userRole === null ? 0 : res.data.userRole;
          app.$data.photoUrl = res.data.userPhoto === '' ? 'images/user_photo_default.jpeg' : res.data.userPhoto;
          app.$data.resumeUrl = res.data.userResume;
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    },
    onCellphoneBlur: function () {
      if(this.cellphone.length === 0 || this.cellphone === this.originalCellphone){
        return false;
      }
      $.ajax({
        url: '/user/cellphone?cellphone=' + this.cellphone,
        type: 'GET',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.data !== null){
            app.$data.cellphoneValid = false;
            layer.msg('该手机号码已存在。');
            return false;
          }
          app.$data.cellphoneValid = true;
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    },
    checkData: function(){
      if(this.saveType !== 'add' && this.saveType !== 'upd'){
        layer.msg('参数不正确。');
        return false;
      }
      if(this.userName.length === 0){
        layer.msg('请输入员工姓名。');
        return false;
      }
      if(this.cellphone.length === 0){
        layer.msg('请输入员工手机号码。');
        return false;
      }
      if(this.photoUrl === 'images/user_photo_default.jpeg'){
        layer.msg('请上传员工头像。');
        return false;
      }
      if(this.resumeUrl === ''){
        layer.msg('请上传员工履历。');
        return false;
      }
      return true;
    },
    onShowUploadDialog: function(){
      $('#photo-upload-modal').modal('show');
    },
    onShowUploadResume: function(){
      $('#resume-upload-modal').modal('show');
    },
    onLoadImage: function(){
      if(!uploadTools.isUploaded){
        layer.msg('请先上传照片。');
        return false;
      }
      this.photoUrl = uploadTools.uploadedList[0];
      $('#photo-upload-modal').modal('hide');
      uploadTools.isUploaded = false;
    },
    onLoadResume: function(){
      if(!uploadTools.isUploaded){
        layer.msg('请先上传员工履历。');
        return false;
      }
      this.resumeUrl = uploadTools.uploadedList[0];
      $('#resume-upload-modal').modal('hide');
      uploadTools.isUploaded = false;
    },
    onDelete: function (userID, userName) {
      let confirmMsg = '您确定要删除用户【' + userName + '】吗？';
      bootbox.confirm(confirmMsg, function(result) {
        if(result) {
          $.ajax({
            url: '/user?userID=' + userID,
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
              layer.msg('远程服务无响应，请检查网络设置。');
            }
          });
        }
      });
    },
    onSave: function () {
      if(!this.checkData()){
        return false;
      }
      let type = '';
      let data = {};
      if(this.saveType === 'add'){
        type = 'post';
        data = {
          userName: this.userName,
          cellphone: this.cellphone,
          userRole: this.selectedRole,
          userPhoto: this.photoUrl,
          userResume: this.resumeUrl,
          loginUser: getLoginUser()
        }
      }else {
        type = 'put';
        data = {
          userID: this.userID,
          userName: this.userName,
          cellphone: this.cellphone,
          userRole: this.selectedRole,
          userPhoto: this.photoUrl,
          userResume: this.resumeUrl,
          loginUser: getLoginUser()
        }
      }
      $.ajax({
        url: '/user',
        type: type,
        dataType: 'json',
        data: data,
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            location.href = '/user';
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    }
  },
  mounted: function () {
    this.initPage();
  }
});