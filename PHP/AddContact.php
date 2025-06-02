<?php
	$inData = getRequestInfo();
	
	//Modified colors value to reflect contacts
	$firstName = $inData["firstName"];
	$lastName = $inDate["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$emailAddress = $inData["emailAddress"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");	//change color values to contact values
		$stmt->bind_param("ssssi",$firstName,$lastName,$phoneNumber,$emailAddress,$userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Access-Control-Allow-Origin: http://supercoolfun.site');
		header('Access-Control-Allow-Headers: Content-Type');
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>