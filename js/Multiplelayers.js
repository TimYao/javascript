/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-6-4
 * Time: 15:30:00
 * Contact: tmwoman@yeah.net
 */
function Multiplelayers(option) {
  this.id = option.id || ''; //容器ID
  this.title = option.title || 'title';
  this.hideName = option.hideName || 'input_'+this.id;
  this.format = option.format || 'checkbox';
  this.columNumber = option.columNumber || 4; //一行几个
  this.defaultValue = option.defaultValue || ''; //input框里默认值
  this.allDate = option.allDate || []; //传入数据
  this.layerZindex = option.layerZindex || "5"; //弹层级别
  this.dateNum = option.dateNum || 5;
  this.dateLayer = parseInt(option.dateLayer) || 0;
  this.styles = option.style || {}; //添加的样式
  this.adate = option.dateId || {}; //是否有默认数据
  this.trigger = function(){};
  this.init(); //触发函数
}

Multiplelayers.prototype = {
  init: function() {
    if (!this.id) {
      return false;
    }
    this.createStruce(); //聚集结构产生
  },
  addDate: function() { //标题数据显示分类
    //数据层级
    switch (parseInt(this.dateLayer)) {
    case 0:
      this.trigger = this.createSinglelayerDate; //触发创建弹层(单层)
      break;
    case 1:
      this.trigger = this.createMultilayerDate; //触发创建弹层(2层)
      break;
    case "":
      break;
    }
    this.trigger(); //函数触发
    this.delDate(); //触发删除聚集框数据函数
    this.docClik(); //触发document
  },
  createStruce: function() { //创建input聚焦框
    this.codeArr = []; //记录存储选择的值得Code
    this.amisFistspan = [];
    this.allmisTabs = [];
    this.checkBtn = false;
    this.checkArr = [];
    this.num = 0;
    this.flg = false; //控制有默认数据和无默认数据开关
    this.oMain = document.getElementById(this.id); //对应生成容器对象
    this.wrapContent = document.createElement("div"); //创建聚集框外层容器
    this.wrapDiv = document.createElement("div"); //创建聚集框下二层
    this.oinput = document.createElement("input"); //创建input
    this.inputHide = document.createElement("input"); //创建隐藏域
    this.oSpan = document.createElement("span"); //创建按钮
    this.wrapContent.className = "wrapContent";
    this.wrapDiv.className = "wrapDiv";
    this.oinput.className = "textValue";
    this.oinput.setAttribute("type", "text");
    this.inputHide.setAttribute("type", "hidden");
    this.inputHide.setAttribute("name",this.hideName);
    this.inputHide.className = "inputHide";
    this.oSpan.className = "sbtn";
    this.wrapDiv.appendChild(this.oinput);
    this.wrapDiv.appendChild(this.inputHide);
    this.wrapContent.appendChild(this.wrapDiv);
    this.wrapContent.appendChild(this.oSpan);
    if (this.defaultValue != "") {
      this.defaultLabel = document.createElement("label"); //创建defaultValue
      this.defaultLabel.className = "defaults";
      this.defaultLabel.innerHTML = this.defaultValue;
      this.wrapContent.appendChild(this.defaultLabel);
      this.deBtn = true;//标注是否有默认提醒，true为有
    }
    this.oMain.appendChild(this.wrapContent);
    this.wrapObj = this.getByClass(this.oMain, "wrapContent"); //获取插入焦点框对象
    this.oinputObj = this.getByClass(this.oMain, "textValue"); //input对象
    this.deLabel = this.getByClass(this.oMain, "defaults"); //input对象
    if (this.defaultValue != "") {
      this.defaultLabel.style.top = (this.wrapContent.offsetHeight - this.defaultLabel.offsetHeight) / 2 + 'px';
    }
    this.addDate(); //触发添加标题
    this.oSpan.style.top = (Math.floor(this.wrapContent.offsetHeight - this.oSpan.offsetHeight)) / 2 + 'px'; //按钮位置显示
  },
  createSinglelayerDate:function(){//创建影藏弹层数据(单层数据触发函数)
     var n0 = 0,
         checkType='',
         firstLength = 0,
         This = this;
     this.firstArr = [];
     if(this.format)
     {
       switch(this.format)
       {
          case 'radio':
            checkType = 'radio';
            break;
          case 'checkbox':
            checkType = 'checkbox'
            break;
          default:
            break;
       }
       This.checkBtn = true;
     }
     for(var m in this.allDate)
     {
         n0++;
         this.firstArr.push([m,this.allDate[m]]);//单层数据
     }
     if(n0<=0)
     {
        alert('请写入数据');
     }else{
        firstLength = n0;
        this.misPic = document.createElement("div");
        this.mptitle = document.createElement("p");
        this.misOther = document.createElement("div");
        this.chax = document.createElement("span");
        this.mtitle = document.createElement("span");
        this.misPic.className = this.id + " misPic";
        this.mptitle.className = "mptitle";
        this.misOther.className = "misOther";
        this.chax.className = "chax";
        this.mtitle.className = "mtitle";
        this.mtitle.innerHTML = this.title;
        this.mptitle.appendChild(this.mtitle);
        this.mptitle.appendChild(this.chax);
        this.misPic.appendChild(this.mptitle);
        //数据的显示排列
        if (this.columNumber >= firstLength) {
            var c = 1;
            var f = false;
            //传入columNumber>默认columNumber，按默认重新排列
            if(this.columNumber>4)
            {
               this.columNumber = 4;
               var c = Math.floor(firstLength / this.columNumber);
               var lNumber = firstLength % this.columNumber;
               var f = true;
            }
        }else{
            var c = Math.floor(firstLength / this.columNumber);
            var lNumber = firstLength % this.columNumber;
            var f = true;
        }
        //整数行循环
        for(var i=0;i<c;i++)
        {
           var misColum = document.createElement("div"); //各行
           var misFirsts = document.createElement("div"); //一级数据行
           misColum.className = "misColum";
           misFirsts.className = "misFirsts";
           if(f===false)
           {
              var j = 0;
              var q = firstLength;
           }else{
              var j = i*(this.columNumber);
              var q = (i+1)*(this.columNumber);
           }
           for(var n=j;n<q;n++)
           {
              var tspan = document.createElement("span");
              var tlabel = document.createElement("label");
              //存在check,radio
              if(This.checkBtn)
              {
                  var oCheck = document.createElement('input');
                  oCheck.type = checkType;
              }
              tlabel.innerHTML = this.firstArr[n][1];
              tspan.setAttribute("code", this.firstArr[n][0]); //添加数据id标示
              tspan.appendChild(oCheck);
              tspan.appendChild(tlabel);
              misFirsts.appendChild(tspan);
           }
           misColum.appendChild(misFirsts);
           this.misOther.appendChild(misColum);
           this.misPic.appendChild(this.misOther);
        }
        //余数后面数据循环
        if(lNumber>0)
        {
          for(var k=0;k<1;k++)
          {
             var misColum = document.createElement("div"); //各行
             var misFirsts = document.createElement("div"); //一级数据行
             var misTab = document.createElement("div"); //二级数据行
             misColum.className = "misColum";
             misFirsts.className = "misFirsts";
             for(var m=n;m<firstLength;m++)
             {
                var tspan = document.createElement("span");
                var tlabel = document.createElement("label");
                //存在check,radio
                if(This.checkBtn)
                {
                    var oCheck = document.createElement('input');
                    oCheck.type = checkType;
                }
                tlabel.innerHTML = this.firstArr[m][1];
                tspan.setAttribute("code", this.firstArr[m][0]);//添加数据id标示
                tspan.appendChild(oCheck);
                tspan.appendChild(tlabel);
                misFirsts.appendChild(tspan);
             }
             misColum.appendChild(misFirsts);
             this.misOther.appendChild(misColum);
             this.misPic.appendChild(this.misOther);
          }
        }
        //弹层定位影藏
        this.misPic.style.left = (this.wrapObj)[0].offsetLeft + "px";
        this.misPic.style.top = (this.wrapObj)[0].offsetTop + (this.wrapObj)[0].offsetHeight + "px";
        this.misPic.style.zIndex = this.layerZindex;
        this.misPic.style.display = "none";
        document.body.appendChild(this.misPic);//生成一层数据
        //给弹层设置样式
        this.setCSS(); 
        this.misPicObj = this.getByClass(document, this.id); //misPic对象
        var amisFirst = this.getByClass(this.misPicObj[0], "misFirsts"); //一层数据所有misFirst对象
        //存储all一级下的span
        for (var i = 0; i < amisFirst.length; i++) {
          var aSpan = amisFirst[i].getElementsByTagName("span");
          var aLength = aSpan.length;
          for (var m = 0; m < aLength; m++) {
            This.amisFistspan.push(aSpan[m]); //This.amisFistspan所有misFirst下span
          }
        }
        //默认传入的数据存在显示
        for (var attr in this.adate) {
          var q1 = 0;
          q1++;
        }
        if (this.adate && q1 > 0) {
          var malldate = {};
          this.aCodeId = (this.adate["codeId"]);
          if (this.aCodeId != null && (this.aCodeId).length>0) {
            for (var i = 0; i < (this.firstArr.length); i++) {
              for(var j=0;j<(this.aCodeId).length;j++)
              {
                 if ((this.aCodeId)[j] === this.firstArr[i][0]) {
                     malldate[this.firstArr[i][0]] = this.firstArr[i][1]; //取得数据
                 }
              }
              
            }
          }
          this.flg = true;
          this.creatSubDate(malldate); //添加点击事件(malldate);
        }
        this.inputFocus(); //触发聚集
        //misPic弹层 阻止冒泡
        this.misPic.onclick = function(ev) {
          var ev = ev || window.event;
          ev.cancelBubble = true;
          This.oinput.focus();
          return false;
        }
     } 
  },
  createMultilayerDate:function() {//创建影藏弹层数据(两层数据触发函数)
    var This = this;
    var firstLength = 0;
    var twoLength = 0;
    var j = 0;
    this.firstArr = [];
    this.twotArr = [];
    this.MapOne = this.allDate.MapOne; //一级数据
    this.MapTwo = this.allDate.MapTwo; //二级数据
    this.misPic = document.createElement("div");
    this.mptitle = document.createElement("p");
    this.misOther = document.createElement("div");
    this.chax = document.createElement("span");
    this.mtitle = document.createElement("span");
    this.misPic.className = this.id + " misPic";
    this.mptitle.className = "mptitle";
    this.misOther.className = "misOther";
    this.chax.className = "chax";
    this.mtitle.className = "mtitle";
    this.mtitle.innerHTML = this.title;
    this.mptitle.appendChild(this.mtitle);
    this.mptitle.appendChild(this.chax);
    this.misPic.appendChild(this.mptitle);
    //弹层数据 一层
    for (var index in this.MapOne) {
      firstLength++;
      this.firstArr.push([index, this.MapOne[index]]);
    }
    //二层
    for (var index in this.MapTwo) {
      twoLength++;
      this.twotArr.push([index, this.MapTwo[index]]);
    }
    //数据的显示排列
    if (this.columNumber >= firstLength) {
        var c = 1;
        var f = false;
        //传入columNumber>默认columNumber，按默认重新排列
        if(this.columNumber>4)
        {
           this.columNumber = 4;
           var c = Math.floor(firstLength / this.columNumber);
           var lNumber = firstLength % this.columNumber;
           var f = true;
        }
    }else{
        var c = Math.floor(firstLength / this.columNumber);
        var lNumber = firstLength % this.columNumber;
        var f = true;
    }
    //整数行循环
    for(var i=0;i<c;i++)
    {
       var misColum = document.createElement("div"); //各行
       var misFirst = document.createElement("div"); //一级数据行
       var misTab = document.createElement("div"); //二级数据行
       misColum.className = "misColum";
       misFirst.className = "misFirst";
       misTab.className = "misTab";
       if(f===false)
       {
          var j = 0;
          var q = firstLength;
       }else{
          var j = (i*this.columNumber);
          var q = (i+1)*this.columNumber;
       }
       for(var n=j;n<q;n++)
       {
          var tspan = document.createElement("span");
          var tlabel = document.createElement("label");
          tlabel.innerHTML = this.firstArr[n][1];
          tspan.setAttribute("code", this.firstArr[n][0]); //添加数据id标示
          tspan.appendChild(tlabel);
          misFirst.appendChild(tspan);
       }
       misColum.appendChild(misFirst);
       misColum.appendChild(misTab);
       this.misOther.appendChild(misColum);
       this.misPic.appendChild(this.misOther);
    }
    //余数后面数据循环
    if(lNumber>0)
    {
      for(var k=0;k<1;k++)
      {
         var misColum = document.createElement("div"); //各行
         var misFirst = document.createElement("div"); //一级数据行
         var misTab = document.createElement("div"); //二级数据行
         misColum.className = "misColum";
         misFirst.className = "misFirst";
         misTab.className = "misTab";
         for(var m=n;m<firstLength;m++)
         {
            var tspan = document.createElement("span");
            var tlabel = document.createElement("label");
            tlabel.innerHTML = this.firstArr[m][1];
            tspan.setAttribute("code", this.firstArr[m][0]);//添加数据id标示
            tspan.appendChild(tlabel);
            misFirst.appendChild(tspan);
         }
         misColum.appendChild(misFirst);
         misColum.appendChild(misTab);
         this.misOther.appendChild(misColum);
         this.misPic.appendChild(this.misOther);
      }
    }
    //弹层定位影藏
    this.misPic.style.left = (this.wrapObj)[0].offsetLeft + "px";
    this.misPic.style.top = (this.wrapObj)[0].offsetTop + (this.wrapObj)[0].offsetHeight + "px";
    this.misPic.style.zIndex = this.layerZindex;
    this.misPic.style.display = "none";
    document.body.appendChild(this.misPic);//生成一层数据
    //给弹层设置样式
    this.setCSS();
    
    this.misPicObj = this.getByClass(document, this.id); //misPic对象
    var amisFirst = this.getByClass(this.misPicObj[0], "misFirst"); //一层数据所有misFirst对象
    var amisTab = this.getByClass(this.misPicObj[0], "misTab");
    //存储all一级下的span
    for (var i = 0; i < amisFirst.length; i++) {
      var aSpan = amisFirst[i].getElementsByTagName("span");
      var aLength = aSpan.length;
      for (var m = 0; m < aLength; m++) {
        This.amisFistspan.push(aSpan[m]); //This.amisFistspan所有misFirst下span
      }
    }
    //存储所有的misTab
    for (var j = 0; j < amisTab.length; j++) {
      This.allmisTabs.push(amisTab[j]);
    }

    //默认传入的数据存在显示
    for (var attr in this.adate) {
      var q1 = 0;
      q1++;
    }
    if (this.adate && q1 > 0) {
      var malldate = [];
      this.aCodeId = (this.adate["codeId"]);
      this.adates = (this.adate["subId"]);
      if (this.aCodeId != null && this.adates != null) {
        for (var i = 0; i < (this.twotArr.length); i++) {
          if (this.aCodeId === this.twotArr[i][0]) {
            malldate.push(this.twotArr[i]); //取得对应一级数据下的二级数据
          }
        }
      }
      this.flg = true;
      this.creatSubDate(malldate); //添加点击事件(malldate);
    }
    
    this.inputFocus(); //触发聚集
    //misPic弹层 阻止冒泡
    this.misPic.onclick = function(ev) {
      var ev = ev || window.event;
      ev.cancelBubble = true;
      This.oinput.focus();
      return false;
    }
  },
  creatSubDate: function(alldate) { //二级子菜单生成
    var This = this;
    if(this.dateLayer===0)
    {
        this.adates = alldate;
    }else if(this.dateLayer===1)
    {
      var index = alldate[0][0];
      var arrs = alldate[0][1];
      var misTabc = document.createElement("div");
    }
    var checkType;
    //checkbox radio类型
    if (this.format) {
      switch (this.format) {
      case 'checkbox':
        checkType = "checkbox";
        break;
      case 'radio':
        checkType = "radio";
        break;
      default:
        break;
      }
      this.checkBtn = true;
    }
    if(this.dateLayer===0)
    {
        var allmisFirst = (this.getByClass(this.misPic, 'misFirsts'));
        var allSpan_1 = [];
        var simKey = [];
        //存在默认值
        if(this.flg === true)
        {
           if (This.deBtn === true) {
              (This.deLabel)[0].style.display = "none";
           }
           for(var attr in this.adates)
           {
              simKey.push(attr);
           }
           this.inputHide.value = simKey.join(","); //存入默认上来的数据
           this.num = this.inputHide.value.split(",").length;
           for (var i = 0; i < allmisFirst.length; i++) {
             var spans = allmisFirst[i].getElementsByTagName("span");
             for (var j = 0; j < spans.length; j++) {
                 allSpan_1.push(spans[j]);
             }
           }
           for (var j1 = 0; j1 < simKey.length; j1++) {
            var nCode = simKey[j1]; //数据CODE
            for (var i1 = 0; i1 < allSpan_1.length; i1++) {
              var sCode = allSpan_1[i1].getAttribute("code");
              if (nCode === sCode) //比对数据CODE,创建聚集框显示默认有的数据
              {
                var aNode_1 = document.createElement("a");
                var slabel_1 = document.createElement("label");
                var clabel_1 = document.createElement("label");
                var texts_1 = document.createTextNode((allSpan_1[i1].getElementsByTagName('label'))[0].innerHTML); //获取点击的内容
                aNode_1.className = "tagClass";
                aNode_1.setAttribute("code", sCode);
                slabel_1.className = "slabel";
                clabel_1.className = "clabel";
                slabel_1.appendChild(texts_1);
                aNode_1.appendChild(slabel_1);
                aNode_1.appendChild(clabel_1);
                this.wrapDiv.insertBefore(aNode_1, this.oinput);
                this.codeArr.push(sCode); //存取已存在CODE值
                //check,radio效果记录
                if (this.checkBtn) {
                  var ocheck = allSpan_1[i1].getElementsByTagName("input");
                  this.checkArr.push(ocheck[0]); //存储check选中对象
                  ocheck[0].checked = true; //设置数据对应项为选中
                }
              }
            }
           }
           this.delDate(this.checkArr); //触发删除选项函数
           this.flg = false;
        }
    }else if(this.dateLayer===1)
    {
        for (var i in arrs) {
          var klabel = document.createElement("label");
          var kspan = document.createElement("span");
          if (this.checkBtn === true) //添加checkbox radio等
          {
            var iCheck = document.createElement("input");
            iCheck.setAttribute("type", checkType);
            kspan.appendChild(iCheck);
          }
          klabel.innerHTML = arrs[i];
          klabel.className = "klabel";
          kspan.setAttribute("code", i);

          kspan.appendChild(klabel);
          misTabc.appendChild(kspan);
        }
        misTabc.setAttribute("tabCode", index); //设置对应数据tabCode
        //有默认数据处理
        var allmisFirst = (this.getByClass(this.misPic, 'misFirst'));
        var allSpan_1 = [];
        for (var i = 0; i < allmisFirst.length; i++) {
          var spans = allmisFirst[i].getElementsByTagName("span");
          for (var j = 0; j < spans.length; j++) {
            allSpan_1.push(spans[j]);
          }
        }
        for (var k = 0; k < allSpan_1.length; k++) {
          var this_Code = allSpan_1[k].getAttribute("code");

          if (this_Code === this.aCodeId) {
            var s_span = allSpan_1[k];
            break;
          }
        }
        if (s_span != null) {
          var smisTabObj = this.getByClass(s_span.parentNode.parentNode, "misTab"); //默认上来获取mistab
        }
        //先默认数据
        if (smisTabObj && smisTabObj != null && this.flg === true) {
          if (This.deBtn === true) {
            (This.deLabel)[0].style.display = "none";
          }
          smisTabObj[0].appendChild(misTabc);
          this.inputHide.value = this.adates.join(","); //存入默认上来的数据
          this.num = this.inputHide.value.split(",").length;
          var aspans = misTabc.getElementsByTagName("span");
          for (var j = 0; j < this.adates.length; j++) {
            var nCode = this.adates[j]; //数据CODE
            for (var i = 0; i < aspans.length; i++) {
              var sCode = aspans[i].getAttribute("code");
              if (nCode === sCode) //比对数据CODE,创建聚集框显示默认有的数据
              {
                var aNode_1 = document.createElement("a");
                var slabel_1 = document.createElement("label");
                var clabel_1 = document.createElement("label");
                var texts_1 = document.createTextNode((this.getByClass(aspans[i], "klabel"))[0].innerHTML); //获取点击的内容
                aNode_1.className = "tagClass";
                aNode_1.setAttribute("code", sCode);
                slabel_1.className = "slabel";
                clabel_1.className = "clabel";
                slabel_1.appendChild(texts_1);
                aNode_1.appendChild(slabel_1);
                aNode_1.appendChild(clabel_1);
                this.wrapDiv.insertBefore(aNode_1, this.oinput);
                this.codeArr.push(sCode); //存取已存在CODE值
                //check,radio效果记录
                if (this.checkBtn) {
                  var ocheck = aspans[i].getElementsByTagName("input");
                  this.checkArr.push(ocheck[0]); //存储check选中对象
                  ocheck[0].checked = true; //设置数据对应项为选中
                }
              }
            }
          }
          this.delDate(this.checkArr); //触发删除选项函数
          this.flg = false;
        }
        //无默认值下初始创建
        if (this.misTabObj && this.flg === false) {
          this.misTabObj[0].appendChild(misTabc);
        }
        //获得点击显示子菜单下的span元素
        var allSpans = misTabc.getElementsByTagName("span");
        var achecks = misTabc.getElementsByTagName("input");
        var klength = allSpans.length;
        for (var k = 0; k < klength; k++) {
          allSpans[k].onclick = function(ev) {
            var ev = ev || window.event;
            ev.cancelBubble = true;
            var thisCode = this.getAttribute("code");
            var thisValue = This.inputHide.value.split(",");
            var dateLength = thisValue.length;
            This.addValue(this, thisCode, thisValue);
            This.delDate(This.checkArr); //触发删除选项函数
            return false;
          }
          //checkbox radio
          if (achecks && achecks.length > 0 && This.checkBtn === true) {
            achecks[k].onclick = function(ev) {
              var ev = ev || window.event;
              ev.cancelBubble = true;
              //数量够之后取消默认点击
              if (This.num === This.dateNum) {
                return false;
              }
              return false;
            }
            achecks[k].onblur = function() {
              var thisCode = this.parentNode.getAttribute("code");
              var thisValue = This.inputHide.value.split(",");
              This.addValue(this.parentNode, thisCode, thisValue);
              This.delDate(This.checkArr); //触发删除选项函数
            }
            achecks[k].onfocus = function() {
              this.blur();
            }
          }
        }
    }
  },
  inputFocus: function() { //聚焦input触发弹层
    var This = this;
    var oInputbtn = (this.oinputObj)[0];
    oInputbtn.onfocus = This.oSpan.onclick = function(ev) {
      var ev = ev || window.event;
      ev.cancelBubble = true;
      if ((This.misPicObj)[0].style.display === "none") {
        (This.misPicObj)[0].style.display = "block";
        oInputbtn.focus(); //聚焦
        //默认提示文字触发影藏
        if (This.deBtn === true) {
          (This.deLabel)[0].style.display = "none";
        }
      }
      This.click(); //添加点击事件
      This.misPic.style.top = This.wrapContent.offsetTop + This.wrapContent.offsetHeight + 'px'; //定位弹层位置
      This.oSpan.style.top = (Math.floor(This.wrapContent.offsetHeight - This.oSpan.offsetHeight)) / 2 + 'px';
      return false;
    }
    oInputbtn.onblur = function() {
      if (This.deBtn === true) {
          if((This.inputHide.value)!='')
          {
             (This.deLabel)[0].style.display = "none";
          }
      }
      /*if ((This.misPicObj)[0].style.display === "none") {
        //默认一级取消root
        for (var j = 0; j < This.amisFistspan.length; j++) {
          This.amisFistspan[j].className = "";
        }
        //隐藏所有二级tab层
        for (var m = 0; m < (This.allmisTabs.length); m++) {
          This.allmisTabs[m].style.display = "none";
        }
      }*/
    }
    //关闭按钮
    this.chax.onclick = function(ev) {
      var ev = ev || window.event;
      ev.cancelBubble = true;
      if ((This.misPicObj)[0].style.display === "block") {
        (This.misPicObj)[0].style.display = "none";
        if (This.deBtn === true) {
          if (This.inputHide.value === "") //存储值影藏域值
          {
            (This.deLabel)[0].style.display = "block";
          }
        }
        //默认一级取消root
        for (var j = 0; j < This.amisFistspan.length; j++) {
          This.amisFistspan[j].className = "";
        }
        //隐藏所有二级tab层
        for (var m = 0; m < (This.allmisTabs.length); m++) {
          This.allmisTabs[m].style.display = "none";
        }
      }
      return false;
    }
    //阻止冒泡发生
    oInputbtn.onclick = This.oSpan.parentNode.onclick = function(ev) {
      var ev = ev || window.event;
      ev.cancelBubble = true;
      return false;
    }
  },
  click: function() { //列表项目添加click
    var This = this;
    if(this.dateLayer===0)//单层数据
    { 
      var achecks = this.misOther.getElementsByTagName("input");
      for (var i = 0; i < (this.amisFistspan.length); i++)
      {
          this.amisFistspan[i].onclick = function(ev) {
             var ev = ev || window.event;
             ev.cancelBubble = true;
             var thisCode = this.getAttribute("code");
             var thisValue = This.inputHide.value.split(",");
             if(thisValue.toString()==="")
             {
               var dateLength = thisValue.length = 0;
             }else{
               var dateLength = thisValue.length;
             }
             This.addValue(this, thisCode, thisValue);
             This.delDate(This.checkArr); //触发删除选项函数
             return false;
          }
          //checkbox radio
          if (achecks && achecks.length > 0 && This.checkBtn === true) {
            achecks[i].onclick = function(ev) {
              var ev = ev || window.event;
              ev.cancelBubble = true;
              //数量够之后取消默认点击
              if (This.num === This.dateNum) {
                return false;
              }
              return false;
            }
            achecks[i].onblur = function() {
              var thisCode = this.parentNode.getAttribute("code");
              var thisValue = This.inputHide.value.split(",");
              This.addValue(this.parentNode, thisCode, thisValue);
              This.delDate(This.checkArr); //触发删除选项函数
            }
            achecks[i].onfocus = function() {
              this.blur();
            }
          }
      }
    }else if(this.dateLayer===1)//2层数据
    {
      var sbtn = false; //控制子菜单的内容替换
      for (var i = 0; i < (this.amisFistspan.length); i++) { //一级添加了事件
        this.amisFistspan[i].onclick = function(ev) {
          var ev = ev || window.event;
          ev.cancelBubble = true;
          var this_code = this.getAttribute("code");
          This.oinput.focus(); //input聚集
          //对应点击一级对象下tab数据对象
          This.misTabObj = This.getByClass(this.parentNode.parentNode, "misTab");
          var ilength = (This.misTabObj)[0].children.length;
          var misTabdiv = (This.misTabObj)[0].children;
          var alldate = [];
          for (var i = 0; i < (This.twotArr.length); i++) {
            if (this_code === This.twotArr[i][0]) {
              alldate.push(This.twotArr[i]); //取得对应一级数据下的二级数据
            }
          }
          //改变当前状态
          for (var n = 0; n < (This.amisFistspan).length; n++) //所有一级下span
          {
            This.amisFistspan[n].className = "";
            var oMistab = (This.getByClass(This.amisFistspan[n].parentNode.parentNode, "misTab")[0]);
            if (oMistab) {
              oMistab.style.display = "none";
            }
          }
          this.className = "aStyle"; //设置当前点击的状态
          This.misTabObj[0].style.display = "block";
          //子菜单创建
          if (ilength <= 0) {
            This.creatSubDate(alldate);
          } else {
            for (var i = 0; i < ilength; i++) {
              if (misTabdiv[i].getAttribute("tabcode") === this_code) {
                sbtn = true;
                var oselectDiv = misTabdiv[i]; //记录所点击的对应DIV显示块
                break;
              } else {
                sbtn = false;
              }
            }
            if (sbtn === true) {
              for (var o = 0; o < ilength; o++) {
                misTabdiv[o].style.display = "none";
              }
              oselectDiv.style.display = "block";
            } else {
              This.creatSubDate(alldate);
              for (var o = 0; o < ilength; o++) {
                misTabdiv[o].style.display = "none";
              }
            }
          }
          return false;
        }
      }
      }
  },
  delDate: function(allCheck) { //删除选择项目项  allCheck(checkbox radio单个或多个)
    var This = this;
    var alldates = This.wrapDiv.getElementsByTagName("a"); //获取聚集框里已添入的数据a
    if (!allCheck || (allCheck.length) < 0) {
      return false
    };
    if (This.checkArr.length > 0) {
      allCheck = This.checkArr;
    }
    //添加数据后为删除添加事件
    if (alldates.length > 0) {
      var allClabel = [];
      for (var i = 0; i < alldates.length; i++) {
        allClabel.push(This.getByClass(alldates[i], "clabel")[0]); //获取已经插入的所有删除按钮
      }
      if (allClabel.length < 0) {
        return false;
      } else {
        var clength = allClabel.length;
      }

      //删除按钮添加事件
      for (var j = 0; j < clength; j++) {
        allClabel[j].onclick = function(ev) { 
          var ev = ev || window.event;
          var thisObj = this.parentNode; //span对象
          var thisCode = thisObj.getAttribute("code");
          var length = alldates.length;
          var iNow = 0;
          var checksArr;
          var firstArr;
          var lastArr;
          var result;
          var codeArrs = This.inputHide.value.split(",");
          for (var i = 0; i < length; i++) {
            var c_code = alldates[i].getAttribute("code");
            if (c_code === thisCode) {
              iNow = i;
              break;
            }
          }
          //code checkbox radio删除处理
          if (iNow === 0) {
            lastArr = codeArrs.splice(1, codeArrs.length);
            result = lastArr; //截取code数组合并
            if (This.checkBtn === true) {
              allCheck[0].checked = false;
              checksArr = allCheck.splice(1, allCheck.length);
            }
          } else if (iNow === codeArrs.length - 1) {
            firstArr = codeArrs.splice(0, iNow);
            result = firstArr; //截取code数组合并 
            if (This.checkBtn === true) {
              allCheck[iNow].checked = false;
              checksArr = allCheck.splice(0, iNow);
            }
          } else if (iNow > 0 && iNow < codeArrs.length - 1) {
            firstArr = codeArrs.splice(0, iNow);
            lastArr = codeArrs.splice(1, codeArrs.length);
            result = firstArr.concat(lastArr); //截取code数组合并

            if (This.checkBtn === true) {
              allCheck[iNow].checked = false;
              checksArr = (allCheck.splice(0, iNow)).concat(allCheck.splice(1, allCheck.length));
            }
          }
          This.num = result.length; //改变之前存储的数量（同步变化）
          This.codeArr = result; //改变之前存储的值（同步变化）
          This.wrapDiv.removeChild(alldates[iNow]); //删除节点
          This.inputHide.value = result.join(","); //删除存在的code值 
          //document.title = This.inputHide.value;
          This.misPic.style.top = This.wrapContent.offsetTop + This.wrapContent.offsetHeight + 'px'; //定位弹层位置
          This.oSpan.style.top = (Math.floor(This.wrapContent.offsetHeight - This.oSpan.offsetHeight)) / 2 + 'px'; //定位点击按钮位置
          if (This.checkBtn === true) {
            //记录下存在checkbox radio后选中状态
            if (checksArr.length <= 0) {
              This.checkArr = [];
            } else {
              for (var c = 0; c < (checksArr.length); c++) {
                This.checkArr[c] = checksArr[c];
              }
            }
          }
          if (This.deBtn === true) //聚集框为空是显示默认值
          {
            if (This.inputHide.value === "" && This.misPic.style.display === "none") //存储值影藏域值
            {
              This.defaultLabel.style.display = "block";
              //默认位置定位
              This.defaultLabel.style.top = (This.wrapContent.offsetHeight - This.defaultLabel.offsetHeight) / 2 + 'px'
            }
          }
          ev.cancelBubble = true;
          This.oinput.blur();//删除时聚集
        }
      }
    }
  },
  docClik: function() { //document点击关闭层
    var This = this;
    var allMisPic = this.getByClass(document, "misPic");
    var allDefault = this.getByClass(document, "defaults");
    var inputHide = this.getByClass(document, "inputHide");
    var length = allMisPic.length;
    var alength = allDefault.length;
    var slength = inputHide.length;
    document.onclick = function() {
      //关闭所有弹层
      for (var i = 0; i < length; i++) {
        allMisPic[i].style.display = "none";
      }
      /*//默认一级取消root
      for (var j = 0; j < This.amisFistspan.length; j++) {
        This.amisFistspan[j].className = "";
      }
      //隐藏所有二级tab层
      for (var m = 0; m < (This.allmisTabs.length); m++) {
        This.allmisTabs[m].style.display = "none";
      }
      //defaultValue值控制
      console.log(This);*/
      for (var i = 0; i < slength; i++) {
        if(inputHide[i].value==='')
        {
           allDefault[i].style.display = "block";
        }
      }
    }
  },
  addValue:function(obj, thisCode, thisValue)//添加值
  { 
      obj.thisbtn = false;
      //限制插入数据个数默认5个
      if (this.num === this.dateNum) {
        return false;
      }
      //checkbox radio
      if (this.checkBtn === true) {
        var arrInput = obj.getElementsByTagName("input");
        arrInput[0].checked = true;
        this.checkArr.push(arrInput[0]);
      }
      for (var i = 0; i < thisValue.length; i++) {
        if (thisValue[i] === thisCode) //存在已经插入
        {
          obj.thisbtn = true;
          break;
        }
      }
      if (obj.thisbtn === false) {
        var spanNode = document.createElement("a");
        var slabel = document.createElement("label");
        var clabel = document.createElement("label");
        //单层数据创建
        if(this.dateLayer===0)
        {
          var texts = document.createTextNode((obj.getElementsByTagName('label'))[0].innerHTML); //获取点击的内容
        }else if(this.dateLayer===1){//双层数据创建
          var texts = document.createTextNode((this.getByClass(obj, "klabel"))[0].innerHTML); //获取点击的内容
        }
        spanNode.className = "tagClass";
        spanNode.setAttribute("code", thisCode);
        slabel.className = "slabel";
        clabel.className = "clabel";
        slabel.appendChild(texts);
        spanNode.appendChild(slabel);
        spanNode.appendChild(clabel);
        this.wrapDiv.insertBefore(spanNode, this.oinput);
        this.misPic.style.top = this.wrapContent.offsetTop + this.wrapContent.offsetHeight + 'px'; //定位弹层位置
        this.oSpan.style.top = (Math.floor(this.wrapContent.offsetHeight - this.oSpan.offsetHeight)) / 2 + 'px'; //定位点击按钮位置
        this.codeArr.push(thisCode);
        this.inputHide.value = this.codeArr.join(","); //存入影藏域
        this.num++;
      }
  },
  setCSS:function()//设置样式
  {
     for(var attr in this.styles)
     {
         this.misPic.style[attr] = this.styles[attr]+'px';
     }
  },
  getByClass: function(oparent, sclass) //公共函数获取指定class名的对象返回数组结构
  {
    var result = [];
    var arr = oparent.getElementsByTagName("*");
    var reg = eval("/\\b" + sclass + "\\b/");
    for (var i = 0; i < arr.length; i++) {
      if (reg.test(arr[i].className)) {
        result.push(arr[i]);
      }
    }
    return result;
  }
}