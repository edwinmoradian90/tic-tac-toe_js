const Player = (name, piece, id) => {
    let score = 0;
    let turn = 0;

    return { name, piece, id, score, turn };
};

const Gameboard = (function(){
    let gameboard = Array(9).fill('');
 
    const initialize = function() {
        const gameboard = 
            document.querySelector('.gameboard');
        Game.current = Game.players[0];
        gameboard.addEventListener('click', (e) => {
            let move = e.target.dataset.space;
            if(e.target.matches('.space')){
                Game.update(move);
            };
        });
    };
    
    const isFull = function(){
        return this.gameboard.includes('');
    }

    const emptySpace = function(move) {
        return this.gameboard[move] == '';
    };

    const addMoveToGameboardArray = function(move, spaceIsEmpty){
        this.gameboard[move] = (spaceIsEmpty) 
            ? Game.current.piece
            : console.log('space not empty');
    };

    return {
        isFull,
        gameboard,
        emptySpace,
        initialize,
        addMoveToGameboardArray,
    };
})();

const Game = (function(){
    let players = [
        Player('', 'x', 1), 
        Player('','o', 2),
    ];
    let current = '';

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
    
    const start = function() {
        Gameboard.initialize();
    };

    const swapPlayer = function() {
        this.current = (this.current.id == 1) 
            ? players[1] 
            : players[0];
    }

    const move = function(move) {
        const spaceIsEmpty = Gameboard.emptySpace(move);
        console.log(spaceIsEmpty)
        Gameboard.addMoveToGameboardArray(move, spaceIsEmpty);
        View.addMoveToGameboard(move, spaceIsEmpty);
    }

    const _draw = function() {
        
    }

    const endGame = function() {
        
    }

    const update = function(move) {
        const boardIsFull = Gameboard.isFull();
        if(boardIsFull){
            this._draw();
        } 
        else {
            this.move(move);
            this.current.turn += 1;
            console.log(this.current.turn)
            this.swapPlayer();
        };
    }

    return {
        start,
        players,
        current,
        swapPlayer,
        move,
        update,
    };
})();

const View = (function(){

    const addMoveToGameboard = function(move, spaceIsEmpty){
        if(spaceIsEmpty){
            const space = 
                document.querySelector( `[data-space='${move}']` );
            const piece = Game.current.piece;
            space.appendChild(document.createTextNode(piece));
        };
    };

    return {
        addMoveToGameboard
    };
})();

Game.start();
console.log(Game.current)