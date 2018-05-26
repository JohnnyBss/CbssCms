$(document).ready(function () {
  let _itemID = $('#hidden-itemID').val();
  let _year = $('#hidden-year').val();
  let _quarter = $('#hidden-quarter').val();
  let _itemIdValid = true;
  let _detailId4Memo = 0;
  function initPage() {
    setDropDownList();
    setBreadcrumbs();
    checkItemIdIsValid();
    showData();
  }

  function setBreadcrumbs() {
    let param = $('#hidden-breadcrumbs').val();
    let arr = param.split('_-_');
    if(arr.length === 0){
      return false;
    }

    $('.page-header h1').append('考评内容管理');
    $.each(arr, function (index, n) {
      if(index === 0){
        $('.page-header h1').append('<small>' + '<i class="icon-double-angle-right"></i>' + n + '</small>');
      }else{
        $('.page-header h1').append('<small>' + '<i class="icon-angle-right"></i>' + n + '</small>');
      }
    })
  }

  function checkItemIdIsValid() {
    if(_itemID === 'undefined' || _itemID === '' || isNaN(_itemID)){
      $('#btn-show-upload-image').attr('disabled', 'disabled');
      $('#btn-show-upload-file').attr('disabled', 'disabled');
      $('#btn-save').attr('disabled', 'disabled');
      $('#btn-delete').attr('disabled', 'disabled');
      _itemIdValid = false;
      layer.msg('参数不正确，操作被禁止。');
    }
  }

  function setDropDownList(){
    let selectYear = $('#select-year').find('strong');
    let selectQuarter = $('#select-quarter').find('strong');

    // Get initial value
    selectYear.text($('#select-year').val());
    selectQuarter.text($('#select-quarter').val());
    // Initialize Selectric and bind to 'change' event
    $('#select-year').selectric().on('change', function() {
      selectYear.text($(this).val());
    });
    $('#select-quarter').selectric().on('change', function() {
      selectQuarter.text($(this).val());
    });
  }

  function showData(){
    if(!_itemIdValid){
      return false;
    }
    $.ajax({
      url: '/detail/data?itemID=' + _itemID + '&year=' + _year + '&quarter=' + _quarter,
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        $('.detail-info').empty();
        if(res.dataList.length === 0){
          $('#btn-save').attr('disabled', 'disabled');
          $('#btn-delete').attr('disabled', 'disabled');
        }else{
          $('#btn-save').removeAttr('disabled');
          $('#btn-delete').removeAttr('disabled');
        }
        $.each(res.dataList, function (index, data) {
          switch (data.contentType){
            case 'I':
              $('.detail-info').append(
                  '<div class="content-hover port-1 effect-1" data-detail-id="' + data.detailID + '">\n' +
                  '  <div class="image-box">\n' +
                  '    <img src="' + data.content + '" alt="">\n' +
                  '  </div>\n' +
                  '  <div class="image-desc" data-detail-id="' + data.detailID + '">\n' +
                  '    <p></p>\n' +
                  '  </div>\n' +
                  '</div>');
              break;
            case 'F':
              let fileName = data.content.substr(data.content.lastIndexOf('/') + 1);
              $('.detail-info').append(
                  '<div class="group-file" data-detail-id="' + data.detailID + '">\n' +
                  '  <img src="/images/icons/pdf.png" alt="">\n' +
                  '  <a href="' + data.content + '" target="_blank">' + fileName + '</a>\n' +
                  '</div>');
              break;
            case 'V':
              $('.detail-info').append(
                  '<div class="content-hover group-video port-1 effect-1" data-detail-id="' + data.detailID + '">\n' +
                  '  <div class="video-box">\n' +
                  '    <video src="' + data.content + '" controls="controls">\n' +
                  '      您使用的浏览器不支持视频播放，请使用Chrome浏览器。' +
                  '    </video>\n' +
                  '  </div>\n' +
                  '  <div class="video-desc" data-detail-id = "' + data.detailID + '">\n' +
                  '    <p></p>\n' +
                  '  </div>\n' +
                  '</div>');
              break;
          }
        });

        showMemo();
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function showMemo() {
    $.each($('.content-hover'), function (index, obj) {
      let imageID = $(obj).attr('data-detail-id');
      $.ajax({
        url: '/detail/imageMemo?itemID=' + _itemID + '&textMapDetail=' + imageID,
        type: 'get',
        success: function (res) {
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          $(obj).find('div.image-desc').find('p').text(res.data === null ? '' : res.data.content);
          $(obj).find('div.video-desc').find('p').text(res.data === null ? '' : res.data.content);
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    })
  }

  /**
   * 返回事件
   */
  $('#btn-back').click(function () {
    location.href = '/item'; //todo 需要传回节点编号
  });


  $('.johnny-select').change(function () {
    showData();
  });

  initPage();
});