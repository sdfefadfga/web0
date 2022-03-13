function trim(value){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string'){
        return value;
    }else{
        return value.replace(/(^\s*)|(\s*$)/g, ''); 
    }
}



function ltrim(value){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string'){
        return value;
    }else{
        return value.replace(/(^\s*)/g, '');
    }
}


    
function rtrim(value){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string'){
        return value;
    }else{
        return value.replace(/(\s*$)/g, '');
    }
}



function right(value,nums){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string' && typeof(value)!='number'){
        return value;
    }else{
        value = value.toString();
        return value.substr(value.length-nums);
    }
}


    
function left(value,nums){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string' && typeof(value)!='number'){
        return value;
    }else{
        value = value.toString();
        return value.substr(0, nums);
    }
}
    


function mid(value, startPoint, endPoint){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string' && typeof(value)!='number'){
        return value;
    }else{
        value = value.toString();
        return value.substring(startPoint,endPoint);
    }
}
    


function replaceAll(value, string, reString){
    if(typeof(value)=='undefined'){
        return '';
    }else if(typeof(value)!='string' && typeof(value)!='number'){
        return value;
    }else{
        value     = value.toString();
        var reg = new RegExp(string, 'g');
        return value.replace(reg, reString);
    }
}



function formatCurrency(num){
    num = num.toString().replace(/\$|\,/g, '');
    if(isNaN(num))
    num   = '0';
    sign  = (num == (num = Math.abs(num)));
    num   = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num   = Math.floor(num/100).toString();
    if(cents<10){
        cents = '0' + cents;
    }
    for(var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}
    


function isNumber(num){
    if(typeof(num) == 'undefined')                 return false;
    if(typeof(num) == 'number')                  return true;
    if(num.trim()  == '' && num.trim()!='0')     return false;
    return isNaN(num) ? false : true;
}



/*
    checkNumber(num,t)
    说明：    检查数字类型
    参数：
            num        待检查的数值
            t        检查类型
                    t        不设置时表示检查是否是数字类型
                    t = 0    是否是:  >0的数
                    t = 1    是否是： >=0的数
                    t = 2    是否是： >=0的整数
                    t = 3    是否是： <0的数
                    t = 4    是否是： <=0的数
                    t = 5    是否是： <=0的整数
                    t = 6    是否是： 正整数，不含0
                    t = 7    是否是： 负整数，不含0
                    t = 8    是否是： 正浮点数
                    t = 9    是否是： 负浮点数
*/
function checkNumber(num, t){
    if(!isNumber(num)) return false;
    num = parseFloat(num); // 可以过滤掉格式： 12. 后面的.号使其变成格式正确的数值
    switch(t){
        case 0://是否是: >0的数
            return (num<=0)?false:true;
            break;
        case 1://是否是： >=0的数
            return (num<0)?false:true;
            break;
        case 2://是否是： >=0的整数
            if(num==0) return true;
            return checkNumber(num,6);
             break;
        case 3://是否是： <0的数
            return (num>=0)?false:true;
            break;
        case 4://是否是： <=0的数
            return (num>0)?false:true;
            break;
        case 5://是否是：<=0的整数
            if(num==0) return true;
            return checkNumber(num,7);
            break;
        case 6://是否是： 正整数
            var r =/^[0-9]*[1-9][0-9]*$/
            return r.test(num);
            break;
        case 7://是否是： 负整数
            if(!checkNumber(num,3)) return false;
            num = -1*num;
            var r =/^[0-9]*[1-9][0-9]*$/
            return r.test(num);
            break;
        case 8://是否是： 正浮点数
            if(!checkNumber(num,0)) return false; 
            return !checkNumber(num,6);//
            break;
        case 9://是否是： 负浮点数
            if(!checkNumber(num,3)) return false;
            return !checkNumber(num,7);
            break;
    }
    return true;
}



/*
* 函数：
*     loadCSS(paths, callback, refresh)
*     loadJS(paths, callback, refresh)
*    参数：
*       path [必须 string | array] 待加载JS或CSS的路径字符串，或一组路径数组
*       callback [可选 function]  加载完成之后的回调函数(如果该文件已加载过了，则也会执行该回调函数)
*       refresh [可选 boolean] 只要设置了此参数(哪怕设置值为false或0)，则会强制重新加载该js（不管该js是否已加载过）
*/
var readyLoad = '|', queueLoad = '|';
function loadCSS(paths, callback, refresh){
	// 统一转成数组路径
	if( !(paths instanceof Array) ) {
		paths = [paths];
	}
	
	loadCSSUnit(0, paths, callback, refresh);
}



function loadJS(paths, callback, refresh) {
	// 统一转成数组路径
	if( !(paths instanceof Array) ) {
		paths = [paths];
	}
	
	loadJSUnit(0, paths, callback, refresh);
}



/*
* 载入CSS单元文件
* 参数:
*    index [number] 路径位于paths的索引值
*    其它参数同loadJS
*/
function loadCSSUnit(index, paths, callback, refresh) {
    var path = paths[index].toLowerCase();
	var complete = function(){
	    if( index == (paths.length-1) ) {
			if(typeof(callback) == 'function') callback();
		} else {
		    loadCSSUnit(index+1, paths, callback, refresh);
		}
	}

    refresh = (typeof(refresh)=="boolean") ? refresh : ((typeof(refresh)=="undefined") ? false: true);

    // 此文件已调用<link 方式进行了引用，且不强制重新引入文件
	var already = $('link').filter(function() {
        return $(this).attr('href') ? ($(this).attr('href').toLowerCase() == path) : false;
    });

	if(already.attr('href') && !refresh ){
		// console.error('file ' + already.attr('href') + ' Already loaded!');
        complete();
		return;
    }

    // 此文件已在加载完成且不强制重新引入文件
    if(readyLoad.indexOf('|' + path + '|') != -1 && !refresh ){
        complete();
		return;
    }

    // 此文件正在队列中
	if( queueLoad.indexOf(path) != -1 ) {
		setTimeout(function(){
			loadCSSUnit(index, paths, callback, refresh);
		}, 200);
		return;
	}
	
	// 此文件第一次加载
	queueLoad = queueLoad + path + '|';
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');
            
    link.href = path + ((path.indexOf("?")!=-1) ? '&rnd=' : '?rnd=') + Math.random();
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.onload = link.onreadystatechange = function(){
                                                     if(!this.readyState || this.readyState=='complete' || this.readyState=='loaded') {
														 readyLoad = readyLoad + path + '|';
														 queueLoad = replaceAll(queueLoad, path + '|', '');
                                                         this.onload = this.onreadystatechange = null; 
                                                         complete();
														 // console.info('loading: ' + path + ' finished!');
                                                     }
                                                 }
    head.appendChild(link);
}



/*
* 载入JS单元文件
* 参数:
*    index [number] 路径位于paths的索引值
*    其它参数同loadJS
*/
function loadJSUnit(index, paths, callback, refresh) {
    var path = paths[index].toLowerCase();
	var complete = function(){
	    if( index == (paths.length-1) ) {
			if(typeof(callback) == 'function') callback();
		} else {
		    loadJSUnit(index+1, paths, callback, refresh);
		}
	}

    refresh = (typeof(refresh)=="boolean") ? refresh : ((typeof(refresh)=="undefined") ? false: true);

    // 此文件已调用<script 方式进行了引用，且不强制重新引入文件
	var already = $('script').filter(function() {
        return $(this).attr('src') ? ($(this).attr('src').toLowerCase() == path) : false;
    });

	if(already.attr('src') && !refresh ){
		// console.error('file ' + already.attr('src') + ' Already loaded!');
        complete();
		return;
    }

    // 此文件已在加载完成且不强制重新引入文件	
    if(readyLoad.indexOf('|' + path + '|') != -1 && !refresh ){
        complete();
		return;
    }

    // 此文件正在队列中
	if( queueLoad.indexOf(path) != -1 ) {
		setTimeout(function(){
			loadJSUnit(index, paths, callback, refresh);
		}, 200);
		return;
	}
	
	// 此文件第一次加载
	queueLoad = queueLoad + path + '|';
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
            
    script.src     = path + ((path.indexOf("?")!=-1) ? '&rnd=' : '?rnd=') + Math.random();
    script.type    = 'text/javascript';
    script.charset = 'utf-8';
    script.onload  = script.onreadystatechange = function(){
                                                     if(!this.readyState || this.readyState=='complete' || this.readyState=='loaded') {
														 readyLoad = readyLoad + path + '|';
														 queueLoad = replaceAll(queueLoad, path + '|', '');
                                                         this.onload = this.onreadystatechange = null; 
                                                         complete();
														 // console.info('loading: ' + path + ' finished!');
                                                     }
                                                 }
    head.appendChild(script);
}



/*
    函数：    formatDate(date,fmt)
    说明：    格式化日期，非日期类型时返回空字符
    参数：
            date        日期类型，或字符串
            fmt            格式样式可自定义，比如 yyyy-MM-dd hh:mm:ss
                            
*/
function formatDate(date, fmt){
    var newDate = date.replace(/T/g,' ');
    if(!(newDate instanceof Date)){
        newDate = newDate.replace(/-/g, '/');
        newDate = new Date(newDate);
    }
    if(newDate=='Invalid Date') return '';//参数不是日期类型
    var o = {  
                'M+' : newDate.getMonth()+1,         //月份  
                'd+' : newDate.getDate(),          //日  
                'h+' : newDate.getHours(),          //小时  
                'm+' : newDate.getMinutes(),         //分  
                's+' : newDate.getSeconds(),         //秒  q是季度  
                'q+' : Math.floor((newDate.getMonth()+3)/3), 
                'S'  : newDate.getMilliseconds()       //毫秒  
            };  

    if(/(y+)/.test(fmt))  
          fmt=fmt.replace(RegExp.$1, (newDate.getFullYear()+'').substr(4 - RegExp.$1.length));  
    for(var k in o)  
        if(new RegExp('('+ k +')').test(fmt))  
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));  
    return fmt;  
} 
    


/*
    函数：    isFun(fun_funName)
    说明：    检测当前参数是否是函数
    参数：    fun_funName            函数，或函数名称字符串
*/
function isFun(fun_funName){
    if(trim(fun_funName)=='') return false;
    if(typeof(fun_funName)=="function") return true;
    try{
        return (typeof(eval(fun_funName))!="function") ? false : true;
    }catch(e){
        return false;
    }
}



/*
    函数:    execute(funString_fun)
*/
function execute(funString_function){
    if(typeof(funString_function)=="function"){
        funString_function();
    }else if(typeof(funString_function)=="string"){
        try{
            eval(funString_function + '();')
        }catch(e){}
    }
}



/*
    函数：    isJson(obj)
    说明：    判断参数obj是否是json类型 
    返回：    true|false
*/
function isJson(obj){
    return typeof(obj)=='object' && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}



/*
    函数：    getFileExtend(path)
    说明：    获取文件扩展名
    参数：    path        文件路径或path路径
*/
function getFileExtend(path){
    var fileName = getFileName(path);
    if(fileName=='') return '';
    var pos = path.lastIndexOf('.');
    pos = trim(path.substr(pos+1).toLowerCase());
    return pos.split("?")[0];
}



/*
    函数：    getFileName(path)
    说明：    获取一个路径的文件名
    参数：    path        文件路径或path路径
*/
function getFileName(path){
    if(typeof(path)!='string') return '';
    var pos = path.lastIndexOf('/');
    if(pos==-1){
        pos = path.lastIndexOf('\\');
    }
    return trim(path.substr(pos +1));
}




function htmlEncode(str){
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    return str;
}



/*
    函数：    rndNumeric()
    说明：    输出不重复的数
*/
function rndNumeric(){
    var now= new Date(); 
    var zIndex = bNumber(now.getHours()) + ' ' + bNumber(now.getMinutes()) + ' ' + bNumber(now.getSeconds());
    zIndex = zIndex.replace(/ /g, '');
    return zIndex + rndChar(5)
};
function bNumber(n){
    return (('0' + n).length==2) ? '0' + n : n;
};



/*
    函数：    rndChar(n)
    说明：    输出随机字符
    参数：    n    指定输出数量
*/
function rndChar(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = '';
    for(var i=0; i<n; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}



/*
    函数：    request(argname)
    说明：    获取url参数值
    参数：    argname            要获取的参数名称，区分大小写
*/
function request(argname){ 
    var url     = document.location.href,
        arrStr  = url.substring(url.indexOf('?')+1).split('&');
    
    for(var i =0;i<arrStr.length;i++){
        var loc = arrStr[i].indexOf(argname + '=');
        if(loc!=-1){
            return arrStr[i].replace(argname+'=', '').replace('?', '');
            break;
        }
    }
    return '';
}



/**
* 获取引用script.js中的参数
* 示例:
*     HTML引用了本页面的js： 
'     <html>
*         <script src="获取引用JS文件的GET参数.js?a=123&b=567"></script>
*     </html>
*
* alert( urlParameters )  ' 结果： a=123&b=567
* GetParameters('a') ' 结果是123
*
* urlParameters 是变量类型 [String | null]
* GetParameters 是函数类型 [String | null]
*/
var urlParameters = (function(script) {
    var l = script.length;

    for(var i = 0; i < l; i++) {
        me = !!document.querySelector ? script[i].src : script[i].getAttribute('src',4);
        if( me.substr(me.lastIndexOf('/')).indexOf('menu_hover') !== -1 ){
            break;
        }
    }
    return me.split('?')[1] ? me.split('?')[1] : null; 
})(document.getElementsByTagName('script'));



function GetParameters ( name ) {
    if(urlParameters===null) {
        return null
    }

    var url    = urlParameters,
        arrStr = url.substring(url.indexOf('?')+1).split('&');

    for(var i =0; i < arrStr.length; i++){
        var loc = arrStr[i].indexOf(name + '=');
        if(loc!=-1){
            return arrStr[i].replace(name+'=', '').replace('?', '');
            break;
        }
    }
    return null;
}



/*
    函数：    urlDecode(urlString)
    说明：    还原URL内的汉字
*/
function urlDecode(urlString){
    var returnString = '' ;
    try{
        returnString = decodeURI(urlString); // 解析汉字的，如果是已解析过的汉字使用会出错 
    }catch(e){
        returnString = unescape(urlString);
    }
    return returnString;
}



// 获取XMLHTTP组件
function getHttpObj(){
    var oT = false;
    try{
        oT = new ActiveXObject('Msxml2.XMLHTTP');
    }catch(e){
        try{
            oT = new ActiveXObject('Microsoft.XMLHTTP');
        }catch(e){
            oT = new XMLHttpRequest();
        }
    }
    return oT;
}



// 将表单提交的内容转成json串
function getFormToJson(frm){
    var o = {},
        a = $(frm).serializeArray();
        
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(trim(this.value) || '');
        } else {
            o[this.name] = trim(this.value) || '';
        }
    });
    return o;
}




/**
* 格式化文件大小
**/
function formatSize( size ) {
    var unit, units;
    
    units = [ 'B', 'K', 'M', 'G', 'TB' ];
    
    while ( (unit = units.shift()) && size > 1024 ) {
        size = size / 1024;
    }
    
    return (unit === 'B' ? size : size.toFixed( 2 || 2 )) +
            unit;
}

			


/*
    函数：    XMLtoString(elem)
    说明：    将XMLDocument类型参数转换成xml字符串
*/
function XMLtoString(elem){  
    var serialized;  
    try {
        // XMLSerializer exists in current Mozilla browsers                                                                              
        serializer = new XMLSerializer();                                                                                                
        serialized = serializer.serializeToString(elem);                                                                                 
    }                                                                                                                                    
    catch (e) {  
        // Internet Explorer has a different approach to serializing XML                                                                 
        serialized = elem.xml;                                                                                                           
    }      
    return serialized;                                                                                                  
}



/*
        fenYe(config)
        说明：    分页输出页码
        参数：    config分页配置
                config = {
                    showPageCodes :        '显示的页码数量
                    currentPage :        '当前页码值
                    pageCounts :        '总页数
                
                    activePage :        '当前页HTML代码
                    otherPage     :        '其他页html代码
                    firstPage     :        '第一页html代码
                    lastPage     :        '最后页html代码
                    nextPage     :        '下一页html代码
                    previousPage :        '上一页html代码
                }
                
        标签示例：
            < script id="pageCode" currentPage="" pageCounts="" url="http://www.fastCms.com/list.asp?">
                var config = {
                    'showPageCodes' : 5,
                    'currentPage'   : param.currentPage,
                    'pageCounts'    : param.pageCounts,
                    'activePage'    : '<strong class="ac">{#pageCode#}</strong>',
                    'otherPage'     : '<a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">{#pageCode#}</a>',
                    'firstPage'     : '<a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">首页</a>',
                    'lastPage'      : '<a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">尾页</a>',
                    'nextPage'      : '<a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">下一页</a>',
                    'previousPage'  : '<a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">上一页</a>'
                };
                return fenYe(config);
            </ script>
        返回结果：
            <a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">首页</a>
            <a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">上一页</a>
            <a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">其它页</a>
            <strong class="ac">{#pageCode#}</strong>
            <a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">下一页</a>
            <a href="' + param.url + 'currentPage={#pageCode#}" class="fyCode toFind">尾页</a>
    */
function fenYe(config){
    if(!checkNumber(config.showPageCodes,6)) config.showPageCodes = 10;
    if(!checkNumber(config.currentPage,6) || !checkNumber(config.pageCounts,6)) return;
    var arr=[],j;
    config.showPageCodes = parseInt(config.showPageCodes);
    config.currentPage = parseInt(config.currentPage);
    config.pageCounts = parseInt(config.pageCounts);
        
    arr.push(config.currentPage);
    for(var i=1;i<=config.showPageCodes;i++){
        j = config.currentPage - i;
        if(j>0) arr.push(j);
        j = config.currentPage + i;
        if(j<=config.pageCounts) arr.push(j);
    }
            
    //排序
    arr = fy_sort(arr);
    j = 1
    //获取起始页码
    var startPageCode = config.currentPage;
    for(var i=1 ;i<=config.showPageCodes;i++){
        if((config.currentPage+i)<=arr[arr.length-1]) j++;
        if(j==config.showPageCodes) break;
        if(config.currentPage-i>=arr[0]){
            j++;
            startPageCode = config.currentPage - i;
        }
        if(j==config.showPageCodes) break;
    }
    
    //重新规划页码
    j = 0;
    for(var i in arr){
        if(arr[i] < startPageCode){
            delete arr[i];
        }else{
            j++;
            if(j>config.showPageCodes) delete arr[i];
        }
    }
    
    var newArr = [];
    for(var i in arr)
        newArr.push(arr[i]);
    arr.length = 0;

    //输出页码
    var returnString='';
    if(config.firstPage) returnString = returnString + replaceAll(config.firstPage, '{#pageCode#}', 1);//首页
    j = ((config.currentPage-1)<=0) ? startPageCode : (config.currentPage-1);
    if(config.previousPage) returnString = returnString + replaceAll(config.previousPage, '{#pageCode#}', j);//上一页
    for(var i in newArr){
        if(newArr[i]==config.currentPage && config.activePage){
            returnString = returnString + replaceAll(config.activePage, '{#pageCode#}', newArr[i]);//当前页
        }else if(newArr[i]!=config.currentPage){
            returnString = returnString + replaceAll(config.otherPage, '{#pageCode#}', newArr[i]);//其它页
        }
    }
    j = ((config.currentPage+1)>=config.pageCounts) ? config.pageCounts : (config.currentPage+1);
    if(config.nextPage) returnString = returnString + replaceAll(config.nextPage, '{#pageCode#}', j);//下一页
    if(config.lastPage) returnString = returnString + replaceAll(config.lastPage, '{#pageCode#}', config.pageCounts);//尾页
    
    newArr.length = 0;
    return returnString;
}
function fy_sort(arr){
    var l = arr.length;
    for(var i=0;i<=l-2;i++){
        for(var j=i+1;j<=l-1;j++){
            if(arr[i]>arr[j]){
                var tmp = arr[j];
                arr[j] = arr[i];
                arr[i] = tmp;
            }
        }
    }
    return arr;
}



/*
    函数：    ascii(str)
    说明：    将字符转成ascii格式： &#XXXX
*/
function ascii(str) {
	if ( !str ) {
		return str;
	}

	str = str.toString();

    var value='';
    for (var i = 0; i < str.length; i++) {
        value += '\&#x' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16))+';';
    }
    return value;
}



/*
    函数：    unicode(str)
    说明：    将字符转成unicode    格式： &#XXXX
*/
function unicode(str){
    var value='';
    for (var i = 0; i < str.length; i++) {
        value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
    }
    return value;
}

function left_zero_4(str) {
    if(str != null && str != '' && str != 'undefined'){
        if(str.length == 2){
            return '00' + str;
        }
    }
    return str;
}



/**
* 获取本地位置
* @param    success_callback        获取成功之后的回调函数，原型：success_callback(position)
*                                                            position对象
*                                                            position.longitude                十进制数的经度
*                                                            position.latitude                 十进制数的纬度
*                                                            position.timestamp                响应位置时的时间戳
*                                                            position.accuracy                 位置精度
*                                                            position.altitude                 海拔，海平面以上以米计
*                                                            position.altitudeAccuracy         位置的海拔精度
*                                                            position.heading                  方向，从正北开始以度计（null|number）
*                                                            position.speed                    速度，以米/每秒计（null|number）
*
* @param    fail_callback            获取失败之后的回调函数，原型：fail_callback(errorCode)
*                                                            errorCode 值 -1 表示客户端不支持h5
*                                                            errorCode 值 0  表示用户拒绝了地理位置请求
*                                                            errorCode 值 1  表示位置信息不可用
*                                                            errorCode 值 2  表示获取用户位置的请求超时
*                                                            errorCode 值 3  表示出现未知错误
**/
function getLocation(success_callback, fail_callback){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, fail);
    }else{
        fail_callback(-1);
    }
        
    // 获取成功之后执行
    function success(result){
        var position = {
                timestamp        :  result.timestamp,
                longitude        :  result.coords.longitude,
                latitude         :  result.coords.latitude,
                accuracy         :  result.coords.accuracy,
                altitude         :  result.coords.altitude,
                altitudeAccuracy :  result.coords.altitudeAccuracy,
                heading          :  result.coords.heading,
                speed            :  result.coords.speed
        };
        success_callback(position);
    }
        
    // 获取失败之后执行
    function fail(error){
        switch(error.code){
            case error.PERMISSION_DENIED:
                fail_callback(0);
                break;
            case error.POSITION_UNAVAILABLE:
                fail_callback(1);
                break;
            case error.TIMEOUT:
                fail_callback(2);
                break;
            case error.UNKNOWN_ERROR:
                fail_callback(3);
                break;
        }
    }
}


// 本地刷新
function refresh() {
    window.location.reload();
}