'''
1 = Nova igra
2 = Pridruži se
3 = Promijeni broj bodova
4 = Lista svih igrača i njihovih bodova poredano od onog s vie do onog s manje bodova
5 = Započni igru
![?=0] = Kraj streama paketa
'''
# 0 = OK
# -0 = NEPOZNATA GREŠKA
'''
-1 = Pogrešan ID igre
-2 = Pogrešan PIN
-3 = Pogrešan ID igrača
-4 = Timeout
'''

from flask import Flask, render_template, request
from datetime import datetime
import os, random, shutil

host = '0.0.0.0'
port = 8000
static = 'www'
qbs_dir = 'qb' # Question bases directory inside templates
debug = False

game_pinmin = 1000; game_pinmax = 9999
gamer_pinmin = 100000; gamer_pinmax = 999999


game_name = []
game_pin = []
game_time = []
game_jokerstatus = []
game_status = []
game_creationtime = []
public_games = []
deleted_games = []

gamers = []
gamer_pin = []
gamer_score = []


def tim():
    da = str(datetime.now()).split()[0]; ti = str(datetime.now()).split()[1].split('.')[0]
    d = da.split('-'); t = ti.split(':')
    v = int(d[0]) * 365 * 30 * 24 * 60 * 60 + int(d[1]) * 30 * 24 * 60 * 60 + int(d[2]) * 24 * 60 * 60 + int(t[0]) * 60 * 60 + int(t[1]) * 60 + int(t[2])
    return v

folder = 'templates/' + qbs_dir + '/'
for filename in os.listdir(folder):
    file_path = os.path.join(folder, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (file_path, e))

app = Flask(__name__, static_url_path='', static_folder =  static)

UPLOAD_FOLDER = 'templates/' + qbs_dir
ALLOWED_EXTENSIONS = {'qb'}
MAX_CONTENT_PATH = 512 * 1024 # Max upload size (bytes)

@app.route('/')
def index(): return render_template('index.html')

@app.route('/api/new-game/', methods = ['POST'])
def new_game():
    global game_name; global game_pin; global game_time; global game_jokerstatus; global game_status; global game_creationtime; global deleted_games
    global gamers; global gamer_pin; global gamer_score; global public_games
    for i in range(len(game_creationtime)):
        if tim() - game_creationtime[i] > 30 and str(i) not in public_games and i not in deleted_games:
            deleted_games.append(i)
            if str(i) in public_games: public_games.remove(str(i))
    if len(deleted_games) > 0:
        game_name[deleted_games[0]] = request.form['game_name']; id = str(deleted_games[0])
        pin = str(random.randint(game_pinmin, game_pinmax)); game_pin[deleted_games[0]] = pin
        game_time[deleted_games[0]] = request.form['game_time']
        game_status[deleted_games[0]] = False
        game_jokerstatus[deleted_games[0]] = request.form['joker_enabled']
        game_creationtime[deleted_games[0]] = tim()
        gamers[deleted_games[0]] = []
        gamer_pin[deleted_games[0]] = []
        gamer_score[deleted_games[0]] = []
        deleted_games.pop(0)
        print(game_pin)
    else:
        game_name.append(request.form['game_name']); id = str(len(game_name) - 1)
        pin = str(random.randint(game_pinmin, game_pinmax)); game_pin.append(pin)
        game_time.append(request.form['game_time'])
        game_status.append(False)
        game_jokerstatus.append(request.form['joker_enabled'])
        game_creationtime.append(tim())
        gamers.append([])
        gamer_pin.append([])
        gamer_score.append([])
    return id + '|' + pin
@app.route('/api/new-qb/<id>/<name>/', methods = ['POST'])
def new_qb(id, name):
    try:
        if name == game_pin[int(id)]:
            f = request.files['qb']
            f.save('templates/' + qbs_dir + '/' + id + '.qb')
            return ''
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/make-public/', methods = ['POST'])
def make_public():
    global game_pin; global public_games
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            public_games.append(request.form['game_id'])
            game_pin[int(request.form['game_id'])] = '0000'
            return ''
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/get-gamers/', methods = ['POST'])
def get_gamers():
    global game_creationtime
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            game_creationtime[int(request.form['game_id'])] = tim()
            to_return = ''
            for i in gamers[int(request.form['game_id'])]: to_return += i + '/[?=end]/'
            return to_return
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/change-status/', methods = ['POST'])
def change_status():
    global game_status; global deleted_games; global public_games
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            if game_status[int(request.form['game_id'])]:
                deleted_games.append(int(request.form['game_id']))
                if request.form['game_id'] in public_games: public_games.remove(request.form['game_id'])
            game_status[int(request.form['game_id'])] = not(game_status[int(request.form['game_id'])])
            return '0'
        else:
            return '-2'
    except:
        return '-1'

@app.route('/api/join/', methods = ['POST'])
def join():
    global gamers; global gamer_pin; global gamer_score
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            g_id = int(request.form['game_id'])
            gamers[g_id].append(request.form['gamer_name'])
            g_pin = str(random.randint(gamer_pinmin, gamer_pinmax)); gamer_pin[g_id].append(g_pin)
            gamer_score[g_id].append(0)
            return str(len(gamers[g_id]) - 1) + '|' + g_pin + '|' + game_name[g_id] + '|' + game_time[g_id] + '|' + game_jokerstatus[g_id]
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/get-qb/', methods = ['POST'])
def get_qb():
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            return render_template('qb/' + request.form['game_id'] + '.qb')
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/is-started/', methods = ['POST'])
def is_started():
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            return str(game_status[int(request.form['game_id'])])
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/update-score/<operation>/', methods = ['POST'])
def update_score(operation):
    global gamer_score
    try:
        if request.form['gamer_pin'] == gamer_pin[int(request.form['game_id'])][int(request.form['gamer_id'])] and request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            if operation == '+':
                gamer_score[int(request.form['game_id'])][int(request.form['gamer_id'])] += 1
            elif operation == '++':
                gamer_score[int(request.form['game_id'])][int(request.form['gamer_id'])] += 2
            elif operation == '--':
                gamer_score[int(request.form['game_id'])][int(request.form['gamer_id'])] -= 2
            elif operation == '-':
                gamer_score[int(request.form['game_id'])][int(request.form['gamer_id'])] -= 1
            return str(gamer_score[int(request.form['game_id'])][int(request.form['gamer_id'])])
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/rating/<mode>/', methods = ['POST'])
def rating(mode):
    global game_creationtime
    try:
        if request.form['game_pin'] == game_pin[int(request.form['game_id'])]:
            tmp_bodovi = []
            for i in range(len(gamers[int(request.form['game_id'])])):
                tmp_bodovi.append((i, gamer_score[int(request.form['game_id'])][i], gamers[int(request.form['game_id'])][i]))
            tmp_bodovi.sort(key = lambda x: x[1],reverse = True)

            if mode == 'place':
                if request.form['gamer_pin'] == gamer_pin[int(request.form['game_id'])][int(request.form['gamer_id'])]:
                    for i in range(len(tmp_bodovi)):
                        if str(tmp_bodovi[i][0]) == request.form['gamer_id']:
                            return str(i + 1)
                    else:
                        return '-3' # Cannot find
                else:
                    return '-2'

            elif mode == 'full':
                game_creationtime[int(request.form['game_id'])] = tim()
                to_return_names = ''
                to_return_scores = ''
                for i in tmp_bodovi:
                    to_return_scores += str(i[1]) + '/[?=end]/'
                    to_return_names += i[2] + '/[?=end]/'
                return to_return_names + '/[?=scores]/' + to_return_scores
        else:
            return '-2'
    except:
        return '-1'
@app.route('/api/get-public-games/', methods = ['POST'])
def get_public_games():
    to_return_ids = ''
    to_return_names = ''
    for i in public_games:
        to_return_ids += i + '/[?=end]/'
        to_return_names += game_name[int(i)] + '/[?=end]/'
    return  to_return_ids + '/[?=names]/' + to_return_names

if __name__ == "__main__":
    app.run(host = host, port = port, debug = debug)
