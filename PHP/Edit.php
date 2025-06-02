<?php

# TODO:
# Make file to edit a contact

	$inData = getRequestInfo();

	//Information to update:
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$emailAddress = $inData["emailAddress"];
	$userId = $inData["userId"];
	$contactId = $inData["contactId"];

	//Connect to the Sql Database
	//We configured "TheBeast" with admin privileges
	$conn = new mysqli("localhost",
		"TheBeast",
		"WeLoveCOP4331",
		"COP4331");

	//report connection errors
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	//no error found
	else
	{
		//create SQL statement to send to database
		$stmt = $conn->prepare("UPDATE Contacts Set 
			FirstName = ?, 
			LastName = ?,
			Phone = ?,
			Email = ?,
			WHERE UserID = ? AND ID = ?");

		//prepare SQL statement by binding arguments
		$stmt->bind_param("ssssii"
			,$firstName
			,$lastName
			,$phoneNumber
			,$emailAddress
			,$userId
			,$contactId);

		//execute arguments
		$stmt->execute();

		//Check affected rows
		if($stmt->affected_rows == 0)
		{
			returnWithError("No contact found or Unauthorized");
		}

		//close statment and connection
		$stmt->close();
		$conn->close();
		returnWithError("");
	}


	//helper function:
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Access-Control-Allow-Origin: http://supercoolfun.site');
		header('Access-Control-Allow-Headers: Content-Type');
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}		







?>
