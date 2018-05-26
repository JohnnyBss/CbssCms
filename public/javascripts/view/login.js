var app = new Vue({
  el: '#app',
  data: {
    cellphone: '',
    password: ''
  },
  computed: {
    enabledSave: function () {
      return this.cellphone.length > 0 && this.password.length > 0;
    }
  },
  methods:{
    onLogin: function () {
      $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'json',
        data:{
          cellphone: app.$data.cellphone,
          password: app.$data.password
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.userInfo === null) {
            layer.msg('用户名密码不存在。');
            return false;
          } else {
            setCookie('loginUser', JSON.stringify(res.userInfo));
            location.href = '/index';
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  }
});