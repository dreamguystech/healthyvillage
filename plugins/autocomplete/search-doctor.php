<?php

require_once '../../../config.php';

/*$pcpsearch = file_get_contents(INI_WEB_API_BASE.'yosidoctor/doctorlslist?Name='.$_GET['q'].'&Page=1&Limit=50');
$pcpsearch_decode = json_decode($pcpsearch);*/

$userid = isset($_SESSION['webyosiId']) ? $_SESSION['webyosiId'] : '';
$api_request = INI_WEB_API_BASE . "yosidoctor/doctorlslist";
$api_request_post_data = array(
	"UserId" => $userid,
    "Name" => $_GET['q'],
	"Page" => 1,
	"Limit" => 1000
);
$api_response = getData($api_request, $api_request_post_data);
$pcpsearch_decode = json_decode($api_response);
 

$data = isset($pcpsearch_decode->data->Doctors) ? $pcpsearch_decode->data->Doctors : '';
 

/*
 * Results array
 */
$results = array();

/*
 * Autocomplete formatter
 */
function autocomplete_format($results) {
	
	foreach ($results as $key => $value) {
    
        echo $value['Name'] . '|' . $value['Id']. '|' . $value['PracticeId']. '|' . $value['PracticeName']. '|' . $value['Specialty'] . '|' . $value['PracticeAddress']. "\n";
    }
}



/*
 * Search for term if it is given
 */
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
    if ($q) {
		if(is_array($data)){
        	foreach ($data as $key => $value) {
			/*echo "<pre>";
	echo $value->Name;
	exit;*/
            if (strpos(strtolower($value->name), $q) !== false) {
				 
             //  $results[] = array($key, $value);
			 $results[] = array("Id"=>$value->id,"Name"=>$value->name,"PracticeId"=>$value->practice_id,"PracticeName"=>$value->practice_name,"Specialty"=>$value->speciality[0]->name,"PracticeAddress"=>$value->practice_address);
			
            }
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
