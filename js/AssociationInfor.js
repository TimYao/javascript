/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-06-6
 * Time: 16:30:00
 * Contact: tmwoman@yeah.net
 */
SugestMenu.result = []; 
function SugestMenu(Parameter)
{
  this.oContainer = null;//容器对象
  this.oUl = null;//模拟UL对象
  this.oIframe = null;//模拟框架对象
  this.reponseData = null;//数据存储对象
  this.resultFlg = false;
  this.flg = false;//是否生成了数据列表，默认false
  this.iframBtn = false;//是否生成的框架，默认false
  this.defaultBtn = false;//是否创建默认值,默认false
  this.inputId = Parameter.inputId || '';//触发联想对象
  //this.data = Parameter.data || '';//传入数据
  this.defaultText = Parameter.defaultText || '';
  this.clickSelect = (Parameter.clickSelect).toString() || true;//是否选中所选的对象内容
  this.targetType = Parameter.targetType || '_self';
  this.url = Parameter.url+'?t='+Math.random() || '';//ajax请求数据地址
  this.type = (Parameter.type).toLowerCase() || 'get';
  this.ie = !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1) && !/MSIE 9.0/ig.test(navigator.userAgent);
  this.ie9 = /MSIE 9.0/ig.test(navigator.userAgent);
  this.time = null;
  this.time1 = null;
  if(this.input==='' || this.url==='')
  {
       alert("请填写正确的参数");
       return false;
  }
  this.oInput = document.getElementById(this.inputId);
  this.oInput ? (this.init()) : 0;
  this.dataName = this.oInput.getAttribute("listClassName") || this.inputId+'_list';//生成容器添加的class名
  SugestMenu.result.push(this);
}
SugestMenu.prototype = {
    init:function(){//初始化
       var This = this;
       this.oInput.value = '';//防止刷新导入缓存数据
       this.setDefaultText();
       if(this.ie)
       {
         this.oInput.onpropertychange = function(ev){
            var value = This.trim(This.oInput.value);
            This.setDefaultText();
            This.time = setTimeout(function(){
              if(value!="")
              {  
                 This.requestDate(value);
              }
            },800);
         };
       }else if(this.ie9){
         //ie9关于提示文字触发兼容改变
         if(this.defaultText!='')
         {
           this.oInput.onpropertychange = function()
           {
              This.setDefaultText();
           }
         }
         this.oInput.onkeyup = function(){
            var value = This.trim(This.oInput.value);
            This.setDefaultText();
            This.time=setTimeout(function(){
              if(value!="")
              {  
                 This.requestDate(value);
              }
           },800);
         };
       }else{
         this.oInput.oninput = function(){
            var value = This.trim(This.oInput.value);
            This.setDefaultText();
            This.time=setTimeout(function(){
              if(value!="")
              {   
                 This.requestDate(value);
              }
           },800);
         };
       }
       this.oInput.onblur=function()
       {
            This.mouseDown();
       }
       this.oInput.onfocus=function()
       { 
           var value = This.trim(This.oInput.value);
           This.setDefaultText();
           if(value!="")
           {  
              This.requestDate(value);
           }
       }
      this.oInput.onclick = function(ev)
       {  
           var ev = ev || window.event;
           ev.cancelBubble = true;
           This.setDefaultText();
           this.focus();
           return false; 
       }
    },
    requestDate:function(value){
       var This = this;
       $.ajax({
         url:This.url,
         type:This.type,
         data:{
            value:value
         },
         dataType:'json',
         async:false,
         beforeSend:function()
         {
             This.loading();
         },
         success:function(reponse)
         {
            This.reponseData = reponse;
         },
         error:function()
         {
            alert("请求失败!");
         }
       });
    },
    filterDate:function(){
       if((this.reponseData).length>0 && this.resultFlg===false)
       {  
          this.create();
       }else{
          this.remove();
       }
    },
    create:function(){//数据创建li(随着数据需求改变)
      var This = this;
      var iLength = (this.reponseData).length;
      if(this.flg===false)
      {
          this.oContainer = document.createElement('div');
          this.oUl = document.createElement('ul');
          this.oContainer.className = this.dataName;
          //创建li标签生成联动内容
          for(var i=0;i<iLength;i++)
          {
              var oLi = document.createElement('li');
              var oA = document.createElement('a');
              for(var a in (this.reponseData)[i])
              {
                 oA.className = "ab_Text";
                 oA.setAttribute('cid',(this.reponseData)[i]['id']);
                 oA.href=(this.reponseData)[i]['link'] || '###';
                 oA.target = this.targetType;
                 oA.innerHTML = (this.reponseData)[i]['title'];
              }
              oLi.appendChild(oA);
              this.oUl.appendChild(oLi);
          }
          this.oContainer.appendChild(this.oUl);
          document.body.appendChild(this.oContainer);
          this.oContainer.style.position = "absolute";
          this.oContainer.style.width = this.oInput.offsetWidth+'px';
          this.oContainer.style.left = this.oInput.offsetLeft+'px';
          this.oContainer.style.top = this.oInput.offsetTop+this.oInput.offsetHeight+'px';
          this.oContainer.style.zIndex = parseInt(this.getStyle(this.oContainer,'zIndex')) || 9999;
          this.flg = true;
          this.iframLay();
          this.resize();
          this.keyDown(iLength);
          this.hover();
          this.clicks();
      }
    },
    loading:function(){
       var This = this;
       var ie6 = window.ActiveXObject&&navigator.appVersion.indexOf("MSIE 6")>-1;
       if(this.resultFlg === false)
       { 
         this.oLoadinSpan = document.createElement('span');
         this.oLodingDiv = document.createElement('div');
         this.oDiv = document.createElement('div');
         this.oLodingDiv.className = 'loading'+this.inputId;
         this.oDiv.className = 'oloadContent';
         this.oLoadinSpan.className = 'loadingSpan';
         this.oDiv.appendChild(this.oLoadinSpan);
         this.oLodingDiv.appendChild(this.oDiv);
         document.body.appendChild(this.oLodingDiv);
         this.oLodingDiv.style.zIndex = parseInt(this.getStyle(this.oLodingDiv,'zIndex')) || 9999;
         this.oLodingDiv.style.width = this.oInput.offsetWidth+'px';
         this.oLodingDiv.style.position = 'absolute';
         this.oLodingDiv.style.left = this.oInput.offsetLeft+'px';
         this.oLodingDiv.style.top = this.oInput.offsetTop + this.oInput.offsetHeight+'px';
         if(ie6===true)
         {
            this.oLoadFrame = document.createElement('iframe');
            this.oLoadFrame.style.position = 'absolute';
            this.oLoadFrame.style.opacity = 0;
            this.oLoadFrame.style.filter = 'alpha(opacity=0)';
            this.oLoadFrame.style.zIndex = parseInt(this.getStyle(this.oLodingDiv,'zIndex'))-10;
            this.oLoadFrame.style.width = this.oLodingDiv.offsetWidth + 'px';
            this.oLoadFrame.style.height = this.oLodingDiv.offsetHeight + 'px';
            this.oLoadFrame.style.left = this.oLodingDiv.offsetLeft + 'px';
            this.oLoadFrame.style.top = this.oLodingDiv.offsetTop + 'px';
            document.body.appendChild(this.oLoadFrame);
         }
         this.resultFlg = true;
         This.remove();
         this.loading();
       }else{
         This.time1 = setTimeout(function(){
            if(This.oLodingDiv)
            {
               if(This.oLoadFrame)
               {
                  document.body.removeChild(This.oLoadFrame);
               }
               document.body.removeChild(This.oLodingDiv);
               This.oLodingDiv = null;
               this.oLoadFrame = null;
               This.resultFlg = false;
            }
            if(This.resultFlg===false)
            {
               This.filterDate();
            }
         },1200);
       }
    },
    remove:function(){
      if(this.oContainer)
      {  
         document.body.removeChild(this.oContainer);
         this.oContainer = null;
         this.flg = false;
         this.iframBtn = true;
         this.iframLay();
      }
    },
    resize:function(){
      var This = this;
      window.onresize=function()
      {
         if(This.oIframe)
         {
            This.oIframe.style.width = This.oInput.offsetWidth+'px';
            This.oIframe.style.left = This.oInput.offsetLeft+'px';
            This.oIframe.style.top = This.oInput.offsetTop+This.oInput.offsetHeight+'px';
         }
         if(This.oContainer)
         {
           This.oContainer.style.width = This.oInput.offsetWidth+'px';
           This.oContainer.style.left = This.oInput.offsetLeft+'px';
           This.oContainer.style.top = This.oInput.offsetTop+This.oInput.offsetHeight+'px';
         }
      }
    },
    hover:function(){
       var This = this;
       var oUl = this.oContainer.children;
       var oTag = oUl[0].children;
       var length = oTag.length;
       for(var i=0;i<length;i++)
       {
         oTag[i].index = i;
         oTag[i].onmouseover = function()
         {
            for(var j=0;j<length;j++)
            {
              oTag[j].className = "";
            }
            this.className="active";
            This.iNow = this.index;
            This.keyDown(This.iNow);
         } 
       } 
    },
    clicks:function()//点击
    {   
        var This = this;
        var oUl = this.oContainer.children;
        var oTag = this.getByClass(oUl[0],'ab_Text');
        var length = oTag.length;
        for(var k=0;k<length;k++)
        {
           oTag[k].index = k;
           oTag[k].onclick = function(ev)
           {  
               var ev = ev||window.event;
               if(This.clickSelect=='true')
               {
                  var value = This.trim(this.innerHTML);
                  This.oInput.value = value;
                  this.cl = true;
               } 
               This.remove();
               This.iframBtn=true;
               This.iframLay();
               ev.cancelBubble=true;
               if(this.cl===true)
               {
                  return false;
               }  
           }  
        }  
    },
    keyDown:function(iNow){//键盘控制
       var This = this;
       var oUl = this.oContainer.children;
       var oTag = this.getByClass(oUl[0],'ab_Text');
       var length = oTag.length;
       document.onkeydown = function(ev)
       { 
        var ev = ev || window.event;
        if(ev.keyCode===38)
        {
          if(iNow===0)
          {
             iNow=length;
          }      
          (iNow)--; 
          for(var i=0;i<length;i++)
          {
            oTag[i].parentNode.className="item";
          }
          oTag[iNow].parentNode.className="active";
        }
        if(ev.keyCode===40)
        {
          if(iNow>=length-1)
          {
             iNow=-1;
          }
          (iNow)++;
          for(var i=0;i<length;i++)
          {
            oTag[i].parentNode.className="item";
          }
          oTag[iNow].parentNode.className="active";
        }
        if(ev.keyCode===13)//回车敲击提交所选内容
        {
          var obj = oTag[iNow];//记录所敲击的对象
          var objValue = obj.innerHTML;
          if(This.clickSelect=='true')
          {
             var value = This.trim(objValue);
             This.oInput.value = value;
             clearTimeout(This.time);   //解决IE下回车触发
             This.time = null;
          }else{
             obj.click();
          }
          This.remove(); 
          This.iframBtn=true;
          This.iframLay();
          This.oInput.blur();
        }
        if(ev.keyCode===8 && !This.ie===true)//解决ie9下onpropertychange事件触发问题
        { 
          /*var value = This.oInput.value;
          var num = 0;
          var newValue = '';
          if(value.length>0)
          {
            num++;
            value = value.substring(0,value.length-num);
            newValue = value;
            This.requestDate(newValue);//指定为操作this
          }
          This.setDefaultText();*/
        }
         ev.cancelBubble=true;
       }   
    },
    mouseDown:function(){//点击document关闭列表
      var This = this;
      document.onclick = function(ev)
      { 
        var ev = ev || window.event;
        clearTimeout(This.time);
        clearTimeout(This.time1);
        This.time = null;
        This.time1 = null;
        if(SugestMenu.result.length>0)
        {
           for(var i=0;i<SugestMenu.result.length;i++)
           {
               SugestMenu.result[i].remove();
           }
        }
        if(This.oContainer)
        {
            //This.remove();
        }
        if(This.oLodingDiv)
        {
           if(This.oLoadFrame)
           {
              document.body.removeChild(This.oLoadFrame);
           }
           document.body.removeChild(This.oLodingDiv);
           This.oLodingDiv = null;
           this.oLoadFrame = null;
           This.resultFlg = false;
        }
        ev.cancelBubble=true;
        return false;
      }
    },
    iframLay:function()//ie6防止select影响
    {
       if(window.ActiveXObject&&navigator.appVersion.indexOf("MSIE 6")>-1)
       {
         if(this.flg===true&&this.iframBtn===false)
         {
             this.oIframe = document.createElement('iframe');
             this.oIframe.style.filter = 'alpha(opacity=0)';
             this.oIframe.style.opacity = 0;
             this.oIframe.style.position = 'absolute';
             this.oIframe.style.left=this.oContainer.offsetLeft+'px';
             this.oIframe.style.top=this.oContainer.offsetTop+'px';
             this.oIframe.style.width = this.oContainer.offsetWidth+'px';
             this.oIframe.style.height = this.oContainer.offsetHeight+'px';
             this.oIframe.style.border = 0;
             this.oIframe.style.background = "#000";
             this.oIframe.style.zIndex = parseInt(this.getStyle(this.oContainer,'zIndex'))-10;
             document.body.appendChild(this.oIframe);
             this.iframBtn=true;
         }else if(this.flg===false&&this.iframBtn===true){
             if(this.oIframe)
             {
                document.body.removeChild(this.oIframe);
                this.oIframe = null;
             }
             this.iframBtn=false;
         }
       }
    },
    setDefaultText:function()
    {
        var This = this;
        this.oDefault = this.defaultText!='' ? document.createElement("span") : !!0;
        if(!!this.oDefault)
        {  
           if(this.defaultBtn===false)
           {
             this.oDefault.innerHTML = this.defaultText;
             this.oDefault.className = "defaultText_"+this.inputId;
             this.oDefault.id = "defaultText_"+this.inputId;
             document.body.appendChild(this.oDefault);
             this.oDefault.style.position = "absolute";
             //this.oDefault.style.zIndex = 0;
             this.oDefault.style.left = this.oInput.offsetLeft+'px';
             this.oDefault.style.top = (this.oInput.offsetTop)+(this.oInput.offsetHeight-this.oDefault.offsetHeight)/2+'px';
             this.defaultBtn = true;
           }else if(this.defaultBtn===true && this.trim(this.oInput.value)!=""){
             //document.getElementById("defaultText_"+this.inputId).style.zIndex= 0;
             document.getElementById("defaultText_"+this.inputId).style.display = "none";
           }else{
             //document.getElementById("defaultText_"+this.inputId).style.zIndex= 0;
             document.getElementById("defaultText_"+this.inputId).style.display = "block";
           }
           this.oDefault.onclick = function()
           {
              This.oInput.focus();
           }
        }
    },
    getStyle:function(obj,attr)//样式获取
    {  
        return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj,false)[attr];
    },
    getByClass:function(oParent,sClass)
    {
       var result = [];
       var reg = eval('/\\b'+sClass+'\\b/g');
       var allD = oParent.getElementsByTagName("*");
       for(var i=0;i<allD.length;i++)
       {
          if(reg.test(allD[i].className))
          {  
             result.push(allD[i]);
          }
       }
       return result;
    },
    trim:function(value)
    {
        var reg = /(^\s*)|(\s*$)/g;
        var result = value.replace(reg,'');
        return result;
    }
}