<?php 
    //header('Content-Type:text/javascript; charset=utf-8');
    $callback=$_GET['jsoncallback'];
	$id = $_GET['id'];
	$idp = $_POST['id'];
	echo $idp;
    $return = array('name'=>leo,'age'=>32);
    $json_string=json_encode($return);
	if(!$callback)
	{
      echo $json_string;
	}else{
      echo $callback."(".$json_string.")";
	}
	if($idp)
	{
	  echo $json_string;
	}

?>