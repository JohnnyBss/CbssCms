var app = new Vue({
  el: '#app',
  data: {
    moduleID: 0,
    moduleName: '',
    moduleNameValid: false,
    message: '',
    saveType: ''
  },
  computed: {
    enabledSave: function () {
      return this.moduleName.length > 0 && this.moduleNameValid
    }
  },
  methods:{
    onAdd: function () {
      this.saveType = 'add';
      this.moduleID = 0;
      this.moduleName = '';
      this.message = '';
      this.moduleNameValid = false;
      $('#myModal').modal('show');
    },
    onChange: function (rowIndex) {
      let row = $('#data-list tbody tr').eq(rowIndex);
      this.saveType = 'upd';
      this.moduleID = $(row).find('td').eq(0).text();
      this.moduleName = $(row).find('td').eq(1).text();
      this.message = '';
      $('#myModal').modal('show');
    },
    onDelete: function (moduleID, moduleName) {
      let confirmMsg = '您确定要删除' + moduleName + '吗？';
      bootbox.confirm(confirmMsg, function(result) {
        if(result) {
          $.ajax({
            url: '/module?moduleID=' + moduleID,
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
    },
    onModuleNameBlur: function () {
      if(this.moduleName === ''){
        return false;
      }
      $.ajax({
        url: '/module/checkName?moduleName=' + this.moduleName,
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.exist){
            app.$data.moduleNameValid = false;
            jmsg.errorMessage($('#form-field-moduleName'), '该模块名称已存在。');
            return false;
          }
          jmsg.clearAlertMessage($('#form-field-moduleName'));
          app.$data.moduleNameValid = true;
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });

    },
    onSave: function () {
      if(app.$data.saveType === ''){
        return false;
      }
      if(app.$data.saveType === 'add'){
        app.add();
      }else{
       app.update();
      }

    },
    add: function () {
      $.ajax({
        url: '/module',
        type: 'post',
        dataType: 'json',
        data:{
          moduleName: app.$data.moduleName,
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            location.reload();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    update: function () {
      $.ajax({
        url: '/module',
        type: 'put',
        dataType: 'json',
        data:{
          moduleID: app.$data.moduleID,
          moduleName: app.$data.moduleName,
          loginUser: getLoginUser()
        },
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
          }else{
            location.reload();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  }
});