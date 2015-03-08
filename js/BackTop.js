/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-06-6
 * Time: 16:30:00
 * Contact: tmwoman@yeah.net
 */
MoveSlider.allObj = [];
function MoveSlider(Parm)
{
    this.id = Parm.id || '';
    this.reg = /MSIE 6/ig;
    this.hideHeight = Parm.hideHeight || 200;
    this.isHideHeight = Parm.isHideHeight || false; //是否指定影藏
    this.isClick = Parm.isClick || false; //是否可点击，针对返回按钮
    this.isSport = Parm.isSport || false; //是否有运动效果
    this.btnShowHeight = parseInt(Parm.showPosition) || 0;
    this.isIE6 = this.reg.test(window.navigator.userAgent);
    this.oTop = this.id?(document.getElementById(this.id)?document.getElementById(this.id):!!0):!!0;
    this.oTop.iframeBtn = false; 
    this.oTop?(this.initMove()):!!0;
    this.btn = true;
    this.zIndex = 999;
}    
MoveSlider.prototype = {
  ie6:function(obj)
  {  
     var This = this;
     obj.style.top = this.veiHeight()+this.scrollY()-this.btnShowHeight-obj.offsetHeight+'px';
     obj.style.zIndex = parseInt(this.getStyle(obj,"zIndex")) || this.zIndex;
     this.setIframe(obj);
     this.addHiden(obj);
  },
  standard:function(obj)
  {
    this.oTop.style.top = this.veiHeight()-this.btnShowHeight-this.oTop.offsetHeight+'px';
    //初始判断
    this.addHiden(obj);
  },
  addHiden:function(obj)
  {
    var This = this;
    if(MoveSlider.allObj.length>0)
    {
      for(var j=0;j<MoveSlider.allObj.length;j++)
      {
         if(MoveSlider.allObj[j].isHideHeight)
         {
            if(this.scrollY()>MoveSlider.allObj[j].hideHeight)
            {
              MoveSlider.allObj[j].oTop.style.display="block";
            }else{
              MoveSlider.allObj[j].oTop.style.display="none"; 
            }
         }else{
            MoveSlider.allObj[j].oTop.style.display="block";
         }
      }
    }
    if(this.isIE6)
    {
      if(this.isHideHeight)
      {
         if(this.scrollY()>this.hideHeight)
         {
            this.oTop.style.display="block";
         }else{
            this.oTop.style.display="none"; 
         }
      }else{
         this.oTop.style.display="block";
      }
      window.onscroll = function()
      { 
        if(MoveSlider.allObj.length>0)
        {
           for(var i=0;i<MoveSlider.allObj.length;i++)
           {
              if(MoveSlider.allObj[i].isHideHeight)
              {
                  if(MoveSlider.allObj[i].scrollY()>MoveSlider.allObj[i].hideHeight)
                  {
                    MoveSlider.allObj[i].oTop.style.display="block";
                    MoveSlider.allObj[i].oTop.oIframe.style.display = "block";
                    MoveSlider.allObj[i].oTop.oIframe.style.top = MoveSlider.allObj[i].oTop.style.top = MoveSlider.allObj[i].veiHeight()+MoveSlider.allObj[i].scrollY()-MoveSlider.allObj[i].btnShowHeight-MoveSlider.allObj[i].oTop.offsetHeight+'px';
                  }else{
                    MoveSlider.allObj[i].oTop.style.display="none";
                    MoveSlider.allObj[i].oTop.oIframe.style.display = "none"; 
                  }
              }else{
                  MoveSlider.allObj[i].oTop.style.display="block";
                  MoveSlider.allObj[i].oTop.oIframe.style.top=MoveSlider.allObj[i].oTop.style.top = MoveSlider.allObj[i].veiHeight()+MoveSlider.allObj[i].scrollY()-MoveSlider.allObj[i].btnShowHeight-MoveSlider.allObj[i].oTop.offsetHeight+'px';
              }
           }
        }
      }
    }else{
      window.onscroll = function()
      {
        for(var i=0;i<MoveSlider.allObj.length;i++)
        {
           if(MoveSlider.allObj[i].isHideHeight)
           { 
              if(This.scrollY()>MoveSlider.allObj[i].hideHeight)
              {
                MoveSlider.allObj[i].oTop.style.display="block";
              }else{
                MoveSlider.allObj[i].oTop.style.display="none"; 
              }
           }else{
               MoveSlider.allObj[i].oTop.style.display="block";
           }
        }
      }
    }
  },
  addClick:function()
  {
    var This = this;
    this.oTop.onclick = function()
    { 
       if(This.isSport)
       {
          This.startMove(This.oTop,0);
       }else{
          document.documentElement.scrollTop = document.body.scrollTop = 0 ;
       } 
    }
  },
  startMove:function(obj,iTargent)
  {
     var This = this;
     clearInterval(obj.timer);
     obj.timer = setInterval(function(){
        var iCur = document.documentElement.scrollTop||document.body.scrollTop;
        var iSpeed = (iTargent-iCur)/8;
        iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
        if(iCur==iTargent)
        {
          clearInterval(obj.timer);
          This.btn = true;
        }else{
          document.documentElement.scrollTop = document.body.scrollTop = iCur+ iSpeed;
          if(This.isIE6)
          {
            obj.oIframe.style.top=obj.style.top = This.veiHeight()+(iCur+iSpeed)-This.btnShowHeight-obj.offsetHeight+'px';
          }
          This.addHiden(obj);
          This.btn = false;  
        }
        window.onscroll = function()
        {  
           if(This.btn)
           {
              clearInterval(obj.timer);
              if(This.isIE6===true)
              {
                 obj.iframeBtn = true;
                 This.ie6(obj); 
              }
              This.addHiden(obj);
           }else{
              This.btn = true;
              if(This.isIE6===true)
              {  
                 This.scrollChange(This);
              } 
           }
        }
     },30);
  },
  veiHeight:function()
  {  
     return document.documentElement.clientHeight;
  },
  veiWidth:function()
  {
     return document.documentElement.clientWidth;
  },
  scrollHeight:function()
  {
    return Math.max(document.documentElement.clientHeight,document.body.offsetHeight); 
  },
  scrollY:function()
  {
    return document.documentElement.scrollTop || document.body.scrollTop;  
  },
  resizeWidow:function()
  {
    var This = this;
    if(MoveSlider.allObj.length>0)
    {
      window.onresize = function()
      {
        for(var i=0;i<MoveSlider.allObj.length;i++)
        {
           if(This.isIE6===true)
           {
             MoveSlider.allObj[i].ie6(MoveSlider.allObj[i].oTop); 
           }else{
             MoveSlider.allObj[i].standard(MoveSlider.allObj[i].oTop);
           }
        }
      }
    }
  },
  scrollChange:function(obj)
  {
     for(var i=0;i<MoveSlider.allObj.length;i++)
     { 
        if(MoveSlider.allObj[i]!=obj)
        {
            MoveSlider.allObj[i].oTop.iframeBtn = true;
            MoveSlider.allObj[i].ie6(MoveSlider.allObj[i].oTop); 
        }
     }
  },
  setIframe:function(obj)
  {
    if(obj.iframeBtn===false)
    {
     obj.oIframe = document.createElement('iframe');
     obj.oIframe.style.filter = "alpha(opacity=0)";
     obj.oIframe.style.position = "absolute";
     obj.oIframe.id = this.id+'_iframe';
     obj.oIframe.style.zIndex = (parseInt(this.getStyle(obj,"zIndex"))-2) || this.zIndex;
     obj.oIframe.style.left = obj.offsetLeft + "px";
     obj.oIframe.style.top = obj.offsetTop + "px";
     obj.oIframe.style.width = obj.offsetWidth + "px";
     obj.oIframe.style.height = obj.offsetHeight + "px";
     document.body.appendChild(obj.oIframe);
     if(this.isHideHeight)
     {
        obj.oIframe.style.display = "none";
     }
    }else{

    }
  },
  getStyle:function(obj,attr)
  {
     return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj)[attr];
  },
  initMove:function()
  { 
    MoveSlider.allObj.push(this);
    if(this.isIE6===true)
    {
      this.ie6(this.oTop); 
    }else{
      this.standard(this.oTop);
    }
    if(this.isClick)
    {
      this.addClick(this.oTop,this.isSport);
    }
    this.resizeWidow();
  }
}
