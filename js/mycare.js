//var base_url = "https://dev.yosicare.com/healthyvillage-app/";
var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$(".user-name").empty().append(window.localStorage.getItem("pat_name"));
$(".user-number").empty().append(window.localStorage.getItem("pat_phone"));
$(".user-dob").empty().append(window.localStorage.getItem("pat_dob"));
$(document).ready(function(e) {
   // setTimeout(function(){ $("#loading").hide(); },1000);
	
	$.post(base_url+"mobile-app?page=mycareteam",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		$("#loading").hide();
		if(data.success == "Y"){
			for(var i=0;i<data.data.length;i++){
				$(".mycare-list").append('<li class="media"><a href="javascript:void(0);" class="media-link"><div class="media-left"><img src="assets/img/user-female.png" class="care-dr-img" alt="" width="47" height="47"></div><div class="media-body media-middle text-nowrap">								<div class="care-dr-name">'+data.data[i]['doctor_first_name']+" "+data.data[i]['doctor_last_name']+'</div><span class="speciality">'+data.data[i]['doctor_specialty']+'</span></div></a></li>');
			}
			 
			
		}else{
			$(".mycare-list").append('<li class="media">No Results</li>');
		}
	},"json");
	
});
