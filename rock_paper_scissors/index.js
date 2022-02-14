const express = require('express');
const os = require('os')
const cors = require('cors');
const serverApp = express();
const PORT = 5050;
const IPaddress = os.networkInterfaces().en0[1].address;
//const IPaddress = 'localhost';
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
let players = [{
    name: 'John',
    move: 'Rock'
}, {
    name: 'Cris',
    move: 'Paper'
}]; // {name: ‘’, move: ‘’}

//---------------------------- Endpoints
/*
GET /player
GET /display
GET /moves
POST /player
PUT /make-a-move
*/

serverApp.get('/moves', (request, response) => {
    response.send(players);
});

serverApp.post('/player', (request, response) => {

    addPlayer(request.body) ? response.send({
        msn: `Player added: ${request.body.name}`
    }) : response.send({
        msn: `Player ${request.body.name} already exist`
    });
    console.log(players);
});

serverApp.put('/make-a-move', (request, response) => {

    upDatePlayerMove(request.body) ? response.send({
        msn: `Move updated for ${request.body.name}`
    }) : response.send({
        msn: `No move updated, ${request.body.name} does not exist`
    });

    console.log(players);
});

//---------------------------------------------- Midlewares

const doesPlayerExists = newPlayer => {
    return players.some(player => player.name == newPlayer.name);
};

const addPlayer = newPlayer => {
    if (players.length === 0) {
        players.push(newPlayer);
        return true;
    } else {
        if (!doesPlayerExists(newPlayer)) {
            players.push(newPlayer);
            return true;
        } else {
            return false;
        }
    }
};

const findPlayer = wantedPlayer => {
    return players.find(player => player.name == wantedPlayer.name);
};

const upDatePlayerMove = targetPlayer => {
    if (doesPlayerExists(targetPlayer)) {
        let playerFound = findPlayer(targetPlayer);
        playerFound.move = targetPlayer.move;
        let index = players.findIndex(player => player.name == playerFound.name);
        players.splice(index, 1, playerFound);
        return true;
    } else {
        return false;
    }
}