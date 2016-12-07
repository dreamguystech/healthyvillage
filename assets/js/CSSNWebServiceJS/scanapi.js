

$(document).ready(function () {
    authinfo = $.base64.encode("741F736A9D8F");
    
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
    var usePreprocessing = false;
    var insuranceURL    = "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessMedInsuranceCard/true/0/150/false";
    var licenseURL      = "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDLDuplex/0/true/-1/false/false/false/0/150/105/false";
    
    $('#btn-insurance-image').on('click',function () {
        $('#input-insurance-image-front').click(); 
        $('#input-insurance-image-back').click();
    }); 
    $('#btn-license-image').on('click',function () {
        $('#input-license-image-front').click(); 
        $('#input-license-image-back').click();        
    }); 
    $('#input-insurance-image-front').on('change', function (a) { 
        imageUpload(a.target.files[0], insuranceURL, 'insuranceFrontImage', 'insurance'); 
    }); 
    $("#input-insurance-image-back").on('change',function(b){ 
        imageUpload(b.target.files[0], insuranceURL, 'insuranceBackImage', 'insurance');         
    }); 
        
    var unmodifiedFrontImage;
    $('#input-license-image-front').on('change', function (c) { 
       var file = c.target.files[0];       
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
    $("#input-license-image-back").on('change',function(d){ 
        var file = d.target.files[0];

        canvasResize(file, {
            isPreprocessing: false,
            isiOS: isMobile.iOS(),
            cardType: "DriversLicenseDuplex",
            callback: function (data, width, height) {
                unmodifiedBackImage = dataURLtoBlob(data);
            }
        });
        var imageToProcess;
        imageToProcess = new FormData();
        imageToProcess.append("BackImage", unmodifiedBackImage);  
        imageToProcess.append("FrontImage", unmodifiedFrontImage);
        imageUpload(imageToProcess, licenseURL, 'licenseImage', 'license');  
    }); 
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
});

function imageUpload(uploadedImage,apiURL, imageType,scanType){ 
    
    $('#errorDiv').empty();
    //$('#loading').hide();    

    if(imageType!='licenseImage') {
        var imageToProcess;
        imageToProcess = new FormData();
        imageToProcess.append(imageType, uploadedImage);
    } else{
        imageToProcess = uploadedImage;
    }
    //Accesing the web service     
    $.ajax({
        type: "POST",
        url: apiURL,
        data: imageToProcess,
        cache: false,
        contentType: 'application/octet-stream; charset=utf-8;',
        dataType: "json",
        processData: false,
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
            $('#loading').show();
        },
        success: function (data) {                
            var stringData = JSON.stringify(data);
            var userData = jQuery.parseJSON(stringData);

            if (userData.ResponseCodeAuthorization < 0) {
                $('#errorDiv').html("<p>CSSN Error Code: " + userData.ResponseMessageAuthorization + "</p>");
                $('.'+scanType+'.tick-icon').hide();
                $('.'+scanType+'.cross-icon').show();                                  }
            else if (userData.WebResponseCode < 1) {
                $('#errorDiv').html("<p>CSSN Error Code: " + userData.WebResponseDescription + "</p>");
                $('.'+scanType+'.tick-icon').hide();
                $('.'+scanType+'.cross-icon').show();
            }
            else {
                var session_values = {imageType,userData};
                $.ajax({
                    type: "POST",
                    url: "http://wpdevel.yosicare.com/scan-api",
                    data: session_values ,
                    async: false,
                    success: function () {
                        if(imageType == 'insuranceBackImage' || imageType == 'licenseImage'){
                            $('.'+scanType+'.tick-icon').show();
                            $('.'+scanType+'.cross-icon').hide();
                        }
                        
                    },
                    error: function (xhr, err) {
                        alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                        alert("responseText: " + xhr.responseText);
                    },
                });       
            }
        },
        error: function (xhr, err) {
            alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            alert("responseText: " + xhr.responseText);
        },
        complete: function (e) {
            $('#loading').hide();
        }
    });
}
