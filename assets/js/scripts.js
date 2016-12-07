if ($('#base_url_h').length) {
    var API_BASE_URL = $('#base_url_h').val();
}
(function($) {

    $("#date").on("blur keyup", function(e) {
        var $this = $(this),
                value = $this.val();

        /*//Does the input have "-", if so it is from the webkit datepicker, fix it
         if(value.indexOf("-") !== -1){
         var cleanDateArray = value.split('-');
         value = cleanDateArray[1] + "/" + cleanDateArray[2] + "/" + cleanDateArray[0];
         }*/
        isDate($this);
        //Set the hidden value to validate on, trigger the blur and keyup event for validation as you type
        $("#date").val(value);
        $("#hiddenDateField").val(value).trigger("blur").trigger("keyup");
    });

    if ($('#zipcode').length) {
        $("#zipcode").mask("99999", {autoclear: false});
    }
    if ($('#pharmacyzipcode').length) {
        $("#pharmacyzipcode").mask("99999", {autoclear: false});
    }
    if ($('#mobilenumber').length) {
        $("#mobilenumber").mask("(999) 999-9999", {autoclear: false});
    }
    if ($('#pcpcontactnumber').length) {
        $("#pcpcontactnumber").mask("(999) 999-9999", {autoclear: false});
    }
    if ($('#emc_number').length) {
        $("#emc_number").mask("(999) 999-9999", {autoclear: false});
    }
    if ($('#ssn').length) {
        $("#ssn").mask("999-99-9999", {autoclear: false}, {placeholder: "(___)-___-____"});
    }



    if ($('#date').length) {
        $('#date').mask("99/99/9999");
    }

    $('#date-error-custom').remove();


    $('.customdd').on("select2:select", function(e) {
        var id = e.target.id;
        var selVal = $('#' + id).val();
        if (selVal == '') {
            $('#select2-' + id + '-container').removeClass('selected');
            $('#' + id + '_wrap .selected_icon').removeClass('active');
        } else {
            $('#select2-' + id + '-container').addClass('selected');
            $('#' + id + '_wrap .selected_icon').addClass('active');
        }

    });

    var $eventSelectId = $(".health-data ");

    $eventSelectId.on("select2:open, select2:opening", function(e) {

        var thisid = e.currentTarget.id;
        var $parentId = $(this).parent().attr("id");
        var $wrapId = $(this).data("id");
        $(this).parent().removeClass('searchInput');
        var svb_ln = $('.selectedVaulesBox').length;
        for (var i = 0; i < svb_ln; i++) {
            if ($.trim($('.selectedVaulesBox').eq(i).html()) != '') {
                $('.selectedVaulesBox').eq(i).show();
                $('.searchBoxWrap').eq(i).hide();
            } else {
                $('.selectedVaulesBox').eq(i).hide();
                $('.searchBoxWrap').eq(i).show();
                if (!$('.searchBoxWrap').eq(i).hasClass('searchInput')) {
                    $('.searchBoxWrap').eq(i).addClass('searchInput');
                }
            }
        }
        $('#' + thisid + '_hidden').hide();
        $('#' + $wrapId + '_wrap').show();

    });

    $('.selectedVaulesBox').on('click', function() {
        var thisid = $(this).attr('id');
        var idarr = thisid.split('_');
        $('#' + idarr[1] + '_wrap').show();
        $('#select_' + idarr[1] + '_hidden').hide();
        $('#select_' + idarr[1]).select2('open');
    });

    if ($("#select_pastmedicalcondition").length) {
        $("#select_pastmedicalcondition").select2({
            ajax: {
                url: API_BASE_URL + "user/pastmedicalhistory",
                dataType: 'jsonp',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, // search term
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    //console.log(data);
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                },
                cache: true
            },
            //data: data,
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatRepoData, // omitted for brevity, see the source of this page
            templateSelection: formatRepoDataSelection, // omitted for brevity, see the source of this page
            placeholder: 'Type to search medical condition',
            tags: true,
            tokenSeparators: [","]
        }).on("change", function(e) {
        }).on("select2:select", function(e) {
            //console.log(e.params.data);

            var isNew = $(this).find('[data-select2-tag="true"]');

            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }



            var a = new Array();
            $("#select_pastmedicalcondition").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_pastmedicalcondition").trigger('change');

            var pmcData = $('#select_pastmedicalcondition').select2('data');
            var pmcArr = [];
            var snames = '';
            for (var i in pmcData) {
                var item = pmcData[i];


                var itemname = item.text || item.name;

                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';



                pmcArr.push({
                    "Id": itemid,
                    "Name": itemname
                });

            }
            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_pastmedicalcondition_hidden').html(snames);


            var pmcJsonData = JSON.stringify(pmcArr);

            $('#pmcJsonData').val(pmcJsonData);


        }).on("select2:unselect", function(e) {
            //console.log(e.params.data);
            var deletedId = e.params.data.id;
            if (deletedId == '') {
                var deletedId = e.params.data.name;
            }
            $('#select_pastmedicalcondition option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_pastmedicalcondition").trigger('change');
            var pmcData = $('#select_pastmedicalcondition').select2('data');
            var pmcArr = [];
            var snames = '';
            for (var i in pmcData) {
                var item = pmcData[i];

                var itemname = item.text || item.name;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                pmcArr.push({
                    "Id": itemid,
                    "Name": itemname
                });

            }
            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_pastmedicalcondition_hidden').html(snames);


            var pmcJsonData = JSON.stringify(pmcArr);
            $('#pmcJsonData').val(pmcJsonData);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        });
    }

    if ($("#select_surgeries").length) {
        $("#select_surgeries").select2({
            ajax: {
                url: API_BASE_URL + "user/getsurgicalhistory",
                dataType: 'jsonp',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, // search term
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                }, /*
                 formatResult: function (post) {
                 markup = '<strong>' + post.text + '</strong>';
                 },*/
                cache: true
            },
            //data: data,
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatRepoData, // omitted for brevity, see the source of this page
            templateSelection: formatRepoDataSelection, // omitted for brevity, see the source of this page
            placeholder: 'Type to search surgeries',
            tags: true,
            tokenSeparators: [","]/*,
             createTag: function (tag) {
             return {
             id: '',
             name: tag.term,
             isNew : true
             };
             }*/
        }).on("change", function(e) {
            /*var isNew = $(this).find('[data-select2-tag="true"]');
             if(isNew.length){
             //isNew.replaceWith('<option selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
             isNew.replaceWith('<option value="">'+isNew.val()+'</option>');
             $.ajax({
             // ... store tag ...
             });
             }*/
        }).on("select2:select", function(e) {
            if (e.params.data.selected == false) {
                //return;
            }

            //if(e.params.data.selected == true) {
            //console.log(e.params.data);
            var isNew = $(this).find('[data-select2-tag="true"]');
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            /*$('#select_surgeries option').each(function() {
             if ( $(this).text() == '' ) {
             $(this).remove();
             }
             });
             $("#select_surgeries").trigger('change');*/
            //}

            var a = new Array();
            $("#select_surgeries").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_surgeries").trigger('change');

            var surgeryData = $('#select_surgeries').select2('data');
            var surgeryArr = [];
            var snames = '';
            for (var i in surgeryData) {
                var item = surgeryData[i];
                //if(item.selected){
                var itemname = item.text || item.name;

                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                surgeryArr.push({
                    "Id": itemid,
                    "Name": itemname
                });
                //}
            }
            var surgeryJsonData = JSON.stringify(surgeryArr);
            $('#surgeryJsonData').val(surgeryJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_surgeries_hidden').html(snames);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        }).on("select2:unselect", function(e) {
            var deletedId = e.params.data.id;
            $('#select_surgeries option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_surgeries").trigger('change');
            var surgeryData = $('#select_surgeries').select2('data');
            var surgeryArr = [];
            var snames = '';
            for (var i in surgeryData) {
                var item = surgeryData[i];
                //if(item.selected){

                var itemname = item.text || item.name;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';


                surgeryArr.push({
                    "Id": itemid,
                    "Name": itemname
                });
                //}
            }
            var surgeryJsonData = JSON.stringify(surgeryArr);
            $('#surgeryJsonData').val(surgeryJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_surgeries_hidden').html(snames);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        });
    }

    if ($("#select_allergies").length) {
        $("#select_allergies").select2({
            ajax: {
                url: API_BASE_URL + "user/getallergy",
                dataType: 'jsonp',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, // search term
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                },
                formatResult: function(post) {
                    markup = '<strong>' + post.text + '</strong>';
                },
                cache: true
            },
            //data: data,
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatRepoData, // omitted for brevity, see the source of this page
            templateSelection: formatRepoDataSelection, // omitted for brevity, see the source of this page
            placeholder: 'Type to search allergies',
            tags: true,
            tokenSeparators: [","]/*,
             createTag: function (tag) {
             return {
             id: '',
             name: tag.term,
             isNew : true
             };
             }*/
        }).on("change", function(e) {
            //console.log(e);
            /*var isNew = $(this).find('[data-select2-tag="true"]');
             if(isNew.length){
             //isNew.replaceWith('<option selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
             isNew.replaceWith('<option selected value="">'+isNew.val()+'</option>');
             $.ajax({
             // ... store tag ...
             });
             }*/
        }).on("select2:select", function(e) {
            if (e.params.data.selected == false) {
                //return;
            }

            //if(e.params.data.selected == true) {
            //console.log(e.params.data);
            var isNew = $(this).find('[data-select2-tag="true"]');
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            /*$('#select_allergies option').each(function() {
             if ( $(this).text() == '' ) {
             $(this).remove();
             }
             });
             $("#select_allergies").trigger('change');*/
            //}

            var a = new Array();
            $("#select_allergies").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_allergies").trigger('change');

            var alleryData = $('#select_allergies').select2('data');
            var allergyArr = [];
            var snames = '';
            for (var i in alleryData) {
                var item = alleryData[i];
                //if(item.selected){
                var itemname = item.name || item.text;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                allergyArr.push({
                    "Id": itemid,
                    "Name": item.name || item.text
                });
                //}
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        }).on("select2:unselect", function(e) {
            var deletedId = e.params.data.id;
            $('#select_allergies option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_allergies").trigger('change');
            var alleryData = $('#select_allergies').select2('data');
            var allergyArr = [];
            var snames = '';
            for (var i in alleryData) {
                var item = alleryData[i];
                //if(item.selected){
                var itemname = item.text || item.name;
                if (item.id == itemname) {
                    var itemid = '';
                } else {
                    var itemid = item.id;
                }
                snames += itemname + ', ';

                allergyArr.push({
                    "Id": itemid,
                    "Name": itemname
                });
                //}
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        });
    }

    if ($("#select_familyhistory").length) {
        $("#select_familyhistory").select2({
            ajax: {
                url: API_BASE_URL + "user/familyhistory",
                dataType: 'jsonp',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, // search term
                        Page: params.page
                    };
                },
                processResults: function(data, params) {
                    document.activeElement.blur();
                    $(this).blur();
                    params.page = params.page || 1;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 30) < data.count
                        }
                    };
                }, /*
                 formatResult: function (post) {
                 markup = '<strong>' + post.text + '</strong>';
                 },*/
                cache: true
            },
            //data: data,
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatRepoData, // omitted for brevity, see the source of this page
            templateSelection: formatRepoDataSelection, // omitted for brevity, see the source of this page
            placeholder: 'Type to search family history',
            tags: true,
            tokenSeparators: [","]/*,
             createTag: function (tag) {
             return {
             id: '',
             name: tag.term,
             isNew : true
             };
             }*/
        }).on("change", function(e) {
            /*var isNew = $(this).find('[data-select2-tag="true"]');
             if(isNew.length){
             //isNew.replaceWith('<option selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
             isNew.replaceWith('<option value="">'+isNew.val()+'</option>');
             $.ajax({
             // ... store tag ...
             });
             }*/
        }).on("select2:select", function(e) {
            if (e.params.data.selected == false) {
                //return;
            }

            //if(e.params.data.selected == true) {
            //console.log(e.params.data);
            var isNew = $(this).find('[data-select2-tag="true"]');
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            /*$('#select_familyhistory option').each(function() {
             if ( $(this).text() == '' ) {
             $(this).remove();
             }
             });
             $("#select_familyhistory").trigger('change');*/
            // }

            var a = new Array();
            $("#select_familyhistory").children("option").each(function(x) {
                test = false;
                b = a[x] = $(this).val();
                for (i = 0; i < a.length - 1; i++) {
                    if (b == a[i])
                        test = true;
                }
                if (test)
                    $(this).remove();
            });
            $("#select_familyhistory").trigger('change');

            $('#relFhName').text(e.params.data.name || e.params.data.text);
            $('#relationshipData').show();
            $('#form_mmedical_info input[type="submit"]').prop('disabled', true);
            $(this).prop("disabled", true);


            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }
        }).on("select2:unselect", function(e) {
            //console.log(e.params.data.id);
            //console.log(familyArr);
            /*var jsonfullobj = familyArr;
             var deletedId=e.params.data.id;
             familyArr =[];
             for(var i in jsonfullobj){
             var item = jsonfullobj[i];
             if(item.Id!=deletedId){
             familyArr.push({
             "Id" : item.Id,
             "Name"  : item.Name,
             "Relation" : item.Relation
             });
             }
             }
             //console.log(familyArr);
             var familyJsonString = JSON.stringify(familyArr);
             $('#familyJsonData').val(familyJsonString);*/

            var deletedId = e.params.data.id;
            $('#select_familyhistory option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_familyhistory").trigger('change');

            /* var fhData = $('#select_familyhistory').select2('data');
             var fhArr = [];
             var snames = '';
             for (var i in fhData) {
             var item = fhData[i];
             //if(item.selected){
             var itemname = item.text || item.name;
             if (item.id == itemname) {
             var itemid = '';
             } else {
             var itemid = item.id;
             }
             snames += itemname + ', ';

             fhArr.push({
             "Id": itemid,
             "Name": itemname,
             "Relation": item.Relation
             });
             //}
             }*/

            var prevArrayVal = $('#familyJsonData').val();
            if (prevArrayVal) {
                var jsonfullobj = jQuery.parseJSON(prevArrayVal);
                var familyArr = [];
                var snames = '';
                for (var i in jsonfullobj) {
                    var item = jsonfullobj[i];
                    if (item.Id != deletedId) {
                        var itemname = item.text || item.Name;
                        if (item.Id == itemname) {
                            var itemid = '';
                        } else {
                            var itemid = item.Id;
                        }
                        snames += itemname + ', ';
                        familyArr.push({
                            "Id": itemid,
                            "Name": itemname,
                            "Relation": item.Relation
                        });
                    }
                }
            }

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_familyhistory_hidden').html(snames);


            var fhJsonData = JSON.stringify(familyArr);
            $('#familyJsonData').val(fhJsonData);

            if (e.params.data.isNew) {
                //$('#console').append('<code>New tag: {"' + e.params.data.id + '":"' + e.params.data.text + '"}</code><br>');
                //$(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
            }



        });


        $('.relationshipList li a').on('click', function() {
            var $thischeckbox = $(this).find('input[type=checkbox]');
            if ($thischeckbox.is(':checked')) {
                $thischeckbox.prop('checked', false);
            } else {
                $thischeckbox.prop('checked', true);
                //alert("Checkbox Master must be checked, but it's not!");
            }
        });
    }

    if ($("#select_pharmacyaddress").length) {

        $("#select_pharmacyaddress").select2({
            minimumResultsForSearch: Infinity,
            ajax: {
                //url: ajax_mprofile_object.baseuri+"/search-medical.php",
                url: API_BASE_URL + "yosidoctor/pharmacysearch",
                dataType: 'jsonp',
                delay: 250,
                data: function(params) {
                    return {
                        Name: params.term, // search term
                        Page: params.page,
                        ZipCode: $('#pharmacyzipcode').val()
                    };
                },
                processResults: function(data, params) {
                    //console.log(data);
                    params.page = params.page || 1;
                    if (data.success == 'Y') {
                        return {
                            results: data.data.Doctors,
                            pagination: {
                                more: (params.page * 30) < data.count
                            }
                        };
                    } else {
                        return {
                            results: '',
                            pagination: {
                                more: ''
                            }
                        };
                    }
                },
                formatResult: function(post) {
                    markup = '<strong>' + post.text + '</strong>';
                },
                cache: false
            },
            //data: data,
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 0,
            templateResult: formatRepoData_pharmacy, // omitted for brevity, see the source of this page
            templateSelection: formatRepoDataSelection_pharmacy, // omitted for brevity, see the source of this page
            placeholder: 'Search Pharmacy',
            allowClear: true
        }).focus(function() {
            $(this).select2('open');
        }).on("select2:select", function(e) {
            //console.log('open');
            var pharmacyData = $('#select_pharmacyaddress').select2('data');
            //$('#select_pharmacyaddress').after('<input type="hidden" name="pharmacy_hid" id="pharmacy_hid"><input type="hidden" name="pharmacy_hname" id="pharmacy_hname"><input type="hidden" name="pharmacy_hphone" id="pharmacy_hphone">');

            $("#pharmacy_hid").val(pharmacyData[0].id);
            $('#pharmacy_hname').val(pharmacyData[0].name);
            //$("#pharmacyzipcode").val(pharmacyData[0].ZipCode);
            $('#pharmacy_hphone').val(pharmacyData[0].PhoneNumber);

        });
    }

    var acOptions_medication = {
        minChars: 2,
        cacheLength: 40,
        max: 50,
        multiple: false,
        extraParams: {//to pass extra parameter in ajax file.
            //"domainBase": ajax_mprofile_object.domainBase,
        },
        formatItem: function(value) {
            document.activeElement.blur();
            $('#select_medication1').blur();
            return '<span style="color:red">' + value[0] + '</span>';
        },
        scrollHeight: 220
    };
    if ($('#select_medication1').length) {
        $('#select_medication1')
                .autocomplete('assets/plugins/autocomplete/search-medication', acOptions_medication)
                //.attr('name', 'display_name')
                //.after('<input type="hidden" name="pcp_id" id="pcp_hid"><input type="hidden" name="pcp_address" id="pcp_haddress"><input type="hidden" name="pcp_name" id="pcp_hname"><input type="hidden" name="pcp_phone" id="pcp_hphone">')
                .result(function(e, data) {
                    $('#select_medication1').blur();
                    console.log(e);
                    $('#medication_hid').val(data[1]);
                    $('#medication_hname').val(data[0]);
                    document.activeElement.blur();


                });

        $('#add_medi_data').on('click', function() {
            //var mId = $('#select_medication1').select2('data');
            var mId = $('#medication_hid').val();
            var mName = $('#medication_hname').val();

            var dosage = $('#select_medication_dosage1').val();
            var frequency = $('#select_medication_freq1').select2('data');
            var existsId = 'N';
            $("#select_medication1").val('').trigger('change');
            $('#select_medication_freq1').val('').trigger('change');
            $('#select_medication_dosage1').val('');
            var prevArrayVal = $('#medicationJsonData').val();
            if (prevArrayVal) {

                var jsonfullobj = jQuery.parseJSON(prevArrayVal);

                medicationArr = [];
                for (var i in jsonfullobj) {
                    var item = jsonfullobj[i];
                    medicationArr.push({
                        "Id": item.Id,
                        "Dosage": item.Dosage,
                        "Frequency": item.Frequency
                    });
                    if (mId == item.Id) {
                        existsId = 'Y';
                        $('p.status-medi').show().removeClass('successmsg').addClass('errormsg').text('Already Added!');
                    }
                }

            }

            //console.log(medicationArr);
            if (mId && existsId == 'N') {
                medicationArr.push({
                    /*"Id" : mId[0].id,*/
                    "Id": mId,
                    "Dosage": dosage,
                    "Frequency": frequency[0].id
                });
            }

            var medicationJsonString = JSON.stringify(medicationArr);

            $('#medicationJsonData').val(medicationJsonString);

            /*$('#addedMedicationList').append('<li id="addedMedi_'+mId[0].id+'"><p><span>'+mId[0].name+'</span>,'+dosage+','+frequency[0].text+' </p><a href="javascript:;" class="removelist" data-id="'+mId[0].id+'"></a></li>');*/
            if (mId && existsId == 'N') {
                $('#addedMedicationList').prepend('<li id="addedMedi_' + mId + '"><p><span>' + mName + '</span>,' + dosage + ',' + frequency[0].text + ' </p><a href="javascript:;" class="removelist" data-id="' + mId + '"></a></li>');
            }
            setTimeout(function() {
                $('p.status-medi').removeClass('errormsg', 'successmsg').html("").hide();
            }, 4000);

        });

        $('.removelist').live('click', function() {
            var prevArrayVal = $('#medicationJsonData').val();
            var jsonfullobj = jQuery.parseJSON(prevArrayVal);
            var deletedId = $(this).data('id');
            $('#addedMedi_' + deletedId).remove();
            medicationArr = [];
            for (var i in jsonfullobj) {
                var item = jsonfullobj[i];
                if (item.Id != deletedId) {
                    medicationArr.push({
                        "Id": item.Id,
                        "Dosage": item.Dosage,
                        "Frequency": item.Frequency
                    });
                }
            }
            var medicationJsonString = JSON.stringify(medicationArr);
            $('#medicationJsonData').val(medicationJsonString);

        });
    }

    $('#selectedRelations').on('click', function() {

        if ($('.relationshipList input:checked').val() == '' || $('.relationshipList input:checked').val() === undefined) {
            $('#relationshipData').show();
            return false;
        }

        $("#select_familyhistory").prop("disabled", false);

        var prevArrayVal = $('#familyJsonData').val();
        if (prevArrayVal) {
            var jsonfullobj = jQuery.parseJSON(prevArrayVal);
            familyArr = [];
            for (var i in jsonfullobj) {
                var item = jsonfullobj[i];

                familyArr.push({
                    "Id": item.Id,
                    "Name": item.Name,
                    "Relation": item.Relation
                });
            }
        }


        var selectBoxData = $('#select_familyhistory').select2('data');
        var idnum = $.isNumeric(selectBoxData[selectBoxData.length - 1].id);

        if (idnum == true) {
            var id = selectBoxData[selectBoxData.length - 1].id;
        } else {
            var id = '';
        }
        familyArr.push({
            "Id": id,
            "Name": selectBoxData[selectBoxData.length - 1].name || selectBoxData[selectBoxData.length - 1].text,
            "Relation": []
        });



        var familyArrLn = familyArr.length;
        $('.relationshipList input:checked').each(function(e) {

            familyArr[familyArrLn - 1].Relation.push({
                "RelationshipId": $(this).val(),
                "Relationship": $(this).attr('name')
            });



        });

        //console.log(familyArr);
        $('#familyJsonData').val('');
        var familyJsonString = JSON.stringify(familyArr);
        $('#familyJsonData').val(familyJsonString);

        $('#relationshipData').hide();
        $('#form_mmedical_info input[type="submit"]').prop('disabled', false);
        $('.relationshipList input').prop('checked', false);

    });


})(jQuery);
var medicationArr = [];

var familyArr = [];
var updatefamilyArr = [];


/*------validation & Form Submit----------*/
jQuery(document).ready(function($) {

    // Perform AJAX Personal Info on form submit
    $('#form_mpersonal_info').on('submit', function(e) {
        if ($("#date").length) {
            var dt = $('#date');
            if (isDate(dt) == false) {
                dt.focus()
                return false
            }
        }
        if (!$(this).valid())
            return false;
        var redirectAction = $(this).attr('action');
        $('#loading').show();
        ctrl = $(this);
        var submitbtntxt = $('input[type=submit]', ctrl).val();
        ctrl = $(this);
        document.activeElement.blur();
        var pageeventtitle = $(this).data('track');
        var serialized = ctrl.serialize();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "ajax/functions",
            data: serialized,
            success: function(data) {
                //console.log(data);
                var statusDiv = $('p.status', ctrl);
                //$('p.status', ctrl).removeClass('successmsg').addClass('errormsg').text(data.message);

                if (data.loggedin == true) {
                    /*$('input[type=submit]', ctrl).val("Redirecting...");*/
                    $('p.status', ctrl).removeClass('errormsg').addClass('successmsg');

                    var cb = rlink_callback(data.rlink);
                    mixpanel.track(pageeventtitle, {"Age": data.track_age, "Gender": data.track_gender, "Fields Entered": ''}, cb);
                    setTimeout(cb, 500);
                } else if (data.loggedin == false) {
                    $('p.status', ctrl).show().removeClass('successmsg').addClass('errormsg').text(data.message);

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

    $.validator.addMethod(
            "masktel",
            function(value, element) {
                var hyphen = value.lastIndexOf('_');
                return this.optional(element) || (hyphen === -1 && value != '');
                //return this.optional(element) || /^[a-zA-Z0-9()._-\s]+$/.test(value);
            },
            "Please enter valid number"
            );

    if ($("#form_mpersonal_info").length)
        $("#form_mpersonal_info").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'invalid', // default input error message class
            ignore: "",
            rules: {
                firstname: {
                    required: true
                },
                lastname: {
                    required: true
                },
                address1: {
                    required: true
                },
                address2: {
                    required: false
                },
                zipcode: {
                    required: true,
                    masktel: true
                },
                select_gender: {
                    required: true
                },
                date: {
                    required: true
                }
            },
            messages: {
                date: {
                    required: "Please enter a date in the format mm/dd/yyyy."
                }
            }
        });
    else if ($("form#addappointment").length)
        $("form#addappointment").validate({
            ignore: "not:hidden",
            errorElement: 'span', //default input error message container
            errorClass: 'invalid', // default input error message class
            rules: {
                reasonforvisit: {
                    required: true
                },
                signature_capture: {
                    required: {
                        depends: function(element) {
                            if ($("#signature").jSignature("getData", "native").length == 0) {
                                $("#signature").addClass('invalid');
                                return true
                            } else {
                                $("#signature").removeClass('invalid');
                                return false
                            }
                        }
                    }
                }
                /*pcp: {
                 required: {
                 depends: function (element) {
                 return $("#refsourcedoctor").is(":filled");
                 }
                 }
                 }*/
            }
        });
    else if ($("#generalinfo").length)
        $("#generalinfo").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'invalid', // default input error message class
            rules: {
                select_maritalstatus: {
                    required: true
                },
                ssn: {
                    masktel: true
                },
                mobilenumber: {
                    required: true,
                    masktel: true
                }
            },
            messages: {
                ssn: {
                    range: "Please enter valid number"
                },
                mobilenumber: {
                    required: "Please enter valid number"
                }
            }
        });
    else if ($("#mycontact").length) {
        $("#mycontact").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'invalid', // default input error message class
            rules: {
                emc_firstname: {
                    required: true
                },
                emc_lastname: {
                    required: true
                },
                emc_number: {
                    required: true,
                    masktel: true
                },
                pcpcontactnumber: {
                    masktel: true
                },
                select_emc_relationship: {
                    required: true
                }
            },
            messages: {
                emc_number: {
                    required: "Please enter valid number"
                }
            }
        });
    } else if ($("#form_minsurance_info").length)
        $("#form_minsurance_info").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'invalid', // default input error message class
            ignore: "",
            rules: {
                primary_policynumber: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                primary_groupnumber: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                primary_companyname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                primary_policyname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                primary_insuredname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;

                    }
                },
                primary_insureddob: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    },
                    dateFormat: true
                },
                primary_insuredgender: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                primary_relationship: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_policynumber: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_groupnumber: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_companyname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_policyname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_insuredname: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_insureddob: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    },
                    dateFormat: true
                },
                secondary_insuredgender: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                },
                secondary_relationship: {
                    required: function(element) {
                        return ($(element).is(":visible")) ? true : false;
                    }
                }
            },
				errorPlacement: function(error, element) {
					if (element.attr("name") == "primary_insuredgender")
					{
						error.insertAfter(".primary_insuredgender label");
					}
					else if (element.attr("name") == "primary_relationship")
					{
						error.insertAfter("#primary_relationship_wrap .selected_icon");
					}
					else if (element.attr("name") == "secondary_insuredgender")
					{
						error.insertAfter(".secondary_insuredgender label");
					}
					else if (element.attr("name") == "secondary_relationship")
					{
						error.insertAfter("#secondary_relationship_wrap .selected_icon");
					}
					else
					{
						error.insertAfter(element);
					}
				},
            messages: {
                /*primary_policynumber: {
                    required: "Please enter a policy number."
                },
                primary_groupnumber: {
                    required: "Please enter a group number."
                },
                primary_companyname: {
                    required: "Please enter a company name."
                },
                primary_insuredname: {
                    required: "Please enter a insured name."
                },
                primary_insureddob: {
                    required: "Please enter a insured DOB.",
                    dateFormat: "Please enter a valid DOB."
                },
                primary_insuredgender: {
                    required: "Please select a insured gender."
                },
                secondary_policynumber: {
                    required: "Please enter a policy number."
                },
                secondary_groupnumber: {
                    required: "Please enter a group number."
                },
                secondary_companyname: {
                    required: "Please enter a company name."
                },
                secondary_insuredname: {
                    required: "Please enter a insured name."
                },
                secondary_insureddob: {
                    required: "Please enter a insured DOB.",
                    dateFormat: "Please enter a valid DOB."
                },
                secondary_insuredgender: {
                    required: "Please select a insured gender."
                }*/
            }
        });
});
$.validator.addMethod(
        "dateFormat",
        function(value, element) {
            if ($(element).is(":visible")) {
                var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
                var dtArray = value.match(rxDatePattern);
                if (dtArray == null)
                    return false;
                dtMonth = dtArray[1];
                dtDay = dtArray[3];
                dtYear = dtArray[5];
                if (dtMonth < 1 || dtMonth > 12)
                    return false;
                else if (dtDay < 1 || dtDay > 31)
                    return false;
                else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
                    return false;
                else if (dtMonth == 2) {
                    var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                    if (dtDay > 29 || (dtDay == 29 && !isleap))
                        return false;
                }
                return true;
            } else {
                return true;
            }
        },
        "Please enter a date in the format mm/dd/yyyy."
        );

// Declaring valid date character, minimum year and maximum year
var dtCh = "/";
var minYear = 1875;
var maxYear = new Date().getFullYear();
function isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9")))
            return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1)
            returnString += c;
    }
    return returnString;
}

function daysInFebruary(year) {
    // February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
}
function DaysArray(n) {
    for (var i = 1; i <= n; i++) {
        this[i] = 31
        if (i == 4 || i == 6 || i == 9 || i == 11) {
            this[i] = 30
        }
        if (i == 2) {
            this[i] = 29
        }
    }
    return this
}

function isDate(element) {
    var dtStr = element.val();
    $('#date-error-custom').remove();
    if ($('#date-error-custom').length == 0) {
        element.parent().append('<span id="date-error-custom" class="date-invalid" style="display:none;"></span>');
    }
    var daysInMonth = DaysArray(12)
    var pos1 = dtStr.indexOf(dtCh)
    var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
    //var strDay=dtStr.substring(0,pos1)
    //var strMonth=dtStr.substring(pos1+1,pos2)
    var strMonth = dtStr.substring(0, pos1)
    var strDay = dtStr.substring(pos1 + 1, pos2)
    var strYear = dtStr.substring(pos2 + 1)
    strYr = strYear
    if (strDay.charAt(0) == "0" && strDay.length > 1)
        strDay = strDay.substring(1)
    if (strMonth.charAt(0) == "0" && strMonth.length > 1)
        strMonth = strMonth.substring(1)
    for (var i = 1; i <= 3; i++) {
        if (strYr.charAt(0) == "0" && strYr.length > 1)
            strYr = strYr.substring(1)
    }
    month = parseInt(strMonth)
    day = parseInt(strDay)
    year = parseInt(strYr)
    if (pos1 == -1 || pos2 == -1) {
        //alert("The date format should be : mm/dd/yyyy")
        $('#date-error-custom').show().text("The date format should be : mm/dd/yyyy");
        return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
        //alert("Please enter a valid month")
        $('#date-error-custom').show().text("Please enter a valid month");
        return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
        //alert("Please enter a valid day")
        $('#date-error-custom').show().text("Please enter a valid day");
        return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
        //alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
        $('#date-error-custom').show().text("Please enter a valid 4 digit year between " + minYear + " and " + maxYear);
        return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
        //alert("Please enter a valid date")
        $('#date-error-custom').show().text("Please enter a valid date");
        return false
    }
    $('#date-error-custom').hide()
    return true
}

function rlink_callback(rlink) {
    return function() {
        window.location.href = rlink;
    }
}

/*-------*/
function formatRepoData_pharmacy(repo) {
    if (repo.loading)
        return repo.text;

    var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
            "<div class='title'>" + repo.name + "</div>" +
            "<div class='ptitle'>" + repo.Address1 + " " + repo.Address2 + "</div>";

    return markup;
}
function formatRepoDataSelection_pharmacy(repo) {
    //console.log(repo);
    var customrepo = '';
    if (repo.name) {
        customrepo = repo.name + ', <span class="subname">' + repo.Address1 + '</span>';
    }
    if (repo.text) {
        if (repo.element) {
            customrepo = repo.text + ', <span class="subname">' + repo.element.dataset.address + '</span>';
        } else {
            customrepo = repo.text;
        }
    }
    return customrepo;
}

function formatRepoData(repo) {

    if (repo.loading)
        return repo.text;

    var markup = '';
    if (repo.name) {
        markup = repo.name;
    }
    if (repo.text) {
        markup = repo.text;
    }
    return markup;

    //return repo.name || repo.text;
}


function formatRepoDataSelection(repo) {
    //console.log(repo);
    var customrepo = '';
    if (repo.name) {
        customrepo = repo.name;
    }
    if (repo.text) {
        customrepo = repo.text;
    }
    return customrepo;
}