/*
 * Created with Sublime Text 2.0
 * User: TimYao
 * Date: 2014-05-26
 * Time: 16:28:00
 * Contact: tmwoman@yeah.net
 */
//联动地区、城市
$(function(){
    (function(){
       var mainSelect = $('.mulitipart').find('.selectOp');
       var oParentObj = $('.mulitipart');
       var defaultV0 = "请选择城市";
       var defaultV1 = "请选择地区";
       var allSelect = null;
       for(var q=0;q<mainSelect.length;q++)
       {
           $(mainSelect[q])[0].istart=false;
       }
       if(mainSelect && mainSelect.length>0)
       { 
           mainSelect.find("option").eq(0).attr("selected",true);
           $(document).on('change','.mulitipart .selectOp',function(){
              var This = $(this);
              $(this)[0].istart = false;
              var selecOptiontId = $(this).find("option:selected").attr('data_id');
              var data_main = (parseInt($(this).attr('data_main'),10))+1;
              if((parseInt($(this).attr('data_main'),10))!=0)
              {    
                   var selectValue = $(this).find("option:selected").val();
              }else{
                   var selectValue = undefined;  
              }
              if(!!selecOptiontId && parseInt($(this).find('select').val())!==-1)
              {  
                   $.ajax({
                      url:'../ajax/select01.php',
                      type:'get',
                      dataType:'json',
                      async:true,
                      data:{
                         id:selecOptiontId
                      },
                      beforeSend:function(response)
                      {
                          if(This[0].istart)
                          {
                             return;
                          }
                      },
                      success:function(response)
                      {
                         for(var a in response)
                         {
                             creatSelect(oParentObj,data_main,a,response[a],selectValue); 
                         } 
                         This[0].istart=true;
                      },
                      error:function(err)
                      {
                         alert('服务器返回失败!');
                      }
                   });
              }else if(parseInt($(this).find("select").val())===-1){
                 $(this).nextAll('.selectOp').remove();
                 var mainSelectall = $('.mulitipart').find('.selectOp');
                 for(var q=0;q<mainSelectall.length;q++)
                 {
                     $(mainSelectall[q])[0].istart=false;
                 }
              }
           });   
       }
       function creatSelect(oParentObj,data_main,parentId,obj,selectValue)
       { 
          var allSelectOp = $('.mulitipart').find('.selectOp');
          var flg = false;
          var n = 0;
          var changObj = null;
           
          for(var i=0;i<allSelectOp.length;i++)
          {
               var data_main_p = parseInt($(allSelectOp[i]).attr("data_main"),10);
               if(data_main_p===data_main)
               { 
                  flg = true;
                  n = i;
                  changObj = $(allSelectOp[i]);
                  break;
               }
          }
          //没有生成
          if(flg===false)
          { 
              var selectOp = $("<div class='selectOp' data_main="+(data_main)+"></div>");
              var selects = $("<select></select>");
              selectOp[0].istart = false;
              if(data_main===1)
              { 
                 //添加验证
                 selects.attr("isVerliate","");
                 selects.attr("verliateRule","[{empty:true,text:['选择城市']}]");
                  
                  var kvalue = -1;
                  var selecText = defaultV0;
              }
              if(data_main===2)
              { 
                 //添加验证
                 selects.attr("isVerliate","");
                 selects.attr("verliateRule","[{empty:true,text:['选择地区']}]");
                 var kvalue = -1;
                 var selecText = defaultV1;
              }
              selects.append($("<option selected=true value="+kvalue+">"+selecText+"</option>"));  
              for(var b in obj)
              {
                   var op = $("<option data_id="+b+" value="+obj[b]+">"+obj[b]+"</option>");
                   selects.append(op);
              }
              selectOp.append(selects);
              oParentObj.append(selectOp);
              selects.blur();//触发验证
              if(selectValue!=undefined)
              {
                 selectOp.prev(".selectOp").find('select').val(selectValue);
              }
          }else{ 
          //生成
             if(changObj && changObj.length>0)
             {   
                 var changSelect = changObj.find('select');
                 var changOp = changSelect.find('option');
                 changSelect.empty();
                 if(data_main===1)
                 {
                     var kvalue = -1;
                     var selecText = defaultV0;
                 }
                 if(data_main===2)
                 {
                     var kvalue = -1;
                     var selecText = defaultV1;
                 }
                 changSelect.append($("<option selected=true value="+kvalue+">"+selecText+"</option>"));
                 for(var c in obj)
                 {
                     var op0 = $("<option data_id="+c+" value="+obj[c]+">"+obj[c]+"</option>");
                     changSelect.append(op0);
                 }
                 changObj.nextAll('.selectOp').remove();
             }

          }  
       }
    })();
});