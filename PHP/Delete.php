<?php

# Make file to delete contact from database

	$inData = getRequestInfo();

	$contactID = $inData["contactID"];
	$userID = $inData["userID"];

	#Connect to database by creating a new sql object.
	#mysqli("host", "username", "password","database").
	$conn = new mysqli("localhost", 
		"TheBeast", 
		"WeLoveCOP4331", 
		"COP4331");


	#Check for connection error.
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	#Continue if no connection error.
	else
	{
		#Define a SQL statement to send to the mySQL server.
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
		
		#Binds the following paramters to the unknown placeholders defined above.
		#bind_param('ii' stands for 'int, int').
		$stmt->bind_param("ii", $contactID, $userID);
		
		#executes the prepared sql statement created above.
		$stmt->execute();
		
		#Check for error
		if( $stmt->affected_rows == 0)
		{
			returnWithError("No contact found or unauthorized");
		}

		#close the connection and close the statement.
		$stmt->close();
		$conn->close();
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
		sendResultInfoAsJson($retValue);
	}
 
 function returnWithInfo( $message )
{
    $retValue = '{"success":true,"message":"' . $message . '"}';
    sendResultInfoAsJson( $retValue );
}

?>
