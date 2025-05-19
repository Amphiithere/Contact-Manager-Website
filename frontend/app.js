document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signup-btn');
    const backBtn = document.getElementById('back-btn');
    const flexContainer = document.querySelector('.flex-container');

    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        flexContainer.classList.add('slide-in');
    });

    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        flexContainer.classList.remove('slide-in');
    });
});
