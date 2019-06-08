let app = new Vue({
  el: '#app',
  data: {
    fromDate: '',
    toDate: '',
    financialAnalyseData: [],
    lobbyAnalyseData: [],
    currentFinancialCallbackAnalyseData: [],
    currentLobbyCallbackAnalyseData: [],
    currentSelectedFinancialIndex: 0,
    currentSelectedLobbyIndex: 0
  },
  computed: {
    enabledSave: function () {
      return this.fromDate.length > 0 && this.toDate.length > 0;
    }
  },
  methods: {
    onAnalyse: function () {
      app.analyseFinancial();
      app.analyseLobby();
    },
    onRefreshFinancialCallback: function(index){
      if(index === app.$data.currentSelectedFinancialIndex){
        return false;
      }
      app.$data.currentSelectedFinancialIndex = index;
      app.$data.currentFinancialCallbackAnalyseData = app.$data.financialAnalyseData[index].callBackAnalyse;
    },
    onRefreshLobbyCallback: function(index){
      if(index === app.$data.currentSelectedLobbyIndex){
        return false;
      }
      app.$data.currentSelectedLobbyIndex = index;
      app.$data.currentLobbyCallbackAnalyseData = app.$data.lobbyAnalyseData[index].callBackAnalyse;
    },
    analyseFinancial: function () {
      $.ajax({
        url: '/analyse/financial?fromDate=' + app.$data.fromDate + '&toDate=' + app.$data.toDate,
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.dataList === null || res.dataList.length === 0){
            app.$data.financialAnalyseData = [];
            app.$data.currentFinancialCallbackAnalyseData = [];
            layer.msg('未查询到理财经理分析数据。');
            return false;
          }
          app.$data.currentSelectedFinancialIndex = 0;
          app.$data.financialAnalyseData = res.dataList;
          app.$data.currentFinancialCallbackAnalyseData = app.$data.financialAnalyseData[0].callBackAnalyse;
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    },
    analyseLobby: function () {
      $.ajax({
        url: '/analyse/lobby?fromDate=' + app.$data.fromDate + '&toDate=' + app.$data.toDate,
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          if(res.dataList === null || res.dataList.length === 0){
            app.$data.lobbyAnalyseData = [];
            app.$data.currentLobbyCallbackAnalyseData = [];
            layer.msg('未查询到大堂经理分析数据。');
            return false;
          }
          app.$data.currentSelectedLobbyIndex = 0;
          app.$data.lobbyAnalyseData = res.dataList;
          app.$data.currentLobbyCallbackAnalyseData = app.$data.lobbyAnalyseData[0].callBackAnalyse;

        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  }
});