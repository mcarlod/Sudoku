var numSelected = null; // current number selected
var tileSelected = null; // current tile selected

var errors = 0; // stores the number of errors

// initial sudoku board layout
var board = [
  "53--7----",
  "6--195---",
  "-98----6-",
  "8---6---3",
  "4--8-3--1",
  "7---2---6",
  "-6----28-",
  "---419--5",
  "----8--79"
]

// solution for the sudoku board
var solution = [
  "534678912",
  "672195348",
  "198342567",
  "859761423",
  "426853791",
  "713924856",
  "961537284",
  "287419635",
  "345286179"
]

var timer; // timer interval variable
var totalTime = 0; // total time elapsed during the game

// code execution after window has loaded
window.onload = function() {
  setGame();
  startTimer();
}

// function to set up the sudoku game
function setGame() {
  // creates number selector buttons
  for (let i=1; i<=9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  // creates sudoku board tiles
  for (let r=0; r < 9; r++) {
    for (let c=0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      if (board[r][c] != "-") {
        tile.innerText = board[r][c];
        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}

// function to update error counter display
function updateErrorCounter() {
  document.getElementById("errors").innerText = "Error Count: " + errors;
}

// function toe start the game timer
function startTimer() {
  timer = setInterval(updateTimer, 1000);
}

// function to check if the game is finished
function isGameFinished() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.getElementById(r.toString()+"-"+c.toString());
      if (tile.innerText === "") {
        return false
      }
    }
  }
  return true;
}

// function to update the game timer for it to increment the seconds and minutes
function updateTimer() {
  totalTime += 1;
  var minutes = Math.floor(totalTime / 60);
  var seconds = totalTime % 60;
  document.getElementById("timer").innerText = padZero(minutes) + ":" + padZero(seconds);

  if (isGameFinished()) {
    clearInterval(timer);
    document.getElementById("board").innerHTML = "<h1>Congratulations! You won the game!</h1>";
    document.getElementById("restartButton").addEventListener("click", resetGame);
  }

  // checks if game has to restart due to time and error limitations
  if (totalTime >= 10 * 60 || errors >= 10) {
    resetGame();
  }
}

// function to pad single-digit numbers with leading zero
function padZero(num) {
  return (num < 10 ? "0" : "") + num;
}

// function to handle tile selections
function selectTile() {
  if (numSelected) {
    if (this.innerText != "") {
      return;
    }
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == numSelected.id) {
      this.innerText = numSelected.id;
    } else {
      errors += 1;
      updateErrorCounter();
      if (errors >= 10) {
        clearInterval(timer);
        resetGame();
      }
    }
  }
}

// function to handle number selection
function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

// function to reset the game
function resetGame() {
  clearInterval(timer);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = board[r][c] !== '-' ? board[r][c] : '';
      if (board[r][c] !== '-') {
        tile.classList.add("tile-start");
      } else {
        tile.classList.remove("tile-start");
      }
    }
  }
  errors = 0;
  updateErrorCounter();
  totalTime = 0;
  document.getElementById("timer").innerText = "00:00";
  startTimer();
}