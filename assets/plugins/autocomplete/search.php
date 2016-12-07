<?php

//$domainBase = isset($_REQUEST['domainBase']) ? $_REQUEST['domainBase'] : '';
require_once '../../../config.php';

/*$pcpsearch = file_get_contents(INI_WEB_API_BASE.'user/getpcp?PracticeId=&Keyword='.$_GET['q'].'&State=NY&Page=1&Limit=50');
$pcpsearch_decode = json_decode($pcpsearch);*/
$userid = isset($_SESSION['webyosiId']) ? $_SESSION['webyosiId'] : '';
$api_request = INI_WEB_API_BASE . "user/getpcp";
$api_request_post_data = array(
	"UserId" => $userid,
    "Keyword" => $_GET['q'],
	"Page" => 1,
	"Limit" => 1000
);
$api_response = getData($api_request, $api_request_post_data);
$pcpsearch_decode = json_decode($api_response);

$data = $pcpsearch_decode->data->Doctors;

/*
 * Results array
 */
$results = array();

/*
 * Autocomplete formatter
 */
function autocomplete_format($results) {
	
	foreach ($results as $key => $value) {
    
        echo $value['Name'] . '|' . $value['Id']. '|' . $value['Address']. '|' . $value['PhoneNumber']. '|' . $value['Specialty'] . "\n";
    }
}

/*
 * Search for term if it is given
 */
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
    if ($q) {
        foreach ($data as $key => $value) {
			/*echo "<pre>";
	echo $value->Name;
	exit;*/
            if (strpos(strtolower($value->Name), $q) !== false) {
				 
             //  $results[] = array($key, $value);
			 $results[] = array("Id"=>$value->Id,"Name"=>$value->Name,"Address"=>$value->Address1,"PhoneNumber"=>$value->PhoneNumber,"Specialty"=>$value->Specialty);
			
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
