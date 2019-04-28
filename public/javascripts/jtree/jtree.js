function Jtree(treeData, treeID){
  var fileData = treeData.files;
  this.build = function(){
    var treeView = tools.$(treeID);
    // 初始化
    treeView.innerHTML = treeHtml(fileData, -1);

    // 事件
    var fileItem = tools.$('.treeNode');
    var root_icon = tools.$('.icon-control', fileItem[0])[0];

    root_icon.className = 'icon icon-control icon-minus';

    tools.each(fileItem, function (item) {
      filesHandle(item);
    });
  };

  function treeHtml(fileData, fileId){
    var _html = '';
    var children = getChildById(fileData, fileId);
    var hideChild = fileId > 0 ? 'none' : '';

    _html += '<ul class="'+hideChild+'">';

    children.forEach(function (item, index) {
      var level = getLevelById(fileData, item.id);
      var distance = (level - 1) * 20 + 'px';
      var hasChild = hasChilds(fileData, item.id);
      var className = hasChild ? '' : 'treeNode-empty';
      var treeRoot_cls = fileId === -1 ? 'treeNode-cur' : '';

      _html += `
        <li>
          <div class="treeNode ${className} ${treeRoot_cls}" style="padding-left: ${distance}" data-file-id="${item.id}" data-file-pid="${item.pid}" data-node-type="${item.type}">
            <i class="icon icon-control icon-add"></i>
            <i class="icon icon-file"></i>
            <span class="title">${item.title}</span>
          </div>
          ${treeHtml(fileData, item.id)}
        </li>`;
    });

    _html += '</ul>';

    return _html;
  }

  function filesHandle(item){
    let icon = $(item).find('i.icon-control').get(0);

    tools.addEvent(item, 'click', function () {
      var treeNode_cur = tools.$('.treeNode-cur')[0];
      var fileId = item.dataset.fileId;
      var curElem = document.querySelector('.treeNode[data-file-id="'+fileId+'"]');
      // var hasChild = hasChilds(fileData, fileId);
      // var icon_control = tools.$('.icon-control', item)[0];
      // var openStatus = true;

      tools.removeClass(treeNode_cur, 'treeNode-cur');
      tools.addClass(curElem, 'treeNode-cur');

      // if (hasChild) {
      //   openStatus = tools.toggleClass(item.nextElementSibling, 'none');
      //
      //   if (openStatus) {
      //     icon_control.className = 'icon icon-control icon-add icon-folder-close';
      //   } else {
      //     icon_control.className = 'icon icon-control icon-minus icon-folder-open';
      //   }
      // }
    });

    tools.addEvent(icon, 'click', function () {
      var treeNode_cur = tools.$('.treeNode-cur')[0];
      var fileId = item.dataset.fileId;
      var curElem = document.querySelector('.treeNode[data-file-id="'+fileId+'"]');
      var hasChild = hasChilds(fileData, fileId);
      var icon_control = tools.$('.icon-control', item)[0];
      var openStatus = true;

      // tools.removeClass(treeNode_cur, 'treeNode-cur');
      // tools.addClass(curElem, 'treeNode-cur');

      if (hasChild) {
        openStatus = tools.toggleClass(item.nextElementSibling, 'none');

        if (openStatus) {
          icon_control.className = 'icon icon-control icon-add icon-folder-close';
        } else {
          icon_control.className = 'icon icon-control icon-minus icon-folder-open';
        }
      }
    });
  }
}