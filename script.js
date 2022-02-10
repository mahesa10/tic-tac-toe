const gameBoard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = (num) => _board[num];
  const setBoard = (value, num) => {
    _board[num] = value;
  }
  return {getBoard, setBoard}
})();

const Player = ((name, sign) => {
  return {name, sign}
});

const gameController = (() => {
  const playerOne = Player("Player 1", "X");
  const playerTwo = Player("Player 2", "O");
  let playerTurn = playerOne;
  let isDone = false;
  let winner = null;

  const changeTurn = () => {
    playerTurn = playerTurn == playerOne ? playerTwo : playerOne;
  }

  const getPlayerTurn = () => playerTurn;

  const checkRow = (sign) => {
    let rowCondition = 
    [
      [gameBoard.getBoard(0), gameBoard.getBoard(1), gameBoard.getBoard(2)],
      [gameBoard.getBoard(3), gameBoard.getBoard(4), gameBoard.getBoard(5)],
      [gameBoard.getBoard(6), gameBoard.getBoard(7), gameBoard.getBoard(8)]
    ];
    let checkValue = rowCondition.map(arr => arr.every(el => el === sign));
    return checkValue.some(el => el == true);
  }

  const checkColumn = (sign) => {
    let columnCondition = 
    [
      [gameBoard.getBoard(0), gameBoard.getBoard(3), gameBoard.getBoard(6)],
      [gameBoard.getBoard(1), gameBoard.getBoard(4), gameBoard.getBoard(7)],
      [gameBoard.getBoard(2), gameBoard.getBoard(5), gameBoard.getBoard(8)]
    ];
    let checkValue = columnCondition.map(arr => arr.every(el => el === sign));
    return checkValue.some(el => el == true); 
  }

  const checkDiagonal = (sign) => {
    let diagonalCondition = 
    [
      [gameBoard.getBoard(0), gameBoard.getBoard(4), gameBoard.getBoard(8)],
      [gameBoard.getBoard(2), gameBoard.getBoard(4), gameBoard.getBoard(6)]
    ];
    let checkValue = diagonalCondition.map(arr => arr.every(el => el === sign));
    return checkValue.some(el => el == true); 
  }

  const checkForWin = () => {
    if (checkRow(playerOne.sign) || checkColumn(playerOne.sign) || checkDiagonal(playerOne.sign)) {
      winner = playerOne;
      isDone = true;
      return true;
    } else if (checkRow(playerTwo.sign) || checkColumn(playerTwo.sign) || checkDiagonal(playerTwo.sign)) {
      winner = playerTwo;
      isDone = true;
      return true;
    }
    return false;
  }

  const checkForDraw = () => {
    if (checkForWin()) {
      return false;
    }
    
    for (let i = 0; i < 9; i++) {
      if (gameBoard.getBoard(i) == ""){
        return false;
      }
    }

    isDone = true;

    return true;
  }

  const getWinner = () => winner;

  const getIsDone = () => isDone;

  const restartGame = () => {
    for (let i = 0; i < 9; i++) {
      gameBoard.setBoard("", i)
    }
    playerTurn = playerOne;
    isDone = false;
    winner = null;
  }

  return {
    getPlayerTurn,
    changeTurn,
    checkForWin,
    checkForDraw,
    getIsDone,
    getWinner,
    restartGame
  }
})();

const displayController = (() => {

  const squares = document.querySelectorAll(".square");
  const winnerDisplay = document.querySelector(".winner");
  const resetBtn = document.querySelector(".btn-restart")

  squares.forEach((square, index) => {
    square.addEventListener("click", (e) => {
      if (e.target.textContent !== "" || gameController.getIsDone() === true) return;
      let playerSign = gameController.getPlayerTurn().sign;
      e.target.textContent = playerSign;
      gameBoard.setBoard(playerSign, index);
      gameController.changeTurn();
      gameController.checkForWin();
      gameController.checkForDraw();
      displayWinner();
    })
  })

  const displayWinner = () => {
    if (gameController.checkForWin()) {
      let winnerName = gameController.getWinner().name;
      winnerDisplay.textContent = `${winnerName} wins!`;
    } else if (gameController.checkForDraw()) {
      winnerDisplay.textContent = "It's a draw!";
    }
  }

  resetBtn.addEventListener("click", () => {
    gameController.restartGame();
    winnerDisplay.textContent = "";
    squares.forEach(square => square.textContent = "");
  })
})();