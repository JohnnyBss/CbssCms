$(document).ready(function () {
  let _itemID = 0;
  let _itemName = '';
  let _itemType = '';
  let _parentItemID = 0;
  let _optionType = '';
  let _selectedNodeID = '0';
  let _selectedNodeName = '';
  let _selectedNodeParentID = '0';
  let _selectedNodeType = 'R';

  function initPage() {
    buildTreeView();
  }

  function buildTreeView() {
    let data = {
      files: [
        {
          "id": 0,
          "pid": -1,
          "title": "全部文件",
          "type": 'R'
        }
      ]
    };

    $.ajax({
      url: '/item/data',
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        $.each(res.itemList, function (index, item) {
          data.files.push({
            "id": item.itemID,
            "pid": item.parentItemID,
            "title": item.itemName,
            "type": item.itemType
          })
        });
        let jtree = new Jtree(data);
        jtree.build();
        bindTreeViewEvents();
        setOpenNodes();
        setFileNodeIcon();
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function setFileNodeIcon() {
    let nodeTitle = $('div.treeNode[data-node-type="D"]').find('span.title').text();
    let nodeTitleHtml = '<i class="icon-file-text" style="color: #90d900; font-size: 16px; margin-right: 8px"></i>' + nodeTitle;
    $('div.treeNode[data-node-type="D"]').find('i.icon-file').remove();
    $('div.treeNode[data-node-type="D"]').find('span.title').html(nodeTitleHtml);
  }

  function bindTreeViewEvents() {
    $('#treeView .treeNode').contextmenu(function (e) {
      let nodeType = $(this).attr('data-node-type');
      let nodeID = $(this).attr('data-file-id');
      if(_selectedNodeID !== nodeID){
        return false;
      }
      rmenu.hide($(".contextmenu"));
      let addTop = -65;
      switch (nodeType) {
        case "R":
          rmenu.show($(".right-menu-root"), e, addTop);
          break;
        case "M":
          rmenu.show($(".right-menu-module"), e, addTop);
          break;
        case "B":
          rmenu.show($(".right-menu-block"), e, addTop);
          break;
        case "I":
          rmenu.show($(".right-menu-item"), e, addTop);
          break;
        case "D":
          rmenu.show($(".right-menu-detail"), e, addTop);
          break;
      }
      return false;
    });

    $('#treeView .treeNode').click(function () {
      _selectedNodeType = $(this).attr('data-node-type');
      _selectedNodeID = $(this).attr('data-file-id');
      _selectedNodeName = $(this).find('span.title').text();
      _selectedNodeParentID = $(this).attr('data-file-pid');
    });
  }

  function setOpenNodes() {
    //移除当前选中的节点
    $('div.treeNode').removeClass('treeNode-cur');
    if(_optionType === 'del'){
      //展开当前节点的父节点
      openParentsTreeNode(_selectedNodeParentID);
      //展开当前节点所属父节点的子节点
      openChildTreeNode(_selectedNodeParentID);
      //设置被删除节点的父节点选中
      $('div.treeNode[data-file-id="' + _selectedNodeParentID + '"]').addClass('treeNode-cur');
      //设置被删除节点的父节点的相关数据为全局数据
      _selectedNodeType = $('div.treeNode[data-file-id="' + _selectedNodeParentID + '"]').attr('data-node-type');
      _selectedNodeID = $('div.treeNode[data-file-id="' + _selectedNodeParentID + '"]').attr('data-file-id');
      _selectedNodeName = $('div.treeNode[data-file-id="' + _selectedNodeParentID + '"]').find('span.title').text();
      _selectedNodeParentID = $('div.treeNode[data-file-id="' + _selectedNodeParentID + '"]').attr('data-file-pid');
    }else{
      //展开当前节点的父节点
      openParentsTreeNode(_selectedNodeID);
      //展开当前节点的子节点
      openChildTreeNode(_selectedNodeID);
      //设置当前节点选中
      $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').addClass('treeNode-cur');
      _selectedNodeName = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').find('span.title').text();
    }

  }
  
  function getBreadcrumbs(nodeID, breadcrumbs) {
    let parentID = $('div.treeNode[data-file-id="' + nodeID + '"]').attr('data-file-pid');
    if(parentID === '0'){
      return breadcrumbs;
    }
    let title = $('div.treeNode[data-file-id="' + parentID + '"]').find('span.title').text();

    let currentBreadcrumbs = title;
    if(breadcrumbs !== ''){
      currentBreadcrumbs = title + '_-_' + breadcrumbs;
    }
    return getBreadcrumbs(parentID, currentBreadcrumbs);
  }

  function getBreadcrumbs4Add(nodeID, breadcrumbs) {
    let title = $('div.treeNode[data-file-id="' + nodeID + '"]').find('span.title').text();
    let parentID = $('div.treeNode[data-file-id="' + nodeID + '"]').attr('data-file-pid');
    if(parentID === '-1'){
      return breadcrumbs;
    }

    let currentBreadcrumbs = title;
    if(breadcrumbs !== ''){
      currentBreadcrumbs = title + '_-_' + breadcrumbs;
    }
    return getBreadcrumbs4Add(parentID, currentBreadcrumbs);
  }

  function openParentsTreeNode(nodeID) {
    let parentID = $('div.treeNode[data-file-id="' + nodeID + '"]').attr('data-file-pid');
    if(parentID === '-1'){
      return false;
    }
    $('div.treeNode[data-file-id="' + parentID + '"]').find('i.icon-control').removeClass('icon-add').addClass('icon-minus icon-folder-open');
    $('div.treeNode[data-file-id="' + parentID + '"]').next('ul').removeClass('none');
    return openParentsTreeNode(parentID);
  }

  function openChildTreeNode(nodeID) {
        if($('div.treeNode[data-file-id="' + nodeID + '"]').next('ul').find('li').length > 0){
          $('div.treeNode[data-file-id="' + nodeID + '"]').find('i.icon-control').removeClass('icon-add').addClass('icon-minus icon-folder-open');
          $('div.treeNode[data-file-id="' + nodeID + '"]').next('ul').removeClass('none');
        }
  }

  function setEditModal(title, formLabel, itemName, treeMap){
    $('#myModal .modal-title').text(title);
    $('#myModal .form-label-itemName').text(formLabel);
    $('#form-field-itemName').val(itemName);
  }

  function setItemData(optionType, itemID, itemType, parentItemID){
    _optionType = optionType;
    _itemID = itemID;
    _itemType = itemType;
    _parentItemID = parentItemID;
  }

  function addNewItem(){
    $.ajax({
      url: '/item',
      type: 'post',
      dataType: 'json',
      data:{
        itemName: _itemName,
        itemType: _itemType,
        parentItemID: _parentItemID,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          buildTreeView();
          $('#myModal').modal('hide');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  function changeItem(){
    $.ajax({
      url: '/item',
      type: 'put',
      dataType: 'json',
      data:{
        itemID: _itemID,
        itemName: _itemName,
        itemType: _itemType,
        parentItemID: _parentItemID,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          buildTreeView();
          $('#myModal').modal('hide');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  function checkDelete(){
    let childItemCount = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').next('ul').find('li').length;
    let alertMsg = '';
    if(childItemCount > 0){
      switch (_selectedNodeType) {
        case "M":
          alertMsg = '请先删除考评模块【' + _selectedNodeName + '】下的内容。';
          break;
        case "B":
          alertMsg = '请先删除考评项目【' + _selectedNodeName + '】下的内容。';
          break;
        case "I":
          alertMsg = '请先删除考评点【' + _selectedNodeName + '】下的内容。';
          break;
      }
      layer.msg(alertMsg);
      return false;
    }

    return true;
  }

  function deleteItem(){
    let confirmMsg = '';
    switch (_selectedNodeType) {
      case "M":
        confirmMsg = '您确认要删除考评模块【' + _selectedNodeName + '】吗？';
        break;
      case "B":
        confirmMsg = '您确认要删除考评项目【' + _selectedNodeName + '】吗？';
        break;
      case "I":
        confirmMsg = '您确认要删除考评点【' + _selectedNodeName + '】吗？';
        break;
    }

    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        _optionType = 'del';
        $.ajax({
          url: '/item?itemID=' + _selectedNodeID,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              buildTreeView();
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，请检查网络设置。');
          }
        });
      }
    });
  }

  /**
   * 添加模块事件
   */
  $('.right-menu-root li.add-module').click(function () {
    setItemData('add', 0, 'M', 0);
    setEditModal('添加模块', '模块名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 更新模块事件
   */
  $('.right-menu-module li.change-module').click(function () {
    setItemData('upd', _selectedNodeID, 'M', 0);
    setEditModal('修改模块', '模块名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 添加项目事件
   */
  $('.right-menu-module li.add-block').click(function () {
    setItemData('add', 0, 'B', _selectedNodeID);
    setEditModal('添加项目', '项目名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 更新项目事件
   */
  $('.right-menu-block li.change-block').click(function () {
    setItemData('upd', _selectedNodeID, 'B', _selectedNodeParentID);
    setEditModal('更新项目', '项目名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 添加考评点事件
   */
  $('.right-menu-block li.add-item').click(function () {
    setItemData('add', 0, 'I', _selectedNodeID);
    setEditModal('添加考评点', '考评点', '');
    $('#myModal').modal('show');
  });

  /**
   * 更新考评点事件
   */
  $('.right-menu-item li.change-item').click(function () {
    setItemData('upd', _selectedNodeID, 'I', _selectedNodeParentID);
    setEditModal('更新考评点', '考评点', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 添加子考评点事件
   */
  $('.right-menu-item li.add-item').click(function () {
    setItemData('add', 0, 'I', _selectedNodeID);
    setEditModal('添加子考评点', '子考评点', '');
    $('#myModal').modal('show');
  });

  /**
   * 删除节点（模块、项目、考评点、子考评点）事件
   */
  $('.contextmenu li.remove-item').click(function () {
    if(!checkDelete()){
      return false;
    }
    deleteItem();
  });

  /**
   * 添加考评点详细信息
   */
  $('.right-menu-item li.add-detail').click(function () {
    let breadcrumbs = getBreadcrumbs4Add(_selectedNodeID, '');
    location.href = '/detail?itemID=' + _selectedNodeID + '&breadcrumbs=' + breadcrumbs;
  });

  /**
   * 添加考评点详细信息
   */
  // $('.right-menu-item li.search-detail').click(function () {
  //   window.open('/detail?flag=s&itemID=' + _selectedNodeID);
  // });

  /**
   * 添加考评点详细信息
   */
  $('.right-menu-detail li.search-detail').click(function () {
    let breadcrumbs = getBreadcrumbs(_selectedNodeID, '');
    let year = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').find('span.title').text().substr(0, 4);
    let quarter = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').find('span.title').text().substr(6, 1);
    window.open('/detailView?itemID=' + _selectedNodeParentID + '&year=' + year + '&quarter=' + quarter + '&breadcrumbs=' + breadcrumbs);
  });

  $('#btn-save').click(function () {
    _itemName = $.trim($('#form-field-itemName').val());
    _selectedNodeName = _itemName;

    if(!checkData()){
      return false;
    }

    if(_optionType === 'add'){
      addNewItem();
    }
    if(_optionType === 'upd'){
      changeItem();
    }
  });

  function checkData(){
    if(!checkIsEmpty()){
      return false;
    }
    if(!checkItemValid()){
      return false;
    }
    return true;
  }

  function checkIsEmpty() {
    if(_itemName.length === 0){
      layer.msg('请输入字段内容。');
      return false;
    }
    return true;
  }

  function checkItemValid(){
    if(_itemName.length === 0){
      return false;
    }
    let result = false;
    $.ajax({
      url: '/item/checkName?itemName=' + _itemName,
      type: 'get',
      async: false,
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          result = false;
        }
        if(res.exist){
          layer.msg('您输入的内容已存在。');
          result = false;
          return false;
        }
        result = true;
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，请检查网络设置。');
        result = false;
      }
    });

    return result;
  }
  
  $(document).click(function(){
    rmenu.hide($(".contextmenu"));
  });

  initPage();
});
