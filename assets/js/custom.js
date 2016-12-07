jQuery(document).ready(function() {
    jQuery(".overlay").show();
    jQuery(window).load(function() {
        jQuery(".overlay").hide();
    });
});

$(".ycmenu").click(function() {
    $(".ycmlist").toggle();
});

/*if ( typeof WebFontConfig === "undefined" ) {
 WebFontConfig = new Object();
 }
 WebFontConfig['google'] = {families: ['Open+Sans:400,700&amp;subset=latin']};

 (function() {
 var wf = document.createElement( 'script' );
 wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.3/webfont.js';
 wf.type = 'text/javascript';
 wf.async = 'true';
 var s = document.getElementsByTagName( 'script' )[0];
 s.parentNode.insertBefore( wf, s );
 })();*/


if ($('#refsource_wrap').length) {
    $('#refsource_wrap .customdd').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#refsource_wrap')
    });
}
if ($('#select_maritalstatus_wrap').length) {
    $('#select_maritalstatus_wrap .customdd').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#select_maritalstatus_wrap')
    });
}
if ($('#select_ethinicity_wrap').length) {
    $('#select_ethinicity_wrap .select_raceethinicity').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#select_ethinicity_wrap')
    });
}
if ($('#primary_relationship_wrap').length) {
    $('#primary_relationship_wrap .customdd').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#primary_relationship_wrap')
    });
}
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
if ($('#select_medication_freq1_wrap').length) {
    $('#select_medication_freq1_wrap .customdd').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#select_medication_freq1_wrap'),
        placeholder: {
            id: "-1",
            text: "Select a repository"
        }
    });
}
if ($('#select_emc_relationship_wrap').length) {
    $('#select_emc_relationship_wrap .customdd').select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $('#select_emc_relationship_wrap')
    });
}



$('#refsource').bind('change', function(e) {
    var $this = $(this).val();
    if ($this == 'Doctor') {
        $('#refsourcedoctor').val($this);
        $('#referingDoctorField').show();
        $('#referingOtherField').hide();
    } else if ($this == 'Other') {
        $('#refsourcedoctor').val('');
        $('#referingDoctorField').hide();
        $('#referingOtherField').show();
    } else {
        $('#refsourcedoctor').val('');
        $('#referingDoctorField').hide();
        $('#referingOtherField').hide();
    }
});

var acOptions_pcp = {
    minChars: 3,
    cacheLength: 20,
    max: 50,
    multiple: false,
    extraParams: {//to pass extra parameter in ajax file.
        //"domainBase": ajax_mprofile_object.domainBase,
    },
    formatItem: function(value) {
        return '<span>' + value[0] + '</span>, <span class="subname">' + value[4] + '</span>';
    }
};

jQuery(document).ready(function($) {



    $('form#addappointment').on('submit', function(e) {
        if (!$(this).valid())
            return false;
        var redirectAction = $(this).attr('action');
        $('#loading').show();
        ctrl = $(this);
        var submitbtntxt = $('input[type=submit]', ctrl).val();
        ctrl = $(this);

        //var serialized= ctrl.serialize() + "&Signature="+$("#signature").jSignature("getData");
        var signature_data = $("#signature").jSignature("getData");
        $('#signature_data').val(signature_data);

        var serialized = ctrl.serialize();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'ajax/appointmentadd',
            data: serialized,
            success: function(data) {
                //console.log(data);
                var jsondata = JSON.stringify(data);
                var statusDiv = $('p.status', ctrl);
                if (data.loggedin == true) {
                    $('#successlink').attr('href', data.rlink);

                    mixpanel.track("Checked-In", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''});

                    openPopup('appoinmentSuccess');
                } else if (data.loggedin == false) {
                    $('p.status', ctrl).show().removeClass('successmsg').addClass('errormsg').text(data.message);
                    //App.scrollTo(statusDiv, -200);
                    if ($("#signature").length) {
                        $('#securitycode').val('');
                    }
                    $('input[type=submit]', ctrl).val(submitbtntxt);
                    $('div.body_overlay').remove();
                    $('#loading').remove();
                } else {
                    $('input[type=submit]', ctrl).val(submitbtntxt);
                }
                setTimeout(function() {
                    $('p.status', ctrl).removeClass('errormsg', 'successmsg').html("").hide();
                }, 4000);
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });
        e.preventDefault();
    });

    $('.chossedoctorlist a').on('click', function(e) {
        ctrl = $('#form_mchoosedoctor_info');
        var did = $(this).data('id');
        var dname = $(this).data('name');
        $("#did").val(did);
        $("#dname").val(dname);
        ctrl.submit();

        e.preventDefault();
    });

    $('form#login').on('submit', function(e) {
        if (!$(this).valid())
            return false;
        var redirectAction = $(this).attr('action');
        $('#loading').show();
        ctrl = $(this);

        var serialized = ctrl.serialize();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "ajax/functions",
            data: serialized,
            success: function(data) {
                if (data.loggedin == true) {
                    if (data.NewUser == 'N') {
                        redirectAction = ctrl.data('action');
                        //console.log(redirectAction);
                    }
                    var cb = rlink_callback(redirectAction);
                    mixpanel.track("Email completed", {"Email": data.email}, cb);
                    setTimeout(cb, 500);
                    //window.location.href = redirectAction;
                }
                $('#loading').remove();

            }
        });

        e.preventDefault();
    });
});

var acOptions_doctor = {
    minChars: 2,
    cacheLength: 40,
    max: 50,
    multiple: false,
    extraParams: {//to pass extra parameter in ajax file.
        //"domainBase": ajax_mprofile_object.domainBase,
    },
    formatItem: function(value) {
        var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
                "<div class='title'>" + value[0] + "</div>" +
                "<div class='ptitle'>" + value[3] + "</div>" +
                "<div class='sname'>" + value[4] + "</div></div></div>";
        return markup;
    }
};

jQuery(function($) {

    var isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
    if (isMacLike) {
        $('.btn-ios').show();
        $('.btn-android').remove();
    } else {
        $('.btn-ios').remove();
        $('.btn-android').show();
    }

    $('#select_ethinicity').change(function() {
        $('#select_ethinicity_wrap').hide();
        $('#select_race_wrap').show();

        $('#select_race_wrap .select_raceethinicity').select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: $('#select_race_wrap')
        });
        $('#select_race').select2('open');
        //down('#select_ethinicity');
    });

    $('#select_race').on('change', function() {
        //up('#select_ethinicity');
        $('#select_race_wrap').hide();
        $('#select_ethinicity_wrap').show();
    });

    $('input[type=radio][name=select_employed]').change(function() {
        if (this.value == 'Y') {
            $('#empcmpy').show();
        } else if (this.value == 'N') {
            $('#empcmpy').hide();
        }
        $('#employed_company').val('');

    });

    $('#yclogout').on('click', function(e) {
        /*$('body').prepend('<div class="body_overlay"></div>');*/
        $('#loading').show();
        //action = 'wpweblogout';
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "ajax/logout",
            data: {},
            success: function(data) {
                window.location.href = data.rlink;
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });
        e.preventDefault();
    });



    $('#form_mdoctordetail_info').on('submit', function(e) {
        //if (!$(this).valid()) return false;
        var redirectAction = $(this).attr('action');
        $('#loading').show();
        ctrl = $(this);
        var submitbtntxt = $('input[type=submit]', ctrl).val();
        ctrl = $(this);
        var pageeventtitle = $(this).data('track');
        var serialized = ctrl.serialize();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "ajax/ajaxmdoctordetailinfo",
            data: serialized,
            success: function(data) {
                if (data.loggedin == true) {
                    var cb = rlink_callback(data.rlink);
                    mixpanel.track(pageeventtitle, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ""}, cb);
                    setTimeout(cb, 500);
                } else {
                    $('input[type=submit]', ctrl).val(submitbtntxt);
                    $('div.body_overlay').remove();
                    $('#loading').remove();
                }
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });

        e.preventDefault();
    });

    $('.editpageinfo').on('click', function(e) {
        var estep = $(this).data('step');
        var icstep = $(this).data('incomplete');
        var pageid = $(this).data('id');
        action = 'ajaxmeditstepinfo';
        /*$('body').prepend('<div class="body_overlay"></div>');*/
        $('#loading').show();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "ajax/ajaxmeditstepinfo",
            data: {
                'action': action,
                'pageid': pageid,
                'estep': estep,
                'icstep': icstep
            },
            success: function(data) {
                if (data.loggedin == true) {
                    if (data.action == 'Update') {
                        window.location.href = data.rlink;
                    } else {
                        $('#redirect_step').attr('href', data.rlink);
                        openPopup('incompletesteps');
                    }
                } else {

                    $('div.body_overlay').remove();
                    $('#loading').remove();
                }
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });

        e.preventDefault();
    });

    if ($('#doctorsearch').length) {
        $('#doctorsearch')
                .autocomplete('assets/plugins/autocomplete/search-doctor', acOptions_doctor)
                .result(function(e, data) {
                    //console.log(data);
                    $('body').prepend('<div class="body_overlay"></div>');
                    $('#loading').show();
                    action = 'ajaxmsearchdoctordetail';
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'ajax/ajaxmsearchdoctordetail',
                        data: {
                            'action': action,
                            'pid': data[2],
                            'did': data[1]
                        },
                        success: function(data) {
                            //console.log(data);
                            if (data.loggedin == true) {
                                var cb = rlink_callback(data.rlink);
                                mixpanel.track("Search Doctor", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''}, cb);
                                setTimeout(cb, 500);
                            } else {
                                $('div.body_overlay').remove();
                                $('#loading').remove();
                            }
                        },
                        error: function(xhr, err) {
                            $('div.body_overlay').remove();
                        },
                        complete: function(e) {
                            $('#loading').remove();
                        }
                    });

                });
    }

    $('#viewprofile').on('click', function(e) {
        /*$('body').prepend('<div class="body_overlay"></div>');*/
        $('#loading').show();
        action = 'ajaxmviewprofile';
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'ajax/ajaxmviewprofile',
            data: {
                'action': action
            },
            success: function(data) {
                //console.log(data);
                if (data.loggedin == true) {
                    var cb = rlink_callback(data.rlink);
                    mixpanel.track("View Profile", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''}, cb);
                    setTimeout(cb, 500);
                } else {
                    $('div.body_overlay').remove();
                    $('#loading').remove();
                }
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });
        e.preventDefault();
    });

    $('#viewrecentvisit').on('click', function(e) {

        $('#loading').show();
        action = 'ajaxmviewrecentvisit';
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'ajax/ajaxmviewrecentvisit',
            data: {
                'action': action
            },
            success: function(data) {
                //console.log(data);
                if (data.loggedin == true) {
                    var cb = rlink_callback(data.rlink);
                    mixpanel.track("Recent Doctor", {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''}, cb);
                    setTimeout(cb, 500);
                    //window.location.href = data.message;
                } else {
                    $('div.body_overlay').remove();
                    $('#loading').remove();
                }
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });
        e.preventDefault();
    });

    if ($("#pcp").length) {
        $('#pcp_selected_hidden').on('click', function() {
            $('#pcp_wrap').show();
            $(this).hide();
            $('#pcp').focus();
        });

        $("#pcp").on("blur keyup", function(e) {
            var $this = $(this),
                    value = $this.val();

            $("#pcp_hname").val(value);

            $("#pcp_hid").val('');
            $("#pcp_hphone").val('');
            $("#pcpcontactnumber").val('');
        });

        $('#pcp').on('focus', function() {
            $(this).val('');
            $("#pcp_hname").val('');
            $("#pcp_hid").val('');
            $("#pcp_hphone").val('');
            $("#pcpcontactnumber").val('');
        });


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
                    //$('#ac_result').val(data[1]);
                });
    }
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
    $('input[type=radio][name=primary_areyouinsured]').change(function() {
        $('#date-error-custom').remove();
        $('.form-group, .addInsurance').show();
        $('.secondaryInsuranceColumn .viewscannedimage').show();
        $('input:radio[name="primary_insuredgender"]').removeClass("validate[required]");
        //$('input[name="primary_insuredgender"]').rules("remove", "required");
        if (this.value == 'N') {
            $('input:radio[name="primary_insuredgender"]').addClass("validate[required]");
            //$('input[name="primary_insuredgender"]').rules("add", "required");
            $('#primary_insureddob').mask("99/99/9999");
            $('#firstIns_dependent').show();
            $("#primary_relationship").select2("val", "");
            $('#primary_relationship_wrap .customdd').select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: $('#primary_relationship_wrap')
            });
            $('#primary_insuredname').val('');
            $('#primary_insureddob').val('');
            $('#primary_insuredssn').val('');
        } else if (this.value == 'Y') {
            $('#firstIns_dependent').hide();
        } else if (this.value == 'noins') {
            $('.form-group, .addInsurance').hide();
            $('.secondaryInsuranceColumn .viewscannedimage').hide();
            $('.primaryInsuranceColumn .yc-form-field-inshead').show();
            //$('#noinsurance').trigger('click');
        }

    });

    $('input[type=radio][name=secondary_areyouinsured]').change(function() {
        $('#date-error-custom').remove();
        $('input:radio[name="secondary_insuredgender"]').removeClass("validate[required]");
        //$('input[name="secondary_insuredgender"]').rules("remove", "required");
        if (this.value == 'N') {
            $('#secondary_insureddob').mask("99/99/9999");
            $('input:radio[name="secondary_insuredgender"]').addClass("validate[required]");
            //$('input[name="secondary_insuredgender"]').rules("add", "required");
            $('#secondIns_dependent').show();
            $("#secondary_relationship").select2("val", "");
            $('#secondary_relationship_wrap .customdd').select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: $('#secondary_relationship_wrap')
            });

            $('#secondary_insuredname').val('');
            $('#secondary_insureddob').val('');
            $('#secondary_insuredssn').val('');
        } else if (this.value == 'Y') {
            $('#secondIns_dependent').hide();
        }

    });
	
	$('#withoutcard').on('click',function(e){
		var href = $(this).attr("href"); 
		var cb = rlink_callback(href);
		mixpanel.track("Skip Photo ID", {}, cb);
		setTimeout(cb, 500);  
						 
		e.preventDefault();
	});

    $('#withoutcardinsurance').on('click', function(e) {
        /*$('body').prepend('<div class="body_overlay"></div>');*/
        $('#loading').show();
        var href = $(this).attr("href");
        var action = 'mwithoutcardinsurance';
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'ajax/functions',
            data: {
                'action': action
            },
            success: function(data) {
                var cb = rlink_callback(href);
                mixpanel.track("Skip Insurance card", {}, cb);
                setTimeout(cb, 500);
                //window.location.href=href;
            },
            error: function(xhr, err) {
                $('div.body_overlay').remove();
                $('#loading').remove();
            },
            complete: function(e) {
                $('#loading').remove();
            }
        });
        e.preventDefault();
    });
    $('.pop_editbtn,.addInsurance').on('click', function(e) {
        $('#loading').show();
        var href = $(this).attr("href");
        var type = $(this).data("type");
        var action = '';
        var post_array = $("#form_minsurance_info").serialize();
        var ajax_action = true;
        if (type == 'addIns') {
            if ($('#primary_policynumber').val() == '' || $('#primary_groupnumber').val() == '' || $('#primary_companyname').val() == '') {
                ajax_action = false;
                alert('Please enter primary insurance values');
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
                url: "ajax/functions",
                data: {
                    action: action,
                    post_array: post_array
                },
                success: function(data) {
                    window.location.href = href;
                },
                error: function(xhr, err) {
                    $('div.body_overlay').remove();
                    $('#loading').remove();
                },
                complete: function(e) {
                    $('#loading').remove();
                }
            });
        }

        e.preventDefault();
    });

});


function rlink_callback(rlink) {
    return function() {
        window.location.href = rlink;
    }
}
function openPopup(popupId) {
    $('#' + popupId).addClass('md-show');
    $('.md-overlay').addClass('md-show');
}

function closePopup(popupId) {
    $('#' + popupId).removeClass('md-show');
    $('.md-overlay').removeClass('md-show');
}

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

(function($) {

    $(document).ready(function() {
        if ($("#signature").length) {
            // This is the part where jSignature is initialized.
            var $sigdiv = $("#signature").jSignature({
                'UndoButton': false,
                'background-color': 'transparent',
                'decor-color': 'transparent',
                'lineWidth': 2,
            })

                    // All the code below is just code driving the demo.
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
                //$('#scrollgrabber').height($('#content').height())
            }

            $('#signature').on('touchmove', function(e) {
                e.preventDefault();
            });
        }

    })

})(jQuery)