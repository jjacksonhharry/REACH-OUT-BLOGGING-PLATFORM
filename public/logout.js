document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      });
    }
  });  