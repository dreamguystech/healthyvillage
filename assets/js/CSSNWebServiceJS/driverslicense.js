jQuery(document).ready(function() {
    $('#loading').hide();
    //Convert checkbox to switch type
    $('input[type="checkbox"]').not('#create-switch').bootstrapSwitch();

    //Detect type of device.
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

    //These variables are for capturing images using webcam.
    //The images captured should be copied to the canvas to keep their resolutions.
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

        //

        //        $("#help-icon").tooltip({ placement: 'bottom' });
        //        $('#chkPreProcessing').bootstrapSwitch('setState', false);
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

    //Toggles UI between using fileupload or webcam when the checkbox has been changed.
    $("#chkImageSource").change(function() {
        if (this.checked) {
            $("#container-camera").show()
            $("#container-webcam").hide()
        } else {
            $("#container-camera").hide()
            $("#container-webcam").show()
        }
    });

    function onFailure(err) {
        //The developer can provide any alert messages here once permission is denied to use the webcam.
    }

    function cloneCanvas(oldCanvas) {

        //create a new canvas
        var newCanvas = document.querySelector('#selected-canvas');
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



    //Accept captured image from webcam and display on canvas.
    $("#btn-use-image").click(function() {
        cloneCanvas(capturedcanvas);
        $('#myModal').modal("hide");
        $("#div-controls").show();
    });

    //Clicks on webcam area to capture image.
    $("#webcam").click(function() {
        snapshot();
        $('#myModal').modal()
    });

    //Clears controls and opens File Dialog to chose input image
    $("#placehold-image").click(function() {
        $("#input-image").click();
//        document.getElementById("faceImage").style.display = "none";
//        document.getElementById("signImage").style.display = "none";
//        document.getElementById("extractedData").style.display = "none";
        $('#drivers-license-data').empty();
        $('#errorDiv').hide();
        $('#loading').hide();
        $("#div-controls").show();
    });

    //Clears controls and opens File Dialog after choosing an input image
    $("#image-thumbnail").click(function() {
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

    var preprocessedImage;
    var unmodifiedImage;
    //Resize image
    $('#input-image').change(function(e) {

        var file = e.target.files[0];

        canvasResize(file, {
            crop: false,
            quality: 75,
            isiOS: isMobile.iOS(),
            isPreprocessing: true,
            cardType: "DriversLicense",
            callback: function(data, width, height) {
                preprocessedImage = dataURLtoBlob(data);
            }
        });

        canvasResize(file, {
            isPreprocessing: false,
            cardType: "DriversLicense",
            callback: function(data, width, height) {
                unmodifiedImage = dataURLtoBlob(data);
            }
        });
    });

    $("#btn-process-image").click(function() {
        //var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
        /*var usePreprocessing = $('#chkPreProcessing').is(':checked') ? true : false;*/
        var usePreprocessing = true;

        //var selectedRegion = $("#region-select").val();
        var imageToProcess;
        var imgVal = $('#input-image').val();
        var storelink = $(this).data('link');
        $('#errorDiv').hide();
        $('#loading').hide();
        if ($(this).hasClass("fileupload-exists")) {
            var cb = rlink_callback($(this).data('rlink'));
            setTimeout(cb, 500);
            return false;
        }
        //if (isSourceCameraOrDisk) {
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
//        } else {
//            var dataUrl = selectedCanvas.toDataURL();
//            var image = dataURLtoBlob(dataUrl);
//            var blankDataUrl = blankCanvas.toDataURL();
//
//            if (dataUrl == blankDataUrl) {
//				$('#errorDiv').show().html("Capture image first before processing.");
//				setTimeout(function(){
//					$('#errorDiv').hide();
//				},5000);
//                return;
//            }
//            imageToProcess = image;
//        }

        //Accesing the web service
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

                //Checking if there are errors returned.
                if (driversLicense.ResponseCodeAuthorization < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseMessageAuthorization + "</p>");
                } else if (driversLicense.ResponseCodeAutoDetectState < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeAutoDetectStateDesc + "</p>");
                } else if (driversLicense.ResponseCodeProcState < 0) {
                    $('#errorDiv').show().html("<p>CSSN Error Code: " + driversLicense.ResponseCodeProcessStateDesc + "</p>");
                } else if (driversLicense.WebResponseCode < 1) {
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
                    }
//                    var reformattedImageBack = driversLicense.ReformattedImageTwo;
//                    if (reformattedImageBack != null && reformattedImageBack != "") {
//                        var reformattedImageBack = "data:image/jpg;base64," + goog.crypt.base64.encodeByteArray(reformattedImageBack);
//                    }
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
                        //"BackImage"     : reformattedImageBack
                    };
                    
					var re = /-/gi;
					var scanneddate = driversLicense.DateOfBirth4;
					
					var dateString = scanneddate.replace(re, '/');
					
                   // var dateString = scanneddate.replace("-", "/");
                    var today = new Date();
                    var birthDate = new Date(dateString);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    var currentage = age;
                    $.ajax({
                        type: "POST",
                        url: storelink,
                        data: session_value,
                        dataType: "json",
                        async: false,
                        success: function(data) {
                            $('.tick-icon').addClass('display_block').removeClass('display_none');
                            $('.cross-icon').addClass('display_none').removeClass('display_block');
                            var cb = rlink_callback(data.rlink);
                            if (driversLicense.Sex == 'M' || driversLicense.Sex == 'Male') {
                                var scannedgender = 'Male';
                            } else {
                                var scannedgender = 'Female';
                            }
                            mixpanel.track("Photo ID Scan", {"Age": currentage, "Gender": scannedgender, "Fields Entered": session_value}, cb);
                            setTimeout(cb, 500);
                        },
                        error: function(xhr, err) {
                            alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                            alert("responseText: " + xhr.responseText);
                        },
                        complete: function(e) {
                            $('#loading').hide();
                            $('#btn-process-image').show();
                        }
                    });

//                    //Display data returned by the web service
//                    var data = AddDisplay("First Name", driversLicense.NameFirst);
//                    data += AddDisplay("Middle Name", driversLicense.NameMiddle);
//                    data += AddDisplay("Last Name", driversLicense.NameLast);
//                    data += AddDisplay("License Number", driversLicense.license);
//                    data += AddDisplay("Address", driversLicense.Address);
//                    data += AddDisplay("City", driversLicense.City);
//                    data += AddDisplay("State", driversLicense.State);
//                    data += AddDisplay("Zip", driversLicense.Zip);
//                    data += AddDisplay("Country", driversLicense.IdCountry);
//                    data += AddDisplay("Expiration Date", driversLicense.ExpirationDate4);
//                    data += AddDisplay("Issue Date", driversLicense.IssueDate4);
//                    data += AddDisplay("Date Of Birth", driversLicense.DateOfBirth4);
//                    data += AddDisplay("Sex", driversLicense.Sex);
//                    data += AddDisplay("Eyes Color", driversLicense.Eyes);
//                    data += AddDisplay("Hair Color", driversLicense.Hair);
//                    data += AddDisplay("Height", driversLicense.Height);
//                    data += AddDisplay("Weight", driversLicense.Weight);
//                    data += AddDisplay("Class", driversLicense.Class);
//                    data += AddDisplay("Restriction", driversLicense.Restriction);
//                    data += AddDisplay("Endorsements", driversLicense.Endorsements);
//                    data += AddDisplay("Address Verification", driversLicense.IsAddressVerified);
//
//                    $(data).appendTo("#drivers-license-data");
//                    document.getElementById("extractedData").style.display = "inline";
//
//                    //Display face, sign and reformatted images on UI
//                    var faceImage = driversLicense.FaceImage;
//                    if (faceImage != null || faceImage != "") {
//                        var base64FaceImage = goog.crypt.base64.encodeByteArray(faceImage);
//                        document.getElementById("faceImage").style.display = "inline";
//                        $("#face-image").attr("src", "data:image/jpg;base64," + base64FaceImage);
//                    }
//
//                    var signImage = driversLicense.SignImage;
//                    if (signImage != null || signImage != "") {
//                        var base64SignImage = goog.crypt.base64.encodeByteArray(signImage);
//                        document.getElementById("signImage").style.display = "inline";
//                        $("#signature-image").attr("src", "data:image/jpg;base64," + base64SignImage);
//                    }
//
//                    var reformattedImage = driversLicense.ReformattedImage;
//                    if (reformattedImage != null || reformattedImage != "") {
//                        var base64ReformattedImage = goog.crypt.base64.encodeByteArray(reformattedImage);
//                        $("#image-thumbnail img:first-child").attr("src", "data:image/jpg;base64," + base64ReformattedImage);
//                    }
                }
            },
            error: function(e) {
                $("#div-controls").show();
            },
            complete: function(e) {
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