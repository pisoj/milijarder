var public_games_list = [];

window.onload = function() {
    if(location.hash) {
        $.post('/api/get-game-name/', {
            "game_id" : getCookie('game_id'),
            "game_pin" : getCookie('game_pin')
        }, function(response, status) {
            document.getElementById('game-name').innerHTML = response; });
        document.getElementById('id').value = location.hash.substring(1).split(':')[0];
        document.getElementById('pin').value = location.hash.substring(1).split(':')[1];
        document.getElementById('name').placeholder = 'Unesite ime!';
        document.getElementById('name').classList.add('topper');
        document.getElementById('join').classList.add('topper');
        document.getElementById('name-text').classList.add('total-hide');
        document.getElementById('game-name').classList.remove('total-hide');
        document.getElementById('id-text').classList.add('total-hide');
        document.getElementById('pin-text').classList.add('total-hide');
        document.getElementById('id').classList.add('total-hide');
        document.getElementById('pin').classList.add('total-hide');
        document.getElementById('public-games').classList.add('hide');
    } else {
        $.post('/api/get-public-games/', {}, function(raw_response, status) {
            var response = raw_response.split('/[?=names]/');
            var ids = response[0].split('/[?=end]/');
            var names = response[1].split('/[?=end]/');
            var to_add = '';
            for (var i = 0; i < ids.length - 1; i++) {
                to_add += '<option value="' + names[i] + ' (' + ids[i] + ')' + '"/>';
                public_games_list.push(names[i] + ' (' + ids[i] + ')'); };
            document.getElementById('public-games-options').innerHTML = to_add;
        });
    }
};

function select_public_game() {
    if (public_games_list.includes(document.getElementById('public-games').value)) {
        var selected = document.getElementById('public-games').value.split(' (');
        document.getElementById('id').value = selected[1][0];
        document.getElementById('id').disabled = true;
        document.getElementById('pin').value = '0000';
        document.getElementById('pin').classList.add('hide');
        document.getElementById('pin-text').classList.add('hide');
        document.getElementById('name').placeholder = 'Unesite ime!'
    } else if (Array.from(document.getElementById('pin').classList).includes('hide')) {
        document.getElementById('id').value = '';
        document.getElementById('id').disabled = false;
        document.getElementById('pin-text').classList.remove('hide');
        document.getElementById('pin').value = '';
        document.getElementById('pin').classList.remove('hide');
        document.getElementById('name').placeholder = '';
    }
}

function join() {
    var url = '/api/join/';
    var data = {
        game_id: document.getElementById('id').value,
        game_pin: document.getElementById('pin').value,
        gamer_name: document.getElementById('name').value
    };

    document.getElementById('id').disabled = true;
    document.getElementById('pin').disabled = true;
    document.getElementById('name').disabled = true;
    document.getElementById('public-games').disabled = true;
    document.getElementById('join').disabled = true;

    $.post(url, data, function(raw_response, status) {
        if(raw_response == '-1') {
            document.querySelector('#join').textContent = 'Pogrešan ID';
            document.getElementById("join").classList.add('wrong');
            setTimeout(function(){
                document.getElementById("join").classList.remove('wrong');
                document.querySelector('#join').textContent = 'Pridruži se';
            }, 3 * 1000);
        } else if (raw_response == '-2') {
            document.querySelector('#join').textContent = 'Pogrešan PIN';
            document.getElementById("join").classList.add('wrong');
            setTimeout(function(){
                document.getElementById("join").classList.remove('wrong');
                document.querySelector('#join').textContent = 'Pridruži se';
            }, 3 * 1000);
        } else {
            var response = raw_response.split("|");
            document.cookie = 'joker_status=' + response[4];
            document.cookie = 'game_time=' + response[3];
            document.cookie = 'game_name=' + response[2];
            document.cookie = 'game_id=' + document.getElementById('id').value;
            document.cookie = 'game_pin=' + document.getElementById('pin').value;
            document.cookie = 'gamer_id=' + response[0];
            document.cookie = 'gamer_pin=' + response[1];
            document.cookie = 'gamer_name=' + document.getElementById('name').value;
            go("/game.html");
        }
    });
}