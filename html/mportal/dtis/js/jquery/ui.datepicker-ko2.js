function datepickerf(ds, de, ids, ide, ds_select_func, de_select_func){
	// 달력 - 시작일
    $('#'+ds).datepicker({
    	dateFormat: 'yy/mm/dd',
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		prevText: '이전달',
		nextText: '다음달',
		showAnim: 'blind',
		showMonthAfterYear: true,
		showOtherMonths: true,
		selectOtherMonths: true,
		showButtonPanel: true,
		closeText: '닫기',
		currentText: '금월',
		//changeMonth: true,
		//changeYear: true,
		//numberOfMonths: 2,
		//defaultDate: -30,
        onSelect: function (dateText, inst) {
            var sEndDate = jQuery.trim($('#'+de).val());
            if (sEndDate.length>0) {
                var iEndDate   = parseInt(sEndDate.replace('/', '').replace('/', ''));
                var iStartDate = parseInt(jQuery.trim(dateText).replace('/', '').replace('/', ''));
                if (iStartDate>iEndDate) {
                    alert('시작일보다 종료일이 과거일 수 없습니다.');
                    $('#'+ds).val($('#'+de).val());
                }
            }
//            if(ds_select_func != undefined && ds_select_func != null) {
//            	ds_select_func(dateText, inst);
//            }
        }
    });
//    if(ids != undefined && ids != null)
//    	$('#'+ids).click(function() {$('#'+ds).focus();});
    // 달력 - 종료일
    $('#'+de).datepicker({
        dateFormat: 'yy/mm/dd',
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
	    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		prevText: '이전달',
		nextText: '다음달',
		showAnim: 'blind',
		showMonthAfterYear: true,
		showOtherMonths: true,
		selectOtherMonths: true,
		showButtonPanel: true,
		closeText: '닫기',
		currentText: '금월',
        onSelect: function (dateText, inst) {
            var sStartDate = jQuery.trim($('#'+ds).val());
            if (sStartDate.length>0) {
                var iStartDate = parseInt(sStartDate.replace('/', '').replace('/', ''));
                var iEndDate  = parseInt(jQuery.trim(dateText).replace('/', '').replace('/', ''));
                if (iStartDate>iEndDate) {
                    alert('시작일보다 종료일이 과거일 수 없습니다.');
                    $('#'+de).val($('#'+ds).val());
                }
            }
            if(de_select_func != undefined && de_select_func != null) {
            	de_select_func(dateText, inst);
            }
        }
    });
//    if(ide != undefined && ide != null)
//    	$('#'+ide).click(function() {$('#'+de).focus();});
}