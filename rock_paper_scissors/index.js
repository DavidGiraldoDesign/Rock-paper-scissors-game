const express = require('express');
const os = require('os')
const cors = require('cors');
const serverApp = express();
const PORT = 5050;
//const IPaddress = os.networkInterfaces().en0[1].address;
const IPaddress = 'localhost';
const path = require('path');

//---------------------------- "use" external midleware
serverApp.use(express.json());
serverApp.use(cors({
    origin: '*'
}));
serverApp.use('/player', express.static('public-player'));
serverApp.use('/display', express.static('public-display'));

//---------------------------- Server listening
serverApp.listen(PORT, (error) => {
    console.log(`http://${IPaddress}:${PORT}`);
});

//---------------------------- Data base
let players = [
    //{
     //   name: 'David',
       // move: ''
   // },
    //{player: 'S', move: 'P'},
]; // {player: ‘0’, move: ‘’}
console.log(players.length);


//---------------------------- Endpoints
/*
GET /game
GET /display
GET /moves
POST /player
PUT /make-a-move
*/
/*serverApp.get('/game', (request, response) => {
    response.send({
        msn: 'okay'
    })
});

serverApp.get('/display', (request, response) => {
    response.send({
        msn: 'okay'
    })
});*/

serverApp.get('/moves', (request, response) => {
    response.send(players);
});

serverApp.post('/player', (request, response) => {
    let isNew = updatePlayers({
        name: request.body.name,
        move: request.body.move
    });

    if (!isNew) {
        response.send({
            msn: 'Not okay, we already have it'
        });
    } else {
        response.send({
            msn: 'okay, new player added'
        });
    }
    console.log(players);
});

serverApp.put('/make-a-move', (request, response) => {
    //console.log(request.body);
    if (updateMoves({
            name: request.body.name,
            move: request.body.move
        }) == true) {
        response.send({
            msn: 'okay, you make this move: ' + request.body
        });
    } else {
        response.send({
            msn: 'not okay, player does not exits'
        });
    }
    console.log(players);
});

//---------------------------------------------- Midlewares
function updatePlayers(newPlayer) {
    if (players.length == 0) {
        players.push(newPlayer);
    } else {
        for (let i = 0; i < players.length; i++) {
            if (newPlayer.name == players[i].name) {
                return false
            }
        }
        players.push(newPlayer);
        return true;
    }
}

function updateMoves(player) {
    if (players.length > 0) {
        for (let i = 0; i < players.length; i++) {
            if (player.name == players[i].name) {
                //If we have them, update their move 
                players[i].move = player.move;
                console.log('Move updated');
                return true;
            }
        }
        //else, say that it does not exist
        console.log('Player does not exit');
        return false;
    } else {
        console.log('We do not have player yet');
    }
}