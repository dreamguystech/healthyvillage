jQuery(document).ready(function () {
    $('#loading').hide();
    $('input[type="checkbox"]').not('#create-switch').bootstrapSwitch();
    $("#rdoFront").prop("checked", true);
    $("#rdoFront").parent().addClass("active");

    //Detect type of device.
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    //These variables are for capturing images using webcam.
    //The images captured should be copied to the canvas to keep their resolutions.
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
    }
    else {
        //Change to .show() to enable webcam feature.
        $("#option-source").hide();
    }

    //Toggles UI between using fileupload or webcam as image input
    var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
    if (isSourceCameraOrDisk) {
        $("#container-camera").show();
        $("#container-webcam").hide();
    }
    else {
        $("#container-camera").hide();
        $("#container-webcam").show();
    }

    function onFailure(err) {
        //The developer can provide any alert messages here once permission is denied to use the webcam.
    }

    function cloneCanvas(oldCanvas) {
        var newCanvas;

        if ($("#rdoFront").parent().hasClass("active"))
            newCanvas = document.querySelector('#selected-canvas-front');
        else
            newCanvas = document.querySelector('#selected-canvas-back');
        //create a new canvas
        //var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
    }

    //Display the image to the canvas upon capturing image from webcam.
    function snapshot() {
        capturedcanvas.width = video.videoWidth;
        capturedcanvas.height = video.videoHeight;
        contextCapturedCanvas.drawImage(video, 0, 0);
    }

    // Convert dataURL to Blob object
    function dataURLtoBlob(dataURL) {
        // Decode the dataURL    
        var binary = atob(dataURL.split(',')[1]);
        // Create 8-bit unsigned array
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return our Blob object
        return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
    }

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue) {

        if (fieldName == "Address Verification" || fieldName == "ID Verification") {
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
        }
        else if (fieldValue) {
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
        }
        else
            return "";
    };

    //Toggles UI between using fileupload or webcam when the checkbox has been changed.
    $("#chkImageSource").change(function () {
        if (this.checked) {
            $("#container-camera").show();
            $("#container-webcam").hide();
        }
        else {
            $("#container-camera").hide();
            $("#container-webcam").show();
        }
    });

    //Accept captured image from webcam and display on canvas.
    $("#btn-use-image").click(function () {
        cloneCanvas(capturedcanvas);
        $('#myModal').modal("hide");
    });

    //Clicks on webcam area to capture image.
    $("#webcam").click(function () {
        snapshot();
        $('#myModal').modal();
    });

    //Clears controls and opens File Dialog to chose input image
    $("#placehold-image-front").click(function () {
        $("#input-image-front").click();       
        $('#loading').hide();
    });

    //Clears controls and opens File Dialog to chose input image
    $("#placehold-image-back").click(function () {
        $("#input-image-back").click();
        $('#loading').hide();
    });

    //Clears controls and opens File Dialog after choosing an input image
    $("#image-thumbnail-front").click(function () {
        $("#input-image-front").click();
        $('#errorDiv').hide();
        $('#loading').hide();
        $("#fileupload-container-back").show();
        $('.fileupload-new.thumbnail').show();
        $("#container-camera > div > div:first-child").attr('class', 'col-xs-12 col-sm-6 col-lg-6');
        $("#fileupload-container-front").fileupload("clear");
    });

    //Clears controls and opens File Dialog after choosing an input image
    $("#image-thumbnail-back").click(function () {
        $("#input-image-back").click();
        $('#errorDiv').hide();
        $('#loading').hide();
        $("#fileupload-container-back").fileupload("clear");
    });

    var unmodifiedFrontImage;
    //Resize image
    $('#input-image-front').change(function (e) {
        var file = e.target.files[0];

        canvasResize(file, {
            isPreprocessing: false,
            isiOS: isMobile.iOS(),
            cardType: "DriversLicenseDuplex",
            callback: function (data, width, height) {
                unmodifiedFrontImage = dataURLtoBlob(data);
            }
        });
    });

    var unmodifiedBackImage;
    //Resize image
    $('#input-image-back').change(function (e) {
        var file = e.target.files[0];

        canvasResize(file, {
            isPreprocessing: false,
            isiOS: isMobile.iOS(),
            cardType: "DriversLicenseDuplex",
            callback: function (data, width, height) {
                unmodifiedBackImage = dataURLtoBlob(data);
            }
        });
    });

    $("#btn-process-image").click(function () {
		$('#errorDiv').hide();
        $('#loading').hide();
        var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
        var imageToProcess;
        var imgValFront = $('#input-image-front').val();
        var imgValBack = $('#input-image-back').val();
		var storelink = $(this).data('link');
        if(imgValFront == '' && imgValBack == ''){
			//var rlink = $(this).data('rlink');
            //window.location.href = rlink;
            //return false;
			$('#errorDiv').show().html("Please scan your cards or click skip");
			setTimeout(function(){
				$('#errorDiv').hide();
			},5000);
			return false;
        }
        

        var dataUrl;
        var image;

        if (isSourceCameraOrDisk) {
            if (imgValFront == '') {
                $('#errorDiv').show().html("Front side image required.");
				setTimeout(function(){
					$('#errorDiv').hide();
				},5000);
                return;
            }

            if (imgValBack == '') {
				$('#errorDiv').show().html("Back side image required.");
				setTimeout(function(){
					$('#errorDiv').hide();
				},5000);
                return;
            }

            imageToProcess = new FormData();
            
            imageToProcess.append("frontImage", unmodifiedFrontImage);
            imageToProcess.append("backImage", unmodifiedBackImage);
            
        }
        else {
            imageToProcess = new FormData();
            dataUrl = selectedCanvasFront.toDataURL();
            image = dataURLtoBlob(dataUrl);
            var blankDataUrl = blankCanvasFront.toDataURL();

            if (dataUrl == blankDataUrl) {
				$('#errorDiv').show().html("Capture image first before processing.");
				setTimeout(function(){
					$('#errorDiv').hide();
				},5000); 
                return;
            }
            //imageToProcess = image;
            imageToProcess.append("files", image);

            dataUrl = selectedCanvasBack.toDataURL();

            if (dataUrl == blankDataUrl) {
				$('#errorDiv').show().html("Capture back image before processing.");
				setTimeout(function(){
					$('#errorDiv').hide();
				},5000);  
                return;
            }
            else {
                image = dataURLtoBlob(dataUrl);
                imageToProcess.append("files", image);
            }
        }
        
        //Accesing the web service 
        $.ajax({
            type: "POST",
           url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDLDuplex/0/true/-1/true/true/true/0/150/105/false",
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

                var driversLicense = JSON.stringify(data);
				//console.log(driversLicense);
                driversLicense = jQuery.parseJSON(driversLicense);
                //Checking if there are errors returned.
                if (driversLicense.ResponseCodeAuthorization < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseMessageAuthorization + "</p>");
                }
                else if (driversLicense.ResponseCodeAutoDetectState < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeAutoDetectStateDesc + "</p>");
                }
                else if (driversLicense.ResponseCodeProcState < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeProcStateDesc + "</p>");
                }
                else if (driversLicense.WebResponseCode < 1) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.WebResponseDescription + "</p>");
                }
                else {
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
                    }					
                    var reformattedImageBack = driversLicense.ReformattedImageTwo;
                    if (reformattedImageBack != null && reformattedImageBack != "") {
                        var reformattedImageBack = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageBack);
                    }
                    var session_value = {
                        "FirstName"     : driversLicense.NameFirst,     "MiddleName"    : driversLicense.NameMiddle,   
                        "LastName"      : driversLicense.NameLast,      "LicenseNumber" : driversLicense.license,   
                        "Address1"       : driversLicense.Address,      "Address2"       : driversLicense.Address2, 
						"City"          : driversLicense.City, 			"State"         : driversLicense.State,         
						"Zip"           : driversLicense.Zip,        	"Country"       : driversLicense.IdCountry,     
						"ExpirationDate": driversLicense.ExpirationDate4,
                        "IssueDate"     : driversLicense.IssueDate4,    "Dob"		    : driversLicense.DateOfBirth4, 
                        "Gender"        : driversLicense.Sex,           "EyesColor"     : driversLicense.Eyes,      
                        "HairColor"     : driversLicense.Hair,          "Height"        : driversLicense.Height,
                        "Weight"        : driversLicense.Weight,        "Class"         : driversLicense.Class,              
                        "Restriction"   : driversLicense.Restriction,   "AddresVerified": driversLicense.IsAddressVerified, 
                        "IDVerified"    : driversLicense.IsIDVerified,  "FaceImage"     : faceImage,
                        "SignImage"     : signImage,                    "FrontImage"    : reformattedImageFront,
                        "BackImage"     : reformattedImageBack
                    };
					var scanneddate = driversLicense.DateOfBirth4;
					var dateString = scanneddate.replace("-", "/"); 
					var today = new Date();
					var birthDate = new Date(dateString);
					var age = today.getFullYear() - birthDate.getFullYear();
					var m = today.getMonth() - birthDate.getMonth();
					if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
						age--;
					}
					var currentage = age;
                    $.ajax({
                        type    : "POST",
                        url     : storelink,
                        data    : session_value ,
                        dataType:"json",
                        async   : false,
                        success : function (data) {
                                    $('.tick-icon').addClass('display_block').removeClass('display_none');
                                    $('.cross-icon').addClass('display_none').removeClass('display_block');
									var cb = rlink_callback(data.rlink);
									if(driversLicense.Sex=='M' || driversLicense.Sex=='Male'){
										var scannedgender = 'Male';
									}else{
										var scannedgender = 'Female';
									}
									mixpanel.track("Photo ID Scan", { "Age": currentage, "Gender":scannedgender, "Fields Entered": session_value }, cb);
        							setTimeout(cb, 500);
                        },
                        error   : function (xhr, err) {
                                    alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                                    alert("responseText: " + xhr.responseText);
                        },
                        complete: function (e) {
                                    $('#loading').hide();
                                    $('#btn-process-image').show();
                        }
                    });  
                }
				
				setTimeout(function(){
					$('#errorDiv').hide();
				},5000);
            },
            error: function (xhr, err) {
                $("#div-controls").show();
            },
            complete: function (e) {
                $('#loading').hide();
                $("#div-controls").show();
                $('#btn-process-image').show();
            }
        });
    });
	
	function rlink_callback(rlink) {
        return function() {
            window.location.href = rlink;
        }
    }

});