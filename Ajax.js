var ajax ={
	queue : function(config){
		var queues = (isJson(config)|| (config instanceof Array)) ? jsonQueues(config) : domQueues(config);
		reEvent(queues, true);
		queues[0].traditional = true; // 解决 checkbox 多项问题
		$.ajax(queues[0]);
	},
	
	together : function(config){
		var queues = (isJson(config) || (config instanceof Array) ) ? jsonQueues(config) : domQueues(config);
		reEvent(queues, false);
		for( var i in queues ) {
			queues[i].traditional = true; // 解决 checkbox 多项问题
			$.ajax(queues[i]);
		}
	},
	
	collect : function(config, url, method, timeout, dataType, beforeSend, success, error, complete){
	}
};

function domQueues(cObj){
	var queues 	 = [],
		maxIndex = 0;
		
	$.each(cObj, function(index, value){
		var obj   = $(this).find('.ajax-item');
		$.each( obj, function(index, value){
			var url			= ($(this).attr('url') 						? trim($(this).attr('url'))			: ''),
				method		= ($(this).attr('method') 					? trim($(this).attr('method')) 		: ''),
				async 		= ($(this).attr('async') 					? trim($(this).attr('async')) 		: ''),
				once 		= ($(this).attr('once') 					? trim($(this).attr('once')) 		: ''),
				data   		= ($(this).attr('data') 					? trim($(this).attr('data')) 		: ''),
				timeout   	= (checkNumber($(this).attr('timeout'), 0)	? parseInt($(this).attr('timeout'))	: ''),
				dataType   	= ($(this).attr('dataType') 				? trim($(this).attr('dataType')) 	: ''),
				beforeSend  = ($(this).attr('beforeSend') 				? trim($(this).attr('beforeSend'))	: ''),
				success 	= ($(this).attr('success') 					? trim($(this).attr('success')) 	: ''),
				error 		= ($(this).attr('error') 					? trim($(this).attr('error')) 		: ''),
				complete 	= ($(this).attr('complete') 				? trim($(this).attr('complete')) 	: ''),
				index_		= (checkNumber($(this).attr('index'), 0) 	? parseInt($(this).attr('index'))	: 0);
			
			// 检查属性值
			if(url==''){
				alert('ajax-item元素缺少url属性值！');
				throw 'ajax-item元素缺少url属性值！';
			}
			// method 默认是GET
			method = method.toUpperCase();
			method = (method!='GET' && method!='POST') ? 'GET' : method;
			
			// async 默认是true,异步
			async = async.toUpperCase();
			async = (async!='FALSE' && async!='0') ? true : false;
			
			
			// once 默认是true
			once = once.toUpperCase();
			once = (once!='TRUE' && once!='1') ? false : true;
			if($(this).attr('executed')=='1' && once){
				return false;
			}
		
			// timeout 默认是120秒
			timeout = (timeout=='') ? 120000 : (timeout*1000);
			
			// dataType 
			dataType = dataType.toLowerCase();
			if( dataType=='' || (dataType!='xml' && dataType!='html' && dataType!='script' && dataType!='json' && dataType!='jsonp' && dataType!='text') ){
				dataType = '';
			}

            // url 中+号会被当做空格传递，解决它
			url = url.replace(/\+/g,"%2B");

			// data中+号问题，data非string时出错
			try {
                data = data.replace(/\+/g,"%2B");
			} catch (e) {}

			// beforeSend
			if(beforeSend!='' && !isFun(beforeSend)){
				alert('ajax-item元素中未定义beforeSend函数(' + beforeSend + ')！');
				throw 'ajax-item元素中未定义beforeSend函数(' + beforeSend + ')！';
			}
					
			// success
			if(success!='' && !isFun(success)){
				alert('ajax-item元素中未定义success函数(' + success + ')！');
				throw 'ajax-item元素中未定义success函数(' + success + ')！';
			}
				
			// error
			if(error!='' && !isFun(error)){
				alert('ajax-item元素中未定义error函数(' + error + ')！');
				throw 'ajax-item元素中未定义error函数(' + error + ')！';
			}
				
			// complete
			if(complete!='' && !isFun(complete)){
				alert('ajax-item元素中未定义complete函数(' + complete + ')！');
				throw 'ajax-item元素中未定义complete函数(' + complete + ')！';
			}
			// 去除无用的键值
			var jsonObj = {
							url			:	url,
							type		:	method,
							async		:	async,
							data		:	data,
							timeout		:	timeout,
							dataType	:	dataType,
							beforeSend	:	beforeSend,
							success		:	success,
							error		:	error,
							complete	:	complete,
							thisDom		:	$(this)
						  };

			if( jsonObj.data==''  ) 		delete jsonObj.data;
			if( jsonObj.dataType==''  ) 	delete jsonObj.dataType;
			if( jsonObj.beforeSend==''  ) 	delete jsonObj.beforeSend;
			if( jsonObj.success==''  ) 		delete jsonObj.success;
			if( jsonObj.error==''  ) 		delete jsonObj.error;
			if( jsonObj.complete==''  ) 	delete jsonObj.complete;
			queues.push( [index_, jsonObj] );
			if(maxIndex<index_) maxIndex=index_;
		});
	});
		
	// 将排序值为0的转成最大的序值，即最后执行
	maxIndex++;
	for(var i=0; i<queues.length; i++){
		if(queues[i][0]==0)
			queues[i][0] = maxIndex;
	}
		
	// 队列排序
	for(var i=0; i<queues.length-1; i++){
		for(var j=(i+1); j<queues.length; j++){
			var acItem   = queues[i],
				nextItem = queues[j],
				tmpItem  = '';
			
			if(acItem[0]>nextItem[0]){
				tmpItem   = nextItem;
				queues[j] = acItem;
				queues[i] = tmpItem;
			}
		}
	}
		
	// 输出结果
	var result = [];
	for(var i=0; i<queues.length; i++){
		result.push( queues[i][1] );
	}
	return result;
}

function jsonQueues(array_json){
	var queues 	 = [];
		
	if(isJson(array_json))
		array_json = [array_json];
		
	for(var i in array_json){
		var obj = array_json[i];
		if( !isJson(obj) ){
			alert('ajax配置出错：参数非json类型！');
			throw 'ajax配置出错：参数非json类型！';
		}
			
		var	url			= (obj.url						 	? trim(obj.url)			: ''),
			method		= (obj.method					 	? obj.method 					: ''),
			async 		= ((typeof(obj.async)=='boolean')	? obj.async 					: true),
			data   		= (obj.data						 	? obj.data						: ''),
			timeout   	= (checkNumber(obj.timeout, 0) 		? parseInt(obj.timeout)*1000	: 30000),
			dataType   	= (obj.dataType					 	? obj.dataType					: ''),
			beforeSend  = (obj.beforeSend				 	? obj.beforeSend 				: ''),
			success 	= (obj.success					 	? obj.success 					: ''),
			error 		= (obj.error						? obj.error						: ''),
			complete 	= (obj.complete						? obj.complete 					: ''),
			thisDom 	= (obj.thisDom						? obj.thisDom 					: '');
			
			// 检查属性值
			if(url==''){
				alert('ajax配置出错：缺少url值！');
				throw 'ajax配置出错：缺少url值！';
			}
			
			// method 默认是GET
			method = method.toUpperCase();
			method = (method!='GET' && method!='POST') ? 'GET' : method;
			
			// dataType 
			dataType = dataType.toLowerCase();
			if( dataType=='' || (dataType!='xml' && dataType!='html' && dataType!='script' && dataType!='json' && dataType!='jsonp' && dataType!='text') ){
				dataType = '';
			}

            // url 中+号会被当做空格传递，解决它
			url = url.replace(/\+/g,"%2B");

			// data中+号问题，data非string时出错
			try {
                data = data.replace(/\+/g,"%2B");
			} catch (e) {}

			// beforeSend
			if( beforeSend!='' && !isFun(beforeSend) ){
				alert('ajax配置出错：未定义beforeSend函数(' + beforeSend + ')！');
				throw 'ajax配置出错：未定义beforeSend函数(' + beforeSend + ')！';
			}
			
			// success
			if( success!='' && !isFun(success) ){
				alert('ajax配置出错：未定义success函数(' + success + ')！');
				throw 'ajax配置出错：未定义success函数(' + success + ')！';
			}
			
			// error
			if( error!='' && !isFun(error) ){
				alert('ajax配置出错：未定义error函数(' + error + ')！');
				throw 'ajax配置出错：未定义error函数(' + error + ')！';
			}
			
			// complete
			if( complete!='' && !isFun(complete) ){
				alert('ajax配置出错：未定义complete函数(' + complete + ')！');
				throw 'ajax配置出错：未定义complete函数(' + complete + ')！';
			}
		
			// 去除无用的键值
			var jsonObj = {
							url			:	url,
							type		:	method,
							async		:	async,
							data		:	data,
							timeout		:	timeout,
							dataType	:	dataType,
							beforeSend	:	beforeSend,
							success		:	success,
							error		:	error,
							complete	:	complete,
							thisDom		:	thisDom
						  };
			if( jsonObj.data==''  ) 		delete jsonObj.data;
			if( jsonObj.dataType==''  ) 	delete jsonObj.dataType;
			if( jsonObj.beforeSend==''  ) 	delete jsonObj.beforeSend;
			if( jsonObj.success==''  ) 		delete jsonObj.success;
			if( jsonObj.error==''  ) 		delete jsonObj.error;
			if( jsonObj.complete==''  ) 	delete jsonObj.complete;
			queues.push(jsonObj);
	}
	return queues;
}

function reEvent(queues, insertNext){
	var l = queues.length-1;

	// 此处要求倒序重置事件
	for( var i=l ; i>=0; i-- ){
		if(insertNext){
			addQueueEvent(queues, i);
		}else{
			reSetEvent(queues[i]);
		}
		delete queues[i].thisDom;
	}
}

function addQueueEvent(queues_, acIndex){
	var queues	 = queues_,
		que 	 = queues[acIndex],
		maxIndex = queues.length-1,
		thisDom	 = que.thisDom;
	
	// beforeSend
	
	if(que.dataType || que.beforeSend || acIndex<maxIndex){
		var beforeSend___ = que.beforeSend;
		delete que.beforeSend;
		que.beforeSend = function(XMLHttpRequest){
							var que    = queues[acIndex],
								length = queues.length,
								result = true;
							
							if(que.dataType){
								XMLHttpRequest.setRequestHeader('dataType', que.dataType);
							}
							if(beforeSend___){
								beforeSend___ = eval(beforeSend___);
								result = beforeSend___(XMLHttpRequest, thisDom);
								if(typeof(result)!='boolean') result=true;
							}
							if(acIndex<length && !result){
								$.ajax( queues[(acIndex+1)] );
							}
							if(thisDom)	thisDom.attr('executed',"1");//标识已执行过
							return result;
						  };
	}
	
	// success
	if(que.success){
		var success___ = que.success;
		delete que.success;
		que.success = function(data, textStatus){
						success___ = eval(success___);
						result = success___(data, textStatus, thisDom);
						return result;
					  };
	}
	
	// error
	if(que.error){
		var error___ = que.error;
		delete que.error;
		que.error = function(XMLHttpRequest, textStatus, errorThrown){
						error___ = eval(error___)
						result = error___(XMLHttpRequest, textStatus, errorThrown, thisDom);
						return result;
					};
	}
	
	// complete
	if(que.complete || acIndex<maxIndex){
		var complete___ = que.complete;
		delete que.complete;
		que.complete = function(XMLHttpRequest, textStatus){
							var length = queues.length,
								result = true;
							
							if(complete___){
								complete___ = eval(complete___)
								result = complete___(XMLHttpRequest, textStatus, thisDom);
							}
														
							if(acIndex<length-1){
								$.ajax( queues[(parseInt(acIndex)+1)] );
							}
							return result;
						};

	}
}

function reSetEvent(que_){
	var que	 	 = que_,
		thisDom	 = que.thisDom;
		
	// beforeSend
	if(que.dataType || que.beforeSend){
		var beforeSend___ = que.beforeSend;
		delete que.beforeSend;
		que.beforeSend = function(XMLHttpRequest){
							var result = true;
							
							if(que.dataType){
								XMLHttpRequest.setRequestHeader('dataType', que.dataType);
							}
							if(beforeSend___){
								beforeSend___ = eval(beforeSend___);
								result = beforeSend___(XMLHttpRequest, thisDom);
								if(typeof(result)!='boolean') result=true;
							}
							if(thisDom) thisDom.attr('executed',"1");//标识已执行过
							return result;
						 };
	}
	
	// success
	if(que.success){
		var success___ = que.success;
		delete que.success;
		que.success = function(data, textStatus){
						success___ = eval(success___);
						result = success___(data, textStatus, thisDom);
						return result;
					  };
	}
	
	// error
	if(que.error){
		var error___ = que.error;
		delete que.error;
		que.error = function(XMLHttpRequest, textStatus, errorThrown){
						error___ = eval(error___);
						result = error___(XMLHttpRequest, textStatus, errorThrown, thisDom);
						return result;
					  };
	}
	
	// complete
	if(que.complete){
		var complete___ = que.complete;
		delete que.complete;
		que.complete = function(XMLHttpRequest, textStatus){
						complete___ = eval(complete___);
						result = complete___(XMLHttpRequest, textStatus, thisDom);
						return result;
					  };
	}
}
	