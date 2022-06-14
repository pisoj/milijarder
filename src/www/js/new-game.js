function make_public() {
    var url = '/api/make-public/';
    var data = {
        game_id: getCookie('game_id'),
        game_pin: getCookie('game_pin')
    };

    $.post(url, data, function(response, status) {
        document.cookie = 'game_pin=0000';
        go('/game-panel.html'); });
}

function new_qb() {
    let formData = new FormData();
    var url = '/api/new-qb/' + getCookie('game_id') + '/' + getCookie('game_pin') + '/';
    formData.append('qb', document.getElementById("qb").files[0]);
    fetch(url, {method: "POST", body: formData});
    if (document.getElementById('public').checked) { make_public(); }
    else { go('/game-panel.html'); }
}

function new_game() {
    var url = '/api/new-game/';
    var data = {
        game_name: document.getElementById('game-name').value,
        game_time: document.getElementById('time').value,
        joker_enabled: document.getElementById('enable-joker').checked
    };

    document.getElementById('game-name').disabled = true;
    document.getElementById('time').disabled = true;
    document.getElementById('enable-joker').disabled = true;
    document.getElementById('public').disabled = true;
    document.getElementById('qb').disabled = true;
    document.getElementById('make').disabled = true;

    $.post(url, data, function(raw_response, status) {
        var response = raw_response.split("|");
        document.cookie = 'game_id=' + response[0];
        document.cookie = 'game_pin=' + response[1];
        new_qb();
    });
}