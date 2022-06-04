document.querySelector('#id').textContent = 'ID: ' + getCookie('game_id');
document.querySelector('#pin').textContent = 'PIN: ' + getCookie('game_pin');

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'Jeste li sigurni da želite napustiti kviz? '
                            + 'Ako nastavite svi će podaci biti izgubljeni!';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

function refresh() {
    setTimeout(function() {
        if (document.getElementById('action').textContent == 'Započni') {
            var url = '/api/get-gamers/';
            var data = {
                game_id: getCookie('game_id'),
                game_pin: getCookie('game_pin')
            };
            $.post(url, data, function(raw_response, status) {
                var response = raw_response.split('/[?=end]/')
                var to_set = ''
                for (var i = 0; i < response.length; i++) {
                    to_set += '<text>' + response[i] + '</text>'
                }; document.getElementById('gamers').innerHTML = to_set;
            });

        } else {
            var url = '/api/rating/full/';
            var data = {
                game_id: getCookie('game_id'),
                game_pin: getCookie('game_pin')
            };
        
            $.post(url, data, function(raw_response, status) {
                var response = raw_response.split('/[?=scores]/');
                var names = response[0].split('/[?=end]/');
                var scores = response[1].split('/[?=end]/');
                var to_set = '<tekst>Ime:</tekst><tekst class="righta">Bodovi:</tekst><br/><br/>';
                for (var i = 0; i < scores.length; i++) {
                    to_set += '<tekst>' + names[i] + '</tekst>' + '<tekst class="righta">' + scores[i] + '</tekst><br/>' };
                document.getElementById('gamers').innerHTML = to_set;
            });
        }
        refresh();
    }, 2000);
}

refresh();

function change_status() {
    if (document.querySelector('#action').textContent == 'Započni') {
        var url = '/api/change-status/';
        var data = {
            game_id: getCookie('game_id'),
            game_pin: getCookie('game_pin')
        };
    
        $.post(url, data, function(response, status) {
            document.querySelector('#action').textContent = 'Završi';
        });
    } else {
        var url = '/api/change-status/';
        var data = {
            game_id: getCookie('game_id'),
            game_pin: getCookie('game_pin')
        };
    
        $.post(url, data, function(response, status) {
            document.getElementById("action").classList.add('hide');
            refresh = false;
        });
    }
}