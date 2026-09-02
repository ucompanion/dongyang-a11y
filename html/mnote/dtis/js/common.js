
// Validation Check
// Document 참고 : http://docs.jquery.com/Plugins/Validation
// Edited by 오세현 2012.10.25
// Edited by 오세현 2012.12.27 -> va_sapp_nm 추가
if ($.validator != null && $.validator != undefined) {
	$.validator.addMethod("password", function(value) {
		var reg_pw = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,15}$/;
		return reg_pw.test(value);
	}, "영문, 숫자 조합 6~15자리가 아닙니다.");
	
	$.validator.addMethod("tel", function(value) {
		var reg_tel = /^[\d]{3}-[\d]{3,4}-[\d]{4}$/;
		return reg_tel.test(value);
	}, "연락처 형식이 올바르지 않습니다.");
	
	$.validator.addMethod("id_chk", function(value) {
		var reg_id = /^[a-zA-Z0-9]+$/;
		return reg_id.test(value);
	}, "영문 또는 숫자가 아닙니다. ");
	
	$.validator.addMethod("special", function(value) {
		return SpecialCheck(value);
	}, '특수문자는 사용할 수 없습니다.');
	
	$.validator.addClassRules({
		va_userid: {
			required: true,
		    id_chk: true
		},
		va_username: {
			required: true
		},
		va_passwd: {
			required: true,
			password: true
		},
		va_passwd_chk: {
			required: true,
			equalTo: "#passwd"
		},
		va_sapp_nm: {		
			required: true,
			maxlength: 24,
			special: true
		},
		va_email:{
			required: true,
			email: true
		},
		va_email_not_required:{
			email: true
		},
		va_number:{
			number: true
		},
		va_tpl_title:{
			required: true
		},
		va_tpl_content:{
			required: true
		},
		va_cate_nm: {		
			required: true,
			maxlength: 16,
			special: true
		},
		va_ncprm_cont_nm: {		
			required: true,
			maxlength: 100,
			special: true
		},
		va_tel:{
			required:true,
			tel:true
		}
	});
}

//특수문자 체크
//한글, 영어, 숫자, 공백외의 글자를 체크
//Edited by 오세현 2012.12.27
function SpecialCheck(string) {
	
	for(var i=0; i<string.length; i++) {
		var ch = string.charAt(i).charCodeAt();
		if ((ch >= 33 && ch <=47) || (ch >=58 && ch <=64) || (ch >= 91 && ch <= 96) || (ch >=123 && ch <=126)) {
			return false;
		}
	}
	return true;
}

// 팝업 공통 함수
// 팝업창에 대한 관리를 이곳에서 통합관리한다.
// 신규 팝업에 대한 정의는 이곳에서...
// 외부 도메인은 팝업창에 submit이 안됨 
// Edited by 오세현 2012.10.25
function OpenWindow(popupid, form) {

	var width = "";
	var height = "";
	var url = "";
 
	switch(popupid) {
		case "sample":	//test용 팝업 아이디
			width = "800";
			height = "600";
			url = "/admin/testController/openwindow";
			break;
			
		default:
			return;
	}
	
	var nLeft = (window.screen.width - width) / 2;
	var nTop = (window.screen.height - height) / 2;
	var strWindowFeatures = "width="+width+",height="+height+",left="+nLeft+",top="+nTop;
	var winPopup = window.open("", popupid, strWindowFeatures);
	form.action = url;
	form.target = popupid;
	form.submit();
	winPopup.focus();	
}

//ajax 호출 공통 함수
//ajax 호출과 xml 응답을 일괄통일
//data: $("#frm").serialize(), {"data": val}
//Edited by 오세현 2012.10.29
//Edited by 오세현 2012.12.06 
//	- error_function 추가
//Edited by 오세현 2013-01-21
//  - beforeSend 추가
function GetAjaxXml(url, data, success_function, loading, error_function) {

	if(loading) {
		AjaxLodingStart();
	}
	if(!window.console) {console = {log:function(){}};}
	$.ajax({
		asyn: false,
//		cache: true,
		type: "POST",
		dataType:"xml",
		data: data,
		url:  url, 
		beforeSend: function(xhr) {
			xhr.setRequestHeader("ajax-call", "true");
		},
		success : function(xmlData) {
//			console.log("XMLDATA:" + xmlData);
			if(xmlData == null || $(xmlData).text() == "") {
				return;
			}
			if ($(xmlData).find('smartq-xml > result').text() != "0" && $(xmlData).find('smartq-xml > result').text() != "000") {
				if (error_function != undefined  && error_function != null) {
					error_function(xmlData);
				} else {
					alert($(xmlData).find('smartq-xml > result-msg').text());
					//console.log($(xmlData).find('smartq-xml > result-msg').text());					
				}
			}else{
				if (success_function != undefined && success_function != null) {
					success_function(xmlData);
				}
			}
		},
		error: function(response, status) {
			//alert('GetAjaxXml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
			console.log('GetAjaxXml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
		},
		complete : function(jqXHR, textStatus) {
			if(loading) {
				AjaxLodingStop();
			}
		}
	});
}


//html을 리턴
function GetAjaxHtml(url, data, success_function, loading, error_function) {

	if(loading) {
		AjaxLodingStart();
	}
	if(!window.console) {console = {log:function(){}};}
	$.ajax({
		asyn: false,
		type: "POST",
		dataType:"html",
		data: data,
		url:  url, 
		beforeSend: function(xhr) {
			xhr.setRequestHeader("ajax-call", "true");
		},
		success : function(htmlData) {
			if (success_function != undefined && success_function != null) {
				success_function(htmlData);
			}
		},
		error: function(response, status) {
			//alert('GetAjaxXml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
			console.log('GetAjaxHtml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
		},
		complete : function(jqXHR, textStatus) {
			if(loading) {
				AjaxLodingStop();
			}
		}
	});
}


//ajax 호출 공통 함수
//ajax 호출과 xml 응답을 일괄통일
//data: $("#frm").serialize(), {"data": val}
//Edited by 최경환 2012.12.07
//Edited by 장명진 2013-01-07
//Edited by 오세현 2013-01-21
//Edited by 최경환 2013-02-01 (form_name, url, data, success_function, loading, error_function, file_name, extension)
//							(폼명, url, data, success_function, loading, error_function, 확장자체크파일명, 수용가능확장자(',jpg,avi'))
function GetAjaxXmlMultiPart(form_name, url, data, success_function, loading, error_function, file_name, extension, change_function) {
	if (file_name != undefined  && file_name != null) {
		if (extension != undefined  && extension != null) {
			var file = $("input[name="+file_name+"]");
			var file_extension = file.val().substring(file.val().lastIndexOf(".") + 1);
			if(extension.indexOf(file_extension.toLowerCase())<0){
				alert("파일 확장자 맞지 않음");
				if (change_function == true) {
					file.wrap('<b />');
					file.parents("b").html(file.parents("b").html());
				}
				return;
			}
		}
	}
	
	if(!window.console) {console = {log:function(){}};}
	
	$('input[form="'+form_name+'"]').attr("enctype", "multipart/form-data");
	if(loading) {
		AjaxLodingStart();
	}
	$("#"+form_name+"").ajaxSubmit({
		asyn: true,
		type: 'POST',
		dataType:'xml',
		data: data,
		url:  url,
		success : function(xmlData, textStatus) {
			var xml = null;
			try {
				xml = $.parseXML($(xmlData).text());
			} catch (e) {
//				xml = $.parseXML(xmlData);
				xml = xmlData;
			}
			if ($(xml).find('smartq-xml > result').text() != "0" && 
					$(xml).find('smartq-xml > result').text() != "000") {
				if (error_function != undefined  && error_function != null) {
					error_function(xmlData);
				} else {
					alert($(xmlData).find('smartq-xml > result-msg').text());
				}
				//return false;
			}else{
				if (success_function != undefined && success_function != null) {
					success_function(xml);
				}
			}
		},
		error : function(response, status) {
			console.log('GetAjaxXml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
			//alert('GetAjaxXml ' + status + '\nCODE: ' + response.status + '\nMESSAGE: ' + response.responseText);
			if (file_name != undefined  && file_name != null) {
				$("input[name="+file_name+"]").wrap('<b/>');
				$("input[name="+file_name+"]").parents("b").html($("input[name="+file_name+"]").parents("b").html());
			}
			if (error_function != undefined  && error_function != null) {
				error_function(response);
			}
		},
		complete : function(xmlData, textStatus) {
			if(loading) {
				AjaxLodingStop();
			}
		}
	});
}




//페이징 페이지 이동 함수. incPageNavi.jsp에서 사용
//data: pageNum : 페이지 번호
//Edited by 오세현 2012.11.06
function GoPageNum(pageNum) {
	
	var url = window.location.pathname;
	var frm = document.frmPage;
	frm.method = "get";
	frm.action = url;
	
	frm.PAGENUM.value = pageNum;
	frm.submit();
}

//메뉴 이동 함수. incTopMenu.jsp에서 사용
//data: url : 메뉴url, menuid : 메뉴id, store_id : 스토어id, store_nm : 스토어 명
//Edited by 최경환 2012.12.26
function GoMenuPage(url, top_menuid, cur_menuid, menutype, menu_auth) {
	
	if(menu_auth=='N'&&top_menuid!='TM_LGOT'){
		LayerAlert("메뉴 권한이 없습니다.");
		return;
	}
	
	GoPage(url, null, top_menuid, cur_menuid, menutype);
}

//페이지 이동 함수. 페이지 이동시 Post 방식으로 이동
//params : 전송 데이터 {'q':'a','s':'b','c':'d'...}으로 묶어서 배열 입력
//Edited by 오세현 2012.11.08
function GoPage(url, params, top_menuid, cur_menuid, menutype) {
	
	var frm = document.createElement("form");
	frm.setAttribute("method", "get");
	frm.setAttribute("action", url);
	
	if (typeof params == 'string') {
		var strJson = ToJsonString(params);
		if (strJson.length > 0) {
			params = JSON.parse(strJson);
		}
	}
	
//	var inputTopMenuId = document.createElement("input");
//	inputTopMenuId.setAttribute("type", "hidden");
//	inputTopMenuId.setAttribute("name", "TMENUID");
//	inputTopMenuId.setAttribute("value", top_menuid);
//	frm.appendChild(inputTopMenuId);
	
//	var inputCurMenuId = document.createElement("input");
//	inputCurMenuId.setAttribute("type", "hidden");
//	inputCurMenuId.setAttribute("name", "SMENUID");
//	inputCurMenuId.setAttribute("value", cur_menuid);
//	frm.appendChild(inputCurMenuId);
	
//	if (menutype != undefined && menutype != null) {
//		var inputMenuType = document.createElement("input");
//		inputMenuType.setAttribute("type", "hidden");
//		inputMenuType.setAttribute("name", "METYPE");
//		inputMenuType.setAttribute("value", menutype);
//		frm.appendChild(inputMenuType);
//	}
	
	for(var key in params) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", key);
		hiddenField.setAttribute("value", params[key]);
		frm.appendChild(hiddenField);
	}	
	
	document.body.appendChild(frm);
	frm.submit();
}

//url parameter 형식을 json string으로 변환
//string : 예) aaa=bbb&ccc=ddd
//Edited by 오세현 2012.11.30
function ToJsonString(string) {
	if (typeof string != 'string') {
		return;
	}
	var retStr = '';
	var arr1 = string.split("&");
	for(var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split("=", 2);
		if (arr2.length == 2) {
			if (retStr.length > 0) {
				retStr += ',';
			}
			retStr = retStr + '"' + arr2[0] + '":"' + arr2[1] + '"'; 
		}
	}
	if (retStr.length > 0) {
		retStr = '{' + retStr + '}';
	}
	return retStr;
}

//table에 동적으로 row를 추가하는 함수
//tableid : table의 id
//params : {
//		'attr_1':'a',  <-- attr은 tr의 attribute로 a를 attribute명으로 xml의 a값을 value로 추가, xml이 없으면 attr_1을 attribute명으로 a를 value로 추가 
//		'attr_2':'b',  <-- 1, 2는 attr의 인덱스 새로운값이 있을때마다 하나씩 증가
//		'cols_1':'c',  <-- cols는 td안에 텍스트로 xml의 c값을 입력, xml이 없으면 c를 입력
//		'cols_2':'d',  <-- 1, 2는 td의 인덱스 
//		'html_1':'e',  <-- html은 td안에 html을 입력
//		'html_2':'f',  <-- 1,2는 td의 인덱스
//		'clas_1':'num; <-- 첫번째 td에 num 클래스 추가
//		'zz':'qq'	   <-- 위의 param 정의 외의 값은 tr의 attribute로 추가 하며, zz를 attribute명으로 qq를 value로 추가 
//		}
//click_event: tr 클릭시 클릭 이벤트 처리 함수
//			       없을시는 ClickTable을 호출한다. 
//			       이벤트 처리 함수를 사용시 함수내에서 ClickTable을 호출할것
//xml: xml의 item, null가능
//Edited by 오세현 2012.11.22
function AddTableXml(tableid, params, click_event, xml) {
	
	var isXml = true;
	var objTable = document.getElementById(tableid);
	var rowIndex = objTable.rows.length;
	var newRow = objTable.insertRow(rowIndex);
	var colLength = objTable.rows[0].cells.length;
	
	if (colLength <= 0) {
		return;
	}
	
	if (xml == undefined || xml == null) {
		isXml = false;
	}

	var clickFunc = click_event;
	if (click_event == undefined || click_event == null || click_event == '') {
		clickFunc = ClickTable;	
	} 
	
	if (window.attachEvent) {
		newRow.attachEvent("onclick", clickFunc);
	} else if(newRow.addEventListener) {
		newRow.addEventListener('click', clickFunc, false);
	}
	newRow.style.cursor = "pointer";
	
	for(var i=0; i<colLength; i++) {
		newRow.insertCell(0);
	}	
	
	if (typeof params == 'string') {
		var strJson = ToJsonString(params);
		if (strJson.length > 0) {
			params = JSON.parse(strJson);
		}
	}
	
	for(var key in params) {
		
		var keyword = key.substring(0, 4);
		var colsIndex = key.substring(5,key.length) - 1;
		switch (keyword) {
			case "attr":
				if (isXml) {
					var newAttr = document.createAttribute(params[key]);
    				newAttr.nodeValue = xml.find(params[key]).text();
    				newRow.setAttributeNode(newAttr);
				} else {
					var newAttr = document.createAttribute(key);
					newAttr.nodeValue = params[key];
					newRow.setAttributeNode(newAttr);
				}
				break;
				
			case "cols":
				if (newRow.cells[colsIndex] == undefined) {
					break;
				}
				if (isXml) {
					newRow.cells[colsIndex].innerHTML = xml.find(params[key]).text();
				} else {
					newRow.cells[colsIndex].innerHTML = params[key];	
				}	
				break;
				
			case "clas":
				if (newRow.cells[colsIndex] == undefined) {
					break;
				}
				var newAttr = document.createAttribute("class");
				newAttr.nodeValue = params[key];
				newRow.cells[colsIndex].setAttributeNode(newAttr);
				break;
			
			case "html":
				if (newRow.cells[colsIndex] == undefined) {
					break;
				}
				newRow.cells[colsIndex].innerHTML = params[key];
				break;
				
			default:
				var newAttr = document.createAttribute(key);
				newAttr.nodeValue = params[key];
				newRow.setAttributeNode(newAttr);
				break;
		}
	}
}

//테이블 클릭시 클릭한 테이블의 row 색상 변경
//return 값으로 클릭한 row를 반환
//Edited by 오세현 2012.11.22
function ClickTable(e) {
	var e=e? e : window.event;
	var clickRow=e.target? e.target : e.srcElement;
	
	while (clickRow.tagName != "TR" && clickRow != undefined && clickRow != null) {
		clickRow = clickRow.parentElement;
	}
	if (clickRow == undefined || clickRow == null) {
		return null;
	}
	
	var tableObj = clickRow.parentElement;
	while (tableObj.tagName != "TABLE" && tableObj != undefined && tableObj != null) {
		tableObj = tableObj.parentElement;
	}
	for(var i=1; i<tableObj.rows.length; i++) {
		tableObj.rows[i].style.backgroundColor = "#ffffff";
	}
	clickRow.style.backgroundColor = "#f8cea0";
	return clickRow;
}

//table의 헤더를 제외한 row를 삭제
//tableid: table의 id
//Edited by 오세현 2012.11.22
function ClearTable(tableid) {
	var objTable = document.getElementById(tableid);
	var rowCount = objTable.rows.length;
	for(var i=1; i<rowCount; i++) {
		objTable.deleteRow(1);
	}
}

//table의 선택한 row를 삭제
//tableid: table의 id
//Edited by 오세현 2012.11.26
function DeleteTable(tableid) {
	var tableObj = document.getElementById(tableid);
	for(var i=1; i<tableObj.rows.length; i++) {
		if(tableObj.rows[i].style.backgroundColor == "rgb(51, 102, 153)") {
			tableObj.deleteRow(i);
		}
	}
}

var Formatter = {
	number: function(str) {
		str = str + '';
//		if (str == '' || str == '0') return '0';
		str = str.replace(/([^\d])/g, '');
//		var regex = /(\d+)(\d{3})/;
//		while(regex.test(str)) {
//			str = str.replace(regex, '$1,$2');
//		}
		return str;
	},
	
	numberstring: function(str) {
		str = str + '';
		str = str.replace(/\D/g, '');
		return str;
	},
		
	date: function(str) {
		str = str.replace(/[^\d]/g, '');
		var regex = /(\d{4})(\d{2})(\d{2}).*/;
		if (regex.test(str)) {
			str = str.replace(regex, '$1-$2-$3');
		}
		return str;
	},
		
	time: function(str) {
		var regex = /(\d{2})(\d{2})(\d{2}).*/;
		if (regex.test(str)) {
			str = str.replace(regex, '$1:$2:$3');
		}
		return str;
	},
		
	mask: function(mask, str) {
		var result = '', j = 0;
		for(var i=0; i<mask.length; i++) {
			if (mask.charAt(i) == '@') result += str.charAt(j++);
			else result += mask.charAt(i);
		}		
		return result;
	},
		
	phoneNumber: function(str) {
		if (str) {
			str = str.replace(/[^\d]/g, '');
			var regex = /^(02|\d{3})(\d{3,4})(\d{4})/;
			if (regex.test(str)) {
				str = str.replace(regex, '$1-$2-$3');
			}
		}
		return str;
	}
};

/**
 * 
 */
var ValueChecker = {
	
	/**
	 * 올바른 주민등록번호인지 확인
	 * 
	 * @param ssn 검사할 주민등록번호
	 * @param clear 주민번호에 기타문자열 삭제후 검사
	 * @returns {Boolean}
	 */
	isSsn: function(ssn, clear) {
		if (clear === true) {
			ssn = ssn.replace(/[^\d]/, '');
		}
		if (!/\d{13}/.test(ssn)) return false;

		var sum = 0;
		for (var i=0; i<12; i++) {
			sum += (i%8+2) * parseInt(ssn.charAt(i));
		}
		
		var checksum = (11 - (sum % 11)) % 10;
		
		return ssn.substring(12) == checksum;
	},
	
	/**
	 * 숫자타입인지 확인
	 * 
	 * @param number
	 * @returns
	 */
	isNumeric: function(number) {
		for(var i=0; i<number.length; i++) {
			var ch = number.charAt(i);
			if(!(ch >= '0' && ch <= '9')) {
				return false;
			}
		}
		return true;
	},
	
	isDate: function(date) {
		date = date.replace(/-/gi, '');
		if (!/\d{8}/.test(date)) return false;
		
		return true;
	},
	
	/**
	 * URL인지 확인
	 * 
	 * @param url
	 * @returns
	 */
	isUrl: function(url) {
		if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url))
			return true;
		else
			return false;
	},
	
	/**
	 * 특수문자인지 확인
	 * 
	 * @param 특수문자
	 * @returns
	 */
	isSpecial: function(special) {
		if(/[~!@\#$%^&*\()\=+_']/gi.test(special))
			return true;
		else
			return false;
	},
	
	/**
	 * email 확인
	 * 
	 * @param email
	 * @returns
	 */	
	isEmail: function(email) {
		var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
		if (exptext.test(email)!=true){
			return false;
		}
		return true;
	}
};

//text의 byte 채크
//objID: byte 채크할 input id
//objTargetID: byte 길이를 표시할 태그 id
//intMaxBytes: byte 최대길이
//$('#file_url_url').keyup(function() {
//	CheckByte(this.id, 'file_url_url_byte', 1024);
//});
function CheckByte(objID, objTargetID, intMaxBytes, alert_yn)
{   
    var len = 0, j, i;
    var strCurrentText = document.getElementById(objID).value;
    for (i = 0, j = strCurrentText.length; i < j; i++) 
    {
    	if (strCurrentText.charCodeAt(i) != 13) {
    		len++;
    	}
    	
        if ((strCurrentText.charCodeAt(i) < 0) || (strCurrentText.charCodeAt(i) > 127) ||(strCurrentText.charCodeAt(i) == 10))
        {      
            len = len + 1;     
        }
        
        if (len > intMaxBytes) 
        {
        	if (alert_yn == undefined || alert_yn == null || alert_yn.toLowerCase() != "n") {
        		document.getElementById(objID).blur();
        		LayerAlert(intMaxBytes + "Bytes 까지 입력가능합니다.");
        		document.getElementById(objID).value = strCurrentText.substring(0, i);
        		if ((strCurrentText.charCodeAt(i) < 0) || (strCurrentText.charCodeAt(i) > 127))
                    len = len - 2;     
        		else
        			len = len - 1;
        		$("#"+objTargetID).text(len);
                //document.getElementById(objID).readOnly = true;
                return;                
        	}
        }
//        document.getElementById(objTargetID).textContent = len + 1;
    }
    $("#"+objTargetID).text(len);
}


//ajax 호출시 로딩중 layer 호출
//Edited by 오세현 2012.11.22
function AjaxLodingStart(){
	var maskHeight = $(document).height(); 
    var maskWidth = $(document).width(); 
    maskHeightMar = maskHeight * 1 / 2;
    maskWidthMar = maskWidth * 1 / 2;
    maskHeightMar = maskHeightMar - 100;
    maskWidthMar = maskWidthMar - 100;
    $('#CommonMaskLayer').css({'width':maskWidth,'height':maskHeight});
    $('#CommonMaskLayerImg').css({'margin-left':maskWidthMar,'margin-top':maskHeightMar, 'padding':0});
    $('#CommonMaskLayer').fadeIn('fast');
    $('#CommonMaskLayer').fadeTo("fast", 0.6);
}

//로딩중 layer hidden
//Edited by 오세현 2012.11.22
function AjaxLodingStop(){
    $('#CommonMaskLayer').fadeOut('fast');
}

//Alert layer 호출
//message: alert message
//click_event: 확인시 호출 함수, null가능
//Edited by 오세현 2012.11.22
function LayerAlert(message, click_event)
{
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();    
	$('#mask').css({'width':maskWidth,'height':maskHeight});     
	$('#mask').fadeTo("fast",0.5);  
	
	var winH = $(window).height();
	var winW = $(window).width();
	$('#layer_alert').css('top',  winH/2-$('#layer_alert').height()/2);
	$('#layer_alert').css('left', winW/2-$('#layer_alert').width()/2);
	$('#layer_alert').fadeIn(2000);
	
	$('#CommonAlertLayerMessage').empty().append(message);
	$('#CommonAlertLayerBtnConfirm').focus();
	
	$('#mask').unbind('click');
	$('#CommonAlertLayerBtnConfirm').unbind('click');
	$("#close_layer_alert").unbind('click');
	
	$('#mask').bind('click', function() {
		$('#mask').hide();
		$('#layer_alert').hide();

		if(click_event != undefined && click_event != null) {
			click_event();
		}
	});
	$('#CommonAlertLayerBtnConfirm').bind('click', function() {
		$('#mask').hide();
		$('#layer_alert').hide();
		
		if(click_event != undefined && click_event != null) {
			click_event();
		}
	});
	$("#close_layer_alert").bind('click',function(){
		$('#mask, .popup_alert').hide();
	});
}

//Confirm layer 호출
//message: confirm message
//confirm_event: 확인시 호출 함수, null가능
//cancel_event: 취소시 호출 함수, null가능
//Edited by 오세현 2012.11.23
function LayerConfirm(message, confirm_event, cancel_event)
{
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();    
	$('#mask').css({'width':maskWidth,'height':maskHeight});     
	$('#mask').fadeTo("fast",0.5);  
	
	var winH = $(window).height();
	var winW = $(window).width();
	$('#layer_confirm').css('top',  winH/2-$('#layer_confirm').height()/2);
	$('#layer_confirm').css('left', winW/2-$('#layer_confirm').width()/2);
	$('#layer_confirm').fadeIn(2000);
	
	$('#CommonConfirmLayerMessage').empty().append(message);
	$('#CommonConfirmLayerBtnConfirm').focus();
	
	$('#mask').unbind('click');
	$('#CommonConfirmLayerBtnConfirm').unbind('click');
	$('#CommonConfirmLayerBtnCancel').unbind('click');
	$("#close_layer_confirm").unbind('click');
	
	$('#mask').bind('click', function() {
		$('#mask').hide();
		$('#layer_confirm').hide();

		if (cancel_event != undefined && cancel_event != null) {
			cancel_event();
		}
	});
	
	$('#CommonConfirmLayerBtnConfirm').bind('click', function() {
		$('#mask').hide();
		$('#layer_confirm').hide();
		
		if (confirm_event != undefined && confirm_event != null) {
			confirm_event();
		}
	});

	$('#CommonConfirmLayerBtnCancel').bind('click', function() {
		$('#mask').hide();
		$('#layer_confirm').hide();
		
		if (cancel_event != undefined && cancel_event != null) {
			cancel_event();
		}
	});
	$("#close_layer_confirm").bind('click',function(){
		$('#mask, .popup_alert').hide();
	});
}

//Layer Popup 호출 함수
//Edited by 오세현 2012.12.14
function OpenLayer(objid, close_function) {
	var id = '#' + objid;
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();
	//Set height and width to mask to fill up the whole screen
	
	$('#mask').css({'width':maskWidth,'height':maskHeight});
	
	//transition effect     
	//$('#mask').fadeIn(1000);    
	$('#mask').fadeTo("fast",0.5);  
	var winH = $(window).height();
	var winW = $(window).width();
	
	//Set the popup window to center
	$(id).css('top',  winH/2-$(id).height()/2);
	$(id).css('left', winW/2-$(id).width()/2);

	//transition effect
	$(id).fadeIn(2000); 	
	
	$('.popup_alert .close').unbind('click');
	$('#mask').unbind('click');
	$(id+"_layer").unbind('click');
	
	$('.popup_alert .close').bind('click', function() {
		$('#mask, .popup_alert').hide();
		if (close_function != undefined && close_function != null) {
			close_function();
		}
	});
	
	$('#mask').bind('click', function() {
		$('#mask, .popup_alert').hide();
		if (close_function != undefined && close_function != null) {
			close_function();
		}
	});
	
	$(id+"_layer").bind('click',function(){
		$('#mask, .popup_alert').hide();
	});
}

function CloseLayer() {
	$('#mask, .popup_alert').hide();
}
  


//YYYY-MM-DD 형식으로 날짜반환
//yy(년),mm(월),dd(일) int형 오늘날짜에서 변경된 날짜값 반환
function getDate(div,yy,mm,dd){
	if(div==null)div="";
	if(yy==null)yy=0;
	if(mm==null)mm=0;
	if(dd==null)dd=0;
	var cDate = new Date();
	var date = new Date(cDate.getFullYear()+yy,cDate.getMonth()+mm,cDate.getDate()+dd);
	var year = date.getFullYear();
	var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
	var day = date.getDate()<10?"0"+date.getDate():date.getDate();
	return year+div+month+div+day;
}


String.prototype.cut = function(len) {
    var str = this;
    var l = 0;
    for (var i=0; i<str.length; i++) {
            l += (str.charCodeAt(i) > 128) ? 2 : 1;
            if (l > len) return str.substring(0,i) + "..";
    }
    return str;
};


//전화걸기
function Fun_Common_tel(num){
	if(num.trim() == ""){
		alert("폰 번호가 없습니다.");
		return;
	}
	location.href="tel:" + num;
}

//SMS보내기
function Fun_Common_sms(num){
	if(num.trim() == ""){
		alert("폰 번호가 없습니다.");
		return;
	}
	location.href="sms:" + num;
}

//EMAIL보내기
function Fun_Common_mailto(addr){
	if(addr.trim() == ""){
		alert("이메일 주소가 없습니다.");
		return;
	}
	location.href="mailto:" + addr;
}
















/* 체크박스 이미지 */
function ChkButton(id) {
	if(jQuery("#"+id).attr("checked")) { 
		jQuery("#"+id).removeAttr("checked");
		jQuery("#"+id).removeClass("ip_c_on");
		jQuery("#"+id).next("label").removeClass("ip_c_on");
	} else { 
		jQuery("#"+id).attr("checked", "checked");
		jQuery("#"+id).addClass("ip_c_on");
		jQuery("#"+id).next("label").addClass("ip_c_on");
	} 
}

/* 라디오버튼 이미지 */
function RadioButton(name,id) {
	if(jQuery(':radio[name="'+name+'"]:checked').length<1){
		jQuery("#"+id).attr("checked", "checked");
		jQuery("#"+id).addClass("ip_r_on");
		jQuery("#"+id).next("label").addClass("ip_r_on");
	} else {
		jQuery('input[name="'+name+'"]').removeAttr("checked");
		jQuery('input[name="'+name+'"]').removeClass("ip_r_on");
		jQuery('input[name="'+name+'"]').next("label").removeClass("ip_r_on");
		jQuery("#"+id).attr("checked", "checked");
		jQuery("#"+id).addClass("ip_r_on");
		jQuery("#"+id).next("label").addClass("ip_r_on");
	} 
}

/* 셀렉트 박스 */
function SelectClick(id) {
	if( $("#"+id).is(':hidden')) { 
		jQuery("#"+id).show();
		jQuery("#"+id).css("z-index","100");
		jQuery("#"+id).parent("dl").css("z-index","10");
	} else { 
		jQuery("#"+id).hide();
		jQuery("#"+id).css("z-index","1");
		jQuery("#"+id).parent("dl").css("z-index","1");
	} 
}
function SelectSel(now,id) {
	jQuery("#"+id+" ul li").removeClass("sel");
	jQuery(now).addClass("sel");
	var strValue=jQuery(now).text();
	var strId = jQuery('#'+id).attr("id").replace("sel_", "");
	jQuery("#"+strId).attr("value",strValue);
	jQuery("#"+id).prev("dt").text(strValue);
	jQuery("#"+id).prev("dt").removeClass("none");
	jQuery("#"+id).hide();
}
$(document).ready(function(){
	jQuery("dl.formSelect").mouseleave(function(){
		jQuery(this).children("dd").hide();
	});

	jQuery('dl.formSelect dd ul li.sel').each(function() {
		jQuery(this).addClass("on");
	});

	jQuery("dl.formSelect").delegate('li','mouseenter focus', function(){ 
		jQuery('dl.formSelect dd ul li').removeClass("on");
		jQuery(this).addClass("on");
	}).bind('mouseleave',function(){;
		jQuery('dl.formSelect dd ul li').removeClass("on")
		jQuery('dl.formSelect dd ul li.sel').each(function() {
			jQuery(this).addClass("on");
		});
	});
});


