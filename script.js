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
  let playerOne = Player("Player 1", "X");
  let playerTwo = Player("Player 2", "O");
  let playerTurn = playerOne;
  let isDone = false;
  let winner = null;

  const createPlayer = (name1, name2) => {
    playerOne = Player(name1, "X");
    playerTwo = Player(name2, "O");
    playerTurn = playerOne;
  }

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
    createPlayer,
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

  const startBtn = document.querySelector(".btn-start");
  const beforeGameDisplay = document.querySelector(".before-game");
  const editNameBtn = document.querySelector(".btn-edit-name");
  const editNameModal = document.querySelector(".edit-name-modal");
  const editNameForm = document.querySelector(".edit-name-form");
  const playerOneDisplay = document.querySelector(".player-one-display");
  const playerTwoDisplay = document.querySelector(".player-two-display");
  const gameDisplay = document.querySelector(".game-container");
  const squares = document.querySelectorAll(".square");
  const infoDisplay = document.querySelector(".info");
  const restartBtn = document.querySelector(".btn-restart");

  const startGame = () => {
    gameDisplay.style.display = "flex";
    beforeGameDisplay.style.display = "none";
    displayTurn();
  }

  startBtn.addEventListener("click", () => startGame());

  editNameBtn.addEventListener("click", () => editNameModal.style.display = "flex");

  window.onclick = function(event) {
    if (event.target == editNameModal) {
      editNameModal.style.display = "none";
    }
  }

  const editName = (e) => {
    e.preventDefault();
    let playerOneInput = document.querySelector("#player-one-name").value;
    let playerTwoInput = document.querySelector("#player-two-name").value;
    gameController.createPlayer(playerOneInput, playerTwoInput);
    playerOneDisplay.textContent = playerOneInput;
    playerTwoDisplay.textContent = playerTwoInput;
    editNameModal.style.display = "none";
  }

  editNameForm.addEventListener("submit", editName);

  const displayTurn = () => {
    let currentTurn = gameController.getPlayerTurn().name;
    infoDisplay.textContent = `${currentTurn}'s turn`
  };

  squares.forEach((square, index) => {
    square.addEventListener("click", (e) => {
      if (e.target.textContent !== "" || gameController.getIsDone() === true) return;
      let playerSign = gameController.getPlayerTurn().sign;
      e.target.textContent = playerSign;
      gameBoard.setBoard(playerSign, index);
      gameController.changeTurn();
      displayTurn();
      gameController.checkForWin();
      gameController.checkForDraw();
      displayWinner();
    })
  })

  const displayWinner = () => {
    if (gameController.checkForWin()) {
      let winnerName = gameController.getWinner().name;
      infoDisplay.textContent = `${winnerName} wins!`;
    } else if (gameController.checkForDraw()) {
      infoDisplay.textContent = "It's a draw!";
    }
  };

  restartBtn.addEventListener("click", () => {
    gameController.restartGame();
    displayTurn();
    squares.forEach(square => square.textContent = "");
  });
})();