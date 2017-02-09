//var base_url = "https://dev.yosicare.com/healthyvillage-app/";
var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";

$("a.forgot-password").click(function(){ 
	$(this).parent().parent().hide();
	$("input[name='password']").parent().parent().hide();
	$("input[name='submit']").val('Submit');
	$("#form_typ").val('f');
	return false;
});
$('#privacy-box').niceScroll({
		cursorcolor: "#2f185c",
        cursorborder: "0",
        autohidemode: true,
		//cursorfixedheight: 47,
        cursormaxheight: 30
	});
	//$("#privacy_html").css('display','none');
$(document).ready(function(e) {
    setTimeout(function(){ $("#loading").hide(); $("#privacy_html").css('display','none');},2000);
	
	
	var slickOpts = {
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots: true,
	centerMode: true,
	centerPadding: '0',
	adaptiveHeight: true,
    };
    $('#walkthrough-items').slick(slickOpts);
	
	var email    = $("#email");
	var password = $("#password");
	var cpassword = $("#con_password");
	
	email.blur(validateEmail);	
	password.blur(validatePassword);
	cpassword.blur(validateCpassword);
	
	email.keyup(validateEmail);
	password.keyup(validatePassword);
	cpassword.keyup(validateCpassword);
	
	$('#sign_in_up').submit(function(){ 
		if(validateEmail() & validatePassword() & validateCpassword())
		{
			var dataString ="uname="+$("#email").val()+"&pass="+$("#password").val()+"&act="+$("#form_typ").val()+"&ccemail="+$("#ccemail:checked").val()+"&ccphone="+$("#ccphone:checked").val()+"&fname="+fname.val()+"&lname="+lname.val()+"&dob="+dob.val()+"&cphone="+cphone.val();
			$.ajax({
				url:base_url+"mobile-app?page=login",
				type:"POST",
				data:dataString,
				dataType:"json",
				beforeSend:function(){
					$("#loading").show();
				},
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success=="Y"){
						window.localStorage.setItem("pat_id", data.data.Id);
						window.localStorage.setItem("pat_name", data.data.FirstName+" "+data.data.LastName);
						window.localStorage.setItem("pat_phone", data.data.Phone);
						window.localStorage.setItem("pat_dob", data.data.Dob);
						window.localStorage.setItem("pat_reftok", data.data.practice.refresh_token);
						window.localStorage.setItem("pat_acctok", data.data.practice.access_token);
						if($("#form_typ").val() == "u"){
							window.localStorage.setItem("pat_form", 'new');
							location.href = "profile.html";
						}
						else
						location.href = "home.html";
					}else{
						$('#password').parent().addClass("has-error");
						$('#email').parent().addClass("has-error");	
						setTimeout(function(){$('.login_err').html(data.det);}, 2000);
						//window.localStorage.clear();
					}
				}
			});
		}
		return false;
	});
		
		function validateEmail()
		{
			var a = $("#email").val();
			var filter = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
			if(a == "")
			{
				$('#email').parent().addClass("has-error");
				return false;
			}else
			{
				if(filter.test(a)){
					$("#email").parent().removeClass("has-error");
					return true;
				}
				else{
					$('#email').parent().addClass("has-error");
					return false;
				}
			}
		}
		
		function validatePassword(){
			if($("#form_typ").val() == "i"){
				var password  = $('#password').val();
				if(password == '')
				{
					$('#password').parent().addClass("has-error");				
					return false;
				}
			}
			$('#password').parent().removeClass("has-error");
			return true;
		}
		
		function validateCpassword(){
			if($("#form_typ").val() == "u"){
				var con_password  = $('#con_password').val();
				if(con_password == '' && con_password != $('#password').val())
				{
					$('#con_password').parent().addClass("has-error");				
					return false;
				}
			}
			$('#con_password').parent().removeClass("has-error");
			return true;
		}
		
		
	/* Consent form validation */
	var fname = $("#fname");
	var lname = $("#lname");
	var dob = $("#dob");
	var cphone = $("#cphone");
	var cemail = $("#cemail");
	
	fname.on('blur keyup',validateFname);
	lname.on('blur keyup',validateLname);
	dob.on('blur keyup',validateDob);
	cphone.on('blur keyup',validateCphone);
	cemail.on('blur keyup',validateCemail);
	
	$("#consent").submit(function(){ 
		if(validateFname() & validateLname() & validateDob() & validateCphone() & validateCemail()){ 
			if($("#cconf").val() == 1){
				$("#loading").show();
				//fname:fname.val(),lname:lname.val(),dob:dob.val(),cphone:cphone.val(),cemail:cemail.val(),ccphone:$("#ccphone:checked").val(),ccemail:$("#ccemail:checked").val()
				$.post(base_url+"mobile-app?page=checkmail",{cemail:cemail.val()},function(data){
					$("#consent").hide();
					$("#email").val(cemail.val()).attr('readonly','readonly');
						if(data.data['UserCheck'] == "N"){
							$("#form_typ").val('u');
							$("#con_password").parent().parent().show();
							$(".loginlogotext").find('span').each(function(index, element) {
                                $(this).hide();
                            });
							$(".forgot-password").parent().parent().hide();
							$(".loginlogotext .signup").show();
							$("#sign_in_up #submit").val('Sign Up');
						}else{
							$("#form_typ").val('i');
							$(".loginlogotext .login").empty().append('Please Login to Access Your Profile');
						}
						$("#sign_in_up").show();
						$("#loading").hide();
					},"json");
			}else{
				$(".md-modal").addClass('md-show');
				$(".md-overlay").addClass('md-show');
				$(".md-modal .success_content").find('p').remove();
				if($("#ccphone:checked").val())
				$(".md-modal .success_content").append('<p>&#10004; Phone consent confirmed</p>');
				if($("#ccemail:checked").val())
				$(".md-modal .success_content").append('<p>&#10004; Email consent confirmed</p>');
			}
		}
		return false;
	});
	
	function validateFname(){
		var fname  = $('#fname').val();
		if(fname == '')
		{
			$('#fname').parent().addClass("has-error");				
			return false;
		}
		$("#fname").parent().removeClass('has-error'); return true;	
	}
	
	function validateLname(){
		var lname  = $('#lname').val();
		if(lname == '')
		{
			$('#lname').parent().addClass("has-error");				
			return false;
		}
		$("#lname").parent().removeClass('has-error'); return true;	
	}
	
	function validateDob(){
		var dob  = $('#dob').val();
		if(dob == '')
		{
			$('#dob').parent().addClass("has-error");				
			return false;
		}
		return isDate($('#dob'));
		//$("#dob").parent().removeClass('has-error'); return true;	
	}
	
	function validateCphone(){
		var cphone  = $('#cphone').val();
		if(cphone == '')
		{
			$('#cphone').parent().addClass("has-error");				
			return false;
		}
		
		$("#cphone").parent().removeClass('has-error'); return true;	
	}
	
	function validateCemail(){
		var cemail  = $('#cemail').val();
		var filter = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
		if(cemail == '')
		{
			$('#cemail').parent().addClass("has-error");				
			return false;
		}else
			{
				if(filter.test(cemail)){
					$("#cemail").parent().removeClass("has-error");
					return true;
				}
				else{
					$('#cemail').parent().addClass("has-error");
					return false;
				}
			}
	}
	var dtCh = "/";
	var minYear = 1875;
	var maxYear = new Date().getFullYear();
	function isDate(element) {
    var dtStr = element.val();
    
    var daysInMonth = DaysArray(12)
    var pos1 = dtStr.indexOf(dtCh)
    var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
     
    var strMonth = dtStr.substring(0, pos1)
    var strDay = dtStr.substring(pos1 + 1, pos2)
    var strYear = dtStr.substring(pos2 + 1)
    strYr = strYear
    if (strDay.charAt(0) == "0" && strDay.length > 1)
        strDay = strDay.substring(1)
    if (strMonth.charAt(0) == "0" && strMonth.length > 1)
        strMonth = strMonth.substring(1)
    for (var i = 1; i <= 3; i++) {
        if (strYr.charAt(0) == "0" && strYr.length > 1)
            strYr = strYr.substring(1)
    }
    month = parseInt(strMonth)
    day = parseInt(strDay)
    year = parseInt(strYr)
    if (pos1 == -1 || pos2 == -1) {
        $('#'+element.attr('id')).parent().addClass("has-error");
        //$('#date-error-custom').show().text("The date format should be : mm/dd/yyyy");
        return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
        $('#'+element.attr('id')).parent().addClass("has-error");
        $('#date-error-custom').show().text("Please enter a valid month");
        return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
        $('#'+element.attr('id')).parent().addClass("has-error");
        $('#date-error-custom').show().text("Please enter a valid day");
        return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
        $('#'+element.attr('id')).parent().addClass("has-error"); 
        $('#date-error-custom').show().text("Please enter a valid 4 digit year between " + minYear + " and " + maxYear);
        return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
        $('#'+element.attr('id')).parent().addClass("has-error"); 
        $('#date-error-custom').show().text("Please enter a valid date");
        return false
    }
    $('#date-error-custom').hide(); $('#'+element.attr('id')).parent().removeClass("has-error")
    return true
}

	function DaysArray(n) {
		for (var i = 1; i <= n; i++) {
			this[i] = 31
			if (i == 4 || i == 6 || i == 9 || i == 11) {
				this[i] = 30
			}
			if (i == 2) {
				this[i] = 29
			}
		}
		return this
	}
	
	function daysInFebruary(year) {
		return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
	}
	
	function isInteger(s) {
		var i;
		for (i = 0; i < s.length; i++) {
			 
			var c = s.charAt(i);
			if (((c < "0") || (c > "9")))
				return false;
		}
		return true;
	}
	
	function stripCharsInBag(s, bag) {
		var i;
		var returnString = "";
		 
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if (bag.indexOf(c) == -1)
				returnString += c;
		}
		return returnString;
	}
	/* End Consent form validation */
});

$(".btn-cancel").on('click',function(){ $(".md-modal").removeClass('md-show'); $(".md-overlay").removeClass('md-show'); });
$(".btn-confirm").on('click',function(){ 
	$(".md-modal").removeClass('md-show'); $(".md-overlay").removeClass('md-show'); 
	$("#cconf").val(1);
	$("#consent").submit();
	
});

$(document).on('click',"a.skip",function(){
	$("#loading").show();
	$("#emailcheck_html").hide();
	$("#privacy_html").show();
	setTimeout(function(){ $("#loading").hide(); },500);
	return false;
});

$(document).on('click',"#privacy_html a",function(){
	$("#loading").show();
	$(".loginlogotext .login").empty().append('Sign Up');
	$(".loginlogoheader").show();
	$("#privacy_html").hide();
	$("#consent").show();
	setTimeout(function(){ $("#loading").hide(); },500);
	return false;
});

$("#show_signin a").click(function(){
	$("#loading").show();
	$(".loginlogotext .login").empty().append('Please Login to Access Your Profile');
	$(".loginlogoheader").show();
	$("#consent").hide();
	$("#sign_in_up").show();
	setTimeout(function(){ $("#loading").hide(); },500);
	return false;
});