let rmenu = {};
rmenu.show = function(element, e, addTop){
  //Get window size:
  let winWidth = $(document).width();
  let winHeight = $(document).height();
  //Get pointer position:
  let posX = e.pageX;
  let posY = e.pageY;
  //Get contextmenu size:
  let menuWidth = $(element).width();
  let menuHeight = $(element).height();
  //Security margin:
  let secMargin = 10;
  //Prevent page overflow:
  if(posX + menuWidth + secMargin >= winWidth && posY + menuHeight + secMargin >= winHeight){
    //Case 1: right-bottom overflow:
    posLeft = posX - menuWidth - secMargin + "px";
    posTop = posY - menuHeight - secMargin + "px";
  }
  else if(posX + menuWidth + secMargin >= winWidth){
    //Case 2: right overflow:
    posLeft = posX - menuWidth - secMargin + "px";
    posTop = posY + secMargin + "px";
  }
  else if(posY + menuHeight + secMargin >= winHeight){
    //Case 3: bottom overflow:
    posLeft = posX + secMargin + "px";
    posTop = posY - menuHeight - secMargin + "px";
  }
  else {
    //Case 4: default values:
    posLeft = posX + secMargin + "px";
    posTop = posY + secMargin + addTop + "px";
  }
  //Display contextmenu:
  $(element).css({"left": posLeft, "top": posTop}).show();
};

rmenu.hide = function(element){
  $(element).hide();
};