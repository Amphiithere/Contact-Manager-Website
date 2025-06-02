<?php

# TODO:
# Make file to edit a contact

	$inData = getRequestInfo();

	//Connect to the Sql Database
	//We configured "TheBeast" with admin privileges
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	//report connection errors
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	//no error found
	else
	{
		//create SQL statement to send to database
		$stmt = $conn->prepare("UPDATE Contacts Set FirstName = ?, LastName = ?, Phone = ?, Email = ?	WHERE ID = ? AND UserID = ?");

		//prepare SQL statement by binding arguments
		$stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["emailAddress"], $inData["contactId"], $inData["userId"]);

		//execute arguments
		$stmt->execute();

		//Check affected rows
		if($stmt->affected_rows == 0)
		{
			returnWithError("No contact found or Unauthorized");
		}
    else
    {
      returnWithInfo("Contact update successful");
    }

		//close statment and connection
		$stmt->close();
		$conn->close();
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
 
 function returnWithInfo( $message )
{
    $retValue = '{"success":true,"message":"' . $message . '"}';
    sendResultInfoAsJson( $retValue );
}
?>
