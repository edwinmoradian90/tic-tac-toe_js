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
    
    let players = [
        Player('', 'x', 1), 
        Player('','o', 2),
    ];

    let currentPlayer = '';

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
        Game.currentPlayer = (Game.currentPlayer.id == 1) 
            ? Game.players[1] 
            : Game.players[0];
    }

    const _winCondition = function() {
        const arrayMatching = Gameboard.indexArray(Game.currentPlayer.piece),
            matched = _winningMoves.map(array => array
                .filter(array => arrayMatching.includes(array)))
                .filter(array => array.length === 3),
        
            result = matched.length > 0
            ? true 
            : false;
        
        return result;
    }

    const _draw = function() {
        const text = 'The game is a draw.',
            gameResults = document.querySelector('.game_results'),
            outcomeDraw = document.createTextNode(text);

        gameResults.appendChild(outcomeDraw);
    }

    const _endGame = function() {
        console.log(this)
        const text = `${Game.currentPlayer.name} is the winner.`,
            gameResults = document.querySelector('.game_results'),
            outcomeWin  = document.createTextNode(text);

        gameResults.appendChild(outcomeWin);
        View.setEndGameView();
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
        else 
        {
            this.currentPlayer.turn += 1;
            swapPlayer();
        };
    }

    const reset = function() {
        View.reset();
        Gameboard.reset();
        this.currentPlayer = this.players[0]
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
        reset,
        initialize,
    };
})();

/*
            ===========
            View Module
            ===========
*/

const View = (function() {

    const startButton   = document.querySelector('.start_button'),
        rematchButton   = document.querySelector('.rematch_button'),
        gameboardView   = document.querySelector('.gameboard'),
        scoreboardView  = document.querySelector('.scoreboard'),
        gameResultsView = document.querySelector('.game_results'),
        playerFormView  = document.querySelector('.player_form'),
        playerOneShow   = document.querySelector('.player_one'),
        playerTwoShow   = document.querySelector('.player_two');

    const getPlayerNames = function() {
        const playerOneName = document.querySelector('.player_one_input').value;
        const playerTwoName = document.querySelector('.player_two_input').value;
        return [playerOneName, playerTwoName];
    }

    const _clearBoard = function() {
        const spaces = document.querySelectorAll('.space');
        spaces.forEach(space => {
            space.innerHTML = '';
        });
    }

    const _clearResults = function() {
        gameResultsView.innerHTML = '';
    }

    const displayPlayerNames = function() {
        const playerOneName = document.querySelector('.player_one_input').value,
            playerTwoName = document.querySelector('.player_two_input').value,
            nameOne = document.createTextNode(`Player 1: ${playerOneName}`),
            nameTwo = document.createTextNode(`Player 2: ${playerTwoName}`);

        playerOneShow.appendChild(nameOne);
        playerTwoShow.appendChild(nameTwo);
    }

    const addMoveToGameboard = function(move, spaceIsEmpty) {
        if(spaceIsEmpty){
            const space = document.querySelector( `[data-space='${move}']` ),                
                piece = Game.currentPlayer.piece;

            space.appendChild(document.createTextNode(piece));
        };
    };

    const initializeView = function() {
        playerFormView.style.display  = 'inline';
        startButton.style.display     = 'inline';
        gameboardView.style.display   = 'none';
        scoreboardView.style.display  = 'none';
        rematchButton.style.display   = 'none';
        gameResultsView.style.display = 'none';
        playerFormView.reset();
        _setViewInteraction();
    };

    const setGameView = function() {
        playerFormView.style.display  = 'none';
        rematchButton.style.display   = 'none';
        gameResultsView.style.display = 'none';
        gameboardView.style.display   = 'grid';
        scoreboardView.style.display  = 'block';

    };

    const setEndGameView = function() {
        gameboardView.style.display   = 'none';
        scoreboardView.style.display  = 'none';
        rematchButton.style.display   = 'inline';
        gameResultsView.style.display = 'block';
        playerFormView.reset();
    }

    const reset = function() {
        _clearBoard();
        _clearResults();
        setGameView();
    }

    const _setViewInteraction = function() {
        document.addEventListener('click', (e) => {
            let move = e.target.dataset.space;
            if(e.target.matches('.start_button')) {
                e.preventDefault();
                Game.start();
            } else 
            if(e.target.matches('.space')){
                e.preventDefault();
                Game.update(move);
            } else 
            if(e.target.matches('.rematch_button')){
                Game.reset();
                Gameboard.reset();
                reset();
            } 
        });
    }

    return {
        getPlayerNames,
        displayPlayerNames,
        addMoveToGameboard,
        initializeView,
        setGameView,
        reset,
        setEndGameView,
    };
})();

/*
            ================
            Game initializer
            ================
*/

Game.initialize();