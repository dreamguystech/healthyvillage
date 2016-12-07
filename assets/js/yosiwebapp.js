var base_url = "https://dev.yosicare.com/healthyvillage-app/";
jQuery(function($) {
		//console.log(new Array(240 + 1).join('\n'));
		//console.clear();
		var isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
		 
		if (isMacLike) {
			$('.btn-ios').show();
			$('.btn-android').remove();
			 
		} else {
			$('.btn-ios').remove();
			$('.btn-android').show();
			 
		}
		 
    	var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
	
	if($('#login').length){
		$("#login").validate();
	}
		/*-------Start Form Submit Action --------------*/
		
		$('.chossedoctorlist a').on('click', function(e) {
			$('#loading').show();
			ctrl = $('#form_mchoosedoctor_info');
			var redirectAction = ctrl.attr('action');
			var did = $(this).data('id');
			var dname = $(this).data('name');
			$("#did").val(did);
			$("#dname").val(dname);
			//ctrl.submit();
			var data = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: data,
				success: function(data) {
					if (data.loggedin == true) {
						$("html, body").animate({ scrollTop: 0 }, "fast");
						$('#htmlContent').load(base_url+"pages #emailcheck_html", { content: redirectAction }, function() {
							$('a.yosi_for_free').attr('href', $('#appflyerlinkhidden').val());
							$('.loginlogoheader').html($('#ajaxloginheader').html());
							$('#choosedoctor_html').hide();
							$('#choosedocpage_header').hide();
							$('#pageheader').hide();
							$('#loginheader').show();
							$('body').removeClass('choosepracticebody');
							$('body').addClass('subpagebody');
							$("#login").validate();
						});
					}
					$('#loading').hide();
	
				}
			});
			e.preventDefault();
		});
		
		$('body').on('click', '#yclogout', function(e){
			$('#loading').show();
			action = 'ajaxweblogout';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: { action: action},
				success: function(data) {
					if (data.loggedin == true) {
						$("html, body").animate({ scrollTop: 0 }, "fast");
						$('#htmlContent').load(base_url+"pages #emailcheck_html", { content: data.rlink }, function() {
							$('.loginlogoheader').html($('#ajaxloginheader').html());
							$('#choosedoctor_html').hide();
							$('#pageheader').hide();
							$('#pageheader .ycmenu').hide();
									$('.ycmlist').hide();
							$('#pageheader .logowithbg').hide();
							$('#loginheader').show();
							$('#banner').hide();
							$('body').removeClass('choosepracticebody');
							$('body').removeClass('user-profile-page');
							$('body').addClass('subpagebody');
							$("#login").validate();
						});
					}
					$('#loading').hide();
				},
				error: function(xhr, err) { 
					$('#loading').hide();
				}
			});
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', '#login', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this); 
			var serialized = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) {
					if (data.loggedin == true) {
						mixpanel.track("Email completed", {"Email": data.email});
						if (data.NewUser == 'N') {
							redirectAction = ctrl.data('action');
							$("html, body").animate({ scrollTop: 0 }, "fast");
							$('#htmlContent').load(base_url+"pages #howreach_html", { content: redirectAction }, function() {
								$('#pageheader').show();
								$('#pageheader #profileHeader').hide();
								$('#pageheader .logowithbg').show();
								$('#banner').hide();
								$('#loginheader').hide();
								$('body').removeClass('subpagebody');
								$('#loading').hide();
							});
						}else{
							loadhtml('personal-info',data.title,redirectAction)
							//loadpage('personal-info',data.title,redirectAction);
							 
						} 
						/*var validateSession = setInterval(session_checking, 10000);*/
					}
	
				}
			});
			e.preventDefault();
		});
		
		$('body').on('click', '#redirect_location', function(e) {
			closePopup('sessionexpire');
			$('#loading').show();
			$('#htmlContent').load("pages #emailcheck_html", { content: 'emailcheck' }, function() {
					$('#choosedoctor_html').hide();
					$('#pageheader').hide();
					$('#pageheader .ycmenu').hide();
							$('.ycmlist').hide();
					$('#pageheader .logowithbg').hide();
					$('#loginheader').show();
							$('body').removeClass('choosepracticebody');
					$('body').addClass('subpagebody');
					$("#login").validate();
					$('#loading').hide();
				});
			e.preventDefault();
		});
		
		$('body').on('click', '#redirect_site', function(e) {
			closePopup('noaccess');
			window.location.href = 'http://yosicare.com';
			e.preventDefault();
		});
		
		$('#htmlContent').on('click', '#sendotp a', function(e){
			var refValue = $(this).data('value');
			var refType = $(this).data('type');
			$('#RefValue').val(refValue);
			$('#RefType').val(refType);
            if (refValue != '') {
            	$('#sendotp').submit();
            } else { 
				$('#msg').html('Please choose email to send OTP');
				setTimeout(function(){
					$('#msg').html("").hide();
				},4000); 
                return false;
            }
        });
		
		$('#htmlContent').on('submit', '#sendotp', function(e){
			$('#loading').show();
			ctrl = $(this); 
			var serialized = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) {
					if (data.loggedin == true) {
						$("html, body").animate({ scrollTop: 0 }, "fast");
						$('#htmlContent').load("pages #securitycode_html", { content: data.rlink }, function() {
							$('#pageheader').hide();
							$('#pageheader #profileHeader').hide();
							$('#pageheader .logowithbg').hide();
							$('#banner').hide();
							$('#loading').hide();
							$("#otpsubmit").validate();
						});
					}else {
						$('#msg').html(data.message);
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
	
				}
			});
			e.preventDefault();
		});
		
		$('#htmlContent').on('click', '#resendcode', function(e){
			var otpemail = $('#RefValue').val();
            var reftype = $('#RefType').val();
			var action = 'resendcode';
            $.ajax({
                url: 'ajax/apifunctions',
                type: "POST",
                data: {RefType: reftype, RefValue: otpemail, action: action},
                success: function(data) {
					var data = $.parseJSON(data);
                    $('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
                },
                error: function(err) {
                    console.log(err);
                }

            });
		});
		
		$('#htmlContent').on('submit', '#otpsubmit', function(e){
			if (!$(this).valid())
				return false;
			$('#loading').show();
			ctrl = $(this); 
			var serialized = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) {
					if (data.loggedin == true) {
						mixpanel.track("OTP completed", {});
						loadhtml(data.page,data.title,data.rlink);
					}else {
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
						$('#loading').hide();
					}
	
				}
			});
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', '#form_mpersonal_info', function(e){
			if ($("#date").length) {
				var dt = $('#date');
				if (isDate(dt) == false) {
					dt.focus()
					return false
				}
			}
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					var statusDiv = $('p.status', ctrl); 
					if (data.loggedin == true) {
						$('p.status', ctrl).removeClass('errormsg').addClass('successmsg');
						mixpanel.track(pageeventtitle, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
						 
					} else if (data.loggedin == false) {
						$('p.status', ctrl).show().removeClass('successmsg').addClass('errormsg').text(data.message);
						$('#loading').hide();
					}
					setTimeout(function() {
						$('p.status', ctrl).removeClass('errormsg', 'successmsg').html("").hide();
					}, 4000);
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#form_minsurance_info', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''+data.trackfield+''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#generalinfo', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#mycontact', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#lifestyle', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#form_mmedical_info', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', 'form#pharmacy', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', '#form_mviewprofiledone', function(e){
			/*$('#loading').show();
			ctrl = $(this);
			loadhtml('profile-complete','','profile-complete');
			e.preventDefault();*/
			
				$('#loading').show();
				ctrl = $(this);
				var serialized = ctrl.serialize();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: base_url+"ajax/apifunctions",
					data: serialized,
					success: function(data) {
						if (data.loggedin == true) { 
							mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
							loadhtml(data.page,data.title,data.rlink);
						} else {
							$('#loading').hide();
						}
					},
					error: function(xhr, err) {
						$('#loading').hide();
					},
					complete: function(e) {
					}
				});
		
				e.preventDefault();
			
		});
		
		
		$('#htmlContent').on('submit', '#addappointment', function(e){
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			var signature_data = $("#signature").jSignature("getData");
			$('#signature_data').val(signature_data);
			var serialized = ctrl.serialize();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+'ajax/apifunctions',
				data: serialized,
				success: function(data) { 
					var jsondata = JSON.stringify(data);
					var statusDiv = $('p.status', ctrl);
					if (data.loggedin == true) {
						$('#successlink').attr('href', data.rlink);
						mixpanel.track("Checked-In", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						openPopup('appoinmentSuccess');
					} else{
						$('p.status', ctrl).show().removeClass('successmsg').addClass('errormsg').text(data.message);
						if ($("#signature").length) {
							$('#securitycode').val('');
						}
						$('#loading').hide();
					}
					setTimeout(function() {
						$('p.status', ctrl).removeClass('errormsg', 'successmsg').html("").hide();
					}, 4000);
				},
				error: function(xhr, err) { 
					$('#loading').hide();
				},
				complete: function(e) {
					$('#loading').hide();
				}
			});
			e.preventDefault();
		});
		
		$('#htmlContent').on('submit', '#form_mdoctordetail_info', function(e){
				$('#loading').show();
				ctrl = $(this);
				var serialized = ctrl.serialize();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: base_url+"ajax/apifunctions",
					data: serialized,
					success: function(data) {
						if (data.loggedin == true) { 
							mixpanel.track("Doctor Details", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ""});
							loadhtml(data.page,data.title,data.rlink);
						} else {
							$('#loading').hide();
						}
					},
					error: function(xhr, err) {
						$('#loading').hide();
					},
					complete: function(e) {
					}
				});
		
				e.preventDefault();
			});
			
		/*------- End Form Submit Action ---------------*/
		
		
		/*-------changes------*/
		$("#htmlContent").on('change', '#patientsspouse',function(e) {
			if(this.checked) {
				$('#patientsspousename').attr("disabled", false);
			}else{
			   $('#patientsspousename').attr("disabled", true);
			}
		});
		
		$("#htmlContent").on('change', '#patientsother',function(e) {
			if(this.checked) {
				$('#patientsothername').attr("disabled", false);
			}else{
			   $('#patientsothername').attr("disabled", true);
			}
		});
		
		$('#htmlContent').on('click', '#cardagree', function(e){
			if($('#cardnumber').length){
				if($('#cardnumber').val()=='' && $('#expire_mm').val()=='' && $('#expire_yy').val()=='' && $('#security_code').val()==''){
					$('#requiredcard').val('N');
					openPopup('cc_confirm');
				}else{
					$('#requiredcard').val('Y');
					$('#additional-info_html .yc-form').submit();
				}
				/*if($('#cardnumber').val()=='' && $('#requiredcard').val()=='N'){
					$('#requiredcard').val('N');
				}else{
					$('#requiredcard').val('Y');
				}*/
			}
		});
		
		$('body').on('click', '#id-card_html', function(e){
		  $('#personal-info_html').removeClass('auto_fill_overlay');
		});
		
		$('#htmlContent').on('submit', '#additional-info_html .yc-form', function(e){
			if($("#security_code").length){
				if ($("#expire_mm").length > 0 && $('#requiredcard').val()=='Y') {
					var mm = $('#expire_mm');
					if (isExpireYear(mm) == false) {
						mm.focus();
						return false
					}
				}
				if ($("#expire_yy").length > 0 && $('#requiredcard').val()=='Y') {
					var yy = $('#expire_yy');
					if (isExpireYear(yy) == false) {
						yy.focus();
						return false
					}
				}
				if ($("#security_code").length > 0 && $('#requiredcard').val()=='Y') {
					var sc = $('#security_code');
					if (isExpireYear(sc) == false) {
						sc.focus();
						return false
					}
				}
			}
			if (!$(this).valid())
				return false;
			var redirectAction = $(this).attr('action');
			$('#loading').show();
			ctrl = $(this);
			document.activeElement.blur();
			var pageeventtitle = $(this).data('track');
			var serialized = ctrl.serialize() + "&submit="+$('input[name=submit]').val();
			
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: serialized,
				success: function(data) { 
					if (data.loggedin == true) {
						mixpanel.track(data.trackname, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else if (data.loggedin == false) {
						$('#loading').hide();
						$('#msg').html(data.message).show();
						setTimeout(function(){
							$('#msg').html("").hide();
						},4000);
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {}
			});
	
			e.preventDefault();
		});
		
		$('body').on('click', '#cc_confirm_no', function(e){
			$('#requiredcard').val('Y');
			closePopup('cc_confirm');
			$('#additional-info_html .yc-form').submit();
			e.preventDefault();
		});
		$('body').on('click', '#cc_confirm_yes', function(e){
			$('#requiredcard').val('N');
			closePopup('cc_confirm');
			$('#additional-info_html .yc-form').submit();
			e.preventDefault();
		});
		/*---------------------------*/
		
		$('#htmlContent').on('click', '#snapphotoid', function(e){
			$('#fileupload-container #input-image').trigger('click');
		});
		
		$('body').on('click', '.back_userprofile', function(e){
			var rlink = $(this).attr('href');
			if(rlink==''){
				loadhtml('view-profile','','mobile-view-profile');
			}
			if(rlink=='mobile-user-profile'){
				loadhtml('user-profile','',rlink);
			}
			
			if(rlink=='mobile-profile-insurance-info'){
				loadhtml('insurance-info','My Insurance',rlink);
			}
			
			e.preventDefault();
		});
		
		$('body').on('click', '#successlink', function(e){
			var rlink = $(this).attr('href');
			closePopup('appoinmentSuccess');
			loadhtml('user-profile','',rlink);
			e.preventDefault();
		});
		
		$('#htmlContent').on('change', '#refsource', function(e){
            var refsource = this.value;
            if (refsource == '1') {
                $('#referalothers').hide();
                $('#referaldoctor').show();
            }
            else if (refsource == '6') {
                $('#referaldoctor').hide();
                $('#referalothers').show();

            } else {
                $('#referaldoctor').hide();
                $('#referalothers').hide();
            }
        });
		
		$('#htmlContent').on('click', '#preview-overlay', function(e){
			var datauri = $('#image-thumbnail img').attr('src');
			$.fancybox.open([
				{
					href : datauri,                
				   
				}
			], {
				padding : 0
			});
			
			return false;
			
		});
		
		/*$('#htmlContent').on('click', '#placehold-image', function(e){
			var datauri = $(this).attr('src');
			$.fancybox.open([
				{
					href : datauri,                
				   
				}
			], {
				padding : 0
			});
			
			return false;
			
		});*/
		
		$('#htmlContent').on('click', '#viewpdfform', function(e){
                e.preventDefault();
                $('body').append('<div id="fancybox-loading"></div>'); 
                var datalink = this.href;
                $('#formPlaceHolder').load("" + datalink + "", function() {
                    $.fancybox(this, {
                        padding: 0,
                        margin: 10,
                        maxWidth: 800,
                        maxHeight: 600,
                        fitToView: false,
                        width: '100%',
                        height: '100%',
                        autoSize: false,
                        autoCenter: false,
                        closeBtn: true,
                        closeClick: true,
                        openEffect: 'none',
                        closeEffect: 'fade',
                        helpers: {
                            media: true
                        },
                        leftRatio: 0,
                        /*type: 'iframe',*/
                        scrolling: 'auto',
                        /*iframe: {
                         preload: false // fixes issue with iframe and IE
                         }*/
                        afterLoad: function() {
                            $('#fancybox-loading').remove();
                        },
                        afterClose: function() {
                            $('#formPlaceHolder').empty();
                        }
                    });
                }); 
            }); 
			
		$('#htmlContent').on('click', '#pcp_selected_hidden', function(e){
            $('#pcp_wrap').show();
            $(this).hide();
            $('#pcp').focus();
        });
		
		 $('#htmlContent').on('blur keyup', '#pcp', function(e){
            var $this = $(this),
                    value = $this.val();
			if(value){
				$('#pcp_wrap').addClass('showprefix');
			  }else{
				$('#pcp_wrap').removeClass('showprefix');
				}
            $("#pcp_hname").val(value);
            $("#pcp_hid").val('');
            $("#pcp_hphone").val('');
            $("#pcpcontactnumber").val('');
        });
		
        $('#htmlContent').on('focus', '#pcp', function(e){
            $(this).val('');
            $("#pcp_hname").val('');
            $("#pcp_hid").val('');
            $("#pcp_hphone").val('');
            $("#pcpcontactnumber").val('');
			$('#pcp_wrap').addClass('showprefix');
        });
		
		$('#htmlContent').on('focus', '#select_medication1', function(e){ 
		//$("html, body").scrollTop($('#select_medication1_wrap').offset().top-30);
			//$('#pagecontent .medication-form').css({"margin-bottom":"200px"});
			$("html, body").animate({scrollTop:$('#select_medication1_wrap').offset().top-30},1000);
        });
		
		$('#htmlContent').on('focus', '#primary_companyname', function(e){
			 var value = $(this).val();
			  if(value==''){
				  $('#primary_company_id').val('');
				  $('#primary_company_name').val('');
			  }
		//$("html, body").scrollTop($('#select_medication1_wrap').offset().top-30);
			//$('#pagecontent .medication-form').css({"margin-bottom":"200px"});
			$("html, body").animate({scrollTop:$('#primary_companyname_wrap').offset().top-30},1000);
        });
		
		$('#htmlContent').on('focus', '#secondary_companyname', function(e){ 
		//$("html, body").scrollTop($('#select_medication1_wrap').offset().top-30);
			//$('#pagecontent .medication-form').css({"margin-bottom":"200px"});
			var value = $(this).val();
			  if(value==''){
				  $('#secondary_company_id').val('');
				  $('#secondary_company_name').val('');
			  }
			$("html, body").animate({scrollTop:$('#secondary_companyname_wrap').offset().top-30},1000);
        });
		
		$('#htmlContent').on('blur', '#select_medication1', function(e){
            //$('#pagecontent .medication-form').css({"margin-bottom":"20px"});
			/*$('#select_medication1_wrap .acResults').hide();
			if($('#medication_hid').val()==''){
				$('#medication_hid').val('');
				$('#medication_hname').val($(this).val());
			}*/
        });
		
		$('#htmlContent').on('select2:select', '.customdd', function(e) {
			var id = e.target.id;
			var selVal = $('#' + id).val();
			if (selVal == '') {
				$('#select2-' + id + '-container').removeClass('selected');
				$('#' + id + '_wrap .selected_icon').removeClass('active');
			} else {
				$('#select2-' + id + '-container').addClass('selected');
				$('#' + id + '_wrap .selected_icon').addClass('active');
			}
	
		});
		
		$('#htmlContent').on('click', '#viewprofile', function(e){
			$('#loading').show();
			action = 'ajaxmviewprofile';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+'ajax/apifunctions',
				data: {
					'action': action
				},
				success: function(data) {
					if (data.loggedin == true) {
						mixpanel.track("View Profile", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						loadhtml(data.page,data.title,data.rlink);
					} else {
						$('#loading').hide();
					}
				},
				error: function(xhr, err) { 
					$('#loading').hide();
				}
			});
			e.preventDefault();
		});

		$('#htmlContent').on('click', '#viewrecentvisit', function(e){
			$('#loading').show();
			action = 'ajaxmviewrecentvisit';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+'ajax/apifunctions',
				data: {
					'action': action
				},
				success: function(data) {
					if (data.loggedin == true) {
						$("html, body").animate({ scrollTop: 0 }, "fast");
						mixpanel.track("Recent Doctor", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});
						$('#htmlContent').load(base_url+"page-recent-visit #recentvisit_html", { content: data.rlink }, function() {
							$('body').addClass('recent-visit-page');
							$('#pageheader').show();
							$('.backBtn').remove();
							$('#pageheader').prepend('<a href="mobile-user-profile" class="backBtn back_userprofile"><img alt="Back" src="assets/img/left_arrow.png"></a>');
							$('#pageheader .ycmenu').hide();
									$('.ycmlist').hide();
							$('#pageheader #profileHeader').show();
							$('#pageheader #profileHeader h4').text(data.title);
							$('#pageheader .logowithbg').hide();
							$('#banner').hide();
							$('#loading').hide();
						}); 
					} else {
						$('#loading').hide();
					}
				},
				error: function(xhr, err) { 
					$('#loading').hide();
				}
			});
			e.preventDefault();
		});
		 
		$('#htmlContent').on('change', '#chkImageSource', function(e){
			if (this.checked) {
				$("#container-camera").show()
				$("#container-webcam").hide()
			} else {
				$("#container-camera").hide()
				$("#container-webcam").show()
			}
		});
		 
		$('#htmlContent').on('click', '#btn-use-image', function(e){
			cloneCanvas(capturedcanvas);
			$('#myModal').modal("hide");
			$("#div-controls").show();
		});
		
		$('#htmlContent').on('click', '#btn-use-image-ins', function(e){
			cloneCanvas_ins(capturedcanvas);
			$('#myModal').modal("hide");
		});
		 
		$('#htmlContent').on('click', '#webcam', function(e){
			snapshot();
			$('#myModal').modal()
		});
		 
		$('#htmlContent').on('click', '#placehold-image', function(e){
			$("#input-image").click();
	 
			$('#drivers-license-data').empty();
			$('#errorDiv').hide();
			$('#loading').hide();
			$("#div-controls").show();
		});
		 
		$('#htmlContent').on('click', '#placehold-image-front', function(e){
			$("#input-image-front").click();
			$('#loading').hide();
		});
		 
		$('#htmlContent').on('click', '#placehold-image-back', function(e){
			$("#input-image-back").click();
			$('#loading').hide();
		});
		 
		$('#htmlContent').on('click', '#image-thumbnail', function(e){
			$("#input-image").click();
			document.getElementById("faceImage").style.display = "none";
			document.getElementById("signImage").style.display = "none";
			document.getElementById("extractedData").style.display = "none";
			$('#drivers-license-data').empty();
			$('#errorDiv').hide();
			$('#loading').hide();
			$("#div-controls").show();
			$("#fileupload-container").fileupload("clear");
		});
		 
		$('#htmlContent').on('click', '#image-thumbnail-front', function(e){
			$("#input-image-front").click();
			$('#errorDiv').empty();
			$('#loading').hide();
			$("#div-controls").show();
			$("#fileupload-container-back").show();
			$("#fileupload-container-front").fileupload("clear");
		});
		 
		$('#htmlContent').on('click', '#image-thumbnail-back', function(e){
	
			$("#input-image-back").click();
			$('#errorDiv').empty();
			$('#loading').hide();
			$("#div-controls").show();
			$("#fileupload-container-back").fileupload("clear");
		});
	
		var unmodifiedFrontImage;
		 
		$('#htmlContent').on('change', '#input-image-front', function(e){ 
			var file = e.target.files[0];
			$('#btn-process-image').removeClass("fileupload-exists");
			canvasResize(file, {
				crop: false,
				quality: 75,
				isiOS: isMobile.iOS(),
				isPreprocessing: true,
				cardType: "MedicalCard",
				callback: function (data, width, height) {
					preprocessedFrontImage = dataURLtoBlob(data);
				}
			});
	
			canvasResize(file, {
				isPreprocessing: false,
				isiOS: isMobile.iOS(),
				cardType: "MedicalCard",
				callback: function (data, width, height) {
					unmodifiedFrontImage = dataURLtoBlob(data);
				}
			});
		});
	
		var unmodifiedBackImage;
		 
		$('#htmlContent').on('change', '#input-image-back', function(e){
			var file = e.target.files[0];
			$('#btn-process-image').removeClass("fileupload-exists");
			canvasResize(file, {
				crop: false,
				quality: 75,
				isiOS: isMobile.iOS(),
				isPreprocessing: true,
				cardType: "MedicalCard",
				callback: function (data, width, height) {
					preprocessedBackImage = dataURLtoBlob(data);
					$('#btn-process-image-ins').click();
				}
			});
			canvasResize(file, {
				isPreprocessing: false,
				isiOS: isMobile.iOS(),
				cardType: "MedicalCard",
				callback: function (data, width, height) {
					unmodifiedBackImage = dataURLtoBlob(data);
					//$('#btn-process-image-ins').click();
				}
			});
		});
	
		var preprocessedImage;
		var unmodifiedImage;
		 
		$('#htmlContent').on('change', '#input-image', function(e){
	
			var file = e.target.files[0];
	
			canvasResize(file, {
				crop: false,
				quality: 75,
				isiOS: isMobile.iOS(),
				isPreprocessing: true,
				cardType: "DriversLicense",
				callback: function(data, width, height) {
					preprocessedImage = dataURLtoBlob(data);
					$('#btn-process-image').click();
				}
			});
	
			canvasResize(file, {
				isPreprocessing: false,
				cardType: "DriversLicense",
				callback: function(data, width, height) {
					unmodifiedImage = dataURLtoBlob(data);
					//$('#btn-process-image').click();
				}
			});
		});
		
	
		$('#htmlContent').on('click', '#btn-process-image', function(e) {
			
			/*//var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
			var usePreprocessing = $('#chkPreProcessing').is(':checked') ? true : false;*/
			var usePreprocessing = true;
	
			/*var selectedRegion = $("#region-select").val();*/
			var imageToProcess;
			var imgVal = $('#input-image').val();
			//var storelink = $(this).data('link');store-id-card
			var storelink = 'store-id-card';
			$('#errorDiv').hide();
			$('#loading').hide();
			if ($(this).hasClass("fileupload-exists")) {
				var cb = rlink_callback($(this).data('rlink'));
				setTimeout(cb, 500);
				return false;
			}
			 
			if (imgVal == '') {
				$('#errorDiv').show().html("Please scan your cards or click skip");
				setTimeout(function() {
					$('#errorDiv').hide();
				}, 5000);
				return false;
			}
	
			if (usePreprocessing)
				imageToProcess = preprocessedImage;
			else
				imageToProcess = unmodifiedImage; 
			 $('#loading').show();
			 
			$.ajax({
				type: "POST",
				url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDriversLicense/0/true/-1/true/true/true/0/150/" + usePreprocessing.toString(),
				data: imageToProcess,
				cache: false,
				contentType: 'application/octet-stream; charset=utf-8;',
				dataType: "json",
				processData: false,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
					$('#loading').show();
					$("#div-controls").hide();
				},
				success: function(data) {
	
					var driversLicense = JSON.stringify(data);
					driversLicense = jQuery.parseJSON(driversLicense);
	
					 
					if (driversLicense.ResponseCodeAuthorization < 0) {
						console.log("1");
						$('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseMessageAuthorization + "</p>");
					} else if (driversLicense.ResponseCodeAutoDetectState < 0) {
						console.log("2");
						$('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeAutoDetectStateDesc + "</p>");
					} else if (driversLicense.ResponseCodeProcState < 0) {
						console.log("3");
						$('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeProcessStateDesc + "</p>");
					} else if (driversLicense.WebResponseCode < 1) {
						console.log("4");
						$('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.WebResponseDescription + "</p>");
					} else {
						$('#loading').show();
						var faceImage = driversLicense.FaceImage;
						if (faceImage != null && faceImage != "") {
							var faceImage = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(faceImage);
						}
	
						var signImage = driversLicense.SignImage;
						if (signImage != null && signImage != "") {
							var signImage = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(signImage);
						}
						var reformattedImageFront = driversLicense.ReformattedImage;
						if (reformattedImageFront != null && reformattedImageFront != "") {
							var reformattedImageFront = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageFront);
							$("#image-thumbnail img:first-child").attr("src", reformattedImageFront);
						}
						
						
	/*                    var reformattedImageBack = driversLicense.ReformattedImageTwo;
	//                    if (reformattedImageBack != null && reformattedImageBack != "") {
	//                        var reformattedImageBack = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageBack);
	//                    }*/
						var session_value = {
							"FirstName": driversLicense.NameFirst, "MiddleName": driversLicense.NameMiddle,
							"LastName": driversLicense.NameLast, "LicenseNumber": driversLicense.license,
							"Address1": driversLicense.Address, "Address2": driversLicense.Address2,
							"City": driversLicense.City, "State": driversLicense.State,
							"Zip": driversLicense.Zip, "Country": driversLicense.IdCountry,
							"ExpirationDate": driversLicense.ExpirationDate4,
							"IssueDate": driversLicense.IssueDate4, "Dob": driversLicense.DateOfBirth4,
							"Gender": driversLicense.Sex, "EyesColor": driversLicense.Eyes,
							"HairColor": driversLicense.Hair, "Height": driversLicense.Height,
							"Weight": driversLicense.Weight, "Class": driversLicense.Class,
							"Restriction": driversLicense.Restriction, "AddresVerified": driversLicense.IsAddressVerified,
							"IDVerified": driversLicense.IsIDVerified, "FaceImage": faceImage,
							"SignImage": signImage, "FrontImage": reformattedImageFront,
							/*"BackImage"     : reformattedImageBack*/
							"action"     : "ajaxstoreidcarddata"
						};
						
						
						
						var re = /-/gi;
						var scanneddate = driversLicense.DateOfBirth4;
						
						var dateString = scanneddate.replace(re, '/');
						 
						var today = new Date();
						var birthDate = new Date(dateString);
						var age = today.getFullYear() - birthDate.getFullYear();
						var m = today.getMonth() - birthDate.getMonth();
						if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
							age--;
						}
						var currentage = age;
						
						$('#loading').hide();
						
						$('#personal-info_html').removeClass('auto_fill_overlay');
						
						$('#photo_frontimage').val(session_value['FrontImage']);
						$('#firstname').val(session_value['FirstName']);
						$('#lastname').val(session_value['LastName']);
						if(session_value['Gender'] == 'M' || session_value['Gender'] == 'Male'){
							$('input:radio[name="select_gender"][value="Male"]').prop('checked', true);
						}else{
							$('input:radio[name="select_gender"][value="Female"]').prop('checked', true);
						}
						var dob = session_value['Dob'];
						var olddate = dob.replace(/-/g , "/"); 
						$('#date, #hiddenDateField').val(olddate);
						$('#address1').val(session_value['Address1']);
						$('#address2').val(session_value['Address2']);
						$('#zipcode').val(session_value['Zip']);
						
						if (driversLicense.Sex == 'M' || driversLicense.Sex == 'Male') {
							var scannedgender = 'Male';
						} else {
							var scannedgender = 'Female';
						}
						mixpanel.track("Photo ID Scan", {"Age": currentage, "Gender": scannedgender, "Fields Entered": session_value});
						//loadhtml(data.page, data.title, data.rlink);
						/*$.ajax({
							type: "POST",
							url: storelink,
							data: session_value,
							dataType: "json",
							async: false,
							success: function(data) {
								$('.tick-icon').addClass('display_block').removeClass('display_none');
								$('.cross-icon').addClass('display_none').removeClass('display_block');
								 
								if (driversLicense.Sex == 'M' || driversLicense.Sex == 'Male') {
									var scannedgender = 'Male';
								} else {
									var scannedgender = 'Female';
								}
								mixpanel.track("Photo ID Scan", {"Age": currentage, "Gender": scannedgender, "Fields Entered": session_value});
								loadhtml(data.page, data.title, data.rlink);
								 
							},
							error: function(xhr, err) {
								alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
								alert("responseText: " + xhr.responseText);
							} 
						}); */
					}
				},
				error: function(e) {
					$("#div-controls").show();
				} 
			});
		});
		
		 $('#htmlContent').on('change', '#select_ethinicity', function(e){
			$('#select_ethinicity_wrap').hide();
			$('#select_race_wrap').show();
	
			$('#select_race_wrap .select_raceethinicity').select2({
				minimumResultsForSearch: Infinity,
				dropdownParent: $('#select_race_wrap')
			});
			$('#select_race').select2('open'); 
			$("html, body").animate({scrollTop:$('#select_race_wrap').offset().top-30},1000);
		});
	
		$('#htmlContent').on('change', '#select_race', function(e){ 
			$('#select_race_wrap').hide();
			$('#select_ethinicity_wrap').show();
		});
	
		$('#htmlContent').on('change', 'input[type=radio][name=select_employed]', function(e){
			if (this.value == 'Y') {
				$('#empcmpy').show();
			} else if (this.value == 'N') {
				$('#empcmpy').hide();
			}
			$('#employed_company').val('');
	
		});
		 
		$('#htmlContent').on('select2:open, select2:opening', '.health-data', function(e) {
			var thisid = e.currentTarget.id;
			var $parentId = $(this).parent().attr("id");
			var $wrapId = $(this).data("id");
			$(this).parent().removeClass('searchInput');
			var svb_ln = $('.selectedVaulesBox').length;
			for (var i = 0; i < svb_ln; i++) {
				if ($.trim($('.selectedVaulesBox').eq(i).html()) != '') {
					$('.selectedVaulesBox').eq(i).show();
					$('.searchBoxWrap').eq(i).hide();
				} else {
					$('.selectedVaulesBox').eq(i).hide();
					$('.searchBoxWrap').eq(i).show();
					if (!$('.searchBoxWrap').eq(i).hasClass('searchInput')) {
						$('.searchBoxWrap').eq(i).addClass('searchInput');
					}
				}
			}
			$('#' + thisid + '_hidden').hide();
			$('#' + $wrapId + '_wrap').show();
		});
	
		$('#htmlContent').on('click', '.selectedVaulesBox', function(e) {
			var thisid = $(this).attr('id');
			var idarr = thisid.split('_');
			$('#' + idarr[1] + '_wrap').show();
			$('#select_' + idarr[1] + '_hidden').hide();
			$('#select_' + idarr[1]).select2('open');
		});
		
		$('#htmlContent').on('click', '.relationshipList li a', function(e) {
            var $thischeckbox = $(this).find('input[type=checkbox]');
            if ($thischeckbox.is(':checked')) {
                $thischeckbox.prop('checked', false);
            } else {
                $thischeckbox.prop('checked', true); 
            }
        });
		
		$('#htmlContent').on('click', '#selectedRelations', function(e) {
			if ($('.relationshipList input:checked').val() == '' || $('.relationshipList input:checked').val() === undefined) {
				$('#relationshipData').show();
				return false;
			}
	
			$("#select_familyhistory").prop("disabled", false);
	
			var prevArrayVal = $('#familyJsonData').val();
			if (prevArrayVal) {
				var jsonfullobj = jQuery.parseJSON(prevArrayVal);
				familyArr = [];
				for (var i in jsonfullobj) {
					var item = jsonfullobj[i];
	
					familyArr.push({
						"Id": item.Id,
						"Name": item.Name,
						"Relation": item.Relation
					});
				}
			}
	
			var selectBoxData = $('#select_familyhistory').select2('data');
			var idnum = $.isNumeric(selectBoxData[selectBoxData.length - 1].id);
	
			if (idnum == true) {
				var id = selectBoxData[selectBoxData.length - 1].id;
			} else {
				var id = '';
			}
			familyArr.push({
				"Id": id,
				"Name": selectBoxData[selectBoxData.length - 1].name || selectBoxData[selectBoxData.length - 1].text,
				"Relation": []
			});
	
			var familyArrLn = familyArr.length;
			$('.relationshipList input:checked').each(function(e) {
				familyArr[familyArrLn - 1].Relation.push({
					"RelationshipId": $(this).val(),
					"Relationship": $(this).attr('name')
				});
			});
	 
			$('#familyJsonData').val('');
			var familyJsonString = JSON.stringify(familyArr);
			$('#familyJsonData').val(familyJsonString);
	
			$('#relationshipData').hide();
			$('#form_mmedical_info input[type="submit"]').prop('disabled', false);
			$('.relationshipList input').prop('checked', false);
		});
		
		$(document).on("keypress", "form#pharmacy", function(event) { 
			return event.keyCode != 13;
		});
		
		/*$(document).on("keypress", "#select_medication1", function(event) { 
			if(event.keyCode == 13){
				alert("hai");
			}
		});
		*/
		
		$('#htmlContent').on('click', '#add_medi_data', function(e) {
             
            var mId = $('#medication_hid').val();
            var mName = $('#medication_hname').val();

            var dosage = $('#select_medication_dosage1').val();
            var frequency = $('#select_medication_freq1').select2('data');
			/*if(dosage =='' || frequency ==''){
				return false;
			}*/
            var existsId = 'N';
            $("#select_medication1").val('').trigger('change');
            $('#select_medication_freq1').val('').trigger('change');
            $('#select_medication_dosage1').val('');
			$('#select_medication_freq1_wrap .selected_icon').removeClass('active');
            var prevArrayVal = $('#medicationJsonData').val();
            if (prevArrayVal) {

                var jsonfullobj = jQuery.parseJSON(prevArrayVal);

                medicationArr = [];
                for (var i in jsonfullobj) {
                    var item = jsonfullobj[i];
                    medicationArr.push({
                        "Id": item.Id,
						"Name": item.Name,
                        "Dosage": item.Dosage,
                        "Frequency": item.Frequency
                    });
                    if (mId) {
						if (mId == item.Id) {
                        	existsId = 'Y';
                        	$('p.status-medi').show().removeClass('successmsg').addClass('errormsg').text('Already Added!');
						}
                    }
                }

            }

            
            if ((mId && existsId == 'N') || mName && existsId == 'N') {
                medicationArr.push({
                    "Id": mId,
					"Name": mName,
                    "Dosage": dosage,
                    "Frequency": frequency[0].id
                });
            }

            var medicationJsonString = JSON.stringify(medicationArr);

            $('#medicationJsonData').val(medicationJsonString);

            /*$('#addedMedicationList').append('<li id="addedMedi_'+mId[0].id+'"><p><span>'+mId[0].name+'</span>,'+dosage+','+frequency[0].text+' </p><a href="javascript:;" class="removelist" data-id="'+mId[0].id+'"></a></li>');*/
            if ((mId && existsId == 'N') || mName && existsId == 'N') {
				var frequencytxt='';
				var mnewid='';
				if(frequency[0].id){
					frequencytxt = frequency[0].text;
				}
				if(mId){
					mnewid = mId;
				}else{
					mnewid = mName.replace(/ /g,'');
				}
                $('#addedMedicationList').prepend('<li id="addedMedi_' + mnewid + '"><p><span>' + mName + '</span>,' + dosage + ',' + frequencytxt + ' </p><a href="javascript:;" class="removelist" data-id="' + mnewid + '" data-name="' + mName.replace(/ /g,'') + '"></a></li>');
            }
            setTimeout(function() {
                $('p.status-medi').removeClass('errormsg', 'successmsg').html("").hide();
            }, 4000);

        });
		
		$('#htmlContent').on('click', '.removelist', function(e) {
            var prevArrayVal = $('#medicationJsonData').val();
            var jsonfullobj = jQuery.parseJSON(prevArrayVal);
            var deletedId = $(this).data('id');
			var deletedIdName = $(this).data('name');
			if(deletedId==deletedIdName){
				$('#addedMedi_' + deletedIdName).remove();
			}else{
            	$('#addedMedi_' + deletedId).remove();
			}
            medicationArr = [];
            for (var i in jsonfullobj) {
                var item = jsonfullobj[i];
                if (item.Id != deletedId) {
                    medicationArr.push({
                        "Id": item.Id,
                        "Dosage": item.Dosage,
                        "Frequency": item.Frequency
                    });
                }
            }
            var medicationJsonString = JSON.stringify(medicationArr);
            $('#medicationJsonData').val(medicationJsonString);

        });
		
		$('#htmlContent').on('click', '.editpageinfo', function(e) {
			var estep = $(this).data('step');
			var icstep = $(this).data('incomplete');
			var pageid = $(this).data('id');
			action = 'ajaxmeditstepinfo';
			$('#loading').show();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: base_url+"ajax/apifunctions",
				data: {
					'action': action,
					'pageid': pageid,
					'estep': estep,
					'icstep': icstep
				},
				success: function(data) {
					if (data.loggedin == true) {
						if (data.action == 'Update') {
							loadhtml(data.page, data.title, data.rlink);
						} else {
							$('#loading').hide();
							$('#redirect_step').attr('href', data.rlink);
							$('#redirect_step').data('page', data.page);
							$('#redirect_step').data('title', data.title);
							openPopup('incompletesteps');
						}
					} else {
	 
						$('#loading').hide();
					}
				},
				error: function(xhr, err) {
					$('#loading').hide();
				},
				complete: function(e) {
					 
				}
			});
	
			e.preventDefault();
		});
		
		$('body').on('click', '#redirect_step', function(e) {
			var page = $(this).data('page');
			var title = $(this).data('title');
			var rlink = $(this).attr('href');
			closePopup('incompletesteps'); 
			$('#loading').show();
			loadhtml(page, title, rlink);
			 
			e.preventDefault();
		});
		
		/*$('#htmlContent').on('mousedown','.select2.select2-container--open',function(){
					  var wrapid = $('.select2.select2-container--open').parent().attr('id');
					  $("html, body").scrollTop($('#'+wrapid).offset().top-30);
					});*/
		$('#htmlContent').on('mousedown','.select2.select2-container--open',function(){
					  var wrapid = $('.select2.select2-container--open').parent().attr('id');
  //setTimeout(function(){
    //$("html, body").scrollTop($('#'+wrapid).offset().top-30);
			if(wrapid!='refsource_wrap'){
    			$("html, body").animate({scrollTop:$('#'+wrapid).offset().top-30},1000);
			}
  //},300);
					});
		
	
		function loadinsurancecardhtml(page,title,rlink,type){
			
			if($('.back_userprofile').length){
				$('.back_userprofile').attr('href', '');
			}
			$("html, body").animate({ scrollTop: 0 }, "fast");
			$('#htmlContent').load(base_url+"page-"+page+" #"+page+"_html", { content: rlink, type: type }, function() {
				$('#pageheader #profileHeader h4').text(title);
				if(page=='insurance-card'){
						$('.back_userprofile').attr('href', 'mobile-profile-insurance-info');
						$('#btn-use-image').hide();
						$('#btn-use-image-ins').show();
						$("#rdoFront").prop("checked", true);
						$("#rdoFront").parent().addClass("active");
						var video = document.querySelector('#webcam');
						var capturedcanvas = document.querySelector('#captured-canvas');
						var blankCanvasFront = document.querySelector('#blank-canvas-front');
						var blankContextFront = blankCanvasFront.getContext('2d');
						var selectedCanvasFront = document.querySelector('#selected-canvas-front');
						var selectedCanvasBack = document.querySelector('#selected-canvas-back');
						var contextCapturedCanvas = capturedcanvas.getContext('2d');
						var contextCanvasBack = selectedCanvasBack.getContext('2d');
						if (isMobile.any()) {
							$("#option-source").hide();
							$("#container-camera").show();
							$("#container-webcam").hide();
							/*$('#chkPreProcessing').bootstrapSwitch('setState', true);*/
						} else {
							$("#option-source").hide();
							$("#help-icon").tooltip({placement: 'bottom'});
							/*$('#chkPreProcessing').bootstrapSwitch('setState', false);*/
						}
						var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
						if (isSourceCameraOrDisk) {
							$("#container-camera").show();
							$("#container-webcam").hide();
						} else {
							$("#container-camera").hide();
							$("#container-webcam").show();
						}
					$('#loading').hide();
				
				}
			});
		}
		function loadhtml(page,title,rlink){
			$("html, body").animate({ scrollTop: 0 }, "fast");
			if($('.back_userprofile').length){
				$('.back_userprofile').attr('href', '');
			}
			$('#htmlContent').load(base_url+"page-"+page+" #"+page+"_html", { content: rlink }, function() {
				$('#pageheader #profileHeader h4').text(title);
				$('body').removeClass('page-medical-info');
				$('body').removeClass('user-profile-page');
				if(page=='insurance-card'){
						$('#btn-use-image').hide();
						$('#btn-use-image-ins').show();
						$("#rdoFront").prop("checked", true);
						$("#rdoFront").parent().addClass("active");
						var video = document.querySelector('#webcam');
						var capturedcanvas = document.querySelector('#captured-canvas');
						var blankCanvasFront = document.querySelector('#blank-canvas-front');
						var blankContextFront = blankCanvasFront.getContext('2d');
						var selectedCanvasFront = document.querySelector('#selected-canvas-front');
						var selectedCanvasBack = document.querySelector('#selected-canvas-back');
						var contextCapturedCanvas = capturedcanvas.getContext('2d');
						var contextCanvasBack = selectedCanvasBack.getContext('2d');
						if (isMobile.any()) {
							$("#option-source").hide();
							$("#container-camera").show();
							$("#container-webcam").hide();
							
						} else {
							$("#option-source").hide();
							$("#help-icon").tooltip({placement: 'bottom'});
							
						}
						var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
						if (isSourceCameraOrDisk) {
							$("#container-camera").show();
							$("#container-webcam").hide();
						} else {
							$("#container-camera").hide();
							$("#container-webcam").show();
						}
					$('#loading').hide();
				
				}
				
				if(page=='id-card'){
					$('#pageheader').show();
					$('#pageheader #profileHeader').show();
					$('#pageheader .logowithbg').hide();
					$('#banner').hide();
					$('#loginheader').hide();
					$('body').removeClass('subpagebody');
					$('#loading').hide();
					$('#btn-use-image').show();
					$('#btn-use-image-ins').hide();
					var video = document.querySelector('#webcam');
					var capturedcanvas = document.querySelector('#captured-canvas');
					var blankCanvas = document.querySelector('#blank-canvas');
					var blankContext = blankCanvas.getContext('2d');
					var selectedCanvas = document.querySelector('#selected-canvas');
					var contextCapturedCanvas = capturedcanvas.getContext('2d');
				
					if (isMobile.any()) {
						$("#option-source").hide();
						$("#container-camera").show();
						$("#container-webcam").hide();
						/*$('#chkPreProcessing').bootstrapSwitch('setState', true);*/
					} else {
						$("#option-source").hide();
					}
					 
					var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
					if (isSourceCameraOrDisk) {
						$("#container-camera").show();
						$("#container-webcam").hide();
					} else {
						$("#container-camera").hide();
						$("#container-webcam").show();
					}
				
				}
				
				if(page=='personal-info'){
					$('#pageheader').show();
					$('#pageheader #profileHeader').show();
					$('#pageheader .logowithbg').hide();
					$('#banner').hide();
					$('#loginheader').hide();
					$('body').removeClass('subpagebody');
					
					$("#zipcode").mask("99999", {autoclear: false});
					$('#date').mask("99/99/9999");
					$('#date-error-custom').remove();
					$('#loading').hide();
					/*---start scan id card-----*/
					$('#btn-use-image').show();
					$('#btn-use-image-ins').hide();
					var video = document.querySelector('#webcam');
					var capturedcanvas = document.querySelector('#captured-canvas');
					var blankCanvas = document.querySelector('#blank-canvas');
					var blankContext = blankCanvas.getContext('2d');
					var selectedCanvas = document.querySelector('#selected-canvas');
					var contextCapturedCanvas = capturedcanvas.getContext('2d');
				
					if (isMobile.any()) {
						$("#option-source").hide();
						$("#container-camera").show();
						$("#container-webcam").hide();
						/*$('#chkPreProcessing').bootstrapSwitch('setState', true);*/
					} else {
						$("#option-source").hide();
					}
					 
					var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
					if (isSourceCameraOrDisk) {
						$("#container-camera").show();
						$("#container-webcam").hide();
					} else {
						$("#container-camera").hide();
						$("#container-webcam").show();
					}
					/*----end scan id card-----*/
					
					loadvalidate('personal');
				}
				
				if(page=='insurance-info' || page=='insurance-info-secondary'){
					/*----start scan insurance card-----*/
						$('#btn-use-image').hide();
						$('#btn-use-image-ins').show();
						$("#rdoFront").prop("checked", true);
						$("#rdoFront").parent().addClass("active");
						var video = document.querySelector('#webcam');
						var capturedcanvas = document.querySelector('#captured-canvas');
						var blankCanvasFront = document.querySelector('#blank-canvas-front');
						var blankContextFront = blankCanvasFront.getContext('2d');
						var selectedCanvasFront = document.querySelector('#selected-canvas-front');
						var selectedCanvasBack = document.querySelector('#selected-canvas-back');
						var contextCapturedCanvas = capturedcanvas.getContext('2d');
						var contextCanvasBack = selectedCanvasBack.getContext('2d');
						if (isMobile.any()) {
							$("#option-source").hide();
							$("#container-camera").show();
							$("#container-webcam").hide();
							/*$('#chkPreProcessing').bootstrapSwitch('setState', true);*/
						} else {
							$("#option-source").hide();
							$("#help-icon").tooltip({placement: 'bottom'});
							/*$('#chkPreProcessing').bootstrapSwitch('setState', false);*/
						}
						var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
						if (isSourceCameraOrDisk) {
							$("#container-camera").show();
							$("#container-webcam").hide();
						} else {
							$("#container-camera").hide();
							$("#container-webcam").show();
						}
					/*----end scan insurance card-----*/
					
					$('#loading').hide();
					
					loadvalidate('insurance');
					if ($('#primary_relationship_wrap').length) {
						$('#primary_relationship_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#primary_relationship_wrap')
						});
					}
					if ($('#secondary_relationship_wrap').length) {
						$('#secondary_relationship_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#secondary_relationship_wrap')
						});
					}
					if(page=='insurance-info'){
						$('#primary_companyname')
							.autocomplete('assets/plugins/autocomplete/search-insurance', acOptions_insurance)
							.result(function(e, data) {
								$('#primary_companyname').blur();
								$('#primary_company_hid').val(data[1]);
								$('#primary_company_hname').val(data[0]);
								document.activeElement.blur();
							});
					}
					if(page=='insurance-info-secondary'){
						$('#secondary_companyname')
							.autocomplete('assets/plugins/autocomplete/search-insurance', acOptions_insurance)
							.result(function(e, data) {
								$('#secondary_companyname').blur();
								$('#secondary_company_hid').val(data[1]);
								$('#secondary_company_hname').val(data[0]);
								document.activeElement.blur();
							});
					}
				}
				
				if(page=='general-info'){
					$('#loading').hide();
					loadvalidate('general');
					$('#select_maritalstatus_wrap .customdd').select2({
						minimumResultsForSearch: Infinity,
						dropdownParent: $('#select_maritalstatus_wrap')
					});
					if ($('#select_ethinicity_wrap').length) {
						$('#select_ethinicity_wrap .select_raceethinicity').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#select_ethinicity_wrap')
						});
					}
					$("#ssn").submask("999-99-9999", {autoclear: false}, {placeholder: "(___)-___-____"});
					$("#mobilenumber").submask("(999) 999-9999", {autoclear: false});
				}
				
				if(page=='pcp-info'){
					$('#loading').hide();
					loadvalidate('mycontact');
					 if ($('#select_emc_relationship_wrap').length) {
						$('#select_emc_relationship_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#select_emc_relationship_wrap')
						});
					}
					$("#pcpcontactnumber").submask("(999) 999-9999", {autoclear: false});
					$("#emc_number").submask("(999) 999-9999", {autoclear: false});
					pcpautocomplete();
				}
				
				if(page=='lifestyle-info'){
					$('#loading').hide();
					if ($('#select_smoking_wrap').length) {
						$('#select_smoking_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#select_smoking_wrap')
						});
					}
					if ($('#select_drink_wrap').length) {
						$('#select_drink_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#select_drink_wrap')
						});
					}
					if ($('#select_drugs_wrap').length) {
						$('#select_drugs_wrap .customdd').select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: $('#select_drugs_wrap')
						});
					}
					
				}
				
				if(page=='medical-info'){
					$('body').addClass('page-medical-info');
					$('#loading').hide();
					medicalautocomplete();
				}
				
				if(page=='profile-complete'){
					$('#loading').hide();
					$('#pageheader').hide();
					$('#banner').hide();
					$('body').addClass('profile-complete-page');
					loadvalidate('addappointment');
					completefunctions();
				}
				
				if(page=='user-profile'){
					$('#loading').hide();
					$('body').removeClass('profile-complete-page, recent-visit-page');
					$('.backBtn').remove();
					$('#pageheader').show();
					$('#pageheader #profileHeader').hide();
					$('#pageheader .logowithbg').hide();
					$('#pageheader .ycmenu').hide();
					$('#banner').hide();
					$('body').addClass('user-profile-page');
					//submenus();
					doctorsearchautocomplete();
				
				}
				
				if(page=='medication-info'){
					$('#loading').hide();
					medicationautocomplete();
				}
				
				/*-----------changes----------*/
				if(page=='additional-info'){
					$('#loading').hide();
					/*$('#scrollbar1 .viewport').css({"height":"160px"});
					var $scrollbar = $("#scrollbar1");
                	$scrollbar.tinyscrollbar();*/
					$('body').addClass('profile-additional-page');
var wh = $(window).height();
var half_height = wh/2;
var topSH = half_height-20;

$('#scrollbar1').css({"height":topSH});
var $scrollbar = $("#scrollbar1");
$scrollbar.niceScroll();
					if($("#security_code").length){
						//$("#security_code").submask("9999", {autoclear: false});
						$("#expire_mm").submask("99", {autoclear: false});
						$("#expire_yy").submask("99", {autoclear: false});
						loadvalidate('additionalinfo_card');
					}
					if($('input[name=patientauthorize]').length){
						loadvalidate('additionalinfo_consent');
					}
					
				}
				/*--------------------------*/
				
				if(page=='view-profile'){
					var viewprofiletitle = $('#viewprofiletitle').val();
					$('#pageheader #profileHeader h4').text(viewprofiletitle);
					$('#pageheader').show();
					$('#pageheader #profileHeader').show();
					$('#pageheader .logowithbg').hide();
					$('.backBtn').remove();
					$('#pageheader').prepend('<a href="mobile-user-profile" class="backBtn back_userprofile"><img alt="Back" src="assets/img/left_arrow.png"></a>');
					$('.back_userprofile').attr('href', 'mobile-user-profile');
					$('#pageheader .ycmenu').hide();
									$('.ycmlist').hide();
					$('#banner').hide();
					$('#loading').hide();
				}
			});
		}
		
		
		function doctorsearchautocomplete(){
			$('#doctorsearch')
				.autocomplete('assets/plugins/autocomplete/search-doctor', acOptions_doctor)
				.result(function(e, data) { 
					$('#loading').show();
					action = 'ajaxmsearchdoctordetail';
					$.ajax({
						type: 'POST',
						dataType: 'json',
						url: base_url+'ajax/apifunctions',
						data: {
							'action': action,
							'pid': data[2],
							'did': data[1],
							'dname': data[0]
						},
						success: function(data) {
							if (data.loggedin == true) {
								mixpanel.track("Search Doctor", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": '', "Practice ID":data.pid, "Doctor Name":data.dname });
								$('#htmlContent').load(base_url+"page-doctor-detail #doctordetail_html", { content: data.rlink, did: data.did, pid: data.pid }, function() {
									$('#pageheader').show();
									$('#pageheader #profileHeader').show();
									$('#pageheader #profileHeader h4').text(data.title);
									$('#pageheader .logowithbg').hide();
									$('#pageheader .ycmenu').hide();
									$('.ycmlist').hide();
									$('#banner').hide();
									$('.backBtn').remove();
									$('#pageheader').prepend('<a href="mobile-user-profile" class="backBtn back_userprofile"><img alt="Back" src="assets/img/left_arrow.png"></a>');
									$('body').addClass('doctor-profile-page');
									initMap($('#mapaddress').val(),$('#lat').val(),$('#lng').val());
									$('#loading').hide();
								});
							} else {
								$('#loading').hide();
							}
						},
						error: function(xhr, err) {
							$('#loading').hide();
						},
						complete: function(e) {
							 
						}
					});
			
				});
			
		}
		
		function pcpautocomplete(){
			$('#pcp')
				.autocomplete('assets/plugins/autocomplete/search', acOptions_pcp)
				.result(function(e, data) {
					$('#pcp_selected_hidden').show().html(data[0] + ' - <span class="subname">' + data[4] + '</span>');
					$('#pcp_wrap').hide();
					var input = $("#pcp_hid");
					input.val(data[1]);

					$("#pcp_hname").val(data[0]);
					$("#pcp_hphone").val(data[3]);
					if ($("#pcpcontactnumber").length) {
						$("#pcpcontactnumber").val(data[3]);
						$('#pcpcontactnumber').mask("(999) 999-9999", {autoclear: false});
					}
				});
		}
		
		/*----------changes------------*/
		function medicalautocomplete(){
			var familyArr = [];
			var updatefamilyArr = [];
			if ($('#base_url_h').length) {
				var API_BASE_URL = $('#base_url_h').val();
			}
			$("#select_pastmedicalcondition").select2({
				ajax: {
					//url: API_BASE_URL + "user/pastmedicalhistory",
					url: base_url+"ajax/ajax_pastmedicalhistory",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Keyword: params.term, 
							Page: params.page
						};
					},
					processResults: function(data, params) { 
						document.activeElement.blur();
						$(this).blur();
						params.page = params.page || 1;
						return {
							results: data.data,
							pagination: {
								more: (params.page * 30) < data.count
							}
						};
					},
					cache: true
				}, 
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 2,
				templateResult: formatRepoData, 
				templateSelection: formatRepoDataSelection, 
				placeholder: 'Type to search medical condition',
				tags: true,
				tokenSeparators: [","],
        		allowClear: false
			}).on("change", function(e) {
			}).on("select2:select", function(e) {
				 
				var isNew = $(this).find('[data-select2-tag="true"]');
	
				if (e.params.data.name) {
					isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
				} else {
					isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
				}
				var a = new Array();
				$("#select_pastmedicalcondition").children("option").each(function(x) {
					test = false;
					b = a[x] = $(this).val();
					for (i = 0; i < a.length - 1; i++) {
						if (b == a[i])
							test = true;
					}
					if (test)
						$(this).remove();
				});
				$("#select_pastmedicalcondition").trigger('change');
	
				var pmcData = $('#select_pastmedicalcondition').select2('data');
				var pmcArr = [];
				var snames = '';
				for (var i in pmcData) {
					var item = pmcData[i];
	
	
					var itemname = item.text || item.name;
	
					if (item.id == itemname) {
						var itemid = '';
					} else {
						var itemid = item.id;
					}
					snames += itemname + ', ';
	
	
	
					pmcArr.push({
						"Id": itemid,
						"Name": itemname
					});
	
				}
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_pastmedicalcondition_hidden').html(snames);
	
	
				var pmcJsonData = JSON.stringify(pmcArr);
	
				$('#pmcJsonData').val(pmcJsonData);
	
	
			}).on("select2:unselect", function(e) { 
				var deletedId = e.params.data.id;
				if (deletedId == '') {
					var deletedId = e.params.data.name;
				}
				$('#select_pastmedicalcondition option').each(function() {
					if ($(this).val() == deletedId || $(this).text() == deletedId) {
						$(this).remove();
					}
				});
				$("#select_pastmedicalcondition").trigger('change');
				var pmcData = $('#select_pastmedicalcondition').select2('data');
				var pmcArr = [];
				var snames = '';
				for (var i in pmcData) {
					var item = pmcData[i];
	
					var itemname = item.text || item.name;
					if (item.id == itemname) {
						var itemid = '';
					} else {
						var itemid = item.id;
					}
					snames += itemname + ', ';
	
					pmcArr.push({
						"Id": itemid,
						"Name": itemname
					});
	
				}
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_pastmedicalcondition_hidden').html(snames);
	
	
				var pmcJsonData = JSON.stringify(pmcArr);
				$('#pmcJsonData').val(pmcJsonData);
	 
			});
			
			
			
			$("#select_surgeries").select2({
				ajax: {
					//url: API_BASE_URL + "user/getsurgicalhistory",
					url: base_url+"ajax/ajax_getsurgicalhistory",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Keyword: params.term, 
							Page: params.page
						};
					},
					processResults: function(data, params) {
						document.activeElement.blur();
						$(this).blur();
						params.page = params.page || 1;
						return {
							results: data.data,
							pagination: {
								more: (params.page * 30) < data.count
							}
						};
					}, 
					cache: true
				}, 
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 2,
				templateResult: formatRepoData, 
				templateSelection: formatRepoDataSelection, 
				placeholder: 'Type to search surgeries',
				tags: true,
				tokenSeparators: [","],
        		allowClear: false
			}).on("change", function(e) {}).on("select2:select", function(e) {
				 
				var isNew = $(this).find('[data-select2-tag="true"]');
				if (e.params.data.name) {
					isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
				} else {
					isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
				}
				 
				var a = new Array();
				$("#select_surgeries").children("option").each(function(x) {
					test = false;
					b = a[x] = $(this).val();
					for (i = 0; i < a.length - 1; i++) {
						if (b == a[i])
							test = true;
					}
					if (test)
						$(this).remove();
				});
				$("#select_surgeries").trigger('change');
	
				var surgeryData = $('#select_surgeries').select2('data');
				var surgeryArr = [];
				var snames = '';
				for (var i in surgeryData) {
					var item = surgeryData[i]; 
					var itemname = item.text || item.name;
	
					if (item.id == itemname) {
						var itemid = '';
					} else {
						var itemid = item.id;
					}
					snames += itemname + ', ';
	
					surgeryArr.push({
						"Id": itemid,
						"Name": itemname
					}); 
				}
				var surgeryJsonData = JSON.stringify(surgeryArr);
				$('#surgeryJsonData').val(surgeryJsonData);
	
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_surgeries_hidden').html(snames);
	 
			}).on("select2:unselect", function(e) {
				var deletedId = e.params.data.id;
				$('#select_surgeries option').each(function() {
					if ($(this).val() == deletedId || $(this).text() == deletedId) {
						$(this).remove();
					}
				});
				$("#select_surgeries").trigger('change');
				var surgeryData = $('#select_surgeries').select2('data');
				var surgeryArr = [];
				var snames = '';
				for (var i in surgeryData) {
					var item = surgeryData[i];
					 
					var itemname = item.text || item.name;
					if (item.id == itemname) {
						var itemid = '';
					} else {
						var itemid = item.id;
					}
					snames += itemname + ', ';
	
	
					surgeryArr.push({
						"Id": itemid,
						"Name": itemname
					}); 
				}
				var surgeryJsonData = JSON.stringify(surgeryArr);
				$('#surgeryJsonData').val(surgeryJsonData);
	
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_surgeries_hidden').html(snames);
	 
			});
			
			$("#select_allergies").select2({
            ajax: {
                //url: API_BASE_URL + "user/getallergy",
				url: base_url+"ajax/ajax_getallergy",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, 
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                },
                formatResult: function(post) {
                    markup = '<strong>' + post.text + '</strong>';
                },
                cache: true
            }, 
            escapeMarkup: function(markup) {
                return markup;
            },  
            minimumInputLength: 2,
            templateResult: formatRepoData, 
            templateSelection: formatRepoDataSelection, 
            placeholder: 'Type to search allergies',
            tags: true,
            tokenSeparators: [","],
        	allowClear: false
        }).on("change", function(e) {
             
        }).on("select2:select", function(e) {
             
            var isNew = $(this).find('[data-select2-tag="true"]');
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            
            var a = new Array();
            $("#select_allergies").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_allergies").trigger('change');

            var alleryData = $('#select_allergies').select2('data');
            var allergyArr = [];
            var snames = '';
            for (var i in alleryData) {
                var item = alleryData[i];
                
                var itemname = item.name || item.text;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                allergyArr.push({
                    "Id": itemid,
                    "Name": item.name || item.text
                });
                
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);

            
        }).on("select2:unselect", function(e) {
            var deletedId = e.params.data.id;
            $('#select_allergies option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_allergies").trigger('change');
            var alleryData = $('#select_allergies').select2('data');
            var allergyArr = [];
            var snames = '';
            for (var i in alleryData) {
                var item = alleryData[i];
                 
                var itemname = item.text || item.name;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                allergyArr.push({
                    "Id": itemid,
                    "Name": itemname
                });
                 
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);
 
        });
		
			$("#select_familyhistory").select2({
            ajax: {
                //url: API_BASE_URL + "user/familyhistory",
				url: base_url+"ajax/ajax_familyhistory",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term,  
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                }, 
                cache: true
            }, 
            escapeMarkup: function(markup) {
                return markup;
            },  
            minimumInputLength: 2,
            templateResult: formatRepoData,  
            templateSelection: formatRepoDataSelection,  
            placeholder: 'Type to search family history',
            tags: true,
            tokenSeparators: [","],
        	allowClear: false
        }).on("change", function(e) {
            
        }).on("select2:select", function(e) { 
 
            var isNew = $(this).find('[data-select2-tag="true"]');
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            
            var a = new Array();
            $("#select_familyhistory").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_familyhistory").trigger('change');

            $('#relFhName').text(e.params.data.name || e.params.data.text);
            $('#relationshipData').show();
            $('#form_mmedical_info input[type="submit"]').prop('disabled', true);
            $(this).prop("disabled", true);

 
        }).on("select2:unselect", function(e) {
             

            var deletedId = e.params.data.id;
            $('#select_familyhistory option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_familyhistory").trigger('change'); 

            var prevArrayVal = $('#familyJsonData').val();
            if (prevArrayVal) {
                var jsonfullobj = jQuery.parseJSON(prevArrayVal);
                var familyArr = [];
                var snames = '';
                for (var i in jsonfullobj) {
                    var item = jsonfullobj[i];
                    if (item.Id != deletedId) {
                        var itemname = item.text || item.Name;
                        if (item.Id == itemname) {
                            var itemid = '';
                        } else {
                            var itemid = item.Id;
                        }
                        snames += itemname + ', ';
                        familyArr.push({
                            "Id": itemid,
                            "Name": itemname,
                            "Relation": item.Relation
                        });
                    }
                }
            }

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_familyhistory_hidden').html(snames);


            var fhJsonData = JSON.stringify(familyArr);
            $('#familyJsonData').val(fhJsonData); 
        });
		}
		/*----------*/
		
		 
		function medicationautocomplete(){
			var medicationArr = [];
			if ($('#base_url_h').length) {
				var API_BASE_URL = $('#base_url_h').val();
			}
			$('#select_medication_freq1_wrap .customdd').select2({
				minimumResultsForSearch: Infinity,
				dropdownParent: $('#select_medication_freq1_wrap'),
				placeholder: {
					id: "-1",
					text: "Select a repository"
				}
			});
			$('#select_medication1')
                .autocomplete('assets/plugins/autocomplete/search-medication', acOptions_medication)
                .result(function(e, data) {
                    $('#select_medication1').blur();
                    
                    $('#medication_hid').val(data[1]);
                    $('#medication_hname').val(data[0]);
                    document.activeElement.blur();
                });
			
			
			
			$("#select_pharmacyaddress").select2({
				minimumResultsForSearch: Infinity,
				ajax: { 
					//url: API_BASE_URL + "yosidoctor/pharmacysearch",
					url: base_url+"ajax/ajax_pharmacysearch",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Name: params.term, 
							Page: params.page,
							ZipCode: $('#pharmacyzipcode').val()
						};
					},
					processResults: function(data, params) { 
						params.page = params.page || 1;
						if (data.success == 'Y') {
							return {
								results: data.data.Doctors,
								pagination: {
									more: (params.page * 30) < data.count
								}
							};
						} else {
							return {
								results: '',
								pagination: {
									more: ''
								}
							};
						}
					},
					formatResult: function(post) {
						markup = '<strong>' + post.text + '</strong>';
					},
					cache: false
				}, 
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 0,
				templateResult: formatRepoData_pharmacy, 
				templateSelection: formatRepoDataSelection_pharmacy, 
				placeholder: 'Search Pharmacy',
				allowClear: true
			}).focus(function() {
            $(this).select2('open');
        }).on("select2:select", function(e) { 
            var pharmacyData = $('#select_pharmacyaddress').select2('data');
             
            $("#pharmacy_hid").val(pharmacyData[0].id);
            $('#pharmacy_hname').val(pharmacyData[0].name);
            
            $('#pharmacy_hphone').val(pharmacyData[0].PhoneNumber);

        });
		}
		
		function completefunctions(){
			$('#refsource_wrap .customdd').select2({
				minimumResultsForSearch: Infinity,
				dropdownParent: $('#refsource_wrap')
			});
			pcpautocomplete();
			/*--------------------------jSignature-----------------*/

			(function($) {
				var topics = {};
				$.publish = function(topic, args) {
					if (topics[topic]) {
						var currentTopic = topics[topic],
								args = args || {};
			
						for (var i = 0, j = currentTopic.length; i < j; i++) {
							currentTopic[i].call($, args);
						}
					}
				};
				$.subscribe = function(topic, callback) {
					if (!topics[topic]) {
						topics[topic] = [];
					}
					topics[topic].push(callback);
					return {
						"topic": topic,
						"callback": callback
					};
				};
				$.unsubscribe = function(handle) {
					var topic = handle.topic;
					if (topics[topic]) {
						var currentTopic = topics[topic];
			
						for (var i = 0, j = currentTopic.length; i < j; i++) {
							if (currentTopic[i] === handle.callback) {
								currentTopic.splice(i, 1);
							}
						}
					}
				};
			})(jQuery);
			
			if ($("#signature").length) { 
						var $sigdiv = $("#signature").jSignature({
							'UndoButton': false,
							'background-color': 'transparent',
							'decor-color': 'transparent',
							'lineWidth': 2,
						})
			
								 
								, $tools = $('#tools')
								, $extraarea = $('#displayarea')
								, pubsubprefix = 'jSignature.demo.'
			
						var export_plugins = $sigdiv.jSignature('listPlugins', 'export')
								, chops = ['<span><b>Extract signature data as: </b></span><select>', '<option value="">(select export format)</option>']
								, name
						for (var i in export_plugins) {
							if (export_plugins.hasOwnProperty(i)) {
								name = export_plugins[i]
								chops.push('<option value="' + name + '">' + name + '</option>')
							}
						}
						chops.push('</select><span><b> or: </b></span>')
			
						$(chops.join('')).bind('change', function(e) {
							if (e.target.value !== '') {
								var data = $sigdiv.jSignature('getData', e.target.value)
								$.publish(pubsubprefix + 'formatchanged')
								if (typeof data === 'string') {
									$('textarea', $tools).val(data)
								} else if ($.isArray(data) && data.length === 2) {
									$('textarea', $tools).val(data.join(','))
									$.publish(pubsubprefix + data[0], data);
								} else {
									try {
										$('textarea', $tools).val(JSON.stringify(data))
									} catch (ex) {
										$('textarea', $tools).val('Not sure how to stringify this, likely binary, format.')
									}
								}
							}
						}).appendTo($tools)
			
			
						$('<input type="button" value="Reset">').bind('click', function(e) {
							$sigdiv.jSignature('reset')
						}).appendTo($tools);
			
						$('#clearsign').bind('click', function(e) {
							$sigdiv.jSignature('reset');
							$('#signhere').show();
						});
						$("#signature").bind('change', function(e) {
							$('#signhere').hide();
						});
			
						$('<div><textarea style="width:100%;height:7em;"></textarea></div>').appendTo($tools)
			
						$.subscribe(pubsubprefix + 'formatchanged', function() {
							$extraarea.html('')
						})
			
						$.subscribe(pubsubprefix + 'image/svg+xml', function(data) {
			
							try {
								var i = new Image()
								i.src = 'data:' + data[0] + ';base64,' + btoa(data[1])
								$(i).appendTo($extraarea)
							} catch (ex) {
			
							}
			
							var message = [
								"If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
										, "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
										, "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
							]
							$("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
						});
			
						$.subscribe(pubsubprefix + 'image/svg+xml;base64', function(data) {
							var i = new Image()
							i.src = 'data:' + data[0] + ',' + data[1]
							$(i).appendTo($extraarea)
			
							var message = [
								"If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
										, "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
										, "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
							]
							$("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
						});
			
						$.subscribe(pubsubprefix + 'image/png;base64', function(data) {
							var i = new Image()
							i.src = 'data:' + data[0] + ',' + data[1]
							$('<span><b>As you can see, one of the problems of "image" extraction (besides not working on some old Androids, elsewhere) is that it extracts A LOT OF DATA and includes all the decoration that is not part of the signature.</b></span>').appendTo($extraarea)
							$(i).appendTo($extraarea)
						});
			
						$.subscribe(pubsubprefix + 'image/jsignature;base30', function(data) {
							$('<span><b>This is a vector format not natively render-able by browsers. Format is a compressed "movement coordinates arrays" structure tuned for use server-side. The bonus of this format is its tiny storage footprint and ease of deriving rendering instructions in programmatic, iterative manner.</b></span>').appendTo($extraarea)
						});
			
						if (Modernizr.touch) {
							/*$('#scrollgrabber').height($('#content').height())*/
						}
			
						$('#signature').on('touchmove', function(e) {
							e.preventDefault();
						});
					} 
		}
		 
		
		function loadvalidate(type){
			if (type=='personal')
				$("#form_mpersonal_info").validate({
					errorElement: 'span',  
					errorClass: 'invalid', 
					ignore: "",
					rules: {
						firstname: {
							required: true
						},
						lastname: {
							required: true
						},
						address1: {
							required: true
						},
						address2: {
							required: false
						},
						zipcode: {
							required: true,
							masktel: true
						},
						select_gender: {
							required: true
						},
						date: {
							required: true
						}
					},
					errorPlacement: function(error, element) {
							if (element.attr("name") == "select_gender")
							{
								error.insertAfter("#select_gender_wrap");
							}
							else
							{
								error.insertAfter(element);
							}
						},
					messages: {
						date: {
							required: "Please enter a date in the format mm/dd/yyyy."
						}
					}
				});
			else if (type=='addappointment')
				$("form#addappointment").validate({
					ignore: "not:hidden",
					errorElement: 'span', 
					errorClass: 'invalid', 
					rules: {
						reasonforvisit: {
							required: true
						},
						signature_capture: {
							required: {
								depends: function(element) {
									if ($("#signature").jSignature("getData", "native").length == 0) {
										$("#signature").addClass('invalid');
										return true
									} else {
										$("#signature").removeClass('invalid');
										return false
									}
								}
							}
						}
					}
				});
			else if (type=='general')
				$("#generalinfo").validate({
					errorElement: 'span', 
					errorClass: 'invalid', 
					rules: {
						select_maritalstatus: {
							required: true
						},
						ssn: {
							masktel: true
						},
						mobilenumber: {
							required: true,
							masktel: true
						}
					},
					errorPlacement: function(error, element) {
							if (element.attr("name") == "select_maritalstatus")
							{
								error.insertAfter("#select_maritalstatus_wrap .selected_icon");
							}
							else
							{
								error.insertAfter(element);
							}
						},
					messages: {
						ssn: {
							range: "Please enter valid number"
						},
						mobilenumber: {
							required: "Please enter valid number"
						}
					}
				});
			else if (type=='mycontact')
				$("#mycontact").validate({
					errorElement: 'span', 
					errorClass: 'invalid', 
					rules: {
						emc_firstname: {
							required: true
						},
						emc_lastname: {
							required: true
						},
						emc_number: {
							required: true,
							masktel: true
						},
						pcpcontactnumber: {
							masktel: true
						},
						select_emc_relationship: {
							required: true
						}
					},
					errorPlacement: function(error, element) {
						if (element.attr("name") == "select_emc_relationship")
						{
							error.insertAfter("#select_emc_relationship_wrap .selected_icon");
						}
						else
						{
							error.insertAfter(element);
						}
					},
					messages: {
						emc_number: {
							required: "Please enter valid number"
						}
					}
				});
			else if (type=='insurance')
				$("#form_minsurance_info").validate({
					ignore: false,
					errorElement: 'span', 
					errorClass: 'invalid', 
					ignore: "",
					rules: {
						primary_policynumber: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						primary_company_name: {
							required: function(element) {
								return ($('#primary_companyname').is(":visible")) ? true : false;
							}
						},
						/*primary_groupnumber: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						primary_policyname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},*/
						primary_insuredfname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
		
							}
						},
						primary_insuredlname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
		
							}
						},
						primary_insureddob: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							},
							dateFormat: true
						},
						primary_insuredgender: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						primary_relationship: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_policynumber: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_company_name: {
							required: function(element) {
								return ($('#secondary_companyname').is(":visible")) ? true : false;
							}
						},
						/*secondary_groupnumber: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_policyname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},*/
						secondary_insuredfname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_insuredlname: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_insureddob: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							},
							dateFormat: true
						},
						secondary_insuredgender: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						},
						secondary_relationship: {
							required: function(element) {
								return ($(element).is(":visible")) ? true : false;
							}
						}
					},
						errorPlacement: function(error, element) {
							if (element.attr("name") == "primary_insuredgender")
							{
								error.insertAfter(".primary_insuredgender label");
							}
							else if (element.attr("name") == "primary_relationship")
							{
								error.insertAfter("#primary_relationship_wrap .selected_icon");
							}
							else if (element.attr("name") == "secondary_insuredgender")
							{
								error.insertAfter(".secondary_insuredgender label");
							}
							else if (element.attr("name") == "secondary_relationship")
							{
								error.insertAfter("#secondary_relationship_wrap .selected_icon");
							}
							else
							{
								error.insertAfter(element);
							}
						},
					messages: {
						primary_company_name: {
							required: "This is a required field. Please Select from list"
						},
						primary_company_id: {
							//required: "This is a required field. Please Select from list"
						},
						secondary_company_name: {
							required: "This is a required field. Please Select from list"
						},
						secondary_company_id: {
							//required: "This is a required field. Please Select from list"
						}
					}
				});
			else if (type=='additionalinfo_card')
				$('#additional-info_html .yc-form').validate({
					errorElement: 'span', 
					errorClass: 'invalid', 
					rules: {
						cardnumber: {
							required: function(element) {
								return ($('#requiredcard').val()=='Y') ? true : false;
							},
							number: true
						},
						expire_mm: {
							required: function(element) {
								return ($('#requiredcard').val()=='Y') ? true : false;
							}
						},
						expire_yy: {
							required: function(element) {
								return ($('#requiredcard').val()=='Y') ? true : false;
							}
						},
						security_code: {
							required: function(element) {
								return ($('#requiredcard').val()=='Y') ? true : false;
							}
						}
					},
					errorPlacement: function(error, element) {
						
					},
					messages: {
						
					}
				});
			else if (type=='additionalinfo_consent')
				$('#additional-info_html .yc-form').validate({
					errorElement: 'span', 
					errorClass: 'invalid',
					groups: {
						names: "patientonly patientsspouse patientsother"
					}, 
					rules: {
						patientonly: {
							require_from_group: [1, ".consentgfield"]
						},
						patientsspouse: {
							require_from_group: [1, ".consentgfield"]
						},
						patientsother: {
							require_from_group: [1, ".consentgfield"]
						},
						patientsspousename: {
							required: function(element) {
								return $('#patientsspouse').is(':checked');
							}
						},
						patientsothername: {
							required: function(element) {
								return $('#patientsother').is(':checked');
							}
						},
						patientauthorize: {
							required: true
						}
					},
					errorPlacement: function(error, element) {
						var elementName = element.attr("name"); 
					  
					  if ($(element).hasClass("consentgfield")) {
						  	error.insertBefore( "#patientauthorize_wrap" );
							//error.insertAfter($(element).closest("table"));
						} else if (elementName == "patientauthorize")
						{
							error.insertAfter("#patientauthorize_wrap");
						}else {
							error.insertAfter(element);
						}
						
					},
					messages: {
						
					}
				});
				
		}
		
		$('#htmlContent').on('keypress', '.numberonly', function(event){
			var keyCode = event.keyCode || event.which; 				 
			if(keyCode!=9)
			{ 					
				var regex = new RegExp("^[0-9 \b]+$");
				var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);					 
				if (!regex.test(key)) 
				{					 
					event.preventDefault();
					return false;
				}
			}
		});	
		
		$('#htmlContent').on('blur keyup', '#date', function(e){
			var $this = $(this),
					value = $this.val();
			isDate($this);
			$("#date").val(value);
			$("#hiddenDateField").val(value).trigger("blur").trigger("keyup");
		});
		/*--------changes-------*/
		$('#htmlContent').on('blur keyup', '#expire_yy, #expire_mm, #security_code', function(e){
			var $this = $(this),
					value = $this.val();
			isExpireYear($this);
		});
		/*----------------------------------------*/
		
		$('#htmlContent').on('change', 'input[type=radio][name=primary_areyouinsured]', function(e){
        $('#date-error-custom').remove();
        $('.form-group, .addInsurance').show();
        $('.secondaryInsuranceColumn .viewscannedimage').show();
        $('input:radio[name="primary_insuredgender"]').removeClass("validate[required]");
        $('#noins').removeClass("active");
		$('#insurance-card_html').show();
		//$('#primary_areyouinsured_noins').val('noins');
        if (this.value == 'N') {
            $('input:radio[name="primary_insuredgender"]').addClass("validate[required]");
            $('#primary_insureddob').mask("99/99/9999");
            $('#firstIns_dependent').show();
            $("#primary_relationship").select2("val", "");
            $('#primary_relationship_wrap .customdd').select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: $('#primary_relationship_wrap')
            });
            $('#primary_insuredfname').val('');
			$('#primary_insuredlname').val('');
            $('#primary_insureddob').val('');
            $('input:radio[name="primary_insuredgender"]').prop('checked', false);
        } else if (this.value == 'Y') {
            $('#firstIns_dependent').hide();
        } else if (this.value == 'noins') {
            $('.form-group, .addInsurance').hide();
            $('.secondaryInsuranceColumn .viewscannedimage').hide();
            $('.primaryInsuranceColumn .yc-form-field-inshead').show();
			$('#insurance-card_html').hide();
        }

    });
	
		/*$('#htmlContent').on('click', '#noins', function(e){
	  		$(this).addClass('active');
			$('#primary_areyouinsured_noins').val('noins');
	  		$('.form-group, .addInsurance').hide();
			$('.yc-form-field-noinshead').show();
            $('.secondaryInsuranceColumn .viewscannedimage').hide();
            $('.primaryInsuranceColumn .yc-form-field-inshead').show();
			$('input:radio[name="primary_areyouinsured"]').prop('checked', false);
			$('#insurance-card_html').hide();
		});*/

    	$('#htmlContent').on('change', 'input[type=radio][name=secondary_areyouinsured]', function(e){
        $('#date-error-custom').remove();
        $('input:radio[name="secondary_insuredgender"]').removeClass("validate[required]");
       
        if (this.value == 'N') {
            $('#secondary_insureddob').mask("99/99/9999");
            $('input:radio[name="secondary_insuredgender"]').addClass("validate[required]");
            
            $('#secondIns_dependent').show();
            $("#secondary_relationship").select2("val", "");
            $('#secondary_relationship_wrap .customdd').select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: $('#secondary_relationship_wrap')
            });
 
			$('#secondary_insuredfname').val('');
			$('#secondary_insuredlname').val('');
            $('#secondary_insureddob').val('');
            $('input:radio[name="secondary_insuredgender"]').prop('checked', false);
        } else if (this.value == 'Y') {
            $('#secondIns_dependent').hide();
        }

    });
		
		$('#htmlContent').on('click', '#withoutcard', function(e){
			$('#loading').show();
			var $this = $(this);
			var rlink = $this.attr("href");
			var page = $this.data("page");
			var title = $this.data("title");
			mixpanel.track("Skip Photo ID", {});
			loadhtml(page, title, rlink);				 
			e.preventDefault();
		});
		$('#htmlContent').on('click', '#withoutcardinsurance', function(e){
			$('#loading').show();
			var $this = $(this);
			var rlink = $this.attr("href");
			var page = $this.data("page");
			var title = $this.data("title");
			mixpanel.track("Skip Insurance card", {});
			loadhtml(page, title, rlink);		
			e.preventDefault();
		});
		$('#htmlContent').on('click', '.pop_editbtn,.addInsurance', function(e){
			$('#loading').show();
			var href = $(this).attr("href");
			var type = $(this).data("type");
			var instype = $(this).data("instype");
			var action = '';
			var post_array = $("#form_minsurance_info").serialize();
			var ajax_action = true;
			var previns='';
			if (type == 'addIns') {
				previns = $(this).data("added");
				if ($('#primary_policynumber').val() == '' || $('#primary_groupnumber').val() == '' || $('#primary_company_hname').val() == '') {
					ajax_action = false;
					$('#loading').hide();
					if (!$('#form_minsurance_info').valid())
						return false;
					//alert('Please enter primary insurance values');
				} else {
					action = 'maddInsuranceCard';
				}
			} else if (type == 'editIns') {
				action = 'mpopeditinscard';
			} else {
				action = 'mpopeditcard';
			}
			if (ajax_action) {
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: base_url+"ajax/apifunctions",
					data: {
						action: action,
						type: instype,
						post_array: post_array,
						preins:previns
					},
					success: function(data) {
						//console.log(previns+'_previously added');
						//console.log(data);
						if (type == 'addIns' || type == 'editIns') {
							//loadinsurancecardhtml(data.page, data.title, data.rlink, instype);
							/*if(previns=='Y'){
								loadhtml(data.page, data.title, data.rlink);
							}else{*/
								$('#form_minsurance_info').submit();
							/*}*/
						}else{
							loadhtml(data.page, data.title, data.rlink);
						}
						
						
					},
					error: function(xhr, err) {
						$('#loading').hide();
					}
				});
			}
	
			e.preventDefault();
		});
		
		$('#htmlContent').on('click', '#btn-process-image-ins', function(e){
        var usePreprocessing = true;
        var imageToProcess = new FormData();
        var imgValFront = $('#input-image-front').val();
        var imgValBack = $('#input-image-back').val();
        var storelink = $(this).data('link');
		var instype = $(this).data('type'); 
        $('#errorDiv').empty();
        $('#loading').hide();
        if ($(this).hasClass("fileupload-exists")) {
            var cb = rlink_callback($(this).data('rlink'));
            setTimeout(cb, 500);
            return false;
        }

        if (imgValFront == '') {
            $('#errorDiv').show().html("Please upload front image.");
            setTimeout(function () {
                $('#errorDiv').hide();
            }, 5000);
            return;
        }
		if (imgValBack == '') {
            $('#errorDiv').show().html("Please upload back image.");
            setTimeout(function () {
                $('#errorDiv').hide();
            }, 5000);
            return;
        }


        if (usePreprocessing) {
            imageToProcess.append("frontImage", preprocessedFrontImage);

            if (imgValBack != '')
                imageToProcess.append("backImage", preprocessedBackImage);
        } else {
            imageToProcess.append("frontImage", unmodifiedFrontImage);

            if (imgValBack != '')
                imageToProcess.append("backImage", unmodifiedBackImage);
        }

$('#loading').show();
         
        $.ajax({
            type: "POST",
            url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessMedInsuranceCard/true/0/150/" + usePreprocessing.toString(),
            data: imageToProcess,
            cache: false,
            contentType: 'application/octet-stream; charset=utf-8;',
            dataType: "json",
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
                $('#loading').show();
                $("#div-controls").hide();
            },
            success: function (data) {
                var session_value = '';
                $("#div-controls").show();
                var medicalCard = JSON.stringify(data);
                medicalCard = jQuery.parseJSON(medicalCard);
                if (medicalCard.ResponseCodeAuthorization < 0) {
                    $('.tick-icon').addClass('display_none').removeClass('display_block');
                    $('.cross-icon').addClass('display_block').removeClass('display_none');
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + medicalCard.ResponseMessageAuthorization + "</p>");
                } else if (medicalCard.WebResponseCode < 1) {
                    $('.tick-icon').addClass('display_none').removeClass('display_block');
                    $('.cross-icon').addClass('display_block').removeClass('display_none');
                    $('#errorDiv').show().html("CSSN Error Code: " + medicalCard.WebResponseDescription);
                } else {
                    $('#loading').show();
                    $('#btn-process-image-ins').hide();
                    var reformattedImageFront = medicalCard.ReformattedImage;
                    if (reformattedImageFront != null) {
                        var reformattedImageFront = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageFront);
						$("#image-thumbnail-front img:first-child").attr("src", reformattedImageFront);
                    }

                    var reformattedImageBack = medicalCard.ReformattedImageTwo;
                    if (reformattedImageBack != null) {
                        var reformattedImageBack = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageBack);
						$("#image-thumbnail-back img:first-child").attr("src", reformattedImageBack);
                    }
                    session_value = {
                        "scan_new":"Y",
                        "MemberName": medicalCard.MemberName, "NameSuffix": medicalCard.NameSuffix,
                        "NamePrefix": medicalCard.NamePrefix, "FirstName": medicalCard.FirstName,
                        "MiddleName": medicalCard.MiddleName, "LastName": medicalCard.LastName,
                        "MemberId": medicalCard.MemberId, "GroupId": medicalCard.GroupNumber,
                        "ContractCode": medicalCard.ContractCode, "CopayEr": medicalCard.CopayEr,
                        "CopayOv": medicalCard.CopayOv, "CopaySp": medicalCard.CopaySp,
                        "CopayUc": medicalCard.CopayUc, "Coverage": medicalCard.Coverage,
                        "DateOfBirth": medicalCard.DateOfBirth, "Deductible": medicalCard.Deductible,
                        "EffectiveDate": medicalCard.EffectiveDate, "Employer": medicalCard.Employer,
                        "ExpirationDate": medicalCard.ExpirationDate, "GroupName": medicalCard.GroupName,
                        "IssuerNumber": medicalCard.IssuerNumber, "Other": medicalCard.Other,
                        "PayerId": medicalCard.PayerId, "PlanAdmin": medicalCard.PlanAdmin,
                        "InsuranceName": medicalCard.PlanProvider, "InsurancePlan": medicalCard.PlanType,
                        "RxBin": medicalCard.RxBin, "RxGroup": medicalCard.RxGroup,
                        "RxId": medicalCard.RxId, "RxPcn": medicalCard.RxPcn,
                        "ListAddress": medicalCard.ListAddress, "ListPlanCode": medicalCard.ListPlanCode,
                        "ListDeductible": medicalCard.ListDeductible, "ListTelephone": medicalCard.ListTelephone,
                        "ListEmail": medicalCard.ListEmail, "ListWeb": medicalCard.ListWeb,
                        "FrontImage": reformattedImageFront, "BackImage": reformattedImageBack,
						"action"     : "ajaxstoreinsurancecarddata", "type": instype
                    };

					var re = /-/gi;
					var scanneddate = medicalCard.DateOfBirth;
					var currentage = '';
					if(scanneddate){
						var dateString = scanneddate.replace(re, '/');
						var today = new Date();
						var birthDate = new Date(dateString);
						var age = today.getFullYear() - birthDate.getFullYear();
						var m = today.getMonth() - birthDate.getMonth();
						if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
							age--;
						}
						currentage = age;
					}
					$('#loading').hide();
					 $('#'+instype+'_frontimage').val(session_value['FrontImage']);
					 $('#'+instype+'_backimage').val(session_value['BackImage']);
						$('#'+instype+'_policynumber').val(session_value['MemberId']);
						$('#'+instype+'_companyname').val('');
						$('#'+instype+'_company_hid').val('');
						$('#'+instype+'_company_hname').val('');
						/*$('#'+instype+'_companyname').val(session_value['InsuranceName']);
						$('#'+instype+'_groupnumber').val(session_value['GroupId']);
						$('#'+instype+'_policyname').val(session_value['InsurancePlan']);*/
						 
					
					mixpanel.track("Insurance ID Scan", {"Age": currentage, "Gender": '', "Fields Entered": session_value});
					
					
                    /*$.ajax({
                        type: "POST",
                        url: storelink,
                        data: session_value,
                        dataType: "json",
                        async: false,
                        success: function (data) {
                            $('.tick-icon').addClass('display_block').removeClass('display_none');
                            $('.cross-icon').addClass('display_none').removeClass('display_block');
                            mixpanel.track("Insurance ID Scan", {"Age": currentage, "Gender": '', "Fields Entered": session_value});
							loadhtml(data.page, data.title, data.rlink);
                        },
                        error: function (xhr, err) {
                            alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                            alert("responseText: " + xhr.responseText);
                        },
                        complete: function (e) {
                            
                        }
                    });*/

                }

            },
            error: function (xhr, err) {
                alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                alert("responseText: " + xhr.responseText);
                $("#div-controls").show();
            } 
        });
    });

	$.validator.addMethod(
            "masktel",
            function(value, element) {
                var hyphen = value.lastIndexOf('_');
                return this.optional(element) || (hyphen === -1 && value != '');
                /*return this.optional(element) || /^[a-zA-Z0-9()._-\s]+$/.test(value);*/
            },
            "Please enter valid number"
            );
	$.validator.addMethod("consentgfield", function() {
		return $(".yc-form").find(".consentgfield:checked").length > 0;
	}, 'Please choose an option to continue.');	
		 
});
	
var medicationArr = [];

var familyArr = [];
var updatefamilyArr = [];
	
var acOptions_pcp = {
    minChars: 3,
    cacheLength: 50,
    max: 50,
    multiple: false,
    formatItem: function(value) {
        return '<span>' + value[0] + '</span>, <span class="subname">' + value[4] + '</span>';
    }
};
var acOptions_doctor = {
    minChars: 2,
    cacheLength: 50,
    max: 50,
    multiple: false,
    formatItem: function(value) {
        var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
                "<div class='title'>" + value[0] + "</div>" +
                "<div class='ptitle'>" + value[3] + "</div>" +
                "<div class='sname'>" + value[4] + "</div>" +
                "<div class='paddress'>" + value[5] + "</div></div></div>";
        return markup;
    }
};


var acOptions_medication = {
        minChars: 2,
        cacheLength: 50,
        max: 50,
        multiple: false,
        formatItem: function(value) {
           // document.activeElement.blur();
            //$('#select_medication1').blur();
			// $("html, body").animate({scrollTop:$('#select_medication1_wrap').offset().top-30},1000);
            return '<span style="color:red">' + value[0] + '</span>';
        },
        scrollHeight: 150
    };

var acOptions_insurance = {
		minChars: 0,
		cacheLength: 50,
		max: 50,
		multiple: false,
		formatItem: function(value) {
		   // document.activeElement.blur();
			//$('#select_medication1').blur();
			// $("html, body").animate({scrollTop:$('#select_medication1_wrap').offset().top-30},1000);
			if($('#primary_company_hid').length){
				$('#primary_company_hid').val('');
				$('#primary_company_hname').val('');
			}
			if($('#secondary_company_hid').length){
				$('#secondary_company_hid').val('');
				$('#secondary_company_hname').val('');
			}
			return '<span style="color:red">' + value[0] + '</span>';
		},
		scrollHeight: 150
	};

function openPopup(popupId) {
    $('#' + popupId).addClass('md-show');
    $('.md-overlay').addClass('md-show');
}

function closePopup(popupId) {
    $('#' + popupId).removeClass('md-show');
    $('.md-overlay').removeClass('md-show');
}

function initMap(mapaddress,lat,lng) {
	var locations = [
		[''+mapaddress+'', ''+lat+'', ''+lng+'']

	];

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: new google.maps.LatLng(''+lat+'', ''+lng+''),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
						'Place ID: ' + place.place_id + '<br>' +
						place.formatted_address + '</div>');
				infowindow.open(map, this);
			});
		})(marker, i));
	}
}

function onFailure(err) {
        /*The developer can provide any alert messages here once permission is denied to use the webcam.*/
    }

function cloneCanvas(oldCanvas) {
 
	var newCanvas = document.querySelector('#selected-canvas');
	var context = newCanvas.getContext('2d');
 
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;

	 
	context.drawImage(oldCanvas, 0, 0);
 
	return newCanvas;
}
function cloneCanvas_ins(oldCanvas) {
	var newCanvas;

	if ($("#rdoFront").parent().hasClass("active"))
		newCanvas = document.querySelector('#selected-canvas-front');
	else
		newCanvas = document.querySelector('#selected-canvas-back');
	 
	/*var newCanvas = document.createElement('canvas');*/
	var context = newCanvas.getContext('2d');

	 
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;

	 
	context.drawImage(oldCanvas, 0, 0);

	 
	return newCanvas;
}

 
function snapshot() {
	capturedcanvas.width = video.videoWidth;
	capturedcanvas.height = video.videoHeight;
	contextCapturedCanvas.drawImage(video, 0, 0);
}

 
function dataURLtoBlob(dataURL) {
	 
	var binary = atob(dataURL.split(',')[1]);
	/* Create 8-bit unsigned array*/
	var array = [];
	for (var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	 
	return new Blob([new Uint8Array(array)], {type: 'image/jpg'});
}

 
function AddDisplay(fieldName, fieldValue) {

	if (fieldName == "Address Verification") {
		var string = "<div class=\"form-group\">";
		string += "<label class=\"col-md-4 control-label\">";
		string += fieldName;
		string += "</label>";
		string += "<div class=\"col-md-7\">";
		string += "<p class=\"form-control text-center\">";
		string += fieldValue;
		string += "</p>";
		string += "</div>";
		string += "</div>";
		return string;
	} else if (fieldValue) {
		var string = "<div class=\"form-group\">";
		string += "<label class=\"col-md-4 control-label\">";
		string += fieldName;
		string += "</label>";
		string += "<div class=\"col-md-7\">";
		string += "<p class=\"form-control text-center\">";
		string += fieldValue;
		string += "</p>";
		string += "</div>";
		string += "</div>";
		return string;
	} else
		return "";
}
;

$.validator.addMethod(
        "dateFormat",
        function(value, element) {
            if ($(element).is(":visible")) {
                var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
                var dtArray = value.match(rxDatePattern);
                if (dtArray == null)
                    return false;
                dtMonth = dtArray[1];
                dtDay = dtArray[3];
                dtYear = dtArray[5];
                if (dtMonth < 1 || dtMonth > 12)
                    return false;
                else if (dtDay < 1 || dtDay > 31)
                    return false;
                else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
                    return false;
                else if (dtMonth == 2) {
                    var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                    if (dtDay > 29 || (dtDay == 29 && !isleap))
                        return false;
                }
                return true;
            } else {
                return true;
            }
        },
        "Please enter a date in the format mm/dd/yyyy."
        );

 
var dtCh = "/";
var minYear = 1875;
var maxYear = new Date().getFullYear();
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

function daysInFebruary(year) {
     
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
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

/*------changes-----*/
function isExpireYear(element){
	var dtStr = element.val();
    $('#date-error-custom').remove();
    if ($('#date-error-custom').length == 0) {
        element.parent().append('<span id="date-error-custom" class="date-invalid" style="display:none;"></span>');
    }
	if(element.attr('id')=='expire_mm'){
		var strMonth = $('#expire_mm').val();
		var month = parseInt(strMonth);
		if (strMonth.length < 1 || month < 1 || month > 12) {
			$('#expire_mm').val('');
			$('#date-error-custom').show().text("Please enter a valid month");
			return false
		}
	}
	if(element.attr('id')=='expire_yy'){
		var date = new Date ();
		var currenttwodigityear = date.getFullYear().toString().substr(2,2);
		var expireyear = $('#expire_yy').val();
		if(currenttwodigityear > expireyear){
			$('#expire_yy').val('');
			$('#date-error-custom').show().text("Please enter a valid year");
			return false
		}
	}
	
	if(element.attr('id')=='security_code'){ 
		var code = $('#security_code').val();
		if (code.length > 3 && code.length >= 5) {
			if(code.length){
				$('#security_code').val('');
				$('#date-error-custom').show().text("please enter a valid 3 or 4 digit number");
				return false
			}
		}
	}
	
	$('#date-error-custom').hide()
    return true
}
/*-------*/

function isDate(element) {
    var dtStr = element.val();
    $('#date-error-custom').remove();
    if ($('#date-error-custom').length == 0) {
        element.parent().append('<span id="date-error-custom" class="date-invalid" style="display:none;"></span>');
    }
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
        
        $('#date-error-custom').show().text("The date format should be : mm/dd/yyyy");
        return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
         
        $('#date-error-custom').show().text("Please enter a valid month");
        return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
         
        $('#date-error-custom').show().text("Please enter a valid day");
        return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
         
        $('#date-error-custom').show().text("Please enter a valid 4 digit year between " + minYear + " and " + maxYear);
        return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
         
        $('#date-error-custom').show().text("Please enter a valid date");
        return false
    }
    $('#date-error-custom').hide()
    return true
}

function formatRepoData_pharmacy(repo) {
    if (repo.loading)
        return repo.text;

    var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
            "<div class='title'>" + repo.name + "</div>" +
            "<div class='ptitle'>" + repo.Address1 + " " + repo.Address2 + "</div>";

    return markup;
}
function formatRepoDataSelection_pharmacy(repo) {
    
    var customrepo = '';
    if (repo.name) {
        customrepo = repo.name + ', <span class="subname">' + repo.Address1 + '</span>';
    }
    if (repo.text) {
        if (repo.element) {
            customrepo = repo.text + ', <span class="subname">' + repo.element.dataset.address + '</span>';
        } else {
            customrepo = repo.text;
        }
    }
    return customrepo;
}

function formatRepoData(repo) {

    if (repo.loading)
        return repo.text;

    var markup = '';
    if (repo.name) {
        markup = repo.name;
    }
    if (repo.text) {
        markup = repo.text;
    }
    return markup;
 
}

function formatRepoDataSelection(repo) {
     
    var customrepo = '';
    if (repo.name) {
        customrepo = repo.name;
    }
    if (repo.text) {
        customrepo = repo.text;
    }
    return customrepo;
}

function submenus(){
					//$('#ycmenu').on('click', function(e) {
						$(".ycmlist").toggle();
					//});
		}

function session_checking()
{
    $.post( "session", function( data ) {
        if(data == "-1")
        {
            //alert("Your session has been expired!");
			openPopup('sessionexpire');
			
            //location.reload();
        }
    });
}

/*function loadpage(page,title,rlink){
			$("html, body").animate({ scrollTop: 0 }, "fast");
			if($('.back_userprofile').length){
				$('.back_userprofile').attr('href', '');
			}
			$('#htmlContent').load("http://localhost/devsite.yosicare.com/page-personal-info #"+page+"_html", { content: rlink }, function() {
				
			});
	
}*/