const board = document.getElementById("board");
const result = document.getElementById("result");
const restart = document.getElementById("restart");
const playFriendsBtn = document.getElementById("playFriends");
const playComputerBtn = document.getElementById("playComputer");
const rockets = document.getElementById("rockets");

let cells;
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
  }
  cells = document.querySelectorAll(".cell");
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardState = Array.from(cells).map(cell => cell.textContent);

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }

  if (boardState.every(cell => cell)) {
    return "draw";
  }

  return null;
}

function showRockets() {
  rockets.innerHTML = '<div class="rocket"></div><div class="rocket"></div>';
  rockets.style.display = "block";
  setTimeout(() => {
    rockets.innerHTML = '<div class="explosion"></div>';
    setTimeout(() => {
      rockets.style.display = "none";
    }, 1000);
  }, 1500);
}

function handleCellClick(event) {
  const cell = event.target;

  if (cell.classList.contains("taken")) return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer, "taken");

  const winner = checkWin();

  if (winner) {
    gameActive = false;
    setTimeout(() => {
      showRockets();
      setTimeout(() => {
        result.textContent = winner === "draw" ? "It's a draw!" : `${winner} wins the game!`;
        restart.style.display = "block";
      }, 1000);
    }, 500);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 1000);
  }
}

function computerMove() {
  const availableCells = Array.from(cells).filter(cell => !cell.classList.contains("taken"));
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  randomCell.textContent = "O";
  randomCell.classList.add("O", "taken");

  const winner = checkWin();

  if (winner) {
    gameActive = false;
    setTimeout(() => {
      showRockets();
      setTimeout(() => {
        result.textContent = winner === "draw" ? "It's a draw!" : `${winner} wins the game!`;
        restart.style.display = "block";
      }, 1000);
    }, 500);
    return;
  }

  currentPlayer = "X";
}

function startGame() {
  gameActive = true;
  result.textContent = "";
  restart.style.display = "none";
  createBoard();
  currentPlayer = "X";

  cells.forEach(cell => cell.addEventListener("click", handleCellClick));
}

playFriendsBtn.addEventListener("click", () => {
  vsComputer = false;
  startGame();
});

playComputerBtn.addEventListener("click", () => {
  vsComputer = true;
  startGame();
});

restart.addEventListener("click", startGame);

createBoard();
