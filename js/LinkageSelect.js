/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-05-26
 * Time: 16:28:00
 * Contact: tmwoman@yeah.net
 */
 /*data_id与后端配合获取ID KEY可配合改变*/
function LinkageSelect(oParm) {
  var newBlist = [],
    defaultId = "",
    defaultflg = "",
    defaultArr = [],
    olderObj = null,
    stopFlg = true,
    flg = false,
    tDefaults = "请选择",
    isDefaultV = false;
  oId = oParm.id || '', evt = oParm.evt || 'click', ajaxUrl = oParm.ajaxUrl || '', type = (oParm.type).toUpperCase() || 'GET', inputId = oParm.inputId || 'txt_put', defTxt = oParm.defTxt || '', defKey = oParm.defKey || "-1", dateId = oParm.dateId || '', datelayerRoot = oParm.datelayerRoot || ['datelayer', '0'], //默认顶层
  cssClass = oParm.cssClass || {}, hoverClass = cssClass.hoverClass || '', btnShow = cssClass.btnShow || '', callBack = oParm.callBack ||
  function() {}, dataArr = [], cf = true, oMain = document.getElementById(oId);
  if (!oId || !oMain) {
    alert('请传入容器ID');
    return false;
  }
  if (ajaxUrl === "") {
    alert("请输入请求地址");
    return false;
  }
  var txt_put = document.getElementById(inputId);
  if (!txt_put) {
    return false;
  }
  if (dateId === "") {
    alert('请传入数据ID');
  }
  var aMen_box = oMain.children,
    ibLength = aMen_box.length,
    rootLayer = datelayerRoot[1];
  //存储页面生成的men_box
  //newBlist.push(aMen_box[1]);
  for (var i = 1; i < ibLength; i++) {
    var oMeth = (aMen_box[i].children)[0];
    var oUlist = (aMen_box[i].children[1]);
    oUlist.style.width = oMeth.offsetWidth + 'px';
    addEvent(oMeth, oUlist);
  }
  //额外操作
  callBack();

  function addEvent(oMeth, oUlist) {
    var oSpan = (oMeth.children)[0],
      oAbtn = (oMeth.children)[1],
      aList = oUlist.getElementsByTagName("li"),
      length = aList.length,
      dataid = (aList[0]).getAttribute(dateId),
      alength = dataArr.length;
    oSpan.setAttribute(dateId, "");
    //初始默认值设置
    if(isDefaultV && defTxt==="")
    {
       oSpan.innerHTML = tDefaults;
    }else{
       oSpan.innerHTML = defTxt || (aList[0].children)[0].innerHTML;
    }
    
    oSpan.parentNode.parentNode.style.width = oUlist.style.width = oSpan.offsetWidth+oAbtn.offsetWidth+'px';
    if (oSpan.innerHTML === defTxt) {
      oSpan.setAttribute(dateId, defKey);
    } else {
      if(isDefaultV)
      {
         oSpan.setAttribute(dateId, defKey);
      }else{
         oSpan.setAttribute(dateId, dataid);
      }
      var thisLayer0 = oSpan.parentNode.parentNode.getElementsByTagName("ul")[0].getAttribute(datelayerRoot[0]);
      var dateLayer0 = oSpan.parentNode.parentNode.getElementsByTagName("ul")[0].getAttribute(datelayerRoot[0])+'_'+1;
      isDefaultV = true;
      if(stopFlg===true)
      { 
         $.ajax({
          url: ajaxUrl,
          type: type,
          async: 'true',
          timeout: '',
          data: {
            data_id: dataid
          },
          dataType: 'json',
          success: function(RETURNA) {
            var result = [];
            if (RETURNA.length != 0) {
              for (var attr in RETURNA) {
                var oParentId = attr;
                var osubList = RETURNA[attr];
              }
              for (var attr in osubList) {
                result.push([attr, osubList[attr]]);
              }
            } else {
              var oParentId = '';
            }
            stopFlg = false;
            createHtml(thisLayer0, dateLayer0, oParentId, result, dataid);
            callBack();
          }
      });
      }
      
    }
    addValue();
    oSpan.onclick = oAbtn.onclick = function(ev) {
      var ev = ev || window.event;
      if (getStyle(oUlist, "display") === "none") {
        oUlist.style.display = "block";
        if (btnShow != "") {
          this.className = btnShow;
        }
      } else {
        oUlist.style.display = "none";
        if (btnShow != "") {
          this.className = '';
        }
      }
      ev.cancelBubble = true;
      oUlist.style.width = oMeth.offsetWidth + 'px';
    }
    oAbtn.onfocus = function() {
      this.blur()
    }
    for (var i = 0; i < length; i++) {
      aList[i].onclick = function(ev) {
        var ev = ev || window.event,
          dateid = this.getAttribute(dateId),
          dateLayer = this.parentNode.getAttribute(datelayerRoot[0]) + "_" + 1,
          thisLayer = this.parentNode.getAttribute(datelayerRoot[0]);
          oSpan.innerHTML = (this.children)[0].innerHTML;
          oSpan.setAttribute(dateId, dateid);
          //设置自适应宽度
          oSpan.parentNode.parentNode.style.width = this.parentNode.style.width = oSpan.offsetWidth+oAbtn.offsetWidth+'px';
        $.ajax({
          url: ajaxUrl,
          type: type,
          async: 'true',
          timeout: '',
          data: {
            data_id: dateid
          },
          dataType: 'json',
          success: function(RETURNA) {
            var result = [];
            if (RETURNA.length != 0) {
              for (var attr in RETURNA) {
                var oParentId = attr;
                var osubList = RETURNA[attr];
              }
              for (var attr in osubList) {
                result.push([attr, osubList[attr]]);
              }
            } else {
              var oParentId = '';
            }
            createHtml(thisLayer, dateLayer, oParentId, result, dateid);
            callBack();
          }
        });
        //列表宽度
        this.parentNode.style.width = oSpan.parentNode.offsetWidth + 'px';
        this.parentNode.style.display = "none";
        ev.cancelBubble = true;
      }
      //hover
      fHover(aList[i]);
    }
  }

  //动态生成样式
  function createHtml(thisLayer,dateLayer,oParentId,osubList,opId) {
    var iBoxlength = newBlist.length; //已存在的生成的select
    for (var j = 0; j < iBoxlength; j++) {
      var oListBj = (newBlist[j].children)[1];
      var layer = oListBj.getAttribute(datelayerRoot[0]);
      
      if (dateLayer === layer) { 
        var obj = (newBlist[j].children);
        var iNow = j;
        olderObj = obj;
        break;
      }
    }
    //变更列表数据
    if (osubList.length > 0) {
        if ( !! obj  && flg===false) {
          var meth = obj[0],
            spanText = (meth.children)[0],
            listul = obj[1],
            aLisDate = (listul.children),
            aLilength = aLisDate.length,
            //已有length
            aDateLength = osubList.length; //数据长度
          spanText.innerHTML = osubList[0][1];
          spanText.setAttribute(dateId, osubList[0][0]);
          if (aLilength <= aDateLength) {
            var istartLength = aDateLength - aLilength; //创建多少个新LI
            var iNum = aDateLength;
            var lengthNum = aLilength;
          } else if (aLilength > aDateLength) {
            var istartLength = aDateLength - aLilength; //创建多少个新LI
            var iNum = aLilength;
            var lengthNum = aDateLength;
          }
          for (var i = 0; i < lengthNum; i++) {
            (aLisDate[i]).setAttribute(dateId, osubList[i][0]);
            (aLisDate[i].children)[0].innerHTML = osubList[i][1];
          }
          if (istartLength > 0) {
            for (var i = lengthNum; i < iNum; i++) {
              var oLi = document.createElement("li");
              var oNewSpan = document.createElement("span");
              oNewSpan.innerHTML = osubList[i][1];
              oLi.setAttribute(dateId, osubList[i][0]);
              oLi.appendChild(oNewSpan);
              listul.appendChild(oLi);
            }
          } else if (istartLength < 0) {
            for (var i = lengthNum; i <= iNum--; i++) {
              if (aLisDate[lengthNum]) {
                listul.removeChild(aLisDate[lengthNum]);
              }
            }
          }
          listul.setAttribute("dateparentid", oParentId);
          listul.style.width = (listul.parentNode.children)[0].offsetWidth + 'px';
          //调用重新添加事件
          addEvent(meth, listul);
        } else {
          var oMen_box = document.createElement('div'); //创建一层div
          var oMeth = document.createElement('div'); //创建二层div
          var oSpan = document.createElement('span'); //创建模拟编辑span
          var oA = document.createElement('a'); //创建A标签
          var oUl = document.createElement('ul'); //创建模拟下拉列表UL
          var length = osubList.length;
          oA.href = "javascript:void(0);";
          oA.setAttribute('hidefocus', true);
          oMen_box.className = 'men_box';
          oMeth.className = 'meth';

          for (var i = 0; i < length; i++) {
            var oLi = document.createElement("li");
            var subspan = document.createElement("span");
            oLi.setAttribute(dateId, osubList[i][0]);
            subspan.innerHTML = osubList[i][1];
            oLi.appendChild(subspan);
            oUl.appendChild(oLi);
          }
          oUl.setAttribute('dateparentid', oParentId);
          oUl.setAttribute(datelayerRoot[0], dateLayer);
          oSpan.setAttribute('class', 'spanTitle');
          oSpan.innerHTML = osubList[0][1];//console.log(osubList[0][1]);
          oMeth.appendChild(oSpan);
          oMeth.appendChild(oA);
          oMen_box.appendChild(oMeth);
          oMen_box.appendChild(oUl);
          oMain.appendChild(oMen_box);
          oUl.style.width = oMeth.offsetWidth + 'px';
          addEvent(oMeth, oUl);
          newBlist.push(oMen_box);
        }
    } else {
      iNow = iNow - 1; //root下数据返回无数据
    }
    //console.log(flg);
    //删除无关项
    if(flg===false)
    {
      var aObj = getByClass(oMain, "men_box");
      for (var i = (iNow + 1); i < iBoxlength; i++) {
          oMain.removeChild(aObj[i]);
      }
    }
    newBlist = getByClass(oMain, "men_box");
    addValue();
  }
  //input add value
  function addValue() {
    dataArr = [];
    var allSpan = getByClass(oMain, "spanTitle");
    var length = allSpan.length;
    for (var i = 0; i < length; i++) {
      var keyId = allSpan[i].getAttribute(dateId);
      dataArr.push(keyId);
    }
    var keyValue = dataArr.join(",");
    txt_put.value = keyValue;
  }
  //hover
  function fHover(obj) {
    obj.onmouseover = function() {
      if (hoverClass != "") {
        this.className = hoverClass;
      } else {
        return false;
      }
    }
    obj.onmouseout = function() {
      if (hoverClass != "") {
        this.className = '';
      } else {
        return false;
      }
    }
  }
  //document click
  document.onclick = function(ev) {
    var ev = ev || window.event;
    var allUl = oMain.getElementsByTagName("ul");
    for (var i = 0; i < allUl.length; i++) {
      allUl[i].style.display = "none";
    }
    ev.cancelBubble = true;
  } 
  /*获取CSS样式*/
  function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
  } 
  /*获取指定class名字对象*/
  function getByClass(obj, sClass) {
    var re = eval("/\\b" + sClass + "\\b/g");
    var result = [];
    if (obj.length > 0) {
      var length = obj.length;
      var aobj = obj;

    } else {
      var aobj = obj.getElementsByTagName('*');
      var length = aobj.length;
    }
    for (var i = 0; i < length; i++) {
      var classN = aobj[i].className;

      if (re.test(classN) === true) {
        result.push(aobj[i]);
      }
    }
    return result;
  }
}