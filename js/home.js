var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$(".user-name").empty().append(window.localStorage.getItem("pat_name"));
$(".user-number").empty().append(window.localStorage.getItem("pat_phone"));
$(".user-dob").empty().append(window.localStorage.getItem("pat_dob"));
if(window.localStorage.getItem("pre_page")){
	$("#user-profile_html").hide();
	$("#pageheader").show();
	$(".loginlogoheader, #user-profile_html").hide();
	$("#pageheader .site-title h4").empty().append('My profile');
	$("#"+window.localStorage.getItem("pre_page")).show();
	window.localStorage.removeItem("pre_page");
}
$(document).ready(function(e) {
	if(!window.localStorage.getItem("pat_id")){ window.location.href="index.html"; }
    setTimeout(function(){ $("#loading").hide(); },1000);
   var height = $(window).height();        
   var headr_height = $("#pageheader").height();
   var footr_height = $("#pagefooter").height();
   var setheight = height - headr_height;
   var trueheight = setheight - footr_height;
   $(".main").css("height", trueheight);
});

$(".media-list li:eq(1)").on('click',function(){ $("#loading").show(); $(".loginlogoheader, #user-profile_html").hide(); $("#pageheader, #myprofile_html").show(); setTimeout(function(){ $("#loading").hide(); },300); });

$('#doctorsearch')
	.autocomplete(base_url+"mobile-app?page=searchDoctor", acOptions_doctor)
	.result(function(e, data) {
		$("#loading").show();
		$('body').removeClass('profile-page2').addClass('user-profile-page').addClass('doctor-profile-page');
		$("#user-profile_html").hide();
		$(".loginlogoheader").hide();
		$("#pageheader, #doctordetail_html").show();
		$("#pageheader .site-title h4").empty().append('DOCTOR PROFILE');
		$("#dpracticeid").val(data[5]);
		$("#did").val(data[1]);
		$("#dname").val(data[0]);
		$("#mapaddress").val(data[3]+" "+data[4]);
		$("#lat").val(data[6]);
		$("#lng").val(data[7]);
		
		$(".docteraddressdiv .reach-title").empty().append(data[0]);
		$(".docteraddressdiv .reach-subtitl").empty().append(data[9]);
		$(".docteraddressdiv .speciality_row span").empty().append(data[2]);
		$(".calbutton a").attr("href","tel://"+data[8]);
		$(".address_row").empty().append(data[3]+"<br />"+data[4]);
		initMap($('#mapaddress').val(),$('#lat').val(),$('#lng').val());
		setTimeout(function(){ $("#loading").hide(); },300);
		});
			
	var acOptions_doctor = {
    minChars: 2,
    cacheLength: 50,
    max: 50,
    multiple: false,
    formatItem: function(value) {
        var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
                "<div class='title'>" + value[0] + "</div>" +
                "<div class='ptitle'>" + value[2] + "</div>" +
                "<div class='sname'>" + value[3] + "</div>" +
                "<div class='paddress'>" + value[4] + "</div></div></div>";
        return markup;
    }
};
	
	
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

$(document).on('click',"#pageheader .panel-control-left a",function(){
	$("#loading").show();
	$("#pageheader, #doctordetail_html, #myprofile_html").hide();
	$(".loginlogoheader, #user-profile_html").show();
	$("#pageheader .site-title h4").empty().append('My profile');
	$("#doctorsearch").val('');
	setTimeout(function(){ $("#loading").hide(); },300);
	$('body').removeClass('user-profile-page').removeClass('doctor-profile-page').addClass('profile-page2');
});


$("#form_mdoctordetail_info").submit(function(){
	$("#loading").show(); 
	window.localStorage.setItem("prac_id", $("#dpracticeid").val());
	window.localStorage.setItem("prac_doc", $("#did").val());
	window.localStorage.setItem("prac_docname", $("#dname").val());
	window.location.href="profile.html";
	return false;
});

$("#myprofile_html").click(function(){
	window.localStorage.setItem("pre_page", 'myprofile_html');
});