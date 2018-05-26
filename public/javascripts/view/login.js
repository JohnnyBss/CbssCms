var app = new Vue({
  el: '#app',
  data: {
    userName: '',
    password: ''
  },
  computed: {
    enabledSave: function () {
      return this.userName.length > 0 && this.password.length > 0;
    }
  },
  methods:{
    onLogin: function () {
      $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'json',
        data:{
          userName: app.$data.userName,
          password: app.$data.password
        },
        success: function(res){
          if(res.err || !res.pass){
            showMessage(res.msg);
          }else{
            setCookie('loginUser', JSON.stringify(res.userInfo));
            location.href = '/index';
          }
        },
        error: function(XMLHttpRequest, textStatus){
          showMessage('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  }
});