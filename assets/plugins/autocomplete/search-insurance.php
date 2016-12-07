<?php

require_once '../../../config.php';
 
$webyosiPracticeID = isset($_SESSION['webyosiPracticeID']) ? $_SESSION['webyosiPracticeID'] : '';
//$domainBase = isset($_REQUEST['domainBase']) ? $_REQUEST['domainBase'] : '';

/*$pcpsearch = file_get_contents(INI_WEB_API_BASE.'user/insurancelist?Keyword='.$_GET['q'].'&PracticeId='.$webyosiPracticeID.'&Page=1&Limit=');
$pcpsearch_decode = json_decode($pcpsearch);*/

$userid = isset($_SESSION['webyosiId']) ? $_SESSION['webyosiId'] : '';
$api_request = INI_WEB_API_BASE . "user/insurancelist";
$api_request_post_data = array(
	"UserId" => $userid,
	"PracticeId" => $webyosiPracticeID,
    "Keyword" => $_GET['q'],
	"Page" => 1,
	"Limit" => ''
);
$api_response = getData($api_request, $api_request_post_data);

$pcpsearch_decode = json_decode($api_response);

$data = $pcpsearch_decode->data;


/*
 * Results array
 */
$results = array();
 
/*
 * Autocomplete formatter
 */
function autocomplete_format($results) {
	
	foreach ($results as $key => $value) {
    
        echo $value['Name'] . '|' . $value['Id'] . "\n";
    }
}



/*
 * Search for term if it is given
 */
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
		
    if ($q) {
		if(isset($_SESSION['webyosiPracticeInsuranceFreeText']) && $_SESSION['webyosiPracticeInsuranceFreeText']=='Y'){
			$results[] = array("Id"=>"","Name"=>$q);
		}
		if($pcpsearch_decode->success=='Y'){
			foreach ($data as $key => $value) {
				/*echo "<pre>";
		echo $value->Name;
		exit;*/
				if (strpos(strtolower($value->Name), $q) !== false) {
					 
				 //  $results[] = array($key, $value);
				 $results[] = array("Id"=>$value->PayerId,"Name"=>$value->Name);
				
				}
			}
		}
		  
		
    }else{
		if($pcpsearch_decode->success=='Y'){
			foreach ($data as $key => $value) {
				 
				 $results[] = array("Id"=>$value->PayerId,"Name"=>$value->Name);
				
				 
			}
		}
	}
}

/*
 * Output format
 */
$output = 'autocomplete';
if (isset($_GET['output'])) {
    $output = strtolower($_GET['output']);
}

/*
 * Output results
 */
if ($output === 'json') {
    echo json_encode($results);
} else {
    echo autocomplete_format($results);
}
