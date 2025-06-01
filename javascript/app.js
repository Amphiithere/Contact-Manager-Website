document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signup-btn');
    const backBtn = document.getElementById('back-btn');
    const flexContainer = document.querySelector('.flex-container');

    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        flexContainer.classList.add('slide-in');
        // Clear any error messages when switching forms
        document.getElementById('loginResult').innerHTML = '';
        if(document.getElementById('registerResult')) {
            document.getElementById('registerResult').innerHTML = '';
        }
    });

    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        flexContainer.classList.remove('slide-in');
        // Clear any error messages when switching forms
        if(document.getElementById('registerResult')) {
            document.getElementById('registerResult').innerHTML = '';
        }
        document.getElementById('loginResult').innerHTML = '';
    });

    // Reset form fields if needed
    function resetFormFields() {
        // Login form fields
        if(document.getElementById('loginName')) {
            document.getElementById('loginName').value = '';
        }
        if(document.getElementById('loginPassword')) {
            document.getElementById('loginPassword').value = '';
        }
        
        // Registration form fields
        if(document.getElementById('firstName')) {
            document.getElementById('firstName').value = '';
        }
        if(document.getElementById('lastName')) {
            document.getElementById('lastName').value = '';
        }
        if(document.getElementById('confirmPassword')) {
            document.getElementById('confirmPassword').value = '';
        }
    }
});
