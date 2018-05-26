var app = new Vue({
  el: '#app',
  data: {
    sysName: ''
  },
  computed: {
    enabledSave: function () {
      return this.sysName.length > 0;
    }
  },
  methods: {
    initPage: function(){
      $.ajax({
        url: '/sysName/current',
        type: 'GET',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.data === null){
            layer.msg('未初始化客户端系统名称。');
            return false;
          }
          app.$data.sysName = res.data.sysName;
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    },
    onSave: function () {
      $.ajax({
        url: '/sysName',
        type: 'put',
        dataType: 'json',
        data: {
          sysName: this.sysName,
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            layer.msg('修改成功。');
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