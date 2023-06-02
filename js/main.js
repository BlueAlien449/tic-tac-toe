const player = (name, points, wins) => {
    return {name, points, wins};
};

const displayController = (() => {
    let counter = 0;
    const gameCells = document.querySelectorAll('.gameCell');
    const drawChoice = (e) => {
        let choice = document.createElement('div');
        if (e.target.textContent !== '') return;
        if(counter % 2){
            choice.textContent = 'O'
        } else choice.textContent = 'X'
        e.target.appendChild(choice);
        counter++
    };
    gameCells.forEach(x => x.addEventListener('click', drawChoice))
})();

const gameBoard = (() => {
    const gameArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    return {
        gameArray
    };
})();