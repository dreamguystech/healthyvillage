<?php

require_once '../../../config.php';
 
//$pcpsearch = file_get_contents(INI_WEB_API_BASE.'user/getmedications?Keyword='.$_GET['q'].'&Page=1&Limit=50');
//$pcpsearch_decode = json_decode($pcpsearch);
$userid = isset($_SESSION['webyosiId']) ? $_SESSION['webyosiId'] : '';
$api_request = INI_WEB_API_BASE . "user/getmedications";
$api_request_post_data = array(
	"UserId" => $userid,
    "Keyword" => $_GET['q'],
	"Page" => 1,
	"Limit" => 10000
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
    
        echo stripslashes($value['Name']) . '|' . $value['Id'] . "\n";
    }
}



/*
 * Search for term if it is given
 */
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
    if ($q) {
		$results[] = array("Id"=>"","Name"=>$q);
		if(is_array($data)){
        	foreach ($data as $key => $value) {
			/*echo "<pre>";
	echo $value->Name;
	exit;*/
			
            if (strpos(strtolower(stripslashes($value->name)), $q) !== false) {
				 
             //  $results[] = array($key, $value);
			 $results[] = array("Id"=>$value->id,"Name"=>stripslashes($value->name));
			
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
