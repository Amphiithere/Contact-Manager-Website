const urlBase = '/PHP';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	// Get all the form fields
	let firstName = document.getElementById("firstNameReg").value;
	let lastName = document.getElementById("lastNameReg").value;
	let login = document.getElementById("loginNameReg").value;
	let password = document.getElementById("loginPasswordReg").value;
	let confirmPassword = document.getElementById("confirmPasswordReg").value;

	// Reset the result message
	document.getElementById("registerResult").innerHTML = "";

	// Verify all fields used
	if (firstName === "" || lastName === "" || login === "" || password === "") {
		document.getElementById("registerResult").innerHTML = "Please fill in all fields";
		return;
	}

	// Check if passwords match
	if (password !== confirmPassword) {
		document.getElementById("registerResult").innerHTML = "Passwords do not match";
		return;
	}

    //Enforce minimum character limit. MUST BE TESTED
    if(firstName.length < 2 || lastName.length < 2 || login.length < 4 || password.length < 8) {
        if(firstName.length < 2) {
            document.getElementById("registerResult").innerHTML = "Firstname must consist of at least 2 letters";
            return;
        }

        if(lastName.length < 2) {
            document.getElementById("registerResult").innerHTML = "Lastname must consist of at least 2 letters";
            return;
        }

        if(login.length < 4) {
            document.getElementById("registerResult").innerHTML = "Username must consist of at least 4 characters";
            return;
        }

        if(password.length < 8) {
            document.getElementById("registerResult").innerHTML = "Password must consist of at least 8 characters";
            return;
        }
    }

	// Create the data object to send
	let tmp = {
		firstName: firstName,
		lastName: lastName,
		login: login,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error) {
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				// Registration successful
				document.getElementById("registerResult").innerHTML =
					"<span style='color: green;'>Registration successful! You can now log in.</span>";

				// Clear the form fields
				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("loginName").value = "";
				document.getElementById("loginPassword").value = "";
				document.getElementById("confirmPassword").value = "";

				// Return to login page after a short delay
				setTimeout(function() {
					// Go back to login form
					document.querySelector('.flex-container').classList.remove('slide-in');
				}, 2000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contact-list").innerHTML = "";
  document.getElementById("contact-notification").innerHTML = "";

	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("colorSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

        if(jsonObject.results === undefined)
        {
          document.getElementById("contact-notification").innerHTML = "There's Nobody Here!";
        }

        //table header setup
        contactList = "<th> Name </th> <th> Phone Number </th> <th> Email </th> <th> Actions </th>";

				for( let i=0; i<jsonObject.results.length; i++ )
				{
          			contactList += "<tr> <td>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName +
                     "</td> <td>" + jsonObject.results[i].PhoneNumber +
                     "</td> <td>" + jsonObject.results[i].EmailAddress +
                     "</td> <td>" +
                     "<button class='action-btn edit-btn' onclick='editContact(" + jsonObject.results[i].ID + ", \"" +
                     jsonObject.results[i].FirstName + "\", \"" + jsonObject.results[i].LastName + "\", \"" +
                     jsonObject.results[i].PhoneNumber + "\", \"" + jsonObject.results[i].EmailAddress + "\")'>Edit</button> " +
                     "<button class='action-btn delete-btn' onclick='deleteContact(" + jsonObject.results[i].ID + ")'>Delete</button>" +
                     "</td> </tr>";
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementById("contact-list").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contact-list").innerHTML = err.message;
	}

}

function addContact() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('add-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeAddModal()">&times;</span>
            <h2>Add New Contact</h2>
            <div class="form-group">
                <label for="add-first-name">First Name:</label>
                <input type="text" id="add-first-name" class="text-field" placeholder="First Name" />
            </div>
            <div class="form-group">
                <label for="add-last-name">Last Name:</label>
                <input type="text" id="add-last-name" class="text-field" placeholder="Last Name" />
            </div>
            <div class="form-group">
                <label for="add-phone">Phone Number:</label>
                <input type="text" id="add-phone" class="text-field" placeholder="Phone Number" />
            </div>
            <div class="form-group">
                <label for="add-email">Email:</label>
                <input type="text" id="add-email" class="text-field" placeholder="Email Address" />
            </div>
            <div id="addResult"></div>
            <button class="action-btn edit-btn" onclick="saveNewContact()">Add Contact</button>
        </div>
    `;

    // Display modal
    modal.style.display = 'block';
}

function saveNewContact() {
    let firstName = document.getElementById("add-first-name").value;
    let lastName = document.getElementById("add-last-name").value;
    let phoneNumber = document.getElementById("add-phone").value;
    let emailAddress = document.getElementById("add-email").value;

    // Validate inputs
    if (firstName.trim() === '' || lastName.trim() === '' || phoneNumber.trim() === '' || emailAddress.trim() === '') {
        document.getElementById('addResult').innerHTML = "All fields are required";
        return;
    }

    // Create data object
    let data = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        userId: userId
    };

    // Send data to server
    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.error && response.error !== "") {
                    document.getElementById('addResult').innerHTML = response.error;
                } else {
                    // Close modal and refresh contacts
                    closeAddModal();
                    searchContacts();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById('addResult').innerHTML = err.message;
    }
}

//TODO: refresh search on deletion successful
function deleteContact(id) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    const data = {
        contactID: id,
        userID: userId
    };

    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/Delete.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.error && response.error !== "") {
                    alert("Error deleting contact: " + response.error);
                } else {
                    searchContacts();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        alert("Error: " + err.message);
    }
}

function editContact(id, firstName, lastName, phoneNumber, emailAddress) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('edit-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Edit Contact</h2>
            <div class="form-group">
                <label for="edit-first-name">First Name:</label>
                <input type="text" id="edit-first-name" class="text-field" value="${firstName}" />
            </div>
            <div class="form-group">
                <label for="edit-last-name">Last Name:</label>
                <input type="text" id="edit-last-name" class="text-field" value="${lastName}" />
            </div>
            <div class="form-group">
                <label for="edit-phone">Phone Number:</label>
                <input type="text" id="edit-phone" class="text-field" value="${phoneNumber}" />
            </div>
            <div class="form-group">
                <label for="edit-email">Email:</label>
                <input type="text" id="edit-email" class="text-field" value="${emailAddress}" />
            </div>
            <div id="editResult"></div>
            <button class="action-btn edit-btn" onclick="saveContact(${id})">Save Changes</button>
        </div>
    `;

    // Display modal
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAddModal() {
    const modal = document.getElementById('add-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveContact(id) {
    let firstName = document.getElementById('edit-first-name').value;
    let lastName = document.getElementById('edit-last-name').value;
    let phoneNumber = document.getElementById('edit-phone').value;
    let emailAddress = document.getElementById('edit-email').value;

    if (firstName.trim() === '' || lastName.trim() === '' || phoneNumber.trim() === '' || emailAddress.trim() === '') {
        document.getElementById('editResult').innerHTML = "All fields are required";
        return;
    }

    let data = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        contactId: id,
        userId: userId
    };

    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/Edit.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.error && response.error !== "") {
                    document.getElementById('editResult').innerHTML = response.error;
                } else {
                    // Close modal and refresh contacts
                    closeModal();
                    searchContacts();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById('editResult').innerHTML = err.message;
    }
}
