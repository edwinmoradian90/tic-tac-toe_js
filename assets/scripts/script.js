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
                Game.move(move);
                Game.swapPlayer();
            };
        });
    };

    const emptySpace = function(move) {
        return gameboard[move] == '';
    };

    const addMoveToGameboardArray = function(move, isEmpty){
        gameboard[move] = (isEmpty) 
            ? Game.current.piece
            : console.log('space not empty');
    };

    return {
        gameboard,
        emptySpace,
        initialize,
        addMoveToGameboardArray,
    };
})();

const Game = (function(){
    let players = [
        Player('', 'x', '1'), 
        Player('','o','2'),
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
       current = current.id = 1 
       ? players[1] 
       : players[0];
    }

    const move = function(move){
        const isEmpty = Gameboard.emptySpace(move);
        console.log(isEmpty)
        Gameboard.addMoveToGameboardArray(move, isEmpty);
        View.addMoveToGameboard(move, isEmpty);
        swapPlayer();
    }

    return {
        start,
        players,
        current,
        swapPlayer,
        move,
    };
})();

const View = (function(){

    const addMoveToGameboard = function(move, isEmpty){
        if(isEmpty){
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