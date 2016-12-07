<?php
$pcpsearch = file_get_contents('http://dev.yosicare.com/web/public/v1/user/getpcp?PracticeId=105801&Keyword='.$_GET['q'].'&State=NY&Page=1&Limit=5');
$pcpsearch_decode = json_decode($pcpsearch);

$data = $pcpsearch_decode->data->Doctors;

/*
$data1 = array(
    "Great Bittern" => "Botaurus stellaris",
    "Little Grebe" => "Tachybaptus ruficollis",
    "Black-necked Grebe" => "Podiceps nigricollis"
);
*/
 