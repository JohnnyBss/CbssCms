var app = new Vue({
  el: '#app',
  data: {
    blockID: 0,
    blockName: '',
    blockNameValid: false,
    moduleList: [],
    selectedModule: 0,
    selectedSearchModule: 0,
    message: '',
    saveType: ''
  },
  computed: {
    enabledSave: function () {
      return this.selectedModule > 0 && this.blockName.length > 0 && this.blockNameValid
    }
  },
  methods:{
    onAdd: function () {
      this.saveType = 'add';
      this.blockID = 0;
      this.selectedModule = 0;
      this.blockName = '';
      this.message = '';
      this.blockNameValid = false;
      $('#myModal').modal('show');
    },
    onShowSearchDialog: function(){
      this.selectedSearchModule = 0;
      $('#searchModal').modal('show');
    },
    onSearch: function(){
      location.href = '/block?moduleID=' + this.selectedSearchModule;
    },
    onChange: function (rowIndex) {
      let row = $('#data-list tbody tr').eq(rowIndex);
      this.saveType = 'upd';
      this.blockID = $(row).find('td').eq(0).text();
      this.selectedModule = $(row).find('td').eq(1).find('input[type="hidden"]').val();
      this.blockName = $(row).find('td').eq(2).text();
      this.message = '';
      $('#myModal').modal('show');
    },
    onDelete: function (blockID, blockName) {
      let confirmMsg = '您确定要删除' + blockName + '吗？';
      bootbox.confirm(confirmMsg, function(result) {
        if(result) {
          $.ajax({
            url: '/block?blockID=' + blockID,
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
    onBlockNameBlur: function () {
      if(this.blockName === ''){
        return false;
      }
      $.ajax({
        url: '/block/checkName?blockName=' + this.blockName,
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.exist){
            app.$data.moduleNameValid = false;
            jmsg.errorMessage($('#form-field-blockName'), '该项目名称已存在。');
            return false;
          }
          jmsg.clearAlertMessage($('#form-field-blockName'));
          app.$data.blockNameValid = true;
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
        url: '/block',
        type: 'post',
        dataType: 'json',
        data:{
          moduleID: app.$data.selectedModule,
          blockName: app.$data.blockName,
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
        url: '/block',
        type: 'put',
        dataType: 'json',
        data:{
          blockID: app.$data.blockID,
          moduleID: app.$data.selectedModule,
          blockName: app.$data.blockName,
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
    initPage: function () {
      this.bindModuleList();
    },
    bindModuleList: function () {
      $.ajax({
        url: '/module/all',
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          app.$data.moduleList = res.dataList;
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  },
  mounted: function () {
    this.initPage();
  }
});