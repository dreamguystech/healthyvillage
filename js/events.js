//var base_url = "https://dev.yosicare.com/healthyvillage-app/";
var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$(".user-name").empty().append(window.localStorage.getItem("pat_name"));
$(".user-number").empty().append(window.localStorage.getItem("pat_phone"));
$(".user-dob").empty().append(window.localStorage.getItem("pat_dob"));
$(document).ready(function(e) {
    //setTimeout(function(){ $("#loading").hide(); },1000);
	if(!window.localStorage.getItem("pat_id")){ window.location.href="index.html"; }
	$.post(base_url+"mobile-app?page=getevents",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),"Edate":"01/20/2017"},
	function(data){
		$("#loading").hide();
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		for(var i=0;i<data.data.length;i++){
			var event_date = data.data[i]['start_date'].split("/");
			var today = new Date(event_date[2]+"-"+event_date[0]+"-"+event_date[1]);
            var dd = today.getDate(); 
			$(".event-list").append('<li class="media"><a href="javascript:;" class="media-link select_event" data-eventname="'+data.data[i]['name']+'" data-eventid="'+data.data[i]['id']+'" data-event="'+data.data[i]['start_date']+'"><div class="media-left"><span class="status-icon"></span></div><div class="media-body media-middle text-nowrap"><div class="event-time2">'+data.data[i]['start_time']+'</div><div class="event-location">'+data.data[i]['name']+'</div><div class="event-address">'+data.data[i]['address']+'</div></div><div class="media-right media-middle text-nowrap"><div class="event-date">'+today.getDate()+'</div><div class="event-week">'+monthNames[today.getMonth()]+'</div></div></a></li>');
		}
		$("#confirmation_html").css('display','none').css('visibility','visible');
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
			$(".site-title h4").empty().append('CONFIRMATION');
			var action = 'eventselect';
			var id = $(this).data('eventid'); $("#event_id").val($(this).data('eventid'));
			var val =$(this).data('event'); $("#event_date").val($(this).data('event'));
			var eventname =$(this).data('eventname'); $(".success_content h4 span").empty().append($(this).data('eventname'));
			$('#loading').show();
			setTimeout(function(){ $("#loading").hide(); },500);
			$("#events_html").hide();
            $("#confirmation_html").show();
		});
		
		

			
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
							$('#non_cli_conf').parent().hide();
						});
						$("#signature").bind('change', function(e) {
							$('#signhere').hide();
							$('#non_cli_conf').parent().show();
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
			
						
			
						$('#signature').on('touchmove', function(e) {
							e.preventDefault();
						});
					} 

$('#addappointment').submit(function(){ 
	$("#loading").show(); 
	var signature_data = $("#signature").jSignature("getData");
	$('#signature_data').val(signature_data);
			$.ajax({
				url:base_url+"mobile-app?page=addAppointment",
				type:"POST",
				data:$('#addappointment').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok")+"&ptype=non-clinic",
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						 $('#non_appoinmentSuccess').addClass('md-show');
    					 $('.md-overlay').addClass('md-show');
					}
				}
			});
		return false;
	});
	
	
$(document).on('click',"#pageheader .panel-control-left a",function(){
	if($(".site-title h4").text() == "CONFIRMATION")
	{
		$("#loading").show(); $("#events_html").show(); $("#confirmation_html").hide(); $(".site-title h4").empty().append('Events'); setTimeout(function(){ $("#loading").hide(); },300);	
	}else
	window.location.href= "home.html";
});

/*$("#pageheader .panel-control-left a").on('click',function(){ $("#loading").show(); $("#events_html").show(); $("#confirmation_html").hide(); $(".site-title h4").empty().append('Events'); setTimeout(function(){ $("#loading").hide(); },300); return false; });*/