var app = new Vue({
  el: '#app',
  data: {
    userID: '',
    userName: '',
    cellphone: '',
    selectedRole: 0,
    roles:[{value: 0, text: '管理员'},{value: 1, text: '普通职员'},{value: 2, text: '理财经理'},{value: 3, text: '大堂经理'}],
    originalCellphone: '',
    cellphoneValid: false,
    saveType: ''
  },
  computed: {
    enabledSave: function () {
      return this.userName.length > 0
          && this.cellphone.length > 0
          && (this.cellphone === this.originalCellphone || this.cellphoneValid);
    }
  },
  methods: {
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
    onAdd: function(){
      this.saveType = 'add';
      $('#myModal').modal('show');
    },
    onChange: function(rowIndex){
      this.saveType = 'upd';
      let row = $('#data-list tbody tr').eq(rowIndex);
      this.userID = $(row).find('td').eq(0).text();
      this.userName = $(row).find('td').eq(1).text();
      this.cellphone = $(row).find('td').eq(2).text();
      this.originalCellphone = $(row).find('td').eq(2).text();
      $('#myModal').modal('show');
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
      let type = '';
      let data = {};
      if(this.saveType === 'add'){
        type = 'post';
        data = {
          userName: this.userName,
          cellphone: this.cellphone,
          userRole: this.selectedRole,
          loginUser: getLoginUser()
        }
      }else {
        type = 'put';
        data = {
          userID: this.userID,
          userName: this.userName,
          cellphone: this.cellphone,
          userRole: this.selectedRole,
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
            location.reload();
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg('远程服务无响应，请检查网络设置。');
        }
      });
    }
  }
});