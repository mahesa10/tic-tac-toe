const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = (num) => board[num];
  const setBoard = (value, num) => {
    board[num] = value;
  }
  return {board, getBoard, setBoard}
})();

const Player = ((sign) => {
  let _sign = sign;
  const getSign = () => _sign;
  return {getSign}
})

const displayController = (() => {
  const playerOne = Player("X");
  const playerTwo = Player("O");
  let playerTurn = playerOne;
  const changeTurn = () => {
    playerTurn = playerTurn == playerOne ? playerTwo : playerOne;
  }
  const squares = document.querySelectorAll(".square");
  squares.forEach((square, i) => {
    square.addEventListener("click", () => {
      if (square.innerHTML === "") {
        square.innerHTML = playerTurn.getSign();
        gameBoard.setBoard(playerTurn.getSign(), i);
        changeTurn();
      }
    })
  })
})();