function go(path) { location.href = path }

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function set_cookie(name, value) {
    document.cookie = name + '=' + value;
}