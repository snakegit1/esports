$(document).ready(function(){
	var landingIdVal = $("form").attr("bpmlandingpageid");
	var serviceUrlVal = $("form").attr("bpmserviceurl");
	
	var bmpjsonObj = {};
	
	$("form").each(function(){
		if($(this).attr('bpmlandingpageid')){
			if(!$(this).hasClass( "BPMFORM" )){
				$(this).find('input').each(function(){
					bmpname = $(this).attr("name");
					
					if(typeof bmpname !== "undefined"){
						bmpname = bmpname.replace(/[\[\]']+/g,'');
						bmpname = bmpname.replace(/\s/g,'');
						if(bmpname.toLowerCase().indexOf('useemail') != -1){
							$(this).addClass('slp_bpm_useemail');
						}
						if(bmpname.toLowerCase().indexOf('name') != -1 && bmpname.toLowerCase().indexOf('last') == -1 && bmpname.toLowerCase().indexOf('job') == -1 && bmpname.toLowerCase().indexOf('organization') == -1 && bmpname.toLowerCase().indexOf('organisation') == -1 && bmpname.toLowerCase().indexOf('city') == -1 && bmpname.toLowerCase().indexOf('country') == -1 ){
							$(this).addClass('slp_bpm_name');
						}
						if(bmpname.toLowerCase().indexOf('email') != -1){
							$(this).addClass('slp_bpm_email');
						}
						if(bmpname.toLowerCase().indexOf('zip') != -1 || bmpname.toLowerCase().indexOf('pin') != -1 ){
							$(this).addClass('slp_bpm_zip');
						}
						if(bmpname.toLowerCase().indexOf('mobile') != -1  || bmpname.toLowerCase().indexOf('phone') != -1 || bmpname.toLowerCase().indexOf('contact') != -1){
							$(this).addClass('slp_bpm_mobilephone');
						}
						if(bmpname.toLowerCase().indexOf('company') != -1 || bmpname.toLowerCase().indexOf('organisation') != -1 || bmpname.toLowerCase().indexOf('organization') != -1){
							$(this).addClass('slp_bpm_company');
						}
						if(bmpname.toLowerCase().indexOf('industry') != -1){
							$(this).addClass('slp_bpm_industry');
						}
						if(bmpname.toLowerCase().indexOf('fulljobtitle') != -1 || bmpname.toLowerCase().indexOf('job') != -1 || bmpname.toLowerCase().indexOf('designation') != -1){
							$(this).addClass('slp_bpm_fulljobtitle');
						}
						if(bmpname.toLowerCase().indexOf('city') != -1){
							$(this).addClass('slp_bpm_city');
						}
						if(bmpname.toLowerCase().indexOf('country') != -1){
							$(this).addClass('slp_bpm_country');
						}
						if(bmpname.toLowerCase().indexOf('commentary') != -1 || bmpname.toLowerCase().indexOf('comment') != -1){
							$(this).addClass('slp_bpm_commentary');
						}
						
						
					}
					
				});
				
			}
		}
		
	});	
	
	/*
	$("form input").each(function (){
		if($(this).parent().find(".embedded-wrap")){
													
		}else
		{
			bmpname = $(this).attr("name");
				if(typeof bmpname !== "undefined"){
					bmpnameclass = bmpname.replace(/\s/g,'');
					bmpnameclass = bmpname.replace(/[\[\]']+/g, '');
					bmpname = bmpname.replace(/[\[\]']+/g, '');
				}
				else
					bmpnameclass = bmpname;
				$(this).addClass(bmpnameclass);
				bmpjsonObj [bmpname] = "."+bmpnameclass;
		}
	});
	*/
	
	bmpjsonObj = {
					"Name": ".slp_bpm_name", // Name of a visitor, submitting the page
					"Email": ".slp_bpm_email", // Visitor's email
					"Zip": ".slp_bpm_zip", // Visitor's ZIP code
					"MobilePhone": ".slp_bpm_mobilephone", // Visitor's phone number
					"Company": ".slp_bpm_company", // Name of a company (for business landing pages)
					"Industry": ".slp_bpm_industry", // Company industry (for business landing pages)
					"FullJobTitle": ".slp_bpm_fulljobtitle", // Visitor's job title (for business landing pages)
					"UseEmail": ".slp_bpm_useemail", // Logical value: 'true' equals to visitor's opt-in to receive emails
					"City": ".slp_bpm_city", // City
					"Country": ".slp_bpm_country", // Country
					"Commentary": ".slp_bpm_commentary"
				};
	
	bmpconfig = {
		fields: bmpjsonObj,
		landingId: landingIdVal,
		serviceUrl: serviceUrlVal,
		redirectUrl: ""
	};

	initLanding(); 
	
	if ($('[id^="slpages_"]').length > 0) {
	  $('[id^="slpages_"]').each(function(e){
	  	var div_id = $(this).attr("id");
	  	div_id = div_id.replace("slpages_","");
	  	var div_val = "";
	  	var isInIframe = (window.location != window.parent.location) ? true : false;
	  	if(isInIframe){
	  		var location = document.referrer;
	  		var sPageURL = location.substring(location.indexOf('?')+1, location.length);
	  	} else {
	  		var sPageURL = decodeURIComponent(window.location.search.substring(1));
	  	}
	  	
		var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == div_id){
	            div_val = sParameterName[1];
	            if(div_val !== '')
					$("#slpages_"+div_id).text(div_val);
	        }
	    }
	  	
	  });
	}
	gswidth = $( window ).width();  				
	if(gswidth <= 750){  					
  		$(".sunnytainer").each(function(){
            var minHeight = $(this).css("min-height");
            minHeight = minHeight.replace("px","");
            // if($('.sunnytainer').length >1){
				// if(minHeight > 100) {
					// $(this).css("min-height","100px");
				// }
			// }
        });
        if($('body .sunnytainer:first-child > .grid-stack').height() < 150) {
        	$('body .sunnytainer:first-child > .grid-stack').addClass('grid-top');
        }
    }
	$(document).on("submit","form.slpjsgenerateform", function( event ) {
		var buttonoriginalbc = $(this).find('input[type=submit]').css('background-color');
		var buttonoriginalbrc = $(this).find('input[type=submit]').css('border-color');
		
		$(this).find('input[type=submit]').css('background-color','#d3d3d3');		
		$(this).find('input[type=submit]').css('border-color','#d3d3d3');
		$(this).find('input[type=submit]').prop('disabled', true);
		
		
		var thankuMsg = $(this).find('input[name=thankuMsg]').val();
		
		if(!thankuMsg){
			thankuMsg = $(this).parent().find('#sec-formdata-wrapper').find('#form-thankumsg-span').attr('data-value');
		}
		
		$(this).find('input[name=thankuMsg]').append("<div id='thethankumsg' class='col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12'><div class='thanks_msg'>"+thankuMsg+"</div></div>");
		var path = window.location.pathname;
		path = path.replace("\/u","u");
		var pageURLsub = window.location.host;
		resultURL = pageURLsub+path;
		$(this).find('input[name=pageUrl]').val(resultURL);
		
		var leadDataReceiver = $(this).find('input[name=leadDataReceiver]').val();
		
		if(!leadDataReceiver){
			leadDataReceiver = $(this).parent().find('#sec-formdata-wrapper').find('#form-emailto-span').attr('data-value');
			//leadDataReceiver = 'vineet.kharwar@gaboli.com';
			$(this).find('input[name=leadDataReceiver]').val(leadDataReceiver);
		}
		
		var formData = $(this).serialize();
		var wpformData = $('input[name!=leadDataReceiver][name!=thankuMsg][name!=webhookUrl][name!=pageUrl][name!=redirectUrl]', this).serialize();;
		
		var redirectUrl = $(this).find('input[name=redirectUrl]').val();
		var whurl = $(this).find('input[name=webhookUrl]').val();
		
		
		if(!redirectUrl){
			redirectUrl = $(this).parent().find('#sec-formdata-wrapper').find('#form-redirecturl-span').attr('data-value');
		}
		
		if (redirectUrl && !redirectUrl.match(/^http([s]?):\/\/.*/)) {
			redirectUrl = 'http://' + redirectUrl;
		}
		
		submitel = $(this);
		
		
		if(!whurl){
			whurl = $(this).parent().find('#sec-formdata-wrapper').find('#form-webhook-span').attr('data-value');
		}
		
		if(typeof whurl != 'undefined'){
			if(whurl.length > 0){
				webhooktrigger(whurl,wpformData);
			} 
		}
		
		$.ajax({
			type: 'POST',
			url: 'https://sunnylandingpages.com/editor/tocopy/contact.php',
			data: formData,
			success: function (msg) {
				console.log("success");
				submitel.find('input[type=submit]').css('background-color',buttonoriginalbc);		
				submitel.find('input[type=submit]').css('border-color',buttonoriginalbrc);
				submitel.find('input[type=submit]').prop('disabled', false);
				
				if(thankuMsg == '')
				{
														
				}
				else
				{
					$.magnificPopup.open({
						items: [
							  {
								src: '#thethankumsg',
								type: 'inline'
							  }
							],
							type: 'inline'
					});					
				}
				
				if (redirectUrl){
					setTimeout(
					  function() 
					  {
						  window.location.href = redirectUrl;
					  }, 5000);
				}
			},
			error: function () {
				$.magnificPopup.open({
						items: [
							  {
								src: '#thethankumsg',
								type: 'inline'
							  }
							],
							type: 'inline'
					});
                                if (redirectUrl){
                                        setTimeout(
                                          function()
                                          {
                                                  window.location.href = redirectUrl;
                                          }, 5000);
                                }		
				console.log("un successful");
				submitel.find('input[type=submit]').css('background-color',buttonoriginalbc);		
				submitel.find('input[type=submit]').css('border-color',buttonoriginalbrc);
				submitel.find('input[type=submit]').prop('disabled', false);
			}
		});
		event.preventDefault();
	});
});

Number.prototype.padLeft = function(base,chr){
	var  len = (String(base || 10).length - String(this).length)+1;
	return len > 0? new Array(len).join(chr || "0")+this : this;
}

function webhooktrigger(whurl,formData){
	$.ajax({
			type: 'POST',
			url: whurl,
			data: formData,
			async: true,
			success: function () {
			},
			error: function () {					
			}
		});
}

function textClock(dendformaty,week_text,day_text,hour_text,minut_text,sec_text,page){
	if(page == "publish") {
		if($("#digitalclock").children().html()) {
			$("#digitalclock").countdown("stop");
			$("#digitalclock").children().remove();
		}
		$("#clock").children().remove();
		if($("#clock").length > 0){
			$("#clock").html("<div class=\"col-sm-12\"><span class=\"countdown-row countdown-show4 countdown\">"
					+ "<span class=\"countdown-section cdddld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">0</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+day_text+"</span></span> "
					+ "<span class=\"countdown-section cdhld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">00</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+hour_text+"</span></span> "
					+ "<span class=\"countdown-section cdmld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">00</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+minut_text+"</span></span> "
					+ "<span class=\"countdown-section cdsld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">00</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+sec_text+"</span></span> "
					+ "</span></div>");
			$("#clock").countdown(dendformaty).on("update.countdown", function(event) {
				$("#clock").children().remove();
				var totalHours = event.offset.hours;
				var totalMinutes = event.offset.minutes;
				if($("#day_toggle").val() == "Off") {
					totalHours = parseInt($("#static-day").val()) *24 + totalHours;
				}
				if($("#hour_toggle").val() == "Off") {
					totalMinutes = parseInt(totalHours) * 60 + totalMinutes;
				}
				
				var $this = $(this).html(event.strftime(""
					+ "<div class=\"col-sm-12\"><span class=\"countdown-row countdown-show4 countdown\">"
					+ "<span class=\"countdown-section cdddld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">%-D</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+day_text+"</span></span> "
					+ "<span class=\"countdown-section cdhld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">"+totalHours+"</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+hour_text+"</span></span> "
					+ "<span class=\"countdown-section cdmld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">"+totalMinutes+"</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+minut_text+"</span></span> "
					+ "<span class=\"countdown-section cdsld\"><span class=\"countdown-amounts count_down_digit cddb cddi cddff cddc\">%S</span><span class=\"countdown-period count_down_text cdtb cdti cdtff cdtc cdld\">"+sec_text+"</span></span> "
					+ "</span></div>"));
			});
		}
	}
 
}																	
function digitClock(dendformaty,week_text,day_text,hour_text,minut_text,sec_text,page){
	if($("#clock").children().html()) {
		$("#clock").countdown("stop");
		$("#clock").children().remove();
	}
	$("#digitalclock").children().remove();
	var flip_update = 0;
	if($("#digitalclock").length > 0){
		
	$("#digitalclock").countdown(dendformaty).on("update.countdown", function(event) {
		flip_update = 1;
		$("#digitalclock").children().remove();
		var totalDays = event.strftime("%-D");
		var totalHours = event.offset.hours;
		var totalMinutes = event.offset.minutes;
		var totalSeconds = event.offset.seconds;
		if($("#day_toggle").val() == "Off") {
			totalHours = parseInt($("#static-day").val()) *24 + totalHours;
		}
		if($("#hour_toggle").val() == "Off") {
			totalMinutes = parseInt(totalHours) * 60 + totalMinutes;
		}
		if(totalDays == 0) {
			var totalDays_less = 0;
		}else {
			var totalDays_less = totalDays + 1;
		}
		if(totalHours == 0) {
			var totalHours_less =  0;
		}else {
			var totalHours_less =  totalHours + 1;
		}
		if(totalMinutes == 0) {
			var totalMinutes_less = 0;
		}else {
			var totalMinutes_less =  totalMinutes + 1;
		}
		if(totalSeconds == 0) {
			var totalSeconds_less = 0;
		}else {
			var totalSeconds_less =  totalSeconds + 1;
		}
		var days_arr = totalDays.toString().split("");
		var days_less_arr =  totalDays_less.toString().split("");
		var hours_arr = totalHours.toString().split("");
		var hours_less_arr = totalHours_less.toString().split("");
		var minutes_arr = totalMinutes.toString().split("");
		var minutes_less_arr = totalMinutes_less.toString().split("");
		var sec_arr = totalSeconds.toString().split("");
		var sec_less_arr = totalSeconds_less.toString().split("");
		if(days_arr.length < 2) {
			days_arr.push("0");days_arr.reverse();
		}
		if(days_less_arr.length < 2) {
			days_less_arr.push("0");days_less_arr.reverse();
		}
		if(hours_arr.length < 2) {
			hours_arr.push("0");hours_arr.reverse();
		}
		if(hours_less_arr.length < 2) {
			hours_less_arr.push("0");hours_less_arr.reverse();
		}
		if(minutes_arr.length < 2) {
			minutes_arr.push("0");minutes_arr.reverse();
		}
		if(minutes_less_arr.length < 2) {
			minutes_less_arr.push("0");minutes_less_arr.reverse();
		}
		if(sec_arr.length < 2) {
			sec_arr.push("0");sec_arr.reverse();
		}
		if(sec_less_arr.length < 2) {
			sec_less_arr.push("0");sec_less_arr.reverse();
		}
		var isplay_sec,isplay_hr,isplay_week,isplay_minut,isplay_day,isplay_minut_1,isplay_hr_1  = "";
		
		var text_new = "";
		jQuery.each( days_arr, function( i, val ) {
			if (val !== days_less_arr[i] && totalMinutes == 0 && totalSeconds == 0) {
				isplay_day = "play";
			}
			text_new = text_new+"<ul class=\"flip count_down_digit cddb cddi cddff cddc cdddld "+isplay_day+"\"><li class=\"flip-clock-before\"><a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+days_less_arr[i]
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+days_less_arr[i]
			+"</div></div></a></li><li class=\"flip-clock-active\"><a href=\"#\"><div class=\"up\"><div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div></a></li></ul>";
		});
		text_new = text_new+"<span class=\"flip-clock-divider hours cdhld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+hour_text+"</span> <span class=\"flip-clock-dot top cdddld\"></span> <span class=\"flip-clock-dot bottom cdddld\"></span> </span> ";
		jQuery.each( hours_arr, function( i, val ) {
			if (val !== hours_less_arr[i] && totalMinutes == 0 && totalSeconds == 0) {
				isplay_hr = "play";
			}
			text_new = text_new+"<ul class=\"flip count_down_digit cddb cddi cddff cddc cdhld "+isplay_hr+"\"> <li class=\"flip-clock-before\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+hours_less_arr[i]
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+hours_less_arr[i]
			+"</div></div></a> </li><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div></a> </li></ul>";
		});
		text_new = text_new + "<span class=\"flip-clock-divider minutes cdmld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+minut_text+"</span> ";
		if($("#hour_toggle").val() == "On" || $("#day_toggle").val() == "On") {
			text_new = text_new + "<span class=\"flip-clock-dot top\"></span> <span class=\"flip-clock-dot bottom\"></span>";
		}
		text_new = text_new + "</span>";
		jQuery.each( minutes_arr, function( i, val ) {
			if (val !== minutes_less_arr[i] && totalSeconds == 0) {
				isplay_minut = "play";
			}
			text_new = text_new + " <ul class=\"flip count_down_digit cddb cddi cddff cddc cdmld "+isplay_minut+"\"> <li class=\"flip-clock-before\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+minutes_less_arr[i]
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+minutes_less_arr[i]
			+"</div></div></a> </li><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div></a> </li></ul>"
		});
		text_new = text_new + "<span class=\"flip-clock-divider seconds cdsld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+sec_text+"</span> <span class=\"flip-clock-dot top\"></span> <span class=\"flip-clock-dot bottom\"></span> </span>";
		jQuery.each( sec_arr, function( i, val ) { 
			if (val !== sec_less_arr[i]) {
				isplay_sec = "play";
			}
			text_new = text_new + "<ul class=\"flip count_down_digit cddb cddi cddff cddc cdsld "+isplay_sec+"\"> <li class=\"flip-clock-before\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+sec_less_arr[i]
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+sec_less_arr[i]
			+"</div></div></a> </li><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+val
			+"</div></div></a> </li></ul>";
		});
		
		var $this = $(this).html(event.strftime(""
		+ "<div class=\"clock flip-clock-wrapper\" style=\"margin:20px 0;\">"
		+ "<span class=\"flip-clock-divider days cdddld\">" 
		+	"<span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+day_text+"</span>" 
		+	"<span class=\"flip-clock-dot top\"></span> "
		+	"<span class=\"flip-clock-dot bottom\"></span>" 
		+"</span> "+
		text_new
		+ "</div>"));
	});	
	if(flip_update == 0) {
		var text_new = "";
			text_new = text_new+"<ul class=\"flip count_down_digit cddb cddi cddff cddc cdddld \"><li class=\"flip-clock-active\"><a href=\"#\"><div class=\"up\"><div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a></li></ul><ul class=\"flip count_down_digit cddb cddi cddff cddc cdddld \"><li class=\"flip-clock-active\"><a href=\"#\"><div class=\"up\"><div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a></li></ul>";		
		text_new = text_new+"<span class=\"flip-clock-divider hours cdhld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+hour_text+"</span> <span class=\"flip-clock-dot top cdddld\"></span> <span class=\"flip-clock-dot bottom cdddld\"></span> </span> ";
		
			text_new = text_new+"<ul class=\"flip count_down_digit cddb cddi cddff cddc cdhld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul><ul class=\"flip count_down_digit cddb cddi cddff cddc cdhld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul>";		
		text_new = text_new + "<span class=\"flip-clock-divider minutes cdmld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+minut_text+"</span> ";
		if($("#hour_toggle").val() == "On" || $("#day_toggle").val() == "On") {
			text_new = text_new + "<span class=\"flip-clock-dot top\"></span> <span class=\"flip-clock-dot bottom\"></span>";
		}
		text_new = text_new + "</span>";		
			text_new = text_new + "<ul class=\"flip count_down_digit cddb cddi cddff cddc cdmld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul><ul class=\"flip count_down_digit cddb cddi cddff cddc cdmld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul>";		
		text_new = text_new + "<span class=\"flip-clock-divider seconds cdsld\"> <span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+sec_text+"</span> <span class=\"flip-clock-dot top\"></span> <span class=\"flip-clock-dot bottom\"></span> </span>";
			text_new = text_new + "<ul class=\"flip count_down_digit cddb cddi cddff cddc cdsld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul><ul class=\"flip count_down_digit cddb cddi cddff cddc cdsld \"><li class=\"flip-clock-active\"> <a href=\"#\"> <div class=\"up\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div><div class=\"down\"> <div class=\"shadow\"></div><div class=\"inn\">"
			+"0"
			+"</div></div></a> </li></ul>";		
		$("#digitalclock").html("<div class=\"clock flip-clock-wrapper\" style=\"margin:20px 0;\">"
		+ "<span class=\"flip-clock-divider days cdddld\">" 
		+	"<span class=\"flip-clock-label count_down_text cdtb cdti cdtff cdtc cdld\">"+day_text+"</span>" 
		+	"<span class=\"flip-clock-dot top\"></span> "
		+	"<span class=\"flip-clock-dot bottom\"></span>" 
		+"</span> "+
		text_new
		+ "</div>");
	}
	}
			
}
function start_vk(countval){
	if(countval == 1) {
		ctd_day_var = parseInt($("#static-day").val());
		ctd_hr_var = parseInt($("#static-hr").val());
		ctd_mint_var = parseInt($("#static-mint").val());
		ts = parseInt($("#tstime").val());
	}
	ts = (ts - (new Date()).getTime() ) + (new Date()).getTime();
	var d = new Date,
	dstartformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
			   d.getDate().padLeft()
			   ].join("/") +" " +
			  [d.getHours().padLeft(),
			   d.getMinutes().padLeft(),
			   d.getSeconds().padLeft()].join(":");	
	if(countval == 1) {
		var dendformaty = $("#enddatetime").val();
		var week_text = $("#text_for_week").val();
		var day_text = $("#text_for_day").val();
		var hour_text = $("#text_for_hour").val();
		var minut_text = $("#text_for_minut").val();
		var sec_text = $("#text_for_second").val();
	}
	
	if(countval == 1) {
		if($("#typeofcd").val() == "flip")
			digitClock(dendformaty,week_text,day_text,hour_text,minut_text,sec_text,"publish");
		else
			textClock(dendformaty,week_text,day_text,hour_text,minut_text,sec_text,"publish");
	} 
}

function base64_decode (encodedData) { 
  

  if (typeof window !== 'undefined') {
    if (typeof window.atob !== 'undefined') {
      return decodeURIComponent(escape(window.atob(encodedData)))
    }
  } else {
    return new Buffer(encodedData, 'base64').toString('utf-8')
  }

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var o1
  var o2
  var o3
  var h1
  var h2
  var h3
  var h4
  var bits
  var i = 0
  var ac = 0
  var dec = ''
  var tmpArr = []

  if (!encodedData) {
    return encodedData
  }

  encodedData += ''

  do {
    
    h1 = b64.indexOf(encodedData.charAt(i++))
    h2 = b64.indexOf(encodedData.charAt(i++))
    h3 = b64.indexOf(encodedData.charAt(i++))
    h4 = b64.indexOf(encodedData.charAt(i++))

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4

    o1 = bits >> 16 & 0xff
    o2 = bits >> 8 & 0xff
    o3 = bits & 0xff

    if (h3 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1)
    } else if (h4 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1, o2)
    } else {
      tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
    }
  } while (i < encodedData.length)

  dec = tmpArr.join('')

  return decodeURIComponent(escape(dec.replace(/\0+$/, '')))
}

function createObject() {
    landing.createObjectFromLanding(bmpconfig)
}

function initLanding() {
	if(bmpconfig.landingId)
		landing.initLanding(bmpconfig);
}

