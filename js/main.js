const player = (name, points, wins) => {
    return {name, points, wins};
};

const gameBoard = (() => {
    const gameArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    return {
        gameArray
    };
})();