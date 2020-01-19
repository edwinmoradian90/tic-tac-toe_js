/*
            ==============
            Player Factory
            ==============
*/

const Player = (name, piece, id) => {
    let score = 0;
    let turn = 0;

    return { name, piece, id, score, turn };
};

/*
            ================
            Gameboard Module
            ================
*/

const Gameboard = (function(){
    let gameboard = '';

    const isFull = function(){
        return !this.gameboard.includes('');
    }

    const emptySpace = function(move) {
        console.log(this.gameboard)
        return this.gameboard[move] == '';
    };

    const indexArray = function(playerPiece) {
        const indexArray = this.gameboard.map((piece, i) => {
            if(piece == playerPiece) {
                return i;
            } 
        });
        return indexArray;
    }

    const reset = function() {
        this.gameboard = Array(9).fill('');
    }

    const addMoveToGameboardArray = function(move, spaceIsEmpty){
        this.gameboard[move] = (spaceIsEmpty) 
            ? Game.currentPlayer.piece
            : console.log('space not empty');
    };

    const initializeGameboard = function() {
        this.gameboard = Array(9).fill('');
    };
    
    return {
        gameboard,
        isFull,
        emptySpace,
        indexArray,
        reset,
        addMoveToGameboardArray,
        initializeGameboard,
    };
})();

/*
            ===========
            Game Module
            ===========
*/

const Game = (function(){
    
    const players = [
        Player('', 'x', 1), 
        Player('','o', 2),
    ];

    const currentPlayer = '';

    const _winningMoves = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6],
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6],
    ];

    const move = function(move) {
        let spaceIsEmpty = Gameboard.emptySpace(move);
        console.log(spaceIsEmpty, Gameboard.emptySpace(move))
        Gameboard.addMoveToGameboardArray(move, spaceIsEmpty);
        View.addMoveToGameboard(move, spaceIsEmpty);
    }

    const _setPlayerNames = function() {
        const playerNames = View.getPlayerNames();
        players[0].name = playerNames[0] || '';
        players[1].name = playerNames[1] || '';
    }

    const swapPlayer = function() {
        this.currentPlayer = (this.currentPlayer.id == 1) 
            ? players[1] 
            : players[0];
    }

    const _winCondition = function() {
        let arrayMatching = Gameboard.indexArray(Game.currentPlayer.piece);
        let matched = _winningMoves.map(array => array
                .filter(array => arrayMatching.includes(array)))
                .filter(array => array.length === 3);
        
        const result = matched.length > 0
            ? true 
            : false;
        
        return result;
    }

    const _draw = function() {
        const text = 'Gameover! The game is a draw.',
            gameResults = document.querySelector('.game_results'),
            outcomeDraw = document.createTextNode(text);

        gameResults.appendChild(outcomeDraw);
    }

    const _endGame = function() {
        const winner = Game.currentPlayer,
            text = `Gameover! ${winner.name} is the winner.`,
            gameResults = document.querySelector('.game_results'),
            outcomeWin  = document.createTextNode(text);

        gameResults.appendChild(outcomeWin);
    }


    const start = function() {
        View.setGameView();
        _setPlayerNames();
        this.currentPlayer = this.players[0];
        View.displayPlayerNames();
    };  

    const update = function(move) {
        this.move(move);
        if(_winCondition()){
            _endGame();
        }else 
        if(Gameboard.isFull()){
            _draw();
        } 
        else {
            this.currentPlayer.turn += 1;
            this.swapPlayer();
        };
    }

    const initialize = function() {
        View.initializeView();
        Gameboard.initializeGameboard();
    }

    return {
        start,
        players,
        currentPlayer,
        swapPlayer,
        move,
        update,
        initialize,
    };
})();

/*
            ===========
            View Module
            ===========
*/

const View = (function() {

    const startButton  = document.querySelector('.start_button'),
        rematchButton  = document.querySelector('.rematch'),
        gameboardView  = document.querySelector('.gameboard'),
        playerFormView = document.querySelector('.player_form'),
        scoreboardView = document.querySelector('.scoreboard'),
        playerOneInput = document.querySelector('.player_one_input'),
        playerTwoInput = document.querySelector('.player_two_input'),
        playerOneShow  = document.querySelector('.player_one'),
        playerTwoShow  = document.querySelector('.player_two'),
        playerOneName  = playerOneInput.value,
        playerTwoName  = playerTwoInput.value;

    const getPlayerNames = function() {
        return [playerOneName, playerTwoName];
    }

    const displayPlayerNames = function() {
        const nameOne = document.createTextNode(`Player 1: ${playerOneName}`);
        const nameTwo = document.createTextNode(`Player 2: ${playerTwoName}`);
        playerOneShow.appendChild(nameOne);
        playerTwoShow.appendChild(nameTwo);
    }

    const addMoveToGameboard = function(move, spaceIsEmpty) {
        if(spaceIsEmpty){
            const space = document.querySelector( `[data-space='${move}']` ),                
                piece = Game.currentPlayer.piece;
            console.log(Game.currentPlayer)

            space.appendChild(document.createTextNode(piece));
        };
    };

    const _setViewInteraction = function() {
        document.addEventListener('click', (e) => {
            let move = e.target.dataset.space;
            if(e.target.matches('.start_button')) {
                e.preventDefault();
                Game.start();
            } else if(e.target.matches('.space')){
                e.preventDefault();
                Game.update(move);
            };
        });
    }

    const initializeView = function() {
        playerFormView.style.display ='inline';
        startButton.style.display = 'inline';
        gameboardView.style.display = 'none';
        scoreboardView.style.display = 'none';
        _setViewInteraction();
    };

    const setGameView = function() {
        playerFormView.style.display ='none';
        gameboardView.style.display = 'grid';
        scoreboardView.style.display = 'block';
    };

    return {
        getPlayerNames,
        displayPlayerNames,
        addMoveToGameboard,
        initializeView,
        setGameView,
    };
})();

/*
            ================
            Game initializer
            ================
*/

Game.initialize();