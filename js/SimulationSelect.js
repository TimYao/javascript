/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-05-26
 * Time: 16:28:00
 * Contact: tmwoman@yeah.net
 */
function SimulationSelect(OPARME)
{
    var boxId = OPARME.id || '',
        evt = OPARME.evt || 'click',
        dateId = OPARME.dateId || 'k_id',
        defaultText = OPARME.defaultText || '',
    defaultWidth = OPARME.defaultWidth ? (Number(OPARME.defaultWidth)===true ? Number(OPARME.defaultWidth): (OPARME.defaultWidth).toLowerCase()):'normal',
        cssClass = OPARME.cssClass || {borderCss:'',btnIconClass:'',hoverClass:''},
        callBack = OPARME.callBack || function(){},
        borderCss = cssClass.borderCss || '',
        btnIconClass = cssClass.btnIconClass || '',
        hoverClass = cssClass.hoverClass || '',
        url = OPARME.url || '',
        type = (OPARME.type)?(OPARME.type).toLowerCase() || 'get':'',
        data = OPARME.data || '',
        callBack = OPARME.callBack || function(){},
        zIndex = cssClass.zIndex || 1,
        btnSpace = 25,                  
        menuBox,
        flgIndex=false;
    if(boxId==="")
    {
        alert("请填写容器ID");
        return false;
    }
    menuBox = document.getElementById(boxId);
    if(!menuBox || !evt)
    {
        return false;
    }
    var oMenuBox = menuBox.children,
        length = oMenuBox.length,
        aUl = menuBox.getElementsByTagName('ul'),
        timer1 = null,
        a_ul = [],
        oMe = (getByClass(document,'menBox'));//修改document点击关闭所有UL列表 

    for(var j=0;j<oMe.length;j++)
    {
        a_ul.push(oMe[j].getElementsByTagName('ul'));
    }

    for(var i=0;i<length;i++)   //默认多级非联动菜单
    {
        displayBox(oMenuBox[i]);
    } 
    
    function displayBox(obj)
    { 
        var oMeth = obj.children,            //获得容器下一级孩子
            oList = oMeth[1],                //获得一级孩子下的UL列表
            aSub = oMeth[0].children,        //获得一级孩子下的容器
            oInput = aSub[0],                //获得input
              oText = aSub[1],                 //获得模拟SPAN
            oTag = aSub[2],                  //获得事件触发按钮
            aList = oList.children,          //获得LI对象
              iLength = aList.length,          //记录Ul下Li长度
            maxArr = [];  
        
        oMeth[0].style.borderBottom = borderCss;
        //添加事件
        if(evt === "mouseover")
        {   
            var oTagObj = oTag.parentNode.parentNode;
            oTagObj.onmouseover = function(ev)
            {
                 clearTimeout(timer1);
                 oList.style.display = "block";
                 if(zIndex<=1)
                 {
                    zIndex++;
                 }
                oList.style.zIndex = zIndex;
                oMeth[0].style.zIndex = zIndex;
                oMeth[0].parentNode.style.zIndex = zIndex;
                oMeth[0].style.borderBottom="none";
                oTag.className = btnIconClass;
                 (ev||window.event).cancelBubble = true;
            }
            oTagObj.onmouseout = function()
            {
                timer1 = setTimeout(function(){
                    oList.style.display = "none";
                    oMeth[0].style.borderBottom = borderCss;
                    oTag.className = '';
                },300);
                oList.style.zIndex = 1;
                oMeth[0].style.zIndex = 1;
                oMeth[0].parentNode.style.zIndex = 1;
            }
        }else{
            obj["on"+evt]=oTag["on"+evt]=function(ev)
            {
               var tag = getStyle(oList,"display");
               if(tag==="none")
               {
                   oList.style.display = "block";
                  if(zIndex<=1)
                  {
                     zIndex++;
                  }
                  oList.style.zIndex = zIndex;
                  oMeth[0].style.zIndex = zIndex;
                  oMeth[0].parentNode.style.zIndex = zIndex;
                  oMeth[0].style.borderBottom="none";
                  oTag.className = btnIconClass;
               }else{
                    oList.style.display = "none";
                  oList.style.zIndex = 1;
                  oMeth[0].style.zIndex = 1;
                  oMeth[0].parentNode.style.zIndex = 1;
                  oMeth[0].style.borderBottom=borderCss;
                  oTag.className = '';
               }
               (ev||window.event).cancelBubble = true;
            }
        }
        //列表添加点击事件
        for(var i=0;i<iLength;i++)
        {
           if(defaultWidth==="max")
           {  
                aList[i].style.whiteSpace = "nowrap";
           }
           aList[i].index = i;
           aList[i].onclick = function(ev)
           {  
            var oTxt = (this.children)[0].innerHTML,
                kId = (this.children)[0].getAttribute(dateId),
                this_parent = this.parentNode.parentNode.parentNode;
                for(var i=0;i<iLength;i++)
                {
                   (aList[i].children)[0].setAttribute("index",'');
                }

                (this.children)[0].setAttribute("index",1);
                oText.innerHTML = oTxt;
                oText.setAttribute(dateId,kId);
                oInput.value = kId;
                oList.style.display = "none";
                oList.style.zIndex = 1;
                oMeth[0].style.borderBottom=borderCss;
                changeBox(obj);   //实现模拟select变换
                //若有AJAX请求
                if(url!='' && type!='')
                {   
                    if(typeof data==='object' && !data.length)
                    {
                       var dates = {};
                       dates[dateId] = kId;
                       for(var attr in data)
                       {
                           dates[attr] = data[attr];
                       } 
                    }else if(typeof data==='string'){
                       var dates = '';
                       dates = dateId+'='+kId+'&'+data;
                    }else{
                       alert("请输入json格式对象");
                       return false;
                    }
                    $.ajax({
                       url:url,
                       type:type,
                       data:dates,
                       async:true,
                       success:function(reponse)
                       {
                           callBack(reponse);
                       },
                       error:function(){

                       }
                    });
                }
                (ev||window.event).cancelBubble = true;
              return false;
           }
           //若是li下石A标签时去除虚线框问题
           var oflu = (aList[i].children)[0];
           oflu.onfocus=function()
           {
             this.blur(); 
           }
           //hover效果
           alistHover(aList[i]);
        }
        //默认触发
        changeBox(obj);
        function changeBox(obj)
        {   
            var ob = null;
            if(maxArr.length<=0)
            {
               maxArr.push(oList.offsetWidth);
            }
           
            oList.oWidth = oList.offsetWidth;

                for(var i=0;i<iLength;i++)
                {
                    if((aList[i].children)[0].getAttribute("index")>=1)
                    {
                         flgIndex = true;
                         ob = (aList[i].children)[0];
                                   break;
                    }else{
                                   flgIndex = false;
                    }
                }
                if(flgIndex===true)    //当前显示判断
                  {
                       oText.innerHTML = ob.innerHTML;
                       oText.setAttribute(dateId,ob.getAttribute(dateId));
                       oInput.value= ob.getAttribute(dateId); 
                  }else{
                       if(defaultText!="")
                       {
                           oText.innerHTML = defaultText;
                           oText.setAttribute(dateId,"-1");
                           oInput.value= "-1";
                       }else{
                           oText.innerHTML = (aList[0].children)[0].innerHTML;
                           oText.setAttribute(dateId,(aList[0].children)[0].getAttribute(dateId));
                           oInput.value= (aList[0].children)[0].getAttribute(dateId);
                       }
                  }
            oList.style.display = "none";
            oList.style.zIndex = 1; 
            if(defaultWidth==="max")
            { 
               if(maxArr.length>0)
               { 
                     for(var m=0;m<maxArr.length;m++)
                    {
                         oMeth[0].style.width = maxArr[m]+btnSpace+'px';
                         oList.style.width = maxArr[m]+btnSpace+'px';
                    } 
               }else{
                    oMeth[0].style.width = oList.oWidth+btnSpace+'px';
                    oList.style.width = oList.oWidth+btnSpace+'px';
               } 
            }else if(defaultWidth==="normal")
            {
                 oList.style.width=oMeth[0].offsetWidth+'px';
            }else if(Number(defaultWidth)>0)
            {
                 oList.style.width=oMeth[0].style.width=Number(defaultWidth)+'px';
            }
        //改变对应整个容器的WIDTH，达到适应标准      
        }
       //点击文档对象关闭所有列表
       document.onclick = function(ev)
       {
          for(var i=0;i<(a_ul).length;i++)
          { 
            for(var j=0;j<(a_ul)[i].length;j++)
            {
                  a_ul[i][j].style.display = "none";
                  (a_ul[i][j].parentNode.children)[0].style.borderBottom = borderCss;
                  (a_ul[i][j].parentNode.children)[1].className = '';
            }
          }
          (ev || window.event).cancelBubble = true; 
       }
       //alistHover  列表hover效果
       function alistHover(obj)
       {
           obj.onmouseover = function()
           {
               this.className = hoverClass;
           }
           obj.onmouseout = function()
           {  
               this.className = "";
           }
       }
    }
    /*公用函数获取CSS样式*/
    function getStyle(obj,attr)
    {
    return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj,false)[attr];
    }
    function getByClass(obj,sClass)
    { 
     var re = eval("/\\b"+sClass+"\\b/g");
     var result = [];
     if(obj.length>0)
     { 
       var length = obj.length;
     var aobj = obj;   
     }else{
         var aobj = obj.getElementsByTagName('*');
       var length = aobj.length;
     }
     for(var i=0;i<length;i++)
     {   
       var classN = aobj[i].className;
       if(re.test(classN)===true)
       {   
           result.push(aobj[i]);
       }
     }
     return result;
    }
}