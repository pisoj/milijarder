document.title = getCookie('game_name') + ', ' + getCookie('gamer_name') + ' - Multi Milijarder';
var joker_text = 'Joker'; var joker_used = false;

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'Jeste li sigurni da želite napustiti kviz? '
                            + 'Ako nastavite svi će bodovi biti izgubljeni!';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

function joker() {
    document.querySelector('#message').textContent = joker_text;
    joker_used = true;
}

function rating() {

}

function countdown(i) {
    setTimeout(function() {
        document.querySelector('#time').textContent = String(i);
        if (i > 0) {
            i--;
            countdown(i);
        } }, 1000);
}

function load_question(qb, q_number, past_q) {
    var q = Math.floor(Math.random() * q_number) + 1;
    while (past_q.includes(q)) {
        q = Math.floor(Math.random() * q_number) + 1;
    };

    document.querySelector('#question').textContent = qb[7 * q - 7];
    document.getElementById('A').innerHTML = 'A: ' + qb[7 * q - 7 + 1];
    document.getElementById('B').innerHTML = 'B: ' + qb[7 * q - 7 + 2];
    document.getElementById('C').innerHTML = 'C: ' + qb[7 * q - 7 + 3];
    document.getElementById('D').innerHTML = 'D: ' + qb[7 * q - 7 + 4];
    joker_text = qb[7 * q - 7 + 6];

    return q;
}

function check(qb, q) {
    // Check
    var correct = false;
    if (document.getElementById('a').checked && qb[7 * q - 7 + 5] == 'A') { correct = true; }
    if (document.getElementById('b').checked && qb[7 * q - 7 + 5] == 'B') { correct = true; }
    if (document.getElementById('c').checked && qb[7 * q - 7 + 5] == 'C') { correct = true; }
    if (document.getElementById('d').checked && qb[7 * q - 7 + 5] == 'D') { correct = true; }

    var to_add = '-'
    if (correct && !joker_used) { to_add = '++' }
    if (correct && joker_used) { to_add = '+' }
    if (!correct && !joker_used) { to_add = '-' }
    if (!correct && joker_used) { to_add = '--' }

    var url = '/api/update-score/' + to_add + '/';
    var data = {
        game_id: getCookie('game_id'),
        game_pin: getCookie('game_pin'),
        gamer_id: getCookie('gamer_id'),
        gamer_pin: getCookie('gamer_pin')
    }
    
    $.post(url, data, function(response, status) {
        document.querySelector('#score').textContent = 'Bodovi: ' + response;

        var url = '/api/rating/place/';
        var data = {
            game_id: getCookie('game_id'),
            game_pin: getCookie('game_pin'),
            gamer_id: getCookie('gamer_id'),
            gamer_pin: getCookie('gamer_pin')
        }
        
        $.post(url, data, function(response, status) {
            document.getElementById('place').innerText = response + '. Mjesto';
        });
    });

    document.getElementById('a').checked = false;
    document.getElementById('b').checked = false;
    document.getElementById('c').checked = false;
    document.getElementById('d').checked = false;
    // Display message (right, wrong)
    if (to_add[0] == '+') {
        document.getElementById("message").classList.add('right');
        document.querySelector('#message').textContent = 'Točno!';
        setTimeout(function() {
            document.getElementById("message").classList.remove('right');
            document.querySelector('#message').textContent = 'Joker';
        }, 2 * 1000); } else {
        document.getElementById("message").classList.add('wrong');
        document.querySelector('#message').textContent = 'Netočno!';
        setTimeout(function() {
            document.getElementById("message").classList.remove('wrong');
            document.querySelector('#message').textContent = 'Joker';
        }, 2 * 1000); };

    
}

function end_game() {
    document.getElementById('question').innerText = 'Igra završena!';
    document.getElementById('A').innerHTML = 'A: ';
    document.getElementById('B').innerHTML = 'B: ';
    document.getElementById('C').innerHTML = 'C: ';
    document.getElementById('D').innerHTML = 'D: ';
    document.getElementById('message').classList.add('hide'); }

function timer(qb, q_number, past_q, first_time, i) {
    var url = '/api/is-started/';
    var data = {
        game_id: getCookie('game_id'),
        game_pin: getCookie('game_pin')
    };
        
    $.post(url, data, function(response, status) {
        if (response == 'True') {
            var q = load_question(qb, q_number, past_q);
            past_q.push(q);

            countdown(first_time);
            setTimeout(function() {
                if (i < q_number) {
                    i++;
                    timer(qb, q_number, past_q, first_time, i);
                } else { end_game(); } }, (first_time + 3) * 1000);

            setTimeout(function() {
                check(qb, q);
            }, (first_time + 1) * 1000);
        } else { end_game(); }
    });
}

function game(qb) {
    var q_number = Math.floor(qb.length / 7);
    var past_q = [];
    var first_time = Number(getCookie('game_time'));
    timer(qb, q_number, past_q, first_time, 1)
    //past_q.push(gaming(qb, q_number, past_q, first_time)); };
}

function wait(qb) {
    setTimeout(function() {
        var url = '/api/is-started/';
        var data = {
            game_id: getCookie('game_id'),
            game_pin: getCookie('game_pin')
        };
        
        $.post(url, data, function(response, status) {
            if (response != 'True') { wait(qb); }
            else { game(qb); }
        });
    }, 1000);
};

window.onload = function() {
    if (getCookie('joker_status') != 'true') { document.getElementById("message").classList.add('hide'); }

    var url = '/api/get-qb/';
    var data = {
        game_id: getCookie('game_id'),
        game_pin: getCookie('game_pin')
    };
    
    $.post(url, data, function(raw_qb, status) {
        wait('Pitanje?/[?=end]/Aa/[?=end]/Bb/[?=end]/Cc/[?=end]/Dd/[?=end]/A/[?=end]/Joker!!/[?=end]/Pitanje2?/[?=end]/Aa2/[?=end]/Bb2/[?=end]/Cc2/[?=end]/Dd2/[?=end]/B/[?=end]/Joker2!!'.split('/[?=end]/'));
    });
};