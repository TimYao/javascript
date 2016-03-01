/**
 * Created by timYao on 2016-2-15.
 *
 * canvas实现头部底部随机下落和升起小点
 *
 *
 * 起泡
 */
(function($){
    $.fn.star_back_points=function(p){
        var p = p || {},
            canvasObj = $(this),
            canvas = canvasObj[0].getContext('2d'),
            counts = parseFloat(p.counts,10) || 400,
            time = p.time || 50,
            directMove = (p.directMove).toLowerCase() || 'down',
            rangeHeight = parseFloat(p.rangeHeight,10) || 60,
            rangeHeightDiff = parseFloat(p.rangeHeightDiff,10) || 40,
            rangeWidthDiff = parseFloat(p.rangeWidthDiff,10) || 100,
            colors = p.colors || ["#177b6c"],
            pro = parseFloat(p.pro) || 10,
            flg = false,
            pointStores = [];
        w = parseFloat($(window).width(),10);
        canvasObj[0].t = null;
        canvasObj.attr({"width":w,"height":rangeHeight});
        canvas.fillRect(0,0,w,rangeHeight); //防止多次调用，清除画布
        setInitpoint();
        //初始化点位置
        function setInitpoint()
        {
            canvas.clearRect(0,0,w,rangeHeight);
            for(var i=0;i<counts;i++)
            {
                var x = (Math.random()*w)-rangeWidthDiff;
                var y = (Math.random()*rangeHeight)-rangeHeightDiff;
                var r = ((Math.random()*10)/10);
                //方向控制
                directMove ==="down" ? (y=y*1): directMove==="top" ? (y=Math.abs(y)) : (y=y*1);
                pointStores[i]=[x,y,r];
            }
            clearInterval(canvasObj[0].t);
            canvasObj[0].t = null;
            canvasObj[0].t = setInterval(function(){
                disPoints();
            },50);
        };
        //随机点位移改变
        function disPoints()
        {
            var randNums = [],
                step= 0,
                points,
                direc = 1,
                x, y,r;
            for(var k=0;k<counts;k++)
            {
                randNums[k] = Math.floor(Math.random()*(pointStores.length-1));
            }
            if(pointStores.length>0)
            {
                flg=true;
            }
            if(flg)
            {
                for(var i=0;i<counts;i++){
                    for(var m=0;m<randNums.length;m++)
                    {
                        if(i==randNums[m])
                        {
                            points = pointStores[i];
                            step = ((points[1]+4)-points[1])/pro; //控制步长速度
                            x = points[0];
                            directMove=="down" ? (y = points[1]+step,direc=1) : directMove=="top" ? (y = points[1]-step,direc=-1) : (y = points[1]+step,direc=1);
                            r = points[2];
                            //向下掉落控制
                            if(directMove=="down")
                            {
                                if(y>(rangeHeight*direc))
                                {
                                    y = (Math.random()*rangeHeight)-(rangeHeightDiff);
                                }
                            }
                            //向上飘起控制
                            if(directMove=="top")
                            {
                                if(y<(rangeHeight*direc))
                                {
                                    y = Math.abs((Math.random()*rangeHeight)-(rangeHeightDiff));
                                }
                            }
                            pointStores[i] = [x,y,r];
                        }
                    }

                }

            }
            drawPoints(pointStores);
        };
        //开始画点
        function drawPoints(pointStores)
        {
            var x,y,r;
            canvas.clearRect(0,0,w,rangeHeight);
            canvas.beginPath();
            canvas.fillStyle ="#177b6c";
            for(var i=0;i<counts;i++)
            {
                x = pointStores[i][0];
                y = pointStores[i][1];
                r = pointStores[i][2];
                canvas.arc(x,y,r,0,Math.PI*2,true);
                canvas.closePath();
                canvas.fill();
            }
        };
    }
})(jQuery);