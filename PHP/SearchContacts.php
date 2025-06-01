<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
	returnWithError( $conn->connect_error );
} 
else
{
	//select from Contacts database instead of colors
	//Added feature to search by fristname, lastname, phone or email
	$stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ? OR Phone like ? OR Email like?)");
	$searchName = "%" . $inData["search"] . "%";
	$stmt->bind_param("ssss", $searchName, $searchName, $searchName, $searchName);
	$stmt->execute();
	
	$result = $stmt->get_result();
	
	while($row = $result->fetch_assoc())
	{
		if( $searchCount > 0 )
		{
			$searchResults .= ",";
		}
		$searchCount++;
		$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "PhoneNumber" : "' . $row["Phone"]. '", "EmailAddress" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';			
		//search will return array of json objects
	}
	
	if( $searchCount == 0 )
	{
		returnWithError( "No Records Found" );
	}
	else
	{
		returnWithInfo( $searchResults );
	}
	
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
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $searchResults )
{
	$retValue = '{"results":[' . $searchResults . '],"error":""}';
	sendResultInfoAsJson( $retValue );
}
	
?>