var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$(".user-name").empty().append(window.localStorage.getItem("pat_name"));
$(".user-number").empty().append(window.localStorage.getItem("pat_phone"));
$(".user-dob").empty().append(window.localStorage.getItem("pat_dob"));
$(document).ready(function(e) {
   // setTimeout(function(){ $("#loading").hide(); },1000);
	
	$.post(base_url+"mobile-app?page=getActivity",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){ $("#loading").hide(); 
		if(data.success == "Y"){
			var monthNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			for(var i=0;i<data.data.length;i++){
				var event_date = data.data[i]['start_date'].split("/");
				var today = new Date(event_date[2]+"-"+event_date[0]+"-"+event_date[1]);
				var dd = today.getDate(); 
				$(".activity-list").append('<li class="media"><a href="javascript:void(0);" class="media-link"><div class="media-left"><span class="status-icon"></span></div><div class="media-body media-middle text-nowrap"><div class="event-location">'+data.data[i]['name']+'</div><div class="event-address">'+data.data[i]['address']+'</div></div><div class="media-right media-middle text-nowrap"><div class="event-date">'+dd+'</div><div class="event-week">'+monthNames[today.getDay()]+'</div></div></a></li>');
			}
			
			
		}else{
			$(".activity-list").append('<li class="media">No Activity</li>');
		}
	},"json");
	
});
$(document).on('click',"#pageheader .panel-control-left a",function(){
	$("#loading").show(); 
	window.location.href = "home.html";
});