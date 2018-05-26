var app = new Vue({
  el: '#app',
  data: {
    administratorID: '',
    userName: '',
    account_current: '',
    account: '',
    accountValid: false,
    cellphone_current: '',
    cellphone: '',
    cellphoneValid: false,
    email_current: '',
    email: '',
    emailValid: false,
    password: '',
    confirmPassword: '',
    passwordValid: false
  },
  computed: {
    enabledSave: function () {
      return this.userName.length > 0
          && this.account.length > 0
          && this.cellphone.length > 0
          && this.email.length > 0
          && this.password.length > 0
          && this.confirmPassword.length > 0
          && this.accountValid
          && this.cellphoneValid
          && this.emailValid
          && this.passwordValid;
    }
  },
  methods: {
    initProcess: function () {
      this.setCurrentUserInfo();
    },
    setCurrentUserInfo: function () {
      this.administratorID = getLoginUserInfo().administratorID;
      $.ajax({
        url: '/user/detail?administratorID=' + this.administratorID,
        type: 'GET',
        success: function(res){
          if(res.err){
            propAlert(res.msg);
          }else{
            app.$data.administratorID = res.data.administratorID;
            app.$data.userName = res.data.administratorName;
            app.$data.account_current = res.data.account;
            app.$data.account = res.data.account;
            if(res.data.account.length > 0){
              app.$data.accountValid = true;
            }
            app.$data.cellphone_current = res.data.cellphone;
            app.$data.cellphone = res.data.cellphone;
            if(res.data.cellphone.length > 0){
              app.$data.cellphoneValid = true;
            }
            app.$data.email_current = res.data.email;
            app.$data.email = res.data.email;
            if(res.data.email.length > 0){
              app.$data.emailValid = true;
            }
          }
        },
        error: function(XMLHttpRequest, textStatus){
          propAlert('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    onUserNameBlur: function () {
      if(app.$data.account === app.$data.account_current){
        app.$data.accountValid = true;
        hiddenMessage();
      }
      if(app.$data.account.length <= 0 || app.$data.account === app.$data.account_current){
        return false;
      }
      $.ajax({
        url: '/register/checkUserName?userName='+app.$data.account,
        type: 'GET',
        success: function(res){
          if(res.err){
            app.$data.accountValid = false;
            showMessage(res.msg);
          }else if(res.exist){
            app.$data.accountValid = false;
            showMessage('用户名已存在。');
          }else{
            app.$data.accountValid = true;
            hiddenMessage();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          showMessage('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    onCellphoneBlur: function () {
      if(app.$data.cellphone === app.$data.cellphone_current){
        app.$data.cellphoneValid = true;
        hiddenMessage();
      }
      if(app.$data.cellphone.length <= 0 || app.$data.cellphone === app.$data.cellphone_current){
        return false;
      }
      $.ajax({
        url: '/register/checkCellphone?cellphone='+app.$data.cellphone,
        type: 'GET',
        success: function(res){
          if(res.err){
            app.$data.cellphoneValid = false;
            showMessage(res.msg);
          }else if(res.exist){
            app.$data.cellphoneValid = false;
            showMessage('手机号已存在。');
          }else{
            app.$data.cellphoneValid = true;
            hiddenMessage();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          showMessage('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    onEmailBlur: function () {
      if(app.$data.email === app.$data.email_current){
        app.$data.emailValid = true;
        hiddenMessage();
      }
      if(app.$data.email.length <= 0 || app.$data.email === app.$data.email_current){
        return false;
      }
      $.ajax({
        url: '/register/checkEmail?email='+app.$data.email,
        type: 'GET',
        success: function(res){
          if(res.err){
            app.$data.emailValid = false;
            showMessage(res.msg);
          }else if(res.exist){
            app.$data.emailValid = false;
            showMessage('邮箱已存在。');
          }else{
            app.$data.emailValid = true;
            hiddenMessage();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          showMessage('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    onConfirmPasswordBlur: function () {
      if(app.$data.password !== app.$data.confirmPassword){
        app.$data.passwordValid = false;
        showMessage('密码和确认密码不一致。');
      }else{
        app.$data.passwordValid = true;
        hiddenMessage();
      }
    },
    onSave: function () {
      $.ajax({
        url: '/user',
        type: 'PUT',
        dataType: 'json',
        data:{
          administratorID: app.$data.administratorID,
          userName: app.$data.userName,
          account: app.$data.account,
          cellphone: app.$data.cellphone,
          email: app.$data.email,
          password: app.$data.password,
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            showMessage(res.msg);
          }else{
            showMessage('个人信息修改成功。');
          }
        },
        error: function(XMLHttpRequest, textStatus){
          showMessage('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  },
  mounted: function () {
    this.initProcess();
  }
});