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

  let _moveOutNodeID = 0;
  let _moveOutNodeName = '';
  let _moveOutNodeType = '';
  let _moveInNodeID = 0;
  let _moveInNodeName = '';
  let _moveInNodeType = '';

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
        let jtree = new Jtree(data, '#treeView');
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
    let detailNode = $('div.treeNode[data-node-type="D"]');
    $(detailNode).find('i.icon-file').remove();
    $(detailNode).find('i.icon-control').after('<i class="icon-file-text" style="color: #90d900; font-size: 16px; margin-right: 8px; position: relative; top: 6px"></i>');
  }

  /**
   * 给树形结构的的每个节点添加右键事件，以显示对应的快捷菜单
   */
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
        case "R": // 根结点
          rmenu.show($(".right-menu-root"), e, addTop);
          break;
        case "M": //一级指标节点
          rmenu.show($(".right-menu-module"), e, addTop);
          break;
        case "B": //二级指标节点
          rmenu.show($(".right-menu-block"), e, addTop);
          break;
        case "I": // 三级指标节点
          rmenu.show($(".right-menu-item"), e, addTop);
          break;
        case "Y": // 年份节点
          rmenu.show($(".right-menu-year"), e, addTop);
          break;
        case "Q": // 季度节点
          rmenu.show($(".right-menu-quarter"), e, addTop);
          break;
        case "D": //详细内容节点
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
          $('.modal').modal('hide');
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
          $('.modal').modal('hide');
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
          alertMsg = '请先删除一级指标【' + _selectedNodeName + '】下的内容。';
          break;
        case "B":
          alertMsg = '请先删除二级指标【' + _selectedNodeName + '】下的内容。';
          break;
        case "I":
          alertMsg = '请先删除三级指标【' + _selectedNodeName + '】下的内容。';
          break;
        case "Y":
          alertMsg = '请先删除【' + _selectedNodeName + '】下的内容。';
          break;
        case "Q":
          alertMsg = '请先删除【' + _selectedNodeName + '】下的内容。';
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
        confirmMsg = '您确认要删除一级指标【' + _selectedNodeName + '】吗？';
        break;
      case "B":
        confirmMsg = '您确认要删除二级指标【' + _selectedNodeName + '】吗？';
        break;
      case "I":
        confirmMsg = '您确认要删除三级指标【' + _selectedNodeName + '】吗？';
        break;
      case "Y":
        confirmMsg = '您确认要删除【' + _selectedNodeName + '】节点吗？';
        break;
      case "Q":
        confirmMsg = '您确认要删除【' + _selectedNodeName + '】节点吗？';
        break;
      case "D":
        confirmMsg = '您确认要删除【' + _selectedNodeName + '】的详细内容吗？';
        break;
    }

    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        _optionType = 'del';
        $.ajax({
          url: '/item?itemID=' + _selectedNodeID + '&itemType=' + _selectedNodeType,
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
   * 根节点快捷菜单：新增一级指标
   */
  $('.right-menu-root li.add-module').click(function () {
    setItemData('add', 0, 'M', 0);
    setEditModal('添加一级指标', '指标名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 一级指标节点快捷菜单：新增二级指标
   */
  $('.right-menu-module li.add-block').click(function () {
    setItemData('add', 0, 'B', _selectedNodeID);
    setEditModal('添加二级指标', '指标名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 一级指标节点快捷菜单：更新一级指标
   */
  $('.right-menu-module li.change-module').click(function () {
    setItemData('upd', _selectedNodeID, 'M', 0);
    setEditModal('修改指标', '指标名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 二级指标节点快捷菜单：新增三级指标
   */
  $('.right-menu-block li.add-item').click(function () {
    setItemData('add', 0, 'I', _selectedNodeID);
    setEditModal('添加子指标', '指标名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 二级指标节点快捷菜单：更新二级指标
   */
  $('.right-menu-block li.change-block').click(function () {
    setItemData('upd', _selectedNodeID, 'B', _selectedNodeParentID);
    setEditModal('更新指标', '指标名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 三级指标节点快捷菜单：新增年份
   */
  $('.right-menu-item li.add-year').click(function () {
    setItemData('add', 0, 'Y', _selectedNodeID);
    $('#yearModal').modal('show');
  });

  /**
   * 三级指标节点快捷菜单：更新三级指标
   */
  $('.right-menu-item li.change-item').click(function () {
    setItemData('upd', _selectedNodeID, 'I', _selectedNodeParentID);
    setEditModal('更新指标', '指标名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 年份节点快捷菜单：新增季度
   */
  $('.right-menu-year li.add-quarter').click(function () {
    setItemData('add', 0, 'Q', _selectedNodeID);
    $('#quarterModal').modal('show');
  });

  /**
   * 年份节点快捷菜单：更新当前年份
   */
  $('.right-menu-year li.change-year').click(function () {
    setItemData('upd', _selectedNodeID, 'Y', _selectedNodeParentID);
    $('#yearModal').modal('show');
  });

  /**
   * 季度节点快捷菜单：更新当前季度
   */
  $('.right-menu-quarter li.change-quarter').click(function () {
    setItemData('upd', _selectedNodeID, 'Q', _selectedNodeParentID);
    $('#quarterModal').modal('show');
  });

  /**
   * 所有节点公用菜单：删除当前节点（一级指标、二级指标、三级指标、当前年份、当前季度、当前内容）
   */
  $('.contextmenu li.remove-item').click(function () {
    if(!checkDelete()){
      return false;
    }
    deleteItem();
  });

  $('.right-menu-detail li.change-item').click(function () {
    setItemData('upd', _selectedNodeID, 'D', _selectedNodeParentID);
    setEditModal('更新标题', '标题名称', _selectedNodeName);
    $('#myModal').modal('show');
  });

  /**
   * 三级指标、季度、年份节点快捷菜单：新增详细标题
   */
  $('li.add-detail').click(function () {
    setItemData('add', 0, 'D', _selectedNodeID);
    setEditModal('添加标题', '标题名称', '');
    $('#myModal').modal('show');
  });

  /**
   * 详细内容节点快捷菜单：查看详细信息
   */
  $('.right-menu-detail li.search-detail').click(function () {
    let breadcrumbs = getBreadcrumbs(_selectedNodeID, '');
    let year = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').find('span.title').text().substr(0, 4);
    let quarter = $('div.treeNode[data-file-id="' + _selectedNodeID + '"]').find('span.title').text().substr(6, 1);
    window.open('/detailView?itemID=' + _selectedNodeParentID + '&year=' + year + '&quarter=' + quarter + '&breadcrumbs=' + breadcrumbs);
  });

  /**
   * 详细内容节点快捷菜单：编辑详细内容
   */
  $('li.edit-detail').click(function () {
    let breadcrumbs = getBreadcrumbs4Add(_selectedNodeID, '');
    window.open('/detail?itemID=' + _selectedNodeID + '&type=n' +  '&breadcrumbs=' + breadcrumbs);
  });

  /**
   * 公用快捷菜单：移出
   */
  $('li.move-out').click(function () {
    _moveOutNodeID = _selectedNodeID;
    _moveOutNodeName = _selectedNodeName;
    _moveOutNodeType = _selectedNodeType;
  });

  /**
   * 公用快捷菜单：移入
   */
  $('li.move-in').click(function () {
    _moveInNodeID = _selectedNodeID;
    _moveInNodeName = _selectedNodeName;
    _moveInNodeType = _selectedNodeType;

    if(!checkMove()){
      return false;
    }
    moveNode();
  });

  $('li.move-up').click(function () {
    _moveInNodeID = _selectedNodeID;
    _moveInNodeName = _selectedNodeName;
    _moveInNodeType = _selectedNodeType;

    if(!checkMoveUp()){
      return false;
    }
    moveUp();
  });

  $('li.move-down').click(function () {
    _moveInNodeID = _selectedNodeID;
    _moveInNodeName = _selectedNodeName;
    _moveInNodeType = _selectedNodeType;

    if(!checkMoveDown()){
      return false;
    }
    moveDown();
  });
  
  function checkMoveUp() {
    let currentNode = $('#treeView').find('div[data-file-id="'+  _moveInNodeID + '"]').parent();
    let preNode = $(currentNode).prev();
    if(preNode.length === 0){
      layer.msg('该内容已经在最前面对了啦！');
      return false;
    }
    return true;
  }

  function checkMoveDown() {
    let currentNode = $('#treeView').find('div[data-file-id="'+  _moveInNodeID + '"]').parent();
    let nextNode = $(currentNode).next();
    if(nextNode.length === 0){
      layer.msg('该内容已经在最后面对了啦！');
      return false;
    }
    return true;
  }
  
  function moveUp() {
    let currentRootNode = $('#treeView').find('div[data-file-id="'+  _moveInNodeID + '"]').parent().parent();
    let childrenList = $(currentRootNode).children('li');
    let nodeIdList = [];
    let currentIdIndex = -1;
    let preNodeIdIndex = -1;

    $.each(childrenList, function (index, children) {
      if($(children).find('div.treeNode').attr('data-file-id') == _moveInNodeID){
        currentIdIndex = index;
        preNodeIdIndex = index - 1;
      }
      nodeIdList.push($(children).find('div.treeNode').attr('data-file-id'));
    });

    let temp = nodeIdList[currentIdIndex];
    nodeIdList[currentIdIndex] = nodeIdList[preNodeIdIndex];
    nodeIdList[preNodeIdIndex] = temp;
    changeNodeOrder(_selectedNodeParentID, nodeIdList);
  }
  
  function moveDown() {
    let currentRootNode = $('#treeView').find('div[data-file-id="'+  _moveInNodeID + '"]').parent().parent();
    let childrenList = $(currentRootNode).children('li');
    let nodeIdList = [];
    let currentIdIndex = -1;
    let nextNodeIdIndex = -1;

    $.each(childrenList, function (index, children) {
      if($(children).find('div.treeNode').attr('data-file-id') == _moveInNodeID){
        currentIdIndex = index;
        nextNodeIdIndex = index + 1;
      }
      nodeIdList.push($(children).find('div.treeNode').attr('data-file-id'));
    });

    let temp = nodeIdList[currentIdIndex];
    nodeIdList[currentIdIndex] = nodeIdList[nextNodeIdIndex];
    nodeIdList[nextNodeIdIndex] = temp;
    changeNodeOrder(_selectedNodeParentID, nodeIdList);
  }

  function changeNodeOrder(parentNodeID, childNodeOrder) {
    $.ajax({
      url: '/item/changeNodeOrder',
      type: 'put',
      dataType: 'json',
      data:{
        parentItemID: parentNodeID,
        childNodeOrder: childNodeOrder.toString(),
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          buildTreeView();
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  /**
   * 判断是否可以移动内容
   * @returns {boolean} 判断结果
   */
  function checkMove(){
    if(_moveOutNodeID === 0){
      layer.msg('请先选择要移出的内容。');
      return false;
    }
    switch (_moveOutNodeType) {
      case 'B': //移出二级指标下的所有内容
          if(_moveInNodeType !== 'M'){
            layer.msg('二级指标只能移动到某个一级指标下。');
            return false;
          }
        break;
      case 'I': //移出三级指标下的所有内容
        if(_moveInNodeType !== 'B'){
          layer.msg('三级指标只能移动到某个二级指标下。');
          return false;
        }
        break;
      case 'Y': //移出当前年下的所有内容
        if(_moveInNodeType !== 'I'){
          layer.msg('年份只能移动到某个三级指标下。');
          return false;
        }
        break;
      case 'Q': //移出当前季度下的所有内容
        if(_moveInNodeType !== 'Y'){
          layer.msg('季度只能移动到某个年份下。');
          return false;
        }
        break;
      case 'D': //移出当前内容
        if(!(_moveInNodeType === 'Q' || _moveInNodeType === 'Y' || _moveInNodeType === 'I')){
          layer.msg('详细内容只能移动到某个季度、年份或者三级指标下。');
          return false;
        }
        break;
    }

    return true;
  }

  /**
   * 移动内容节点
   */
  function moveNode(){
    $.ajax({
      url: '/item/move',
      type: 'put',
      dataType: 'json',
      data:{
        itemID: _moveOutNodeID,
        itemName: _moveOutNodeName,
        itemType: _moveOutNodeType,
        parentItemID: _moveInNodeID,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          buildTreeView();
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
    _moveOutNodeID = 0;
    _moveOutNodeName = '';
    _moveOutNodeType = '';
    _moveInNodeID = 0;
    _moveInNodeName = '';
    _moveInNodeType = '';
  }

  /**
   * 保存指标
   */
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

  /**
   * 保存年份
   */
  $('#btn-save-year').click(function () {
    _itemName = $('#form-select-year option:selected').text();
    _selectedNodeName = _itemName;

    if(_optionType === 'add'){
      addNewItem();
    }
    if(_optionType === 'upd'){
      changeItem();
    }
  });

  /**
   * 保存季度
   */
  $('#btn-save-quarter').click(function () {
    _itemName = $('#form-select-quarter option:selected').text();
    _selectedNodeName = _itemName;

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
    return true;
  }

  function checkIsEmpty() {
    if(_itemName.length === 0){
      layer.msg('请输入字段内容。');
      return false;
    }
    return true;
  }
  
  $(document).click(function(){
    rmenu.hide($(".contextmenu"));
  });

  initPage();
});
