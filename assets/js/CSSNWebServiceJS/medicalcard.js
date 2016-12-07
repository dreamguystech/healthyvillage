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
        /*$('#chkPreProcessing').bootstrapSwitch('setState', true);*/
    } else {

        //Change to .show() to enable webcam feature.
        $("#option-source").hide();

        //Remove comment to enable webcam feature
        //Prompts the user for permission to use a webcam.
        //        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        //        if (navigator.getUserMedia) {
        //            navigator.getUserMedia
        //                            (
        //                              { video: true },
        //                              function (localMediaStream) {
        //                                  video.src = window.URL.createObjectURL(localMediaStream);
        //                              }, onFailure);
        //        }

        $("#help-icon").tooltip({placement: 'bottom'});
        /*$('#chkPreProcessing').bootstrapSwitch('setState', false);*/
    }

    //Toggles UI between using fileupload or webcam as image input
    var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
    if (isSourceCameraOrDisk) {
        $("#container-camera").show();
        $("#container-webcam").hide();
    } else {
        $("#container-camera").hide();
        $("#container-webcam").show();
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
        return new Blob([new Uint8Array(array)], {type: 'image/jpg'});
    }

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue) {

        if (fieldValue) {
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

        return "";
    }
    ;

    //Toggles UI between using fileupload or webcam when the checkbox has been changed.
    $("#chkImageSource").change(function () {
        if (this.checked) {
            $("#container-camera").show();
            $("#container-webcam").hide();
        } else {
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
        $("#div-controls").show();
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
        $('#errorDiv').empty();
        $('#loading').hide();
        $("#div-controls").show();
        $("#fileupload-container-back").show();
        $("#fileupload-container-front").fileupload("clear");
    });

    //Clears controls and opens File Dialog after choosing an input image
    $("#image-thumbnail-back").click(function () {

        $("#input-image-back").click();
        $('#errorDiv').empty();
        $('#loading').hide();
        $("#div-controls").show();
        $("#fileupload-container-back").fileupload("clear");
    });

    var unmodifiedFrontImage;
    //Resize image
    $('#input-image-front').change(function (e) {
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
    //Resize image
    $('#input-image-back').change(function (e) {
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
            }
        });
        canvasResize(file, {
            isPreprocessing: false,
            isiOS: isMobile.iOS(),
            cardType: "MedicalCard",
            callback: function (data, width, height) {
                unmodifiedBackImage = dataURLtoBlob(data);
            }
        });
    });

    $("#btn-process-image").click(function () {
        var usePreprocessing = true;
        var imageToProcess = new FormData();
        var imgValFront = $('#input-image-front').val();
        var imgValBack = $('#input-image-back').val();
        var storelink = $(this).data('link');
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


        if (usePreprocessing) {
            imageToProcess.append("frontImage", preprocessedFrontImage);

            if (imgValBack != '')
                imageToProcess.append("backImage", preprocessedBackImage);
        } else {
            imageToProcess.append("frontImage", unmodifiedFrontImage);

            if (imgValBack != '')
                imageToProcess.append("backImage", unmodifiedBackImage);
        }

        //var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
        /*var usePreprocessing = $('#chkPreProcessing').is(':checked') ? true : false;*/


        //if (isSourceCameraOrDisk) {




//        }
//        else {
//            imageToProcess = new FormData();
//            dataUrl = selectedCanvasFront.toDataURL();
//            image = dataURLtoBlob(dataUrl);
//            var blankDataUrl = blankCanvasFront.toDataURL();
//
//            if (dataUrl == blankDataUrl) {
//				$('#errorDiv').show().html("Capture image first before processing.");
//				setTimeout(function(){
//					$('#errorDiv').hide();
//				},5000); 
//                return;
//            }
//            //imageToProcess = image;
//            imageToProcess.append("files", image);
//
//
//            dataUrl = selectedCanvasBack.toDataURL();
//
//            if (dataUrl != blankDataUrl) {
//                image = dataURLtoBlob(dataUrl);
//                imageToProcess.append("files", image);
//            }
//        }

        //Accesing the web service 
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
                    $('#btn-process-image').hide();
                    var reformattedImageFront = medicalCard.ReformattedImageTwo;
                    if (reformattedImageFront != null) {
                        var reformattedImageFront = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageFront);
                    }

                    var reformattedImageBack = medicalCard.ReformattedImage;
                    if (reformattedImageBack != null) {
                        var reformattedImageBack = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageBack);
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

                    $.ajax({
                        type: "POST",
                        url: storelink,
                        data: session_value,
                        dataType: "json",
                        async: false,
                        success: function (data) {
                            $('.tick-icon').addClass('display_block').removeClass('display_none');
                            $('.cross-icon').addClass('display_none').removeClass('display_block');
                            var cb = rlink_callback(data.rlink);
                            mixpanel.track("Insurance ID Scan", {"Age": currentage, "Gender": '', "Fields Entered": session_value}, cb);
                            setTimeout(cb, 500);
                        },
                        error: function (xhr, err) {
                            alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                            alert("responseText: " + xhr.responseText);
                        },
                        complete: function (e) {
                            $('#loading').hide();
                            $('#btn-process-image').show();
                        }
                    });

                }

            },
            error: function (xhr, err) {
                alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                alert("responseText: " + xhr.responseText);
                $("#div-controls").show();
            },
            complete: function (e) {
                $('#loading').hide();
                $("#div-controls").show();
            }
        });
    });

    function rlink_callback(rlink) {
        return function () {
            window.location.href = rlink;
        }
    }

});