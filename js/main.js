const Player = (name, wins) => {
    return {name, wins};
};

const playerCreation = (() => {
    const playerOneInput = document.querySelector('#playerOne');
    const playerTwoInput = document.querySelector('#playerTwo');
    const startButton = document.querySelector('.startGame');
    let firstPlayer;
    let secondPlayer;
    const createPlayer = (e) => {
        if(playerOneInput.value === "" && playerTwoInput.value === "") { // Form validation. Can't leave the fields empty
            alert('Input the players names!');
            return;
        }

        firstPlayer = Player(playerOneInput.value, 0); // Create player objects with the value of the name fields
        secondPlayer = Player(playerTwoInput.value, 0);

        e.preventDefault();
    };

    startButton.addEventListener('click', createPlayer);

    return{
    get firstPlayer() {
        return firstPlayer;
    },
    get secondPlayer() {
        return secondPlayer;
    },
    createPlayer
    };
})();

const displayController = (() => {
    let gameMoves = 0;
    const gameCells = document.querySelectorAll('.gameCell');

    const drawChoice = (e) => {
        if (playerCreation.firstPlayer === undefined || playerCreation.secondPlayer === undefined){
            alert('Input the players names!');
            return;
        }
        
        let index = e.target.dataset;
        let choice = document.createElement('div');
        if (e.target.textContent !== '') return; // If the clicked cell is not empty

        if(gameMoves % 2){ // Check if the counter is even or odd as it's a turn-based game mode
            choice.textContent = 'O'
            gameBoard.gameArray[index.cellnumber] = -1; // Change element in array with the number representing each symbol
        } else {
            choice.textContent = 'X'
            gameBoard.gameArray[index.cellnumber] = 1;
        }
        
        gameBoard.checkWinner();
        e.target.appendChild(choice);
        gameMoves++
    };

    gameCells.forEach(x => x.addEventListener('click', drawChoice));

    return{
        gameCells,
        get gameMoves() {
            return gameMoves;
        }
    };
})();

const gameBoard = (() => {
    let tieResult;
    const xPoints = document.querySelector('.xPoints');
    const oPoints = document.querySelector('.oPoints');
    const gameArray = [10,11,12,13,14,15,16,17,18];
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8],
    ];

    const checkWinner = () => {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gameArray[a] && gameArray[a] === gameArray[b] && gameArray[a] === gameArray[c]) {
                if(gameArray[a] === 1){
                    playerCreation.firstPlayer.wins = 1
                    drawScoreBoard();
                } else if(gameArray[a] === -1){
                    playerCreation.secondPlayer.wins = 1
                    drawScoreBoard();
                }
                return gameArray[a]; // Return the winning player symbol (1 for 'X' or -1 for 'O')
            }
        }
        displayController.gameMoves === 9 ? tieResult = false : tieResult = true; // Check if it's a tie
    };

    const drawScoreBoard = () => {
        if (playerCreation.firstPlayer.wins === 0){
            xPoints.textContent = '-';
        } else xPoints.textContent = playerCreation.firstPlayer.wins;
        if (playerCreation.secondPlayer.wins === 0){
            oPoints.textContent = '-';
        } else oPoints.textContent = playerCreation.secondPlayer.wins;
    }

    return {
        gameArray,
        checkWinner,
        get tieResult() {
            return tieResult;
        }
    };
})();
