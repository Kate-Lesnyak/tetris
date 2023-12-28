// ДЗ №1
// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Центрування фігури коли вона з'являється
// 5. Додати функцію рандомних кольорів для кожної нової фігури

// ДЗ №2
// 1. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 2. Зверстати поле для розрахунку балів гри
// 3. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 4. Реалізувати самостійний рух фігур до низу

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
	'O',
	'L',
	'J',
	'S',
	'Z',
	'T',
	'I'
];

const TETROMINOES = {
	'O': [
		[1, 1],
		[1, 1]
	],
	'L': [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	'J': [
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	'S': [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	'Z': [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],

	],
	'T': [
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
	],
	'I': [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
};

const arrColors = [
	'yellowgreen', 'yellow', 'orange', 'orangered', 'aquamarine', 'darkcyan', 'darkblue'
]

let playField;
let tetromino;
let timeoutId;
let requestId;
let score = 0;

function getRandomElement(arr) {
	const randomIdx = Math.floor(Math.random() * arr.length);
	return arr[randomIdx];
}

// ищем позицию фигурки, где будем рисовать
function convertPositionToIndex(row, column) {
	return row * PLAYFIELD_COLUMNS + column;
};

function generatePlayField() {
	for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i += 1) {
		const div = document.createElement('div');
		document.querySelector('.tetris').append(div);
	}
	playField = new Array(PLAYFIELD_ROWS)
		.fill()
		.map(() => new Array(PLAYFIELD_COLUMNS)
			.fill(0)); // create array of arrays
	console.log(playField);
};

// ===================== getRandomColor============
// function getRandomHexColor() {
// 	return `#${Math.floor(Math.random() * 16777215)
// 		.toString(16)
// 		.padStart(6, 0)}`;
// }

// function randomGenerator(from, to) {
// 	return Math.floor(Math.random() * (to - from) + from);
// }

// function randomColor() {
// 	const r = randomGenerator(0, 256);
// 	const g = randomGenerator(0, 256);
// 	const b = randomGenerator(0, 256);
// 	const rgb = `rgb(${r}, ${g}, ${b})`;
// 	return rgb;
// }

// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }
// ===================== getRandomColor============

function generateTetromino() {
	// const nameTetro = 'S';// какая фигура
	const nameTetro = getRandomElement(TETROMINO_NAMES);
	const matrixTetro = TETROMINOES[nameTetro]// пропорции, какую фигурку хотим схватить

	const columnTetro = Math.floor((PLAYFIELD_COLUMNS - matrixTetro.length) / 2);
	// const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);

	const rowTetro = -2; // в каком рядке будем рисовать

	tetromino = {
		name: nameTetro,
		matrix: matrixTetro,
		column: columnTetro,
		row: rowTetro,
		color: getRandomElement(arrColors),
	}
};

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

function drawPlayField() {
	for (let row = 0; row < PLAYFIELD_ROWS; row += 1) {
		for (let column = 0; column < PLAYFIELD_COLUMNS; column += 1) {
			// 	if(playfield[row][column] === 0) { 
			// 	continue;
			// };
			const name = playField[row][column];
			const cellIndex = convertPositionToIndex(row, column);
			// cells[cellIndex].classList.add(name);

			if (name) {
				cells[cellIndex].classList.add(name);
			}
			else {
				cells[cellIndex].style.removeProperty('background');
				// cells[cellIndex].removeAttribute('style');
			}
		}
	}
}

// рисуем
function drawTetromino() {
	const name = tetromino.name;//'O'
	const tetrominoMatrixSize = tetromino.matrix.length; // size figure
	for (let row = 0; row < tetrominoMatrixSize; row += 1) {
		for (let column = 0; column < tetrominoMatrixSize; column += 1) {
			if (tetromino.row + row < 0) {
				continue;
			}
			if (tetromino.matrix[row][column] === 0) {
				continue;
			}
			// определеяем позицию
			const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
			cells[cellIndex].classList.add(name);
			cells[cellIndex].style.background = tetromino.color;

		}
	}
};

startLoop();

function draw() {
	cells.forEach(function (cell) {
		cell.removeAttribute('class');
		// cell.style.background = 'burlywood';
	});
	drawPlayField();
	drawTetromino();
	console.table(playField);
}


// создаем и появляется новая фигура, когда предыдущая достигла низа
function placeTetromino() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row += 1) {
		for (let column = 0; column < matrixSize; column += 1) {
			if (!tetromino.matrix[row][column]) {
				continue;
			}
			playField[tetromino.row + row][tetromino.column + column] = tetromino.name;
		}
	}
	const filledRows = findFilledRows();
	console.log(filledRows);
	removeFillRows(filledRows);
	generateTetromino();
}

function findFilledRows() {
	const filledRows = [];
	for (let row = 0; row < PLAYFIELD_ROWS; row += 1) {
		let filledColumns = 0;
		for (let column = 0; column < PLAYFIELD_COLUMNS; column += 1) {
			if (playField[row][column] !== 0) {
				filledColumns += 1;
			}
		} if (PLAYFIELD_COLUMNS === filledColumns) {
			filledRows.push(row);
		}
	}
	return filledRows;
}

function moveDown() {
	moveTetrominoDown();
	draw();
	stopLoop();
	startLoop();
}

function startLoop() {
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        700
    );
}

startLoop();

function stopLoop(){
    cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
}

function countScore(destroyRows) {
	switch (destroyRows) {
		case 1:
			score += 10;
			break;
		case 2:
			score += 30;
			break;
		case 3:
			score += 50;
			break;
		case 4:
			score += 100;
			break;
		default:
			score += 0;
	}
	document.getElementById('score').innerHTML = score;
}

// Строки удаляются поочередно
function removeFillRows(filledRows) {
	// filledRows.forEach(row => dropRowsAbove(row));
	for (let i = 0; i < filledRows.length; i += 1) {
		dropRowsAbove(filledRows[i]);
	}
	countScore(filledRows.length);
}

function dropRowsAbove(rowDelete) {
	for (let row = rowDelete; row > 0; row -= 1) {
		playField[row] = playField[row - 1];
	}
	// добавляем верхний массив 
	playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
	switch (e.key) {
		case 'ArrowLeft':
			moveTetrominoLeft();
			break;

		case 'ArrowRight':
			moveTetrominoRight();
			break;

		case 'ArrowDown':
			moveTetrominoDown();
			break;

		case 'ArrowUp':
			rotateTetromino();
			break;
	}
	draw();
}

function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
	}
}

function moveTetrominoLeft() {
	tetromino.column -= 1;
	if (isValid()) {
		tetromino.column += 1;
	}
}

function moveTetrominoRight() {
	tetromino.column += 1;
	if (isValid()) {
		tetromino.column -= 1;
	}
}

function rotateTetromino() {
	const oldMatrix = tetromino.matrix;
	const rotatedMatrix = rotateMatrix(oldMatrix);
	tetromino.matrix = rotatedMatrix;
	if (isValid()) {
		tetromino.matrix = oldMatrix;
	}
}

function rotateMatrix(matrixTetromino) {
	const N = matrixTetromino.length;
	const rotateMatrix = [];
	for (let i = 0; i < N; i += 1) {
		rotateMatrix[i] = [];
		for (let j = 0; j < N; j += 1) {
			rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
		}
	}
	return rotateMatrix;
}

function isValid() {
	const matrsxSize = tetromino.matrix.length;
	for (let row = 0; row < matrsxSize; row += 1) {
		for (let column = 0; column < matrsxSize; column += 1) {
			if (!tetromino.matrix[row][column]) {
				continue;
			}
			// if(tetromino.matrix[row][column] == 0){ continue; }
			if (isOutsideOfBoard(row, column)) {
				return true;
			}
			if (hasCollisions(row, column)) {
				return true;
			}
		}
	}
	return false;
}

function isOutsideOfBoard(row, column) {
	return tetromino.column + column < 0 ||
		tetromino.column + column >= PLAYFIELD_COLUMNS ||
		tetromino.row + row >= playField.length;
}

function hasCollisions(row, column) {
	return playField[tetromino.row + row]?.[tetromino.column + column];
}
