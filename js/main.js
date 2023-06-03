const player = (name, points, wins) => {
    return {name, points, wins};
};

const displayController = (() => {
    let counter = 0;
    const gameCells = document.querySelectorAll('.gameCell');
    const drawChoice = (e) => {
        let index = e.target.dataset;
        let choice = document.createElement('div');
        if (e.target.textContent !== '') return;
        if(counter % 2){
            choice.textContent = 'O'
            gameBoard.gameArray[index.cellnumber] = -1;
        } else {
            choice.textContent = 'X'
            gameBoard.gameArray[index.cellnumber] = 1;
        }
        e.target.appendChild(choice);
        counter++
    };
    gameCells.forEach(x => x.addEventListener('click', drawChoice))
})();

const gameBoard = (() => {
    const gameArray = [0,1,2,3,4,5,6,7,8];
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
                return gameArray[a]; // Return the winning player symbol (1 for 'X' or -1 for 'O')
            }
        }
        return null; // If there is no winner
    }
    return {
        gameArray,
        checkWinner
    };
})();
