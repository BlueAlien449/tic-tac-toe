const Player = (name, wins, symbol, reset) => {
    return {name, wins, symbol};
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

        firstPlayer = Player(playerOneInput.value, 0, 'x'); // Create player objects with the value of the name fields
        secondPlayer = Player(playerTwoInput.value, 0, 'o');
        gameSection.style.display = 'block';
        gameConfig.style.display = 'none';
        displayController.p1Points.classList.add('active');
        displayController.playerTurn.textContent = `${firstPlayer.name}'s turn`;
        displayController.scoreBoard.append(displayController.playerTurn);
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
    gameSection,
    gameConfig
    };
})();

const displayController = (() => {
    let gameMoves = 0;
    const xSvg = '<svg viewBox="0 0 128 128"><path class="svgImg xSvg" d="M16,16L112,112"></path><path class="svgImg xSvg" d="M112,16L16,112"></path></svg>';
    const oSvg = '<svg viewBox="0 0 128 128"><path class="svgImg oSvg" d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"></path></svg>';
    const gameCells = document.querySelectorAll('.gameCell');
    const p1Points = document.querySelector('.p1Points');
    const p2Points = document.querySelector('.p2Points');
    const scoreBoard = document.querySelector('.scoreBoard');
    const playerTurn = document.createElement('div');
    playerTurn.classList.add('playerTurn');

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
            p2Points.classList.remove('active');
            p1Points.classList.add('active');
            playerTurn.textContent = `${playerCreation.firstPlayer.name}'s turn`
            gameBoard.gameArray[index.cellnumber] = -1; // Change element in array with the number representing each symbol
        } else {

            p1Points.classList.remove('active');
            p2Points.classList.add('active');
            playerTurn.textContent = `${playerCreation.secondPlayer.name}'s turn`
            choice.innerHTML = xSvg;
            gameBoard.gameArray[index.cellnumber] = 1;
        }
        
        e.target.appendChild(choice);
        scoreBoard.append(playerTurn);
        gameMoves++;
        gameBoard.checkWinner();
    };

    gameCells.forEach(x => x.addEventListener('click', drawChoice));

    return{
        oSvg,
        xSvg,
        gameCells,
        p1Points,
        p2Points,
        playerTurn,
        scoreBoard,
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
    const clearButton = document.querySelector('.restartButton');
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
                    displayWinner(playerCreation.firstPlayer);
                } else if(gameArray[a] === -1){
                    playerCreation.secondPlayer.wins++;
                    drawScoreBoard();
                    displayWinner(playerCreation.secondPlayer);
                }
                return gameArray[a]; // Return the winning player symbol (1 for 'X' or -1 for 'O')
            }
        }
        if (displayController.gameMoves === 9) { // Check if it's a tie
            tieResult = true;
            displayWinner("IT'S A TIE!");
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
        const winnerSymbol = document.createElement('div');
        const tieSymbol = document.createElement('div');
        tieSymbol.classList.add('tieSymbol');
        winnerSymbol.classList.add('winnerSymbol');
        gameWinner.classList.add('gameWinner');

        if (tieResult){
            tieSymbol.innerHTML = displayController.xSvg + displayController.oSvg;
            gameWinner.textContent = winner;
            winnerSymbol.append(tieSymbol);
        } else {
            if (winner.symbol === 'x'){
                winnerSymbol.innerHTML = displayController.xSvg;
            } else if (winner.symbol === 'o'){
                winnerSymbol.innerHTML = displayController.oSvg;
            }
            gameWinner.textContent = `${winner.name.toUpperCase()} WINS!`;

        };
        displayController.playerTurn.textContent = '';
        gameWinnerContainer.append(winnerSymbol);
        winnerSymbol.append(gameWinner);
        displayController.gameCells.forEach(x => x.style.display = 'none')
    };

    const restartRound = () => {
        arrayCounter = 10;
        tieResult = undefined;
        displayController.gameMoves = 0;
        displayController.gameCells.forEach(x => x.textContent = '');
        if(gameWinnerContainer.hasChildNodes()){
            gameWinnerContainer.removeChild(gameWinnerContainer.firstChild);
        };
        for (let i = 0; i < gameArray.length; i++){
            gameArray[i] = arrayCounter++;
        };
        displayController.gameCells.forEach(x => x.style.display = 'grid');
        displayController.playerTurn.textContent = `${playerCreation.firstPlayer.name}'s turn`;
        displayController.p1Points.classList.add('active');
        displayController.p2Points.classList.remove('active');
    };

    gameWinnerContainer.addEventListener('click', restartRound);

    const clearGame = () => {
        restartRound();
        xPoints.textContent = '-';
        oPoints.textContent = '-';
        playerCreation.gameSection.style.display = 'none';
        playerCreation.gameConfig.style.display = 'block';
    };

    clearButton.addEventListener('click', clearGame);

    return {
        gameWinnerContainer,
        gameArray,
        checkWinner,
        get tieResult() {
            return tieResult;
        },
        get winnerId() {
            return winnerId;
        }
    };
})();
