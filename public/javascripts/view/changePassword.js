var app = new Vue({
  el: '#app',
  data: {
    originalPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  computed: {
    enabledSave: function () {
      return this.originalPassword > 0
          && this.newPassword > 0
          && this.confirmPassword > 0;
    }
  },
  methods: {
    onSave: function () {
      //判断新密码与旧密码是否一致
      if(this.newPassword !== this.confirmPassword){
        layer.msg('新密码与旧密码不一致，请重新输入。');
        return false;
      }
      let userInfo = getLoginUserInfo();
      let originalPassword = this.originalPassword;
      let newPassword = this.newPassword;
      //判断原始密码是否正确
      $.ajax({
        url: '/changePassword/userInfo?userID=' + userInfo.userID,
        type: 'GET',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.userInfo === null){
            layer.msg('当前用户不存。');
            return false;
          }
          if(res.userInfo.password !== originalPassword){
            layer.msg('原始密码不正确，请重新输入。');
            return false;
          }

          //修改密码
          $.ajax({
            url: '/changePassword',
            type: 'put',
            dataType: 'json',
            data: {
              userID: userInfo.userID,
              password: newPassword,
              loginUser: getLoginUser()
            },
            success: function(res){
              if(res.err){
                layer.msg(res.msg);
              }else{
                app.$data.originalPassword = '';
                app.$data.newPassword = '';
                app.$data.confirmPassword = '';
                layer.msg('密码修改成功。');
              }
            },
            error: function(XMLHttpRequest, textStatus){
              layer.msg('远程服务无响应，请检查网络设置。');
            }
          });
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    }
  }
});