<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type,  Access-Control-Allow-Headers, Authorization, X-Requested-With');
$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['fname']) && empty($_POST['email'])) die();

if ($_POST)
	{

	// set response code - 200 OK

	http_response_code(200);
	$subject = $_POST['fname'];
	$to = "trinhdoduyhungss@gmail.com";
	$from = $_POST['email'];

	// data

	$msg = $_POST['message'];
	

	// send mail

	ini_set("SMTP","ssl://smtp.gmail.com");
	ini_set("smtp_port","465");
	ini_set("sendmail_from",$from);
	ini_set("sendmail_path", "C:\xampp\sendmail\sendmail.exe -t");

	// Headers

	$headers = "MIME-Version: 1.0\r\n";
	$headers.= "Content-type: text/html; charset=UTF-8\r\n";
	$headers.= "From: <" . $from . ">";
	mail($to, $subject, $msg, $headers);

	// echo json_encode( $_POST );

	echo json_encode(["sent" => true]);
	}
  else
	{

	// tell the user about error

	echo json_encode(["sent" => false, "message" => "Something went wrong"]);
	}

?>