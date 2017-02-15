var base_url = "https://healthfirst.yosicare.com/dev/hf-app/";
$("#pagecontent").hide();
$(document).ready(function(e) {
	if(!window.localStorage.getItem("pat_id")){ window.location.href="index.html"; }
	maritalList();
	if(window.localStorage.getItem("prac_id")){ demographicList(); $("#app_submit").parent().show();}
	relationsList(); getLifestyle(); frequencylist();relationshipList();
	$.post(base_url+"mobile-app?page=getDetails",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		$("#pagecontent").show();
		if(data.success == "Y"){
			$("#frm_step").val(data.data.Step.Step); $("#app_submit").attr('data-step',data.data.Step.Step);
			$("#firstname").val(data.data.PersonalData.FirstName);
			$("#lastname").val(data.data.PersonalData.LastName);
			$("#pgender").val(data.data.PersonalData.Gender);
			if(data.data.PersonalData.Gender)
			$("input[name=select_gender][value=" + data.data.PersonalData.Gender + "]").prop('checked', true);
			$("#pdob").val(data.data.PersonalData.Dob);
			$("#address1").val(data.data.PersonalData.Address1);
			$("#address2").val(data.data.PersonalData.Address2);
			$("#zipcode").val(data.data.PersonalData.Zip);
			if(window.localStorage.getItem("pat_form") == "new"){ window.localStorage.removeItem("pat_form");
				$(".vp_header a").each(function(index, element) {
					$(this).parent().parent().parent().parent().hide();
				});
				$("#htmlContent").removeClass('view-pro-det');
				$("#view-profile_html").show();
				$(".dotstyle").show();
				$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
				$("#form_mpersonal_info").find('input, select').removeAttr('readonly');
				$("#form_mpersonal_info").find('.mobilevp').hide();
				$("#frm_step").attr('data-step',$("#view-profile_html").next().attr('id'));
				$("#pgender, .mobilevp").hide(); $("#select_gender_wrap").show(); $("#submitpinfo").parent().show();
			}
			if(data.data.InsuranceData){
			if(data.data.InsuranceData[0]){
				//$("#no_insurance").show();
				//$(".dep_fd").h();
				var dep='';
				if(data.data.InsuranceData[0].InsuranceHolderType == "secondary") dep='N';
				if(data.data.InsuranceData[0].InsuranceHolderType == "primary") dep='Y';
				$("#ins_dep").val(dep);
				if(dep == "N") $("#firstIns_dependent").hide();
				if(dep == "D") $("#firstIns_dependent, .primaryInsuranceColumn .dependent-no, .secInsuranceColumn").hide();
				$("input[name=primary_areyouinsured][value=" + dep + "]").prop('checked', true);
				$("#primary_insuredfname").val(data.data.InsuranceData[0].InsuredFirstName);
				$("#primary_insuredlname").val(data.data.InsuranceData[0].InsuredLastName);
				$("#primary_insureddob").val(data.data.InsuranceData[0].Dob);
				$("#ins_gen").val(data.data.InsuranceData[0].InsuredGender);
				$("input[name=primary_insuredgender][value=" + data.data.PersonalData.InsuredGender + "]").prop('checked', true);
				$("#primary_insuranceid").val(data.data.InsuranceData[0].Id);
				$("#primary_policynumber").val(data.data.InsuranceData[0].MemberId); $(".addInsurance").hide();
				if(data.data.InsuranceData[1]){
					var dep='D';
					if(data.data.InsuranceData[1].InsuranceHolderType == "secondary") dep='N';
					if(data.data.InsuranceData[1].InsuranceHolderType == "primary") dep='Y';
					$("#ins_secdep").val(dep);
					$(".secInsuranceColumn").show();
					if(dep == "N") $("#secIns_dependent").hide();
					if(dep == "D") $("#secIns_dependent, .secInsuranceColumn .dependent-no").hide();
					$("a.addInsurance").hide();
					$("#ins_submit").show();
					if(data.data.InsuranceData[1].InsuranceHolderType == "secondary") dep='N';
					if(data.data.InsuranceData[1].InsuranceHolderType == "primary") dep='Y';
					$("input[name=sec_areyouinsured][value=" + dep + "]").prop('checked', true);
					$("#sec_insuredfname").val(data.data.InsuranceData[1].InsuredFirstName);
					$("#sec_insuredlname").val(data.data.InsuranceData[1].InsuredLastName);
					$("#sec_insureddob").val(data.data.InsuranceData[1].Dob);
					$("#ins_gen").val(data.data.InsuranceData[1].InsuredGender);
					$("input[name=sec_insuredgender][value=" + data.data.PersonalData.InsuredGender + "]").prop('checked', true);
					$("#sec_insuranceid").val(data.data.InsuranceData[1].Id);
					$("#sec_policynumber").val(data.data.InsuranceData[1].MemberId);
				}
			}
			}else{
				$(".primaryInsuranceColumn").hide();
				$("#no_insurance").show();
				$("#ins_dep").val('i dont have insurance');
			}
			// Demographics //
			$("#dem_emp").val(data.data.GeneralData.Employed);
			$("#ssn").val(data.data.GeneralData.Ssn);
			$("#mobilenumber").val(data.data.GeneralData.MobileNumber);
			$("#employed_company").val(data.data.GeneralData.CompanyName);
			if(data.data.GeneralData.MaritalStatus.length > 0)
			$('#select_maritalstatus option[value='+data.data.GeneralData.MaritalStatus+']').attr('selected','selected');
			$("#dem_mar_sts").val($('#select_maritalstatus option:selected').text());
			if(data.data.GeneralData.Employed.length > 0)
			$("input[name=select_employed][value=" + data.data.GeneralData.Employed + "]").prop('checked', true);
			$("#dem_enhn").val(data.data.GeneralData.EthnicityName);
			$("#dem_race").val(data.data.GeneralData.RaceName);
			$("#select_ethinicity_wrap").val(data.data.GeneralData.EthnicityId);
			$("#select_race_wrap").val(data.data.GeneralData.RaceId);
			if(!window.localStorage.getItem("prac_id")) $("#dem_enhn").parent().hide();
			
			//Pcp //
			$("#emc_firstname").val(data.data.PcpandEmergencyData.EmerFirstName);
			$("#emc_lastname").val(data.data.PcpandEmergencyData.EmerLastName);
			$("#emc_number").val(data.data.PcpandEmergencyData.EmerPhoneNumber);
			
			$("#pcp").val(data.data.PcpandEmergencyData.PcpName);
			$("#pcpcontactnumber").val(data.data.PcpandEmergencyData.PcpPhone);
			if(data.data.PcpandEmergencyData.EmerRelationshipId.length > 0)
			$('#select_emc_relationship option[value='+data.data.PcpandEmergencyData.EmerRelationshipId+']').attr('selected','selected');
			$("#rel_pcp").val($('#select_emc_relationship option:selected').text());
			
			//lifestyle //
			$("#lf_cig").val(data.data.LifestyleData[0]['TobaccoName']);
			$("#lf_alc").val(data.data.LifestyleData[0]['AlcoholName']);
			$("#lf_rec").val(data.data.LifestyleData[0]['DrugName']);
			if(data.data.LifestyleData[0]['TobaccoId'])
			$('#select_smoking option[value='+data.data.LifestyleData[0]['TobaccoId']+']').attr('selected','selected');
			if(data.data.LifestyleData[0]['AlcoholId'])
			$('#select_drink option[value='+data.data.LifestyleData[0]['AlcoholId']+']').attr('selected','selected');
			if(data.data.LifestyleData[0]['DrugsId'].length > 0)
			$('#select_drugs option[value='+data.data.LifestyleData[0]['DrugsId']+']').attr('selected','selected');
			$("#select_smoking").trigger('change');
			$("#select_drink").trigger('change');
			$("#select_drugs").trigger('change');
			//medical info//
			if(data.data.PastMedicalHistoryData){
				var pasthist = new Array;
				var pmcArr = new Array;
				for(var i=0;i<data.data.PastMedicalHistoryData.length;i++){
					pasthist.push(data.data.PastMedicalHistoryData[i]['Name']);
					$("#select_pastmedicalcondition").append('<option value="'+data.data.PastMedicalHistoryData[i]['Id']+'" selected>'+data.data.PastMedicalHistoryData[i]['Name']+'</option>');
					pmcArr.push({
						"Id": data.data.PastMedicalHistoryData[i]['Id'],
						"Name": data.data.PastMedicalHistoryData[i]['Name']
					});
				}
				
				
			var pmcJsonData = JSON.stringify(pmcArr);
				$('#pmcJsonData').val(pmcJsonData);
				
				$("#md_con").val(pasthist.join(", "));
				$("#select_pastmedicalcondition").trigger('change');
			}
			if(data.data.AllergyData){
				var pasthist = new Array; var algArr = new Array; 
				for(var i=0;i<data.data.AllergyData.length;i++){
					pasthist.push(data.data.AllergyData[i]['Name']);
					$("#select_allergies").append('<option value="'+data.data.AllergyData[i]['Id']+'" selected>'+data.data.AllergyData[i]['Name']+'</option>');					
					algArr.push({
						"Id": data.data.AllergyData[i]['Id'],
						"Name": data.data.AllergyData[i]['Name']
					});
				}
				var algArrData = JSON.stringify(algArr);
				$('#allergyJsonData').val(algArrData);
				$("#md_alg").val(pasthist.join(", "));
				$("#select_allergies").trigger('change');
			}
			if(data.data.SurgicalHistoryData){
				var pasthist = new Array;var surArr = new Array; 
				for(var i=0;i<data.data.SurgicalHistoryData.length;i++){
					pasthist.push(data.data.SurgicalHistoryData[i]['Name']);
					$("#select_surgeries").append('<option value="'+data.data.SurgicalHistoryData[i]['Id']+'" selected>'+data.data.SurgicalHistoryData[i]['Name']+'</option>');
					surArr.push({
						"Id": data.data.SurgicalHistoryData[i]['Id'],
						"Name": data.data.SurgicalHistoryData[i]['Name']
					});
				}
				var surArrData = JSON.stringify(algArr);
				$('#surgeryJsonData').val(surArrData);
				$("#md_sug").val(pasthist.join(", "));
				$("#select_surgeries").trigger('change');
			}
			if(data.data.FamilyHistoryData){
				var pasthist = new Array;var famArr = new Array;
				for(var i=0;i<data.data.FamilyHistoryData.length;i++){
					pasthist.push(data.data.FamilyHistoryData[i]['Name']);
					$("#select_familyhistory").append('<option value="'+data.data.FamilyHistoryData[i]['Id']+'" selected>'+data.data.FamilyHistoryData[i]['Name']+'</option>');
					famArr.push({
						"Id": data.data.FamilyHistoryData[i]['Id'],
						"Name": data.data.FamilyHistoryData[i]['Name']
					});
				}
				var famArrData = JSON.stringify(famArr);
				$('#familyJsonData').val(famArrData);
				$("#select_familyhistory").trigger('change');
				$("#md_fam").val(pasthist.join(", "));
			}
			
			if(data.data.MedicationsData){
				var medichist = new Array;var medicationArr = new Array;
				for(var i=0;i<data.data.MedicationsData.length;i++){
					pasthist.push(data.data.MedicationsData[i]['Name']);
					$("#addedMedicationList").append('<li id="addedMedi_'+data.data.MedicationsData[i]['RefId']+'"><p><span>'+data.data.MedicationsData[i]['Name']+", "+data.data.MedicationsData[i]['Dosage']+", "+$("#select_medication_freq1 option[value="+data.data.MedicationsData[i]['Frequency']+"]").text()+'</span></p><a href="javascript:;" class="removelist" data-id="'+data.data.MedicationsData[i]['RefId']+'"></a></li>');
					medicationArr.push({
                    "Id": data.data.MedicationsData[i]['Id'],
					"Name": data.data.MedicationsData[i]['Name'],
                    "Dosage": data.data.MedicationsData[i]['Dosage'],
                    "Frequency": data.data.MedicationsData[i]['Frequency']
                });
				}
				
			}
			
            var medicationJsonString = JSON.stringify(medicationArr);
            $('#medicationJsonData').val(medicationJsonString);
			if(window.localStorage.getItem("prac_id")) 
			referalList();
		}
		$("#loading").hide();
		
		},"json");
		
		
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
$('#select_medication_freq1_wrap .customdd').select2({
		minimumResultsForSearch: Infinity,
		dropdownParent: $('#select_medication_freq1_wrap'),
		placeholder: {
			id: "-1",
			text: "Select a repository"
		}
	});
});

function maritalList(){
	$.post(base_url+"mobile-app?page=maritalList",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
			$("#select_maritalstatus").append('<option value="'+data.data[i]['Id']+'">'+data.data[i]['Name']+'</option>');
			}
		}
	},"json");
	
}

function referalList(){
	$.post(base_url+"mobile-app?page=referalList",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),practiceId:window.localStorage.getItem("prac_id")},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
			$("#refsource").append('<option value="'+data.data[i]['Id']+'">'+data.data[i]['Name']+'</option>');
			}
		}
	},"json");
	
}

function demographicList(){
	$.post(base_url+"mobile-app?page=demographicList",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
			$("#select_maritalstatus").append('<option value="'+data.data[i]['Id']+'">'+data.data[i]['Name']+'</option>');
			}
		}
	},"json");
	
}

function relationsList(){
	$.post(base_url+"mobile-app?page=relationsList",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),SlefFlag:"N"},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
			$("#select_emc_relationship, #primary_relationship, #sec_relationship").append('<option value="'+data.data[i]['Id']+'">'+data.data[i]['Relationship']+'</option>');
			}
		}
	},"json");
	
}

function getLifestyle(){
	$.post(base_url+"mobile-app?page=getLifestyle",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),SlefFlag:"N"},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.tobacco.length;i++){
				$("#select_smoking").append('<option value="'+data.data.tobacco[i]['Id']+'">'+data.data.tobacco[i]['Name']+'</option>');
			}
			for(var i=0;i<data.data.alcohol.length;i++){
				$("#select_drink").append('<option value="'+data.data.alcohol[i]['Id']+'">'+data.data.alcohol[i]['Name']+'</option>');
			}
			
		}
	},"json");
	
}

function frequencylist(){
	$.post(base_url+"mobile-app?page=frequencylist",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
				$("#select_medication_freq1").append('<option value="'+data.data[i]['Id']+'">'+data.data[i]['Name']+'</option>');
			}
			
		}
	},"json");
	
}

function relationshipList(){
	$.post(base_url+"mobile-app?page=relationshipList",{pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),SlefFlag:"N"},
	function(data){
		if(data.success == "Y"){ 
			for(var i=0;i<data.data.length;i++){
			$(".relationshipList").append('<li><a href="javascript:;"><input value="'+data.data[i]['Id']+'" name="rel_list" type="checkbox"><label>'+data.data[i]['Relationship']+'</label></a></li>');
			}
		}
	},"json");
	
}
$(document).on('click',".vp_header a, .btn-cancel",function(){ 
	$("#htmlContent").removeClass('view-pro-det');
	$("#loading").show(); 
	$(".vp_header a").each(function(index, element) {
        $(this).parent().parent().parent().parent().hide();
    });
	$("#app_submit").parent().hide();
	if($(this).attr('class') == "btn btn-cancel"){
		$(".md-modal").removeClass('md-show'); $(".md-overlay").removeClass('md-show');
		//$("#app_submit").parent().hide();
		var cur_form = $('a[data-step="'+$("#app_submit").attr('data-step')+'"]').parent().parent().parent().parent(); cur_form.show();
	}else{
		if(window.localStorage.getItem("pre_page") !='' && $("#app_submit").attr('data-step') <= 5){
			if(window.localStorage.getItem("prac_id") !=''){
				$('#incomplete_form ul').empty();
				for(var i=$("#app_submit").attr('data-step');i<=5;i++){ 
						if(i != 3)
							$('#incomplete_form ul').append("<li><p>"+$('a[data-step="'+i+'"]').prev().text()+"</p></li>");
					}
				$('#incomplete_form').addClass('md-show');
				$('.md-overlay').addClass('md-show');
				$("#loading").hide();
			return false;
			}
		}
		var cur_form = $(this).parent().parent().parent().parent(); cur_form.show();
	}
	$(".dotstyle li").each(function(index, element) {
			$(this).removeClass('current');
			if($(this).attr('data-id') == cur_form.attr('id')) $(this).addClass('current');
		});
	$(".dotstyle").show();
	$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
	
	cur_form.find('input, select').removeAttr('readonly');
	cur_form.find('.mobilevp').hide();
	$("#frm_step").attr('data-step',$("#view-profile_html").next().attr('id'));
	if(cur_form.find('form').attr('id') == "form_mpersonal_info"){
		$("#pgender").hide(); $("#select_gender_wrap").show(); $("#submitpinfo").parent().show();
	} 
	if(cur_form.attr('id') == "insurance-card_html"){
		$("#no_insurance, #ins_secdep, #ins_gen, #ins_secgen, #ins_rel").hide(); $(".dep_fd, .genterradio, .sec_insuredgender, #primary_relationship_wrap").show(); $("#ins_submit").parent().show(); $("#ins_secdep").next('div').show(); $("#primary_companyname_wrap, #sec_companyname_wrap").addClass('searchInput');
	}
	if(cur_form.attr('id') == "general-info_html"){
		 $("#gi_submit").parent().show(); $("#dem_mar_sts, #dem_emp").hide(); $("#select_maritalstatus_wrap").show(); $("#radio1").parent().parent().show();
	}
	if(cur_form.attr('id') == "pcp-info_html"){
		 $("#pcpsubmit").parent().show(); $("#relpcp").hide(); $("#select_emc_relationship_wrap").show(); 
	}
	if(cur_form.attr('id') == "lifestyle-info_html"){
		 $("#lfsubmit").parent().show(); $("#lf_cig, #lf_alc, #lf_rec").hide(); $("#select_smoking_wrap, #select_drink_wrap, #select_drugs_wrap").show(); 
	}
	if(cur_form.attr('id') == "medical-info_html"){
		 $("#md_submit").parent().show(); $("#md_con, #md_sug, #md_alg, #md_fam").hide(); $("#pastmedicalcondition_wrap, #surgeries_wrap, #allergies_wrap, #familyhistory_wrap").show(); $("#pcp_wrap").addClass('searchInput');
	}
	if(cur_form.attr('id') == "medication-info_html"){
		 $("#medi_submit").parent().show(); $("#ph_det, #md_sug, #md_alg, #md_fam").hide(); $("#pharmacyaddress_wrap, #select_medication1_wrap, .medi_add_group_row").show(); 
	}
	setTimeout(function(){ $("#loading").hide(); },500);
});


/* Personal form validate */
	var firstname = $("#firstname");
	var lastname = $("#lastname");
	var pdob = $("#pdob");
	var select_gender_option = $("#select_gender_option");
	var address1 = $("#address1");
	var zipcode = $("#zipcode");
	
	firstname.on('blur keyup',validateFname);
	lastname.on('blur keyup',validateLname);
	pdob.on('blur keyup',validateDob);
	select_gender_option.on('blur keyup',validateGender);
	address1.on('blur keyup',validateAddress);
	zipcode.on('blur keyup',validateZipcode);
	
	$("#form_mpersonal_info").submit(function(){ 
		if(validateFname() & validateLname() & validateDob() & validateGender() & validateAddress() & validateZipcode()){ 
				$("#loading").show();
				$.post(base_url+"mobile-app?page=updateProfile",{firstname:firstname.val(),lastname:lastname.val(),pdob:pdob.val(),gender:$('input[name="select_gender"]:checked').val(),address1:address1.val(),zipcode:zipcode.val(),address2:$("#address2").val(),pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok"),pat_type:'clinic'},function(data){
						if(data.success=="Y"){
							$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$("#"+$("#frm_step").attr('data-step')).find('input, select').removeAttr('readonly');
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#loading").hide();
							$("#no_insurance, #ins_gen, #ins_secdep").hide(); $(".primaryInsuranceColumn, .dep_fd, .genterradio").show();
							if($("#sec_insuranceid").val()){ $(".secInsuranceColumn").show(); $("#sec_areyouinsured").parent().parent().show();}
							$("#ins_submit").parent().show();
							$("#primary_companyname_wrap, #sec_companyname_wrap").addClass('searchInput');
						}
					},"json");
			
		}
		return false;
	});
	
	function validateFname(){
		var fname  = $('#firstname').val();
		if(fname == '')
		{
			$('#firstname').parent().addClass("has-error");				
			return false;
		}
		$("#firstname").parent().removeClass('has-error'); return true;	
	}
	
	function validateLname(){
		var lname  = $('#lastname').val();
		if(lname == '')
		{
			$('#lastname').parent().addClass("has-error");				
			return false;
		}
		$("#lastname").parent().removeClass('has-error'); return true;	
	}
	
	function validateDob(){
		var dob  = $('#pdob').val();
		if(dob == '')
		{
			$('#pdob').parent().addClass("has-error");				
			return false;
		}
		return isDate($('#pdob'));
		//$("#dob").parent().removeClass('has-error'); return true;	
	}
	
	function validateGender(){
		var cphone  = $('input[name="select_gender"]:checked').val();
		if(cphone == '' || $('input[name="select_gender"]:checked').length == 0)
		{
			$('input[name="select_gender"]').parent().addClass("has-error");				
			return false;
		}
		$('input[name="select_gender"]').parent().removeClass('has-error'); return true;	
	}
	
	function validateAddress(){
		var address1  = $('#address1').val();
		if(address1 == '')
		{
			$('#address1').parent().addClass("has-error");				
			return false;
		}
		$("#address1").parent().removeClass('has-error'); return true;	
	}
	
	function validateZipcode(){
		var zipcode  = $('#zipcode').val();
		if(zipcode == '')
		{
			$('#zipcode').parent().addClass("has-error");				
			return false;
		}
		$("#zipcode").parent().removeClass('has-error'); return true;	
	}
	var dtCh = "/";
	var minYear = 1875;
	var maxYear = new Date().getFullYear();
	function isDate(element) {
    var dtStr = element.val();
    
    var daysInMonth = DaysArray(12)
    var pos1 = dtStr.indexOf(dtCh)
    var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
     
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
        $('#'+element.attr('id')).parent().addClass("has-error");
        //$('#date-error-custom').show().text("The date format should be : mm/dd/yyyy");
        return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
        $('#'+element.attr('id')).parent().addClass("has-error");
        $('#date-error-custom').show().text("Please enter a valid month");
        return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
        $('#'+element.attr('id')).parent().addClass("has-error");
        $('#date-error-custom').show().text("Please enter a valid day");
        return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
        $('#'+element.attr('id')).parent().addClass("has-error"); 
        $('#date-error-custom').show().text("Please enter a valid 4 digit year between " + minYear + " and " + maxYear);
        return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
        $('#'+element.attr('id')).parent().addClass("has-error"); 
        $('#date-error-custom').show().text("Please enter a valid date");
        return false
    }
    $('#date-error-custom').hide(); $('#'+element.attr('id')).parent().removeClass("has-error")
    return true
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
	
	function daysInFebruary(year) {
		return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
	}
	
	function isInteger(s) {
		var i;
		for (i = 0; i < s.length; i++) {
			 
			var c = s.charAt(i);
			if (((c < "0") || (c > "9")))
				return false;
		}
		return true;
	}
	
	function stripCharsInBag(s, bag) {
		var i;
		var returnString = "";
		 
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if (bag.indexOf(c) == -1)
				returnString += c;
		}
		return returnString;
	}


/* end personal form validation */


/* Insurance Form */

$("a.addInsurance").click(function(){
	$(this).hide();
	$(".primaryInsuranceColumn").hide(); $(".secInsuranceColumn").show(); $("#sec_areyouinsured").parent().parent().show();
});

$('#primary_companyname').autocomplete(base_url+"mobile-app?page=searchInsurance", acOptions_insurance)
							.result(function(e, data) {
								$('#primary_companyname').blur();
								$('#primary_company_hid').val(data[1]);
								$('#primary_company_hname').val(data[0]);
								document.activeElement.blur();
							});
$('#sec_companyname').autocomplete(base_url+"mobile-app?page=searchInsurance", acOptions_insurance)
							.result(function(e, data) {
								$('#sec_companyname').blur();
								$('#sec_company_hid').val(data[1]);
								$('#sec_company_hname').val(data[0]);
								document.activeElement.blur();
							});
$('#pcp').autocomplete(base_url+"mobile-app?page=physicianList", acOptions_insurance)
							.result(function(e, data) {
								$('#pcp').blur();
								$('#pcp_hid').val(data[1]);
								$('#pcp_hname').val(data[0]);
								$('#pcp_hphone').val(data[3]);
								$("#pcpcontactnumber").val(data[3]).attr('readonly','readonly');
								document.activeElement.blur();
							});
var acOptions_insurance = {
		minChars: 0,
		cacheLength: 50,
		max: 50,
		multiple: false,
		formatItem: function(value) {
		   // document.activeElement.blur();
			//$('#select_medication1').blur();
			// $("html, body").animate({scrollTop:$('#select_medication1_wrap').offset().top-30},1000);
			if($('#primary_company_hid').length){
				$('#primary_company_hid').val('');
				$('#primary_company_hname').val('');
			}
			if($('#sec_company_hid').length){
				$('#sec_company_hid').val('');
				$('#sec_company_hname').val('');
			}
			if($('#pcp').length){
				$('#pcp_hid').val('');
				$('#pcp_hname').val('');
				$('#pcp_hphone').val('');
				$("#pcpcontactnumber").val('');
			}
			return '<span style="color:red">' + value[0] + '</span>';
		},
		scrollHeight: 150,
		
	};


/*$(document).on('click','input[name="sec_areyouinsured"]',function(){ 
	if($(this).val() == "D"){
		$("#secIns_dependent, .secInsuranceColumn .dependent-no, .secInsuranceColumn").hide();
	}
	if($(this).val() == "N"){
		$("#secIns_dependent").hide(); $(".secInsuranceColumn .dependent-no, .secInsuranceColumn").show();
	}
	if($(this).val() == "Y"){
		 $("#secIns_dependent, .secInsuranceColumn .dependent-no, .secInsuranceColumn").show();
	}
});*/

var pri_insurad = $('input[name="primary_areyouinsured"]'), pri_insuredfname = $("#primary_insuredfname"), pri_insuredlname = $("#primary_insuredlname"), pri_insuredgender = $('input[name="primary_insuredgender"]'), pri_insureddob = $("#primary_insureddob"), pri_relationship = $("#primary_relationship"), pri_policynumber = $("#primary_policynumber") , sec_areyouinsured = $('input[name="sec_areyouinsured"]'), sec_insuredfname = $("#sec_insuredfname"), sec_insuredlname = $("#sec_insuredlname"), sec_insureddob = $("#sec_insureddob"), sec_insuredgender = $("#sec_insuredgender"), sec_relationship = $("#sec_relationship"), sec_policynumber = $("#sec_policynumber"), sec_insureddob = $("#sec_insureddob");
	
	pri_insurad.on('blur keyup click',validatePinsured);
	pri_insuredfname.on('blur keyup',validatePfname);
	pri_insuredlname.on('blur keyup',validatePlname);
	pri_insureddob.on('blur keyup',validatePdob);
	pri_insuredgender.on('blur keyup',validatePgender);
	pri_relationship.on('blur keyup form-control',validatePrel);
	pri_policynumber.on('blur keyup',validatePpolicy);
	sec_areyouinsured.on('blur keyup',validateSinsured);
	sec_insuredfname.on('blur keyup',validateSfname);
	sec_insuredlname.on('blur keyup',validateSlname);
	sec_insureddob.on('blur keyup',validateSdob);
	sec_insuredgender.on('blur keyup',validateSgender);
	sec_relationship.on('blur keyup form-control',validateSrel);
	sec_policynumber.on('blur keyup',validateSpolicy);
$('#form_minsurance_info').submit(function(){ 
		if(validatePinsured() & validatePfname() & validatePlname()& validatePdob()& validatePgender()& validatePrel() & validatePpolicy() & validateSinsured()& validateSfname()& validateSlname()& validateSdob()& validateSgender()& validateSrel()& validateSpolicy())
		{  $("#loading").show();
			$.ajax({
				url:base_url+"mobile-app?page=updateInsurance",
				type:"POST",
				data:$('#form_minsurance_info').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#frm_step").attr('data-step',$("#insurance-card_html").next('div').attr('id'));
						$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#"+$("#frm_step").attr('data-step')).find('input, select').removeAttr('readonly');
							$("#gi_submit").parent().show();
							$("#dem_emp, #dem_mar_sts").hide();
							$("#radio1").parent().parent().show(); $("#empcmpy, #select_maritalstatus_wrap").show();
					}
				}
			});
		}
		return false;
	});
	
	function validatePinsured(){ 
		var pri_areyouinsured  = $('input[name="primary_areyouinsured"]:checked').val();
		if(typeof pri_areyouinsured === "undefined" || pri_areyouinsured.length == 0)
		{   $('input[name="primary_areyouinsured"]').attr('data-id',0);
			$('input[name="primary_areyouinsured"]').next().css("border","1px solid #a94442");				
			return false;
		}  $('#primary_insuredfname, #primary_insuredlname, #primary_relationship, #primary_insureddob').val('').attr('data-id',0);
		if(pri_areyouinsured == "D"){
			$("#firstIns_dependent, .primaryInsuranceColumn .dependent-no, .secInsuranceColumn, .addInsurance").hide();
			$("input[name='sec_areyouinsured']").attr('checked',false);
		}
		if(pri_areyouinsured == "N"){
			$("#firstIns_dependent").hide(); $(".primaryInsuranceColumn .dependent-no, .primaryInsuranceColumn").show();
		}
		if(pri_areyouinsured == "Y"){
			 $("#firstIns_dependent, .primaryInsuranceColumn .dependent-no, .primaryInsuranceColumn").show();
		} $('input[name="primary_areyouinsured"]').attr('data-id',1); secins();
		$('input[name="primary_areyouinsured"]').next().css("border",""); return true;	
	}
	
	function validatePfname(){
		var primary_insuredfname  = $('#primary_insuredfname').val();
		if($('input[name="primary_areyouinsured"]:checked').val() == "Y"){
			if(primary_insuredfname == '')
			{ 	$(this).attr('data-id',0);
				$('#primary_insuredfname').parent().addClass("has-error");		secins();		
				return false;
			}
		} $(this).attr('data-id',1); secins();
		$("#primary_insuredfname").parent().removeClass('has-error'); return true;	
	}
	function validatePlname(){ 
		var primary_insuredlname  = $('#primary_insuredlname').val();
		if($('input[name="primary_areyouinsured"]:checked').val() == "Y"){
			if(primary_insuredlname == '')
			{   $(this).attr('data-id',0);secins();
				$('#primary_insuredlname').parent().addClass("has-error");				
				return false;
			}
		} $(this).attr('data-id',1); secins();
		$("#primary_insuredlname").parent().removeClass('has-error'); return true;	
	}
	function validatePdob(){
		var primary_insureddob  = $('#primary_insureddob').val();
		if($('input[name="primary_areyouinsured"]:checked').val() == "Y"){
			if(primary_insureddob == '')
			{	$(this).attr('data-id',0);secins();
				$('#primary_insureddob').parent().addClass("has-error");				
				return false;
			}
			
			var chkdate= isDate($('#primary_insureddob'));
			if(chkdate) {
				$(this).attr('data-id',1); secins();
				return chkdate;
			}$(this).attr('data-id',0); secins();
				return chkdate;
		} 
		$("#primary_insureddob").parent().removeClass('has-error'); return true;	
	}
	function validatePgender(){
		var primary_insuredgender  = $('input[name="primary_insuredgender"]:checked').val();
		if($('input[name="primary_areyouinsured"]:checked').val() == "Y"){
			if(typeof primary_insuredgender === "undefined" || primary_insuredgender.length == 0)
			{	$('input[name="primary_insuredgender"]').attr('data-id',0);secins();
				$('input[name="primary_insuredgender"]').next().css("border","1px solid #a94442");				
				return false;
			}
		} $('input[name="primary_insuredgender"]').attr('data-id',1); secins();
		$('input[name="primary_insuredgender"]').next().css("border",""); return true;	
	}
	
	function validatePrel(){
		var primary_relationship  = $('#primary_relationship').val();
		if($('input[name="primary_areyouinsured"]:checked').val() == "Y"){
			if(primary_relationship == '')
			{	$(this).attr('data-id',0);secins();
				$('#primary_relationship').parent().addClass("has-error");				
				return false;
			}
		} $(this).attr('data-id',1); secins();
		$("#primary_relationship").parent().removeClass('has-error'); return true;	
	}
	function validatePpolicy(){
		var primary_policynumber  = $('#primary_policynumber').val();
		if(primary_policynumber == '')
			{	$(this).attr('data-id',0);secins();
				$('#primary_policynumber').parent().addClass("has-error");				
				return false;
			} $(this).attr('data-id',1); secins();
		$("#primary_policynumber").parent().removeClass('has-error'); return true;	
	}
	function secins(){
		var chk_secins =1;
		var pri_areyouinsured  = $('input[name="primary_areyouinsured"]:checked').val();
		if(pri_areyouinsured == "Y" || pri_areyouinsured == "N"){
			$("#form_minsurance_info input, #form_minsurance_info select").each(function(index, element) {
				if($(this).attr('data-id')){ 
				 if($(this).attr('data-id')==0){ 
				  chk_secins =0; }
				} 
			});
		} if(pri_areyouinsured == "D") chk_secins =0;
			if(chk_secins == 1) $(".addInsurance").show(); else $(".addInsurance").hide();
		
	}
	function validateSinsured(){ 
		var sec_areyouinsured  = $('input[name="sec_areyouinsured"]:checked').val();
		if(typeof sec_areyouinsured === "undefined" || sec_areyouinsured.length == 0)
		{
			$('input[name="sec_areyouinsured"]').next().css("border","1px solid #a94442");				
			return false;
		}  $('#sec_insuredfname, #sec_insuredlname, #sec_relationship, #sec_insureddob').val('');
		if(sec_areyouinsured == "D"){
		$("#secIns_dependent, .secInsuranceColumn .dependent-no, .secInsuranceColumn").hide();
		}
		if(sec_areyouinsured == "N"){
			$("#secIns_dependent").hide(); $(".secInsuranceColumn .dependent-no, .secInsuranceColumn").show();
		}
		if(sec_areyouinsured == "Y"){
			 $("#secIns_dependent, .secInsuranceColumn .dependent-no, .secInsuranceColumn").show();
		}
		$('input[name="sec_areyouinsured"]').next().css("border",""); return true;	
	}
	function validateSfname(){
		var sec_insuredfname  = $('#sec_insuredfname').val();
		if($('input[name="sec_areyouinsured"]:checked').val() == "Y"){
			if(sec_insuredfname == '')
			{
				$('#sec_insuredfname').parent().addClass("has-error");				
				return false;
			}
		}
		$("#sec_insuredfname").parent().removeClass('has-error'); return true;	
	}
	function validateSlname(){
		var sec_insuredlname  = $('#sec_insuredlname').val();
		if($('input[name="sec_areyouinsured"]:checked').val() == "Y"){
			if(sec_insuredlname == '')
			{
				$('#sec_insuredlname').parent().addClass("has-error");				
				return false;
			}
		}
		$("#sec_insuredlname").parent().removeClass('has-error'); return true;	
	}
	function validateSdob(){
		var sec_insureddob  = $('#sec_insureddob').val();
		if($('input[name="sec_areyouinsured"]:checked').val() == "Y"){
			if(sec_insureddob == '')
			{
				$('#sec_insureddob').parent().addClass("has-error");				
				return false;
			}
			return isDate($('#sec_insureddob'));
		}
		$("#sec_insureddob").parent().removeClass('has-error'); return true;	
	}
	function validateSgender(){
		var sec_insuredgender  = $('input[name="sec_insuredgender"]:checked').val();
		if($('input[name="sec_areyouinsured"]:checked').val() == "Y"){
			if(typeof sec_insuredgender === "undefined" || sec_insuredgender.length == 0)
			{
				$('input[name="sec_insuredgender"]').next().css("border","1px solid #a94442");				
				return false;
			}
		}
		$('input[name="sec_insuredgender"]').next().css("border",""); return true;	
	}
	
	function validateSrel(){
		var sec_relationship  = $('#sec_relationship').val();
		if($('input[name="sec_areyouinsured"]:checked').val() == "Y"){
			if(sec_relationship == '')
			{
				$('#sec_relationship').parent().addClass("has-error");				
				return false;
			}
		}
		$("#sec_relationship").parent().removeClass('has-error'); return true;	
	}
	function validateSpolicy(){
		var sec_policynumber  = $('#sec_policynumber').val();
		if(sec_policynumber == '')
			{
				$('#sec_policynumber').parent().addClass("has-error");				
				return false;
			}
		$("#sec_policynumber").parent().removeClass('has-error'); return true;	
	}
/* End insurance form */

/* General form */	

$(document).on('click','#radio1',function(){
	$("#empcmpy").hide();
	if($('input[name="select_employed"]:checked').val() == "Y") $("#empcmpy").show();
	
});


$('#generalinfo').submit(function(){ 
	var dem_emp = $("#radio1");
	var ssn = $("#ssn");
	var mobilenumber = $("#mobilenumber");
	var select_maritalstatus = $("#select_maritalstatus");
		
	dem_emp.on('blur keyup',validateEmp);
	ssn.on('blur keyup',validateSsn);
	mobilenumber.on('blur keyup',validateMobilenumber);
	select_maritalstatus.on('blur keyup',validateMaritalsts);

		if(validateEmp() & validateSsn() & validateMobilenumber() & validateMaritalsts())
		{ $("#loading").show(); 
			$.ajax({
				url:base_url+"mobile-app?page=demographics",
				type:"POST",
				data:$('#generalinfo').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#frm_step").attr('data-step',$("#general-info_html").next('div').attr('id'));
						$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#pcpsubmit").parent().show();
							$("#select_emc_relationship_wrap").show();
							$("#relpcp").hide();
					}
				}
			});
		}
		return false;
	});

	function validateEmp(){ 
		var dem_emp  = $('input[name="select_employed"]:checked').val();
		if(typeof dem_emp == "undefined" || dem_emp.length == 0)
		{
			$('input[name="select_employed"]').next().css("border","1px solid #a94442");;				
			return false;
		}
		$('input[name="select_employed"]').next().css("border",""); return true;	
	}
	
	function validateSsn(){
		var ssn  = $('#ssn').val();
		if(ssn == '')
		{
			$('#ssn').parent().addClass("has-error");				
			return false;
		}
		$("#ssn").parent().removeClass('has-error'); return true;	
	}
	
	function validateMobilenumber(){
		var mobilenumber  = $('#mobilenumber').val();
		if(mobilenumber == '')
		{
			$('#mobilenumber').parent().addClass("has-error");				
			return false;
		}
		$("#mobilenumber").parent().removeClass('has-error'); return true;	
	}
	
	function validateMaritalsts(){
		var select_maritalstatus  = $('#select_maritalstatus').val();
		if(select_maritalstatus == '')
		{
			$('#select_maritalstatus').parent().addClass("has-error");				
			return false;
		}
		$("#select_maritalstatus").parent().removeClass('has-error'); return true;	
	}


/* General form */	

/* Pcp */
$('#mycontact').submit(function(){ 
	var emc_firstname = $("#emc_firstname");
	var emc_lastname = $("#emc_lastname");
	var emc_number = $("#emc_number");
	var select_emc_relationship = $("#select_emc_relationship");
		
	emc_firstname.on('blur keyup',validateEfname);
	emc_lastname.on('blur keyup',validateElname);
	emc_number.on('blur keyup',validateEmobilenumber);
	select_emc_relationship.on('blur keyup change',validateErel);

		if(validateEfname() & validateElname() & validateEmobilenumber() & validateErel())
		{ $("#loading").show(); 
			$.ajax({
				url:base_url+"mobile-app?page=physician",
				type:"POST",
				data:$('#mycontact').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#frm_step").attr('data-step',$("#pcp-info_html").next('div').attr('id'));
						$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#lfsubmit").parent().show();
							$("#lifestyle-info_html, #select_smoking_wrap, #select_drink_wrap, #select_drugs_wrap").show();
							$("#relpcp, #lf_cig, #lf_alc, #lf_rec").hide();
					}
				}
			});
		}
		return false;
	});

	function validateEfname(){
		var emc_firstname  = $("#emc_firstname").val();
		if(emc_firstname == '')
		{
			$('#emc_firstname').parent().addClass("has-error");				
			return false;
		}
		$("#emc_firstname").parent().removeClass('has-error'); return true;	
	}
	
	function validateElname(){
		var emc_lastname  = $('#emc_lastname').val();
		if(emc_lastname == '')
		{
			$('#emc_lastname').parent().addClass("has-error");				
			return false;
		}
		$("#emc_lastname").parent().removeClass('has-error'); return true;	
	}
	
	function validateEmobilenumber(){
		var emc_number  = $('#emc_number').val();
		if(emc_number == '')
		{
			$('#emc_number').parent().addClass("has-error");				
			return false;
		}
		$("#emc_number").parent().removeClass('has-error'); return true;	
	}
	
	function validateErel(){
		var select_emc_relationship  = $('#select_emc_relationship').val();
		if(select_emc_relationship == '')
		{
			$('#select_emc_relationship').parent().addClass("has-error");				
			return false;
		}
		$("#select_emc_relationship").parent().removeClass('has-error'); return true;	
	}

/* End Pcp */

/* Life Style */


$('#lifestyle').submit(function(){ 
	$("#loading").show(); 
			$.ajax({
				url:base_url+"mobile-app?page=lifestyle",
				type:"POST",
				data:$('#lifestyle').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#frm_step").attr('data-step',$("#lifestyle-info_html").next('div').attr('id'));
						$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#md_submit").parent().show();
							$("#medical-info_html, #pastmedicalcondition_wrap, #surgeries_wrap, #allergies_wrap, #familyhistory_wrap").show();
							$("#relpcp, #md_con, #md_sug, #md_alg, #md_fam").hide();
					}
				}
			});
		return false;
	});


/* End Life Style */


/* Medical history */
$(document).ready(function(e) {
    

			var familyArr = [];
			var updatefamilyArr = [];
			if ($('#base_url_h').length) {
				var API_BASE_URL =base_url;
			}
			$("#select_pastmedicalcondition").select2({
				ajax: {
					type:"POST",
					url: base_url+"mobile-app?page=getpatmedicalHistory",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Keyword: params.term, 
							Page: params.page,
							pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")
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
					cache: true
				}, 
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 2,
				templateResult: formatRepoData, 
				templateSelection: formatRepoDataSelection, 
				placeholder: 'Type to search medical condition',
				tags: true,
				tokenSeparators: [","],
        		allowClear: false
			}).on("change", function(e) {
			}).on("select2:select", function(e) {
				 //console.log(e.params.data);
				var isNew = $(this).find('[data-select2-tag="true"]');
				if (e.params.data.name == 'None' || e.params.data.name == 'none' || e.params.data.text == 'none') {
					$('#select_pastmedicalcondition option:lt(-1)').remove();
					$("#select_pastmedicalcondition").trigger('change');
				}
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
	 
			});
			
			
			
			$("#select_surgeries").select2({

				ajax: {
					type:"POST",
					url: base_url+"mobile-app?page=getsurgicalHistory",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Keyword: params.term, 
							Page: params.page,
							pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")
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
					cache: true
				}, 
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 2,
				templateResult: formatRepoData, 
				templateSelection: formatRepoDataSelection, 
				placeholder: 'Type to search surgeries',
				tags: true,
				tokenSeparators: [","],
        		allowClear: false
			}).on("change", function(e) {}).on("select2:select", function(e) {
				 
				var isNew = $(this).find('[data-select2-tag="true"]');
				if (e.params.data.name == 'None' || e.params.data.name == 'none' || e.params.data.text == 'none') {
					$('#select_surgeries option:lt(-1)').remove();
					$("#select_surgeries").trigger('change');
				}
				if (e.params.data.name) {
					isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
				} else {
					isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
				}
				 
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
				}
				var surgeryJsonData = JSON.stringify(surgeryArr);
				$('#surgeryJsonData').val(surgeryJsonData);
	
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_surgeries_hidden').html(snames);
	 
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
				}
				var surgeryJsonData = JSON.stringify(surgeryArr);
				$('#surgeryJsonData').val(surgeryJsonData);
	
				var lastChar = snames.slice(-2);
				if (lastChar == ', ') {
					snames = snames.slice(0, -2);
				}
				var selectedItem = $('#select_surgeries_hidden').html(snames);
	 
			});
			
			$("#select_allergies").select2({
            ajax: {
               type:'POST',
				url: base_url+"mobile-app?page=getAllergy",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, 
                        Page: params.page,
						pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")
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
            escapeMarkup: function(markup) {
                return markup;
            },  
            minimumInputLength: 2,
            templateResult: formatRepoData, 
            templateSelection: formatRepoDataSelection, 
            placeholder: 'Type to search allergies',
            tags: true,
            tokenSeparators: [","],
        	allowClear: false
        }).on("change", function(e) {
             
        }).on("select2:select", function(e) {
             
            var isNew = $(this).find('[data-select2-tag="true"]');
				if (e.params.data.name == 'None' || e.params.data.name == 'none' || e.params.data.text == 'none') {
					$('#select_allergies option:lt(-1)').remove();
					$("#select_allergies").trigger('change');
				}
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            
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
                
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);

            
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
                 
            }
            var allergyJsonData = JSON.stringify(allergyArr);
            $('#allergyJsonData').val(allergyJsonData);

            var lastChar = snames.slice(-2);
            if (lastChar == ', ') {
                snames = snames.slice(0, -2);
            }
            var selectedItem = $('#select_allergies_hidden').html(snames);
 
        });
		
			$("#select_familyhistory").select2({
            ajax: {
                type:'POST',
                url: base_url+"mobile-app?page=familyHistory",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        Keyword: params.term, 
                        Page: params.page,
						pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")
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
                cache: true
            }, 
            escapeMarkup: function(markup) {
                return markup;
            },  
            minimumInputLength: 2,
            templateResult: formatRepoData,  
            templateSelection: formatRepoDataSelection,  
            placeholder: 'Type to search family history',
            tags: true,
            tokenSeparators: [","],
        	allowClear: false
        }).on("change", function(e) {
            
        }).on("select2:select", function(e) { 
 
            var isNew = $(this).find('[data-select2-tag="true"]');
				if (e.params.data.name == 'None' || e.params.data.name == 'none' || e.params.data.text == 'none') {
					$('#select_familyhistory option:lt(-1)').remove();
					$("#select_familyhistory").trigger('change');
				}
            if (e.params.data.name) {
                isNew.replaceWith('<option selected value="' + e.params.data.id + '">' + e.params.data.name + '</option>');
            } else {
                isNew.replaceWith('<option selected value="' + e.params.data.text + '">' + e.params.data.text + '</option>');
            }
            
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
			if (e.params.data.name == 'None' || e.params.data.name == 'none' || e.params.data.text == 'none') {
				$('#relationshipData').hide();
			}else{
            	$('#relFhName').text(e.params.data.name || e.params.data.text);
            	$('#relationshipData').show();
				$('#form_mmedical_info input[type="submit"]').prop('disabled', true);
            	$(this).prop("disabled", true);
			}
            

 
        }).on("select2:unselect", function(e) {
             

            var deletedId = e.params.data.id;
            $('#select_familyhistory option').each(function() {
                if ($(this).val() == deletedId || $(this).text() == deletedId) {
                    $(this).remove();
                }
            });
            $("#select_familyhistory").trigger('change'); 

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
        });
		


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
 
}

function formatRepoDataSelection(repo) {
     
    var customrepo = '';
    if (repo.name) {
        customrepo = repo.name;
    }
    if (repo.text) {
        customrepo = repo.text;
    }
    return customrepo;
}
});

$(document).on('click', '.relationshipList li a', function(e) {
            var $thischeckbox = $(this).find('input[type=checkbox]');
            if ($thischeckbox.is(':checked')) {
                $thischeckbox.prop('checked', false);
            } else {
                $thischeckbox.prop('checked', true); 
            }
        });
$(document).on('click', '#selectedRelations', function(e) {
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
	 
			$('#familyJsonData').val('');
			var familyJsonString = JSON.stringify(familyArr);
			$('#familyJsonData').val(familyJsonString);
	
			$('#relationshipData').hide();
			$('#form_mmedical_info input[type="submit"]').prop('disabled', false);
			$('.relationshipList input').prop('checked', false);
		});
		
		
$('#form_mmedical_info').submit(function(){ 
    var select_pastmedicalcondition = $("#select_pastmedicalcondition");
	var select_surgeries = $("#select_surgeries");
	var select_allergies = $("#select_allergies");
	var select_familyhistory = $("#select_familyhistory");
		
	select_pastmedicalcondition.on('blur keyup',validatePmc);
	select_surgeries.on('blur keyup',validateSurg);
	select_allergies.on('blur keyup',validateAllg);
	select_familyhistory.on('blur keyup',validateFamhis);

		if(validatePmc() & validateSurg() & validateAllg() & validateFamhis())
		{
	$("#loading").show(); 
			$.ajax({
				url:base_url+"mobile-app?page=myHealth",
				type:"POST",
				data:$('#form_mmedical_info').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#frm_step").attr('data-step',$("#medical-info_html").next('div').attr('id'));
						$(".dotstyle li").each(function(index, element) {
                                $(this).removeClass('current');
								if($(this).attr('data-id') == $("#frm_step").attr('data-step')) $(this).addClass('current');
                            });
							$(".site-title h4").empty().append($(".dotstyle").find('ul li.current a').text());
							$("#"+$("#frm_step").attr('data-step')).prev().hide();
							$("#"+$("#frm_step").attr('data-step')).find('.mobilevp').hide();
							$("#"+$("#frm_step").attr('data-step')).show();
							$("#medi_submit").parent().show();
							$("#medication-info_html, #pharmacyaddress_wrap, .medi_add_group_row , #select_medication1_wrap").show();
							$("#ph_det").hide(); $("#pcp_wrap").addClass('searchInput');
					}
				}
			});
		}
		return false;
	});
	
	function validatePmc(){
		var select_pastmedicalcondition  = $('#select_pastmedicalcondition').val();
		if(select_pastmedicalcondition == '' || select_pastmedicalcondition == null)
		{
			$('#select_pastmedicalcondition').next().addClass("has-error");				
			return false;
		}
		$("#select_pastmedicalcondition").next().removeClass('has-error'); return true;
	}
	function validateSurg(){
		var select_surgeries  = $('#select_surgeries').val();
		if(select_surgeries == '' || select_surgeries == null)
		{
			$('#select_surgeries').next().addClass("has-error");				
			return false;
		}
		$("#select_surgeries").next().removeClass('has-error'); return true;
	}
	
	function validateAllg(){
		var select_allergies  = $('#select_allergies').val();
		if(select_allergies == '' || select_allergies == null)
		{
			$('#select_allergies').next().addClass("has-error");				
			return false;
		}
		$("#select_allergies").next().removeClass('has-error'); return true;
	}
	
	function validateFamhis(){ 
		var select_familyhistory  = $('#select_familyhistory').val(); 
		if(select_familyhistory == '' || select_familyhistory == null)
		{
			$('#select_familyhistory').next().addClass("has-error");				
			return false;
		}
		$("#select_familyhistory").next().removeClass('has-error'); return true;
	}
/* End Medical history */

/* Medication Form */

 
           $(document).on('click', '#add_medi_data', function(e) {  
            var mId = $('#medication_hid').val();
            var mName = $('#medication_hname').val();

            var dosage = $('#select_medication_dosage1').val();
            var frequency = $('#select_medication_freq1').select2('data');
			/*if(dosage =='' || frequency ==''){
				return false;
			}*/
            var existsId = 'N';
            $("#select_medication1").val('').trigger('change');
            $('#select_medication_freq1').val('').trigger('change');
            $('#select_medication_dosage1').val('');
			$('#select_medication_freq1_wrap .selected_icon').removeClass('active');
            var prevArrayVal = $('#medicationJsonData').val();
			 medicationArr = [];
            if (prevArrayVal) {

                var jsonfullobj = jQuery.parseJSON(prevArrayVal);

               
                for (var i in jsonfullobj) {
                    var item = jsonfullobj[i];
					if(item.Id ){
                    medicationArr.push({
                        "Id": item.Id,
						"Name": item.Name,
                        "Dosage": item.Dosage,
                        "Frequency": item.Frequency
                    });
					}
                    if (mId) {
						if (mId == item.Id) {
                        	existsId = 'Y';
                        	$('p.status-medi').show().removeClass('successmsg').addClass('errormsg').text('Already Added!');
						}
                    }
                }

            }

            
            if ((mId && existsId == 'N') || mName && existsId == 'N') {
                medicationArr.push({
                    "Id": mId,
					"Name": mName,
                    "Dosage": dosage,
                    "Frequency": frequency[0].id
                });
            }

            var medicationJsonString = JSON.stringify(medicationArr);
            $('#medicationJsonData').val(medicationJsonString);

            /*$('#addedMedicationList').append('<li id="addedMedi_'+mId[0].id+'"><p><span>'+mId[0].name+'</span>,'+dosage+','+frequency[0].text+' </p><a href="javascript:;" class="removelist" data-id="'+mId[0].id+'"></a></li>');*/
            if ((mId && existsId == 'N') || mName && existsId == 'N') {
				var frequencytxt='';
				var mnewid='';
				if(frequency[0].id){
					frequencytxt = frequency[0].text;
				}
				if(mId){
					mnewid = mId;
				}else{
					mnewid = mName.replace(/ /g,'');
				}
                $('#addedMedicationList').prepend('<li id="addedMedi_' + mnewid + '"><p><span>' + mName + '</span>,' + dosage + ',' + frequencytxt + ' </p><a href="javascript:;" class="removelist" data-id="' + mnewid + '" data-name="' + mName.replace(/ /g,'') + '"></a></li>');
            }
            setTimeout(function() {
                $('p.status-medi').removeClass('errormsg', 'successmsg').html("").hide();
            }, 4000);

        });
		
		$(document).on('click', '.removelist', function(e) {
            var prevArrayVal = $('#medicationJsonData').val();
            var jsonfullobj = jQuery.parseJSON(prevArrayVal);
            var deletedId = $(this).data('id');
			var deletedIdName = $(this).data('name');
			if(deletedId==deletedIdName){
				$('#addedMedi_' + deletedIdName).remove();
			}else{
            	$('#addedMedi_' + deletedId).remove();
			}
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

$('#select_medication1')
                .autocomplete(base_url+"mobile-app?page=medicationsList", acOptions_medication)
                .result(function(e, data) {
                    $('#select_medication1').blur();
                    $('#medication_hid').val(data[1]);
                    $('#medication_hname').val(data[0]);
                    document.activeElement.blur();
                });
		var acOptions_medication = {
        minChars: 2,
        cacheLength: 50,
        max: 50,
        multiple: false,
        formatItem: function(value) {
           // document.activeElement.blur();
            //$('#select_medication1').blur();
			// $("html, body").animate({scrollTop:$('#select_medication1_wrap').offset().top-30},1000);
            return '<span style="color:red">' + value[0] + '</span>';
        },
        scrollHeight: 150
    };	
			
			
			$("#select_pharmacyaddress").select2({
				minimumResultsForSearch: Infinity,
				ajax: { 
					type:"POST",
					url: base_url+"mobile-app?page=searchPharmacy",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							Name: params.term, 
							Page: params.page,
							ZipCode: $('#pharmacyzipcode').val(),
							pat_id:window.localStorage.getItem("pat_id"),pat_acctok:window.localStorage.getItem("pat_acctok"),pat_reftok:window.localStorage.getItem("pat_reftok")
						};
					},
					processResults: function(data, params) { 
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
				escapeMarkup: function(markup) {
					return markup;
				}, 
				minimumInputLength: 1,
				templateResult: formatRepoData_pharmacy, 
				templateSelection: formatRepoDataSelection_pharmacy, 
				placeholder: 'Search Pharmacy',
				allowClear: true
			}).focus(function() {
            $(this).select2('open');
        }).on("select2:select", function(e) { 
            var pharmacyData = $('#select_pharmacyaddress').select2('data');
             
            $("#pharmacy_hid").val(pharmacyData[0].id);
            $('#pharmacy_hname').val(pharmacyData[0].name);
            
            $('#pharmacy_hphone').val(pharmacyData[0].PhoneNumber);

        });
	function formatRepoData_pharmacy(repo) {
		if (repo.loading)
			return repo.text;
	
		var markup = "<div class='select2-result-doctor clearfix'><div class='doctorInfo'>" +
				"<div class='title'>" + repo.name + "</div>" +
				"<div class='ptitle'>" + repo.Address1 + " " + repo.Address2 + "</div>";
	
		return markup;
	}
	function formatRepoDataSelection_pharmacy(repo) {
		
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
		
	$('#pharmacy').submit(function(){ 
		$("#loading").show();
		{ 
			$.ajax({
				url:base_url+"mobile-app?page=addPharmacymed",
				type:"POST",
				data:$('#pharmacy').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok"),
				dataType:"json",
				success:function(data){ $("#signature").jSignature('reset');
					$("#loading").hide(); 
					window.localStorage.removeItem('pat_form');
					if(data.success == "Y"){
						if(window.localStorage.getItem("prac_id")){
							$("#pageheader .site-title h4").empty().append('Confirmation');
							$("#medication-info_html, .dotstyle").hide();
							$("#profile-complete_html").show();
							$("#signature").jSignature('reset');
						}else{
						$('#non_appoinmentSuccess').addClass('md-show');
    					 $('.md-overlay').addClass('md-show');
						 setTimeout(function(){ window.location.href="home.html";},1000);
						}
					}
				}
			});
		}
		return false;
	});	
/* End Medication Form */
$("#app_submit").click(function(){
	$(this).parent().hide();
	if($("#app_submit").attr('data-step') >= 6){
		$("#pageheader .site-title h4").empty().append('Confirmation');
		$("#htmlContent").removeClass('view-pro-det');
		$("#view-profile_html, #insurance-card_html, #general-info_html, #pcp-info_html, #lifestyle-info_html, #medical-info_html, #medication-info_html").hide();
		$("#medication-info_html, .dotstyle").hide();
		$("#profile-complete_html").show();
		$("#signature").jSignature('reset');
	}else{
		$('#incomplete_form ul').empty();
		for(var i=$("#app_submit").attr('data-step');i<=5;i++){ 
			if(i != 3)
				$('#incomplete_form ul').append("<li><p>"+$('a[data-step="'+i+'"]').prev().text()+"</p></li>");
		}
		$('#incomplete_form').addClass('md-show');
    	$('.md-overlay').addClass('md-show');
	}
	return false;	
});

/* Confirmation Form */

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
							$('#cli_submit').parent().hide();
						});
						$("#signature").bind('change', function(e) {
							$('#signhere').hide();
							$('#cli_submit').parent().show();
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

$('#drpcp').autocomplete(base_url+"mobile-app?page=physicianList", acOptions_insurance)
							.result(function(e, data) {
								$('#drpcp').blur();
								$('#drpcp_hid').val(data[1]);
								$('#drpcp_hname').val(data[0]);
								$('#drpcp_hphone').val(data[3]);
								//$("#pcpcontactnumber").val(data[3]).attr('readonly','readonly');
								document.activeElement.blur();
							});
var acOptions_insurance = {
		minChars: 0,
		cacheLength: 50,
		max: 50,
		multiple: false,
		formatItem: function(value) {
		   
			if($('#pcp').length){
				$('#drpcp_hid').val('');
				$('#drpcp_hname').val('');
				$('#drpcp_hphone').val('');
				//$("#pcpcontactnumber").val('');
			}
			return '<span style="color:red">' + value[0] + '</span>';
		},
		scrollHeight: 150,
		
	};
$(document).on('click',"#refsource",function(){
	$("#referaldoctor, #referalothers").hide();
	if($(this).val() == 1) $("#referaldoctor").show();
	if($(this).val() == 6) $("#referalothers").show();
});


$('#addappointment').submit(function(){ 

	$("#loading").show(); 
	var signature_data = $("#signature").jSignature("getData");
	$('#signature_data').val(signature_data);
			$.ajax({
				url:base_url+"mobile-app?page=addAppointment",
				type:"POST",
				data:$('#addappointment').serialize() + "&pat_id="+window.localStorage.getItem("pat_id")+"&pat_acctok="+window.localStorage.getItem("pat_acctok")+"&pat_reftok="+window.localStorage.getItem("pat_reftok")+"&ptype=clinic&prac_id="+window.localStorage.getItem("prac_id")+"&prac_doc="+window.localStorage.getItem("prac_doc")+"&prac_docname="+window.localStorage.getItem("prac_docname"),
				dataType:"json",
				success:function(data){ 
					$("#loading").hide(); 
					if(data.success == "Y"){
						$("#appoinmentSuccess h4 span").empty().append(window.localStorage.getItem("prac_docname"));
						window.localStorage.removeItem('prac_id');
						window.localStorage.removeItem('prac_doc');
						window.localStorage.removeItem('prac_docname');
						 $('#appoinmentSuccess').addClass('md-show');
    					 $('.md-overlay').addClass('md-show');
					}
				}
			});
		return false;
	});
/* End confirmation */

$(document).on('click',"#pageheader .panel-control-left a",function(){
	$("#htmlContent").addClass('view-pro-det');
	//$("#loading").show(); 
	if($("#pageheader .site-title h4").text() == "View Profile") window.location.href = "home.html";
	$("#pageheader .site-title h4").empty().append('View Profile');
	$("input[type='submit']").parent().hide();
	$(".mobilevp, #pgender, #no_insurance, #ins_gen, #ins_secdep, #ins_secgen, #ins_rel, #dem_emp, #dem_mar_sts, #dem_enhn, #dem_race, #rel_pcp, #lf_cig, #lf_alc, #lf_rec, #md_con, #md_sug, #md_alg, #md_fam, #ph_det, #addedMedicationList").show();
	$("input[name='primary_insuredgender'], input[name='sec_areyouinsured'], input[name='sec_insuredgender'], input[name='select_employed']").parent().parent().hide();
	$("#select_gender_wrap, #dep_fd, #primary_relationship_wrap, #sec_relationship_wrap, #select_maritalstatus_wrap, #select_ethinicity_wrap, #select_race_wrap, #select_emc_relationship_wrap, #select_smoking_wrap, #select_drink_wrap, #select_drugs_wrap, #pastmedicalcondition_wrap, #surgeries_wrap, #allergies_wrap, #familyhistory_wrap, #pharmacyaddress_wrap, #select_medication1_wrap, #medi_add_group_row, .medi_add_group_row").hide();
	$("#primary_companyname_wrap, #sec_companyname_wrap, #pcp_wrap").removeClass('searchInput');
	$(".vp_header a").each(function(index, element) {
        $(this).parent().parent().parent().parent().show();
    });
	/*var cur_form = $(this).parent().parent().parent().parent(); cur_form.show();
	$(".dotstyle li").each(function(index, element) {
		$(this).removeClass('current');
		if($(this).attr('data-id') == cur_form.attr('id')) $(this).addClass('current');
	});*/
	$(".dotstyle, #profile-complete_html").hide();
});

              