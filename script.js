const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill("");
let mode = modeSelect.value;

modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.addEventListener("click", () => handleClick(index));
    board.appendChild(div);
  });
}

function handleClick(index) {
  if (!gameActive || cells[index]) return;

  if (mode === "pvp") {
    cells[index] = currentPlayer;
    renderBoard();
    if (checkGameOver(currentPlayer)) return;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  } else {
    if (currentPlayer === "X") {
      cells[index] = "X";
      renderBoard();
      if (checkGameOver("X")) return;

      currentPlayer = "O";
      statusText.textContent = "Computer's turn...";
      setTimeout(computerMove, 400);
    }
  }
}

function computerMove() {
  if (!gameActive) return;

  const emptyCells = cells
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);

  if (emptyCells.length === 0) return;

  const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  cells[move] = "O";
  renderBoard();
  if (checkGameOver("O")) return;

  currentPlayer = "X";
  statusText.textContent = "Your turn (X)";
}

function checkGameOver(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] === player && cells[b] === player && cells[c] === player) {
      gameActive = false;
      statusText.textContent = `${player === "X" ? "Player X" : mode === "pvp" ? "Player O" : "Computer"} wins!`;
      highlightWinningCells(pattern);
      return true;
    }
  }

  if (!cells.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function highlightWinningCells(indices) {
  const cellDivs = document.querySelectorAll(".cell");
  for (let i of indices) {
    cellDivs[i].classList.add("winning");
  }
}

function resetGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = mode === "pvp" ? "Player X's turn" : "Your turn (X)";
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);

resetGame();
