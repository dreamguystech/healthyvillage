//var base_url = "https://dev.yosicare.com/healthyvillage-app/";
var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$(".user-name").empty().append(window.localStorage.getItem("pat_name"));
$(".user-number").empty().append(window.localStorage.getItem("pat_phone"));
$(".user-dob").empty().append(window.localStorage.getItem("pat_dob"));
$(document).ready(function(e) {
    setTimeout(function(){ $("#loading").hide(); },1000);
	
	$.post(base_url+"mobile-app?page=getQuestions",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		if(data.success == "Y"){
			
			var question = '';
			var qcnt=0;
			$.each(data.data.Data, function(key, value) { 
					question += '<li id="list_'+value['id']+'" class="list-group-item"><div class="row"><label class="col-md-12 control-label">'+value['question']+'</label><div class="col-sm-12"><div class="row">';
				for(var j=0;j<value['def_answers'].length;j++){ var chk='';
					if(value['answerId'] == value['def_answers'][j]['id']) chk='checked';
					question += '<div class="col-sm-4"><div class=" radiooption"><input name="optradio_'+value['id']+'" class="selected_answer" id="question_'+value['id']+'" value="'+value['def_answers'][j]['id']+'"  type="radio" '+chk+'><label for="question_'+value['id']+'">'+value['def_answers'][j]['name']+'</label></div></div>';
				}
				question += '</div></div></div></li>';
				qcnt++;
				});
			$(".question-list").append(question);
			$("#total_question_count").val(qcnt);
			$("#loading").hide(); 
			if($("[type='radio']:checked").length == $('#total_question_count').val()) $("#submit_button").show();
		}
	},"json");
	
});

var step = 100;
var scrolling = false;

$("#scrollRight").bind("click", function(event) {
    event.preventDefault();
    $(".month-list").animate({
        scrollLeft: "-=" + step + "px"
    });
});
$("#scrollLeft").bind("click", function(event) {
    event.preventDefault();
    $(".month-list").animate({
        scrollLeft: "+=" + step + "px"
    });
});
function scrollContent(direction) {
    var amount = (direction === "right" ? "-=1px" : "+=1px");
    $(".month-list").animate({
        scrollLeft: amount
    }, 1, function() {
        if (scrolling) {
            scrollContent(direction);
        }
    });
}

var step = 100;
var scrolling = false;

$("#backyear").bind("click", function(event) {
    event.preventDefault();
    $(".year-list").animate({
        scrollLeft: "-=" + step + "px"
    });
});

$("#frontyear").bind("click", function(event) {
    event.preventDefault();
    $(".year-list").animate({
        scrollLeft: "+=" + step + "px"
    });
});
function scrollContent(direction) {
    var amount = (direction === "right" ? "-=1px" : "+=1px");
    $(".year-list").animate({
        scrollLeft: amount
    }, 1, function() {
        if (scrolling) {
            scrollContent(direction);
        }
    });
}




$(document).on('click', '.event-list .select_event', function(e) { 
			var action = 'eventselect';
			var id = $(this).data('eventid');
			var val =$(this).data('event');
			var eventname =$(this).data('eventname');
			$('#loading').show();
			setTimeout(function(){ $("#loading").hide(); },500);
			$("#events_html").hide();
            $("#confirmation_html").show();
		});
		
/*var curPos = 0;
$('body').on('click', '.selected_answer', function(){
	//alert($(this).closest('li').attr('id'));

var all_question_count = $("[type='radio']:checked").length;
if(all_question_count >5){
////var bottom2 = $(window).height() - bottom;
//if(bottom2 < 80) 
//{ 
	curPos = curPos + 80;		
	$('html , body').animate({scrollTop:curPos},1000 );	
	if(all_question_count == $('#total_question_count').val()) $("#submit_button").show();	
}
});*/

var curPos = 0;
$('body').on('click', '.selected_answer', function(){
	var bottom = offsetBottom(this);
	var right = offsetRight(this);
	
	var bottom2 = $(window).height() - bottom;
	if(bottom2 < 80) 
	{ 
	curPos = curPos + 250;	
	$('html , body').animate({scrollTop:curPos},3500 );	
	}
	if($("[type='radio']:checked").length == $('#total_question_count').val()) $("#submit_button").show();	
});
function offsetBottom(el, i) { i = i || 0; return $(el)[i].getBoundingClientRect().bottom } 
// Returns right offset value
function offsetRight(el, i) { i = i || 0; return $(el)[i].getBoundingClientRect().right }





$('body').on('click', '#submit_button', function(e){ 
			 $("#loading").show(); 
			$.ajax({
				url:base_url+"mobile-app?page=saveQuestions",
				type:"POST",
				data:$('#question_submit').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						window.location.href='events.html';
					}
				}
			});
		
			e.preventDefault();
		});