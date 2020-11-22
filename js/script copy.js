const appElement = document.querySelector("#app")

let SIZE = 8;
let cells2DArray = [];
let table;
let numberOfBombs;

addControlsContainer()
addInputForSize();
addResultBox();

// создадим таблицу и вставим на страницу
createAndPasteTable(SIZE);

// создадим массив  объектов с характеристиками ячеек
let cellsProperties2DArray = createCellsPropertiesArray(SIZE)

// создадим кнопку "Старт"
addStartButton()

// добавим на страницу отображение счетчика мин
addCounter();

/** --------- start game block ----------- */

restartGameHandler()

function restartGameHandler() {
	hideResultBox();
	hideStartButton()

	clearTable()

	clearProperties()

	const numbersOfCells = getNumbersArray(SIZE * SIZE);

	numberOfBombs = Number.parseInt((SIZE * SIZE) / 6);
	console.log(numberOfBombs);

	const randomCellsNumbers = getRandomNumbers(numberOfBombs, numbersOfCells)

	const randomCoords = getRandomCoords(randomCellsNumbers, SIZE);

	placeBobms(randomCoords)

	placeNumbers ()

	refreshCounter()

	// добавим обработчики
	table.addEventListener('mousedown', onCellClick)
	table.addEventListener('dblclick', onCellDoubleClick)
	table.addEventListener('mousedown', showStartButton)
	table.addEventListener('contextmenu', toggleMark)
}

// создадим таблицу и вставим на страницу
function createAndPasteTable(SIZE) {
	cells2DArray = Array.from({length: SIZE}, () => {
		return Array.from({length: SIZE}, () => document.createElement('td'))
	})

	// добавим в data аттрибуты координаты ячеек
	cells2DArray.forEach((row, rowIndex) => {
		row.forEach((cell, columnIndex) => {
			cell.dataset.rowCoord = rowIndex;
			cell.dataset.columnCoord = columnIndex;
		})
	})

	// создадим таблицу и добавим на страницу
	table = document.createElement('table')
	const tableHTML = document.createDocumentFragment()
	cells2DArray.forEach(rowArray => {
		const rowHTML = document.createDocumentFragment()
		rowHTML.append(...rowArray)
		const tr = document.createElement('tr')
		tr.append(rowHTML)
		tableHTML.append(tr)
	})
	table.append(tableHTML)
	appElement.append(table)
	return table;
}

// создадим массив  объектов с характеристиками ячеек
function createCellsPropertiesArray(SIZE) {
	return Array.from({length: SIZE}, () => {
		return Array.from({length: SIZE}, () => new Object())
	})
}


// действие на левый клик мышки - нажать на ячейку
function onCellClick(e) {
	const td = e.target
	rowCoord = +td.dataset.rowCoord;
	columnCoord = +td.dataset.columnCoord;
	if(e.button === 0) {
		if(!cellsProperties2DArray[rowCoord][columnCoord].isClicked) {
			clickCell(td, rowCoord, columnCoord)
		}
	}
}

function clickCell(td, rowCoord, columnCoord) {
	td.style.backgroundColor = "#ddd";
	rowCoord = rowCoord;
	columnCoord = columnCoord;
	if(+cellsProperties2DArray[rowCoord][columnCoord].neighbours > 0
		&& cellsProperties2DArray[rowCoord][columnCoord].hasBomb !== true
	) {
		td.innerText = cellsProperties2DArray[rowCoord][columnCoord].neighbours;
		cellsProperties2DArray[rowCoord][columnCoord].isClicked = true;
	}
	if(cellsProperties2DArray[rowCoord][columnCoord].hasBomb === true) {
		td.innerText = "💣";
		gameOver();
	}
	if(+cellsProperties2DArray[rowCoord][columnCoord].neighbours === 0
		&& !cellsProperties2DArray[rowCoord][columnCoord].isClicked
		&& cellsProperties2DArray[rowCoord][columnCoord].hasBomb !== true
	) {
		cellsProperties2DArray[rowCoord][columnCoord].isClicked = true;
		processNeighbours(rowCoord, columnCoord, clickCell)
	}
}

function processNeighbours(rowCoord, columnCoord, processingFn) {
	const upLeftRowCoord = rowCoord - 1;
	const upRowCoord = rowCoord - 1;
	const upRightRowCoord = rowCoord - 1;
	const leftRowCoord = rowCoord;
	const rightRowCoord = rowCoord;
	const downLeftRowCoord = rowCoord + 1;
	const downRowCoord = rowCoord + 1;
	const dowRightRowCoord = rowCoord + 1;
	const upLeftColumnCoord = columnCoord - 1;
	const upColumnCoord = columnCoord;
	const upRightColumnCoord = columnCoord + 1;
	const leftColumnCoord = columnCoord - 1;
	const rightColumnCoord = columnCoord + 1;
	const downLeftColumnCoord = columnCoord - 1;
	const downColumnCoord = columnCoord;
	const dowRightColumnCoord = columnCoord + 1;

	if(rowCoord > 0 && columnCoord > 0) {
		const upLeftCell = document.querySelector(`[data-row-coord="${upLeftRowCoord}"][data-column-coord="${upLeftColumnCoord}"]`)
		processingFn(upLeftCell, upLeftRowCoord, upLeftColumnCoord);
	}
	if(rowCoord > 0) {
		const upCell = document.querySelector(`[data-row-coord="${upRowCoord}"][data-column-coord="${upColumnCoord}"]`)
		processingFn(upCell, upRowCoord, upColumnCoord);
	}
	if(rowCoord > 0 && columnCoord < SIZE - 1) {
		const upRightCell = document.querySelector(`[data-row-coord="${upRightRowCoord}"][data-column-coord="${upRightColumnCoord}"]`)
		processingFn(upRightCell, upRightRowCoord, upRightColumnCoord);
	}
	if(columnCoord > 0) {
		const leftCell = document.querySelector(`[data-row-coord="${leftRowCoord}"][data-column-coord="${leftColumnCoord}"]`)
		processingFn(leftCell, leftRowCoord, leftColumnCoord);
	}
	if(columnCoord < SIZE - 1) {
		const rightCell = document.querySelector(`[data-row-coord="${rightRowCoord}"][data-column-coord="${rightColumnCoord}"]`)
		processingFn(rightCell, rightRowCoord, rightColumnCoord);
	}
	if(rowCoord < SIZE - 1 &&  columnCoord > 0) {
		const downLeftCell = document.querySelector(`[data-row-coord="${downLeftRowCoord}"][data-column-coord="${downLeftColumnCoord}"]`)
		processingFn(downLeftCell, downLeftRowCoord, downLeftColumnCoord);
	}
	if(rowCoord < SIZE - 1) {
		const downCell = document.querySelector(`[data-row-coord="${downRowCoord}"][data-column-coord="${downColumnCoord}"]`)
		processingFn(downCell, downRowCoord, downColumnCoord);
	}
	if(rowCoord < SIZE - 1 && columnCoord < SIZE - 1) {
		const downRightCell = document.querySelector(`[data-row-coord="${dowRightRowCoord}"][data-column-coord="${dowRightColumnCoord}"]`)
		processingFn(downRightCell, dowRightRowCoord, dowRightColumnCoord);
	}
}

function onCellDoubleClick(e) {
	const td = e.target
	const rowIndex = +td.dataset.rowCoord;
	const columnIndex = +td.dataset.columnCoord;
	if(e.button === 0) {
		if(cellsProperties2DArray[rowIndex][columnIndex].isClicked) {
			console.log(cellsProperties2DArray[rowIndex][columnIndex])
			let markedNeighbours = 0;
			if(rowIndex - 1 >= 0 && columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex - 1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(rowIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(rowIndex - 1 >= 0 && columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex + 1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex][columnIndex - 1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex][columnIndex + 1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(rowIndex + 1 < SIZE && columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex -1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(rowIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(rowIndex + 1 < SIZE && columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex + 1].markedAsBomb) {
					markedNeighbours++;
				}
			}
			if(markedNeighbours === cellsProperties2DArray[rowIndex][columnIndex].neighbours){
				console.log(true)
				processNeighbours(rowIndex, columnIndex, clickOneCell)
			}
		}
	}
}

function clickOneCell(td, rowCoord, columnCoord) {
	rowCoord = rowCoord;
	columnCoord = columnCoord;
	if(cellsProperties2DArray[rowCoord][columnCoord].hasBomb !== true
	) {
		if(cellsProperties2DArray[rowCoord][columnCoord].neighbours > 0){
			td.innerText = cellsProperties2DArray[rowCoord][columnCoord].neighbours;
		}
		td.style.backgroundColor = "#ddd";
		cellsProperties2DArray[rowCoord][columnCoord].isClicked = true;
	}
	if(cellsProperties2DArray[rowCoord][columnCoord].hasBomb === true) {
		if(cellsProperties2DArray[rowCoord][columnCoord].markedAsBomb === false) {
			td.style.backgroundColor = "#ddd";
			td.innerText = "💣";
			gameOver();
		}
	}
}


// при клике на бомбу покажем бомбы и запретим кликать по таблице
function gameOver() {
	const resultBox = document.querySelector(".result-box");
	resultBox.textContent = "You loose!";
	resultBox.style.visibility = "visible";
	table.removeEventListener('mousedown', onCellClick);
	table.removeEventListener('contextmenu', toggleMark);
	showBombs()
}

// покажем мины если игрок проиграл
function showBombs() {
	cellsProperties2DArray.forEach((rowProperty, rowIndex) => {
		rowProperty.forEach((cellProperty, columnIndex) => {
			if(cellProperty.hasBomb) {
				const td = document.querySelector(`[data-row-coord="${rowIndex}"][data-column-coord="${columnIndex}"]`)
				td.innerText = "💣";
			}
		})
	})
}

// установить флажок по правому клику
function toggleMark (e) {
	e.preventDefault()
	const td = e.target;
	if(cellsProperties2DArray[rowCoord][columnCoord].isClicked === false) {
		cellsProperties2DArray[rowCoord][columnCoord].markedAsBomb = !cellsProperties2DArray[rowCoord][columnCoord].markedAsBomb;
		if(cellsProperties2DArray[rowCoord][columnCoord].markedAsBomb) {
			td.innerText = "💣";
		}
		else {
			td.innerText = "";
		}
	}
  // обновим значение счетчика мин
  refreshCounter()
}

// создадим контейнер для кнопка "Старт" и счетчика мин
function addControlsContainer() {
	const controlsContainer = document.createElement('div');
	controlsContainer.classList.add('controls-container');
	appElement.prepend(controlsContainer)
}

function addInputForSize() {
	const label = document.createElement('label');
	const input = document.createElement('input');
	input.value = 8;
	const setSizeBtn = document.createElement('button');
	setSizeBtn.classList.add('size-btn')
	setSizeBtn.addEventListener('click', setSize)
	setSizeBtn.textContent = "Задать размеры поля";
	label.prepend(input);
	label.append(setSizeBtn);
	const controlsContainer = document.querySelector('.controls-container')
	controlsContainer.prepend(label);
}

function setSize() {
	const input = document.querySelector('input');
	fieldSize = input.value;
	SIZE = +fieldSize;
	document.querySelector('table').remove();
	table = createAndPasteTable(SIZE)
	cellsProperties2DArray = createCellsPropertiesArray(SIZE)
	restartGameHandler()
}

function addResultBox() {
	const resultBox = document.createElement('p');
	resultBox.classList.add("result-box");
	resultBox.textContent = "pending";
	resultBox.style.visibility = "hidden";
	appElement.prepend(resultBox);
}

function hideResultBox() {
	const resultBox = document.querySelector('.result-box');
	resultBox.style.visibility = "hidden";
}

// создадим кнопку "Старт"
function addStartButton() {
	const startButton = document.createElement('button')
	startButton.id = 'start-button'
	startButton.innerText = "Начать игру заново"
	const controlsContainer = document.querySelector('.controls-container')
	startButton.visibility = "hidden";
  controlsContainer.prepend(startButton)
  startButton.addEventListener('click', restartGameHandler)
  table.removeEventListener('mousedown', showStartButton)
}

function showStartButton() {
	const startButton = document.getElementById('start-button')
	startButton.style.visibility = "visible"
}
function hideStartButton() {
	const startButton = document.getElementById('start-button');
	startButton.style.visibility = "hidden"
}

// добавим на страницу отображение счетчика мин
function addCounter() {
	const counterSpan = document.createElement('span')
	counterSpan.classList.add('counter')
	const controlsContainer = document.querySelector('.controls-container')
	controlsContainer.append(counterSpan)
	counterSpan.innerText = `${numberOfBombs - refreshCounter()} of ${numberOfBombs} left`;
}

// обновим значение счетчика мин
function refreshCounter() {
	console.log(numberOfBombs)
	const counterSpan = document.querySelector('.counter');
	let markedCells = 0;
	cellsProperties2DArray.forEach((rowProperty) => {
		rowProperty.forEach((cellProperty) => {
			if(cellProperty.markedAsBomb === true) {
				markedCells++
			}
		})
	})
	counterSpan.innerText = `${numberOfBombs - markedCells} of  ${numberOfBombs} left`;
	return markedCells;
}

// получим массив с номерами ячеек, вызвав getNumbersArray(число строк * число столбцов)
function getNumbersArray(num) {
	let i = 0;
	const numbersArray = Array.from({length: num}, () => i++)
	return numbersArray;
}

// создадим массив случайных чисел, для номеров ячеек в которых будут бомбы, вызвав getRandomNumbers(число бомб, массив номеров ячеек)
function getRandomNumbers(num, array) {
	const randomNumbersArray = []
	while(num > 0) {
		const index = Math.floor(Math.random() * array.length)
		const chosenNumber = array.splice(index, 1)[0]
		randomNumbersArray.push(chosenNumber)
		num--;
	}
	return randomNumbersArray
}

// получим массив случайных координат для проставления бомб
function getRandomCoords(array, rowLength) {
	const coordsArray = []
	array.forEach(i => {
		const row = parseInt(i / rowLength);
		const column = i - rowLength * row;
		coordsArray.push([row, column])
	})
	return coordsArray;
}

// поставим на случайные ячейки бомбы в свойствах
function placeBobms(randomCoords) {
	randomCoords.forEach(coordinates => {
		const cellProperty = cellsProperties2DArray[coordinates[0]][coordinates[1]]
		cellProperty.hasBomb = true;
	})
}

// проставим числа соседних бомб
function placeNumbers () {
	// проставим числа
	cellsProperties2DArray.forEach((rowProperty, rowIndex) => {
		rowProperty.forEach((cellProperty, columnIndex) => {
			cellProperty.markedAsBomb = false;
			let neighbours = 0;
			if(rowIndex - 1 >= 0 && columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex - 1].hasBomb) {
					neighbours++;
				}
			}
			if(rowIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex].hasBomb) {
					neighbours++;
				}
			}
			if(rowIndex - 1 >= 0 && columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex - 1][columnIndex + 1].hasBomb) {
					neighbours++;
				}
			}
			if(columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex][columnIndex - 1].hasBomb) {
					neighbours++;
				}
			}
			if(columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex][columnIndex + 1].hasBomb) {
					neighbours++;
				}
			}
			if(rowIndex + 1 < SIZE && columnIndex - 1 >= 0) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex -1].hasBomb) {
					neighbours++;
				}
			}
			if(rowIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex].hasBomb) {
					neighbours++;
				}
			}
			if(rowIndex + 1 < SIZE && columnIndex + 1 < SIZE) {
				if(cellsProperties2DArray[rowIndex + 1][columnIndex + 1].hasBomb) {
					neighbours++;
				}
			}
			cellsProperties2DArray[rowIndex][columnIndex].neighbours = neighbours;
		})
	})

}

// очистим таблицу
function clearTable() {
	cells2DArray.forEach((row) => {
		row.forEach((cell) => {
			cell.style.backgroundColor = "white";
			cell.innerText = "";
		})
	})
}

// очистим массив свойств ячеек
function clearProperties() {
	cellsProperties2DArray.forEach((rowProperty) => {
		rowProperty.forEach((cellProperty) => {
			cellProperty.hasBomb = false;
			cellProperty.markedAsBomb = false;
			cellProperty.neighbours = 0;
			cellProperty.isClicked = false;
		})
	})
}
