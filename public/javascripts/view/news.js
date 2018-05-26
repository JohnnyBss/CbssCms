let app = new Vue({
  el: '#app',
  methods:{
    onChange: function (newsID) {
      location.href = '/editNews?newsID=' + newsID + '&saveType=upd';
    },
    onDelete: function (newsID, newsTitle) {
      let confirmMsg = '您确定要删除新闻【' + newsTitle + '】吗？';
      bootbox.confirm(confirmMsg, function(result) {
        if(result) {
          $.ajax({
            url: '/news?newsID=' + newsID,
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
    }
  }
});