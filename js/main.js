const Player = (name, wins) => {
    return {name, wins};
};

const playerCreation = (() => {
    const gameSection = document.querySelector('.gameSection');
    const gameConfig = document.querySelector('.gameConfig');
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
        gameSection.style.display = 'block'
        gameConfig.style.display = 'none'

        e.preventDefault();
    };

    startButton.addEventListener('click', createPlayer);

    return{
    get firstPlayer() {
        return firstPlayer;
    },
    get secondPlayer() {
        return secondPlayer;
    }
    };
})();

const displayController = (() => {
    let gameMoves = 0;
    const xSvg = '<svg viewBox="0 0 128 128"><path class="svgImg xSvg" d="M16,16L112,112"></path><path class="svgImg xSvg" d="M112,16L16,112"></path></svg>';
    const oSvg = '<svg viewBox="0 0 128 128"><path class="svgImg oSvg" d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"></path></svg>';
    const gameCells = document.querySelectorAll('.gameCell');

    const drawChoice = (e) => {
        if (gameBoard.gameWinnerContainer.hasChildNodes()) return;
        if (playerCreation.firstPlayer === undefined || playerCreation.secondPlayer === undefined){
            alert('Input the players names!');
            return;
        }

        let index = e.target.dataset;
        let choice = document.createElement('div');
        if (e.target.innerHTML !== '') return; // If the clicked cell is not empty

        if(gameMoves % 2){ // Check if the counter is even or odd as it's a turn-based game mode
            choice.innerHTML = oSvg;
            gameBoard.gameArray[index.cellnumber] = -1; // Change element in array with the number representing each symbol
        } else {
            choice.innerHTML = xSvg;
            gameBoard.gameArray[index.cellnumber] = 1;
        }
        
        e.target.appendChild(choice);
        gameMoves++;
        gameBoard.checkWinner();
    };

    gameCells.forEach(x => x.addEventListener('click', drawChoice));

    return{
        gameCells,
        get gameMoves() {
            return gameMoves;
          },
          set gameMoves(value) {
            gameMoves = value;
          }
    };
})();

const gameBoard = (() => {
    let tieResult;
    const gameWinnerContainer = document.querySelector('.gameWinnerContainer');
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
                    playerCreation.firstPlayer.wins++;
                    drawScoreBoard();
                    displayWinner(playerCreation.firstPlayer.name);
                } else if(gameArray[a] === -1){
                    playerCreation.secondPlayer.wins++;
                    drawScoreBoard();
                    displayWinner(playerCreation.secondPlayer.name);
                }
                return gameArray[a]; // Return the winning player symbol (1 for 'X' or -1 for 'O')
            }
        }
        if (displayController.gameMoves === 9) { // Check if it's a tie
            tieResult = true;
            displayWinner("It's a tie!");
          }
    };

    const drawScoreBoard = () => {
        if (playerCreation.firstPlayer.wins === 0){
            xPoints.textContent = '-';
        } else xPoints.textContent = playerCreation.firstPlayer.wins;
        if (playerCreation.secondPlayer.wins === 0){
            oPoints.textContent = '-';
        } else oPoints.textContent = playerCreation.secondPlayer.wins;
    };

    const displayWinner = (winner) => {
        const gameWinner = document.createElement('div');
        gameWinner.classList.add('gameWinner');
        if (tieResult){
            gameWinner.textContent = winner;
        } else {
            gameWinner.textContent = `${winner} Winner!`;
        }
        gameWinnerContainer.append(gameWinner);
    };

    const restartRound = () => {
        arrayCounter = 10;
        tieResult = undefined;
        displayController.gameMoves = 0;
        displayController.gameCells.forEach(x => x.textContent = '');
        gameWinnerContainer.removeChild(gameWinnerContainer.firstChild);
        for (let i = 0; i < gameArray.length; i++){
            gameArray[i] = arrayCounter++;
        }
    }

    gameWinnerContainer.addEventListener('click', restartRound);

    return {
        gameWinnerContainer,
        gameArray,
        checkWinner,
        get tieResult() {
            return tieResult;
        }
    };
})();
