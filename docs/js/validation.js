function validatenumber(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function validateurl(evt){
	var theEvent = evt || window.event;
	var message;
	var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
	var urlToValidate = theEvent.keyCode || theEvent.which;
	if (!myRegExp.test(urlToValidate)){
		theEvent.returnValue = false;
		if(theEvent.preventDefault) theEvent.preventDefault();
	}
}

$(document).ready(function() {
	$("form input").each(function(){ 
		if($(this).attr('validatorrequired') == 'true'){
			$(this).attr('required','true'); 
		}
		if($(this).attr('validator') == "[email]"){
			$(this).attr('type','email');
		}
		if($(this).attr('validator') == "[number]"){
			$(this).attr('type','number');
			$(this).attr('onkeypress','validatenumber(event)');
		}
		if($(this).attr('validator') == "[url]"){
			$(this).attr('type','url');
			$(this).attr('onkeypress','validateurl(event)');
		}	
	});
	$("form textarea").each(function(){ 
		if($(this).attr('validatorrequired') == 'true'){
			$(this).attr('required','true'); 
		}	
	});
});
