/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-06-6
 * Time: 16:30:00
 * Contact: tmwoman@yeah.net
 */
SugestEmail.storageArr = [];
function SugestEmail(Parameter)
{
  this.result = []; 
  this.oContainer = null;//容器对象
  this.oUl = null;//模拟UL对象
  this.oIframe = null;//模拟框架对象
  this.reponseData = null;//数据存储对象
  this.flg = false;//是否生成了数据列表，默认false
  this.iframBtn = false;//是否生成的框架，默认false
  this.defaultBtn = false;//是否创建默认值,默认false
  this.inputId = Parameter.inputId || '';//触发联想对象
  //this.data = Parameter.data || '';//传入数据
  this.defaultText = Parameter.defaultText || '';
  this.url = Parameter.url +'?t=' + Math.random() || '';//ajax请求数据地址
  this.type = (Parameter.type).toLowerCase() || 'get';
  this.ie = !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1);
  if(this.input==='' || this.url==='')
  {
       alert("请填写正确的参数");
       return false;
  }
  this.oInput = document.getElementById(this.inputId);
  this.oInput ? (this.init()) : 0;
  this.dataName = this.oInput.getAttribute("listClassName") || this.inputId+'_list';//生成容器添加的class名
  SugestEmail.storageArr.push(this);
}
SugestEmail.prototype = {
    init:function(){//初始化
       var This = this;
       this.oInput.value = '';//防止刷新导入缓存数据
       this.setDefaultText();
       this.requestDate();
       if(this.ie)
       {
         this.oInput.onpropertychange = function(ev){
            This.setDefaultText();
            This.filterDate();
         };  
       }else{
         this.oInput.oninput = function(){
            This.setDefaultText();
            This.filterDate();
         };
       }
       this.oInput.onblur=function()
       {
            This.mouseDown();
       }
       this.oInput.onfocus=function()
       {
           This.setDefaultText();
           This.filterDate();
       }
       this.oInput.onclick = function(ev)
       { 
           var ev = ev || window.event;
           ev.cancelBubble = true;
           This.setDefaultText();
           This.filterDate();
           this.focus();
           return false;
       }
    },
    requestDate:function(){
       var This = this;
       $.ajax({
         url:This.url,
         type:This.type,
         data:'',
         dataType:'json',
         async:false,
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
       var value = this.trim(this.oInput.value);
       var reg0 = /@[0-9a-z]+\.[a-zA-Z]{2,4}$/g;
       value!="" ? (this.setDefaultText()) : !!0;
       if(value.indexOf('@')!=-1)
       {  
          for(var i=0;i<(this.reponseData).length;i++)
          {
              if(reg0.test((this.reponseData)[i])) 
              {
                  this.result.push((this.reponseData)[i]);
              }
          }
       }else{
          this.result.length=0;
       }
       if((this.result).length>0)
       {
          this.create();
       }else{
          /*var This = this;
          document.onkeydown = function(ev)
          {
             var ev = ev || window.event;
             if(ev.keyCode===8)
             {
                //alert(this.oInput.value);
                //This.setDefaultText();
             }
          }*/
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
              oLi.innerHTML = (this.reponseData)[i];
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
          This.keyDown(iLength);
          this.hover();
          this.clicks();
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
        var oTag = oUl[0].children;
        var length = oTag.length;
        for(var k=0;k<length;k++)
        {
           oTag[k].index = k;
           oTag[k].onclick = function(ev)
           {  
               var ev = ev||window.event;
               if(This.trim(This.oInput.value).indexOf('@')===This.trim(This.oInput.value).length-1 && (this.innerHTML).indexOf('@')===0)
               {
                  This.oInput.value = This.trim(This.oInput.value)+(this.innerHTML).substring(1);
               }else{
                  This.oInput.value = this.innerHTML;
               }
               This.remove();
               This.iframBtn=true;
               This.iframLay();
               ev.cancelBubble=true;   
           }  
        }  
    },
    keyDown:function(iNow){//键盘控制
       var This = this;
       var oUl = this.oContainer.children;
       var oTag = oUl[0].children;
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
            oTag[i].className="item";
          }
          oTag[iNow].className="active";
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
            oTag[i].className="item";
          }
          oTag[iNow].className="active";
        }
        if(ev.keyCode===13)        //回车敲击提交所选内容
        {
          var olderValue = This.oInput.value;   //记录当前INPUT里内容
          var obj = oTag[iNow];      //记录所敲击的对象
          var objValue = obj.innerHTML;
          if(objValue!=''||objValue!=' '||objValue!=null)
          {   
            if(olderValue.indexOf('@')!=-1 && objValue.indexOf('@')>0)
            {
                This.oInput.value = oTag[iNow].innerHTML;
            }else if(olderValue.indexOf('@')===olderValue.length-1 && objValue.indexOf('@')===0)
            { 
                This.oInput.value = olderValue+objValue.substring(1);
            }else{
                This.oInput.value = oTag[iNow].innerHTML;
            }
          }
          This.remove(); 
          This.iframBtn=true;
          This.iframLay();
          This.oInput.blur();
        }
        if(ev.keyCode===8 && This.ie===true)//解决ie9下onpropertychange事件触发问题
        { 
          /*var value = This.oInput.value;
          var num = 0;
          var newValue = '';
          if(value.length>0)
          {
            num++;
            value = value.substring(0,value.length-num);
            newValue = value;
            This.oInput.value = newValue;
          }

          This.setDefaultText();
          This.filterDate();
          return false;*/
        }
         ev.cancelBubble=true;
       }   
    },
    mouseDown:function(){//点击document关闭列表
      var This = this;
      document.onclick = function(ev)
      {  
        var ev = ev || window.event;
        if(This.oContainer)
        {
            This.remove();
            This.flg=false;
            this.iframBtn=true;
            This.iframLay();
        }
        if(SugestEmail.storageArr.length>0)
        {
           for(var i=0;i<SugestEmail.storageArr.length;i++)
           {
               SugestEmail.storageArr[i].remove();
           }
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
             this.oIframe.style.left=this.oInput.offsetLeft+'px';
             this.oIframe.style.top=this.oInput.offsetTop+this.oInput.offsetHeight+'px';
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
             this.oDefault.style.left = this.oInput.offsetLeft+'px';
             this.oDefault.style.top = (this.oInput.offsetTop)+(this.oInput.offsetHeight-this.oDefault.offsetHeight)/2+'px';
             this.defaultBtn = true;
           }else if(this.defaultBtn===true && this.trim(this.oInput.value)!=""){
             document.getElementById("defaultText_"+this.inputId).style.display = "none";
           }else{
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
    trim:function(value)
    {
        var reg = /(^\s*)|(\s*$)/g;
        var result = value.replace(reg,'');
        return result;
    }
}