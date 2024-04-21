const board = document.getElementById('board');
let selectedPiece = null;
let currentPlayer = 'black';

function createBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.dataset.row = i;
            square.dataset.col = j;
            if ((i + j) % 2 === 0) {
                square.style.backgroundColor = '#e3cba8';
                square.addEventListener('click', handleSquareClick);
            } else {
                square.style.backgroundColor = '#c99a5e';
            }
            board.appendChild(square);
        }
    }
}

function createPiece(color, row, col) {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.color = color;
    piece.addEventListener('click', handlePieceClick);
    document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`).appendChild(piece);
}

function handlePieceClick(event) {
    const clickedPiece = event.target;
    if (clickedPiece === selectedPiece) {
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    } else if (selectedPiece === null && clickedPiece.dataset.color === currentPlayer) {
        selectedPiece = clickedPiece;
        selectedPiece.classList.add('selected');
    } else if (selectedPiece !== null && clickedPiece.classList.contains('square')) {
        const isValidMove = isValidMove(selectedPiece, clickedPiece);
        if (isValidMove) {
            movePiece(selectedPiece, clickedPiece);
            checkForPromotion(clickedPiece);
            switchPlayer();
        }
    }
}

function handleSquareClick(event) {
    if (selectedPiece !== null) {
        const clickedSquare = event.target;
        const isValidMove = isValidMove(selectedPiece, clickedSquare);
        if (isValidMove) {
            movePiece(selectedPiece, clickedSquare);
            checkForPromotion(clickedSquare.firstElementChild);
            switchPlayer();
        }
    }
}

function isValidMove(piece, square) {
    const rowDiff = Math.abs(parseInt(piece.dataset.row) - parseInt(square.dataset.row));
    const colDiff = Math.abs(parseInt(piece.dataset.col) - parseInt(square.dataset.col));
    if (rowDiff === 1 && colDiff === 1 && !square.firstElementChild) {
        return true;
    } else if (rowDiff === 2 && colDiff === 2 && square.firstElementChild === null) {
        const jumpedRow = (parseInt(piece.dataset.row) + parseInt(square.dataset.row)) / 2;
        const jumpedCol = (parseInt(piece.dataset.col) + parseInt(square.dataset.col)) / 2;
        const jumpedPiece = document.querySelector(`.piece[data-row="${jumpedRow}"][data-col="${jumpedCol}"]`);
        if (jumpedPiece && jumpedPiece.dataset.color !== piece.dataset.color) {
            jumpedPiece.remove();
            return true;
        }
    }
    return false;
}

function movePiece(piece, square) {
    square.appendChild(piece);
    piece.classList.remove('selected');
    selectedPiece = null;
}

function checkForPromotion(piece) {
    const row = parseInt(piece.dataset.row);
    if ((piece.dataset.color === 'black' && row === 0) || (piece.dataset.color === 'red' && row === 7)) {
        piece.classList.add('king');
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'red' : 'black';
}

function initializeGame() {
    createBoard();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                createPiece('red', i, j);
            }
        }
    }
    for (let i = 5; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                createPiece('black', i, j);
            }
        }
    }
}

initializeGame();
