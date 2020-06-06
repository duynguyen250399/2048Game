const offset = 5;
const w = 500 + offset * 2;
const boardSize = w;

// all sizes of game
var gameSize = 4;
var gridSize = boardSize / gameSize;

const h = w + gridSize + offset * 2;

var numberSize = gridSize / 3;
var gameOverTextSize = boardSize / 8;
var scoreSize = numberSize + numberSize * 0.2;

// check whether game is over or not
var gameOver = false;

var score = 0;

// initialize 2d array with all zero-element
var numbers = initArr();


// color of each block
const colors = {
    text: '#474747',
    score: '#474747',
    c0: '#bdac97',
    c2: '#b2c3eb',
    c4: '#8ca9ed',
    c8: '#bf47bd',
    c16: '#e39be8',
    c32: '#e6076b',
    c64: '#9adba9',
    c128: '#87c9c6',
    c256: '#d49817'

}


function initArr(){
    let arr = [];

    for(let row = 0; row < gameSize; row++){
        let a = [];
        for(let col = 0; col < gameSize; col++){
            a.push(0);
        }
    
        arr.push(a);
    }

    return arr;
}

// reset new game
function resetGame(){
    numbers = initArr();
    addNumber();
    addNumber();
    gameOver = false;
    score = 0;

    redraw();
}


function setup() {
    // create canvas
    createCanvas(w, h);
    // disable loop in draw() method
    noLoop();

    // draw game board
    drawGrid();

    // add 2 random numbers at start
    addNumber();
    addNumber();
}

function draw() {

    // draw everything
    if (!gameOver) {
        clear();
        drawGrid();
        drawScore();
        for (let y = 0; y < gameSize; y++) {
            for (let x = 0; x < gameSize; x++) {
                if (numbers[y][x] !== 0) {
                    let val = numbers[y][x];
                    fill(colors.text);
                    textSize(numberSize);
                    textAlign(CENTER, CENTER);
                    text(val, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2 + (h - boardSize));
                }
            }
        }
    }
    else{

        // draw game over text when player lost
        background('rgba(232, 231, 231, 0.85)')
        textSize(gameOverTextSize);
        textAlign(CENTER, CENTER);
        fill('#474747');
        text('Game Over!', w / 2, h / 2);


        // create 'Play again' button then show it
        let replayBtn = createButton('Play again');
        replayBtn.position(0, h / 2 + 100);

        let btn = document.getElementsByTagName('button')[0];

        // modify styles of button
        btn.style.background = '#9E7979';
        btn.style.padding = '25px 0';
        btn.style.border = 'none';
        btn.style.fontSize = '20px';
        btn.style.width = w + 'px';
        btn.style.cursor = 'pointer';

        // mouse events
        btn.addEventListener('mouseenter', () =>{
            btn.style.background = '#7F4C4C';
        })

        btn.addEventListener('mouseleave', () =>{
            btn.style.background = '#9E7979';
        })


        btn.addEventListener('click', () =>{           
            replayBtn.remove();
            resetGame();
        })

    }
}

function keyPressed() {

    if(gameOver){
        return;
    }

    if (key == 'd') {
        for (let row = 0; row < numbers.length; row++) {
            numbers[row] = right(numbers[row]);
        }
        addNumber();

        redraw();
    }
    else if (key == 'a') {
        for (let row = 0; row < numbers.length; row++) {
            numbers[row] = left(numbers[row]);
        }
        addNumber();

        redraw();
    }
    else if (key == 'w') {
        numbers = up(numbers);

        addNumber();
        redraw();
    }
    else if (key == 's') {
        numbers = down(numbers);
        addNumber();
        redraw();
    }

}

function keyReleased(){
    if(gameOver){
        return;
    }

    gameOver = checkGameOver();
    redraw();
}

function checkGameOver(){

    let isOver = true;
   
    for(let row = 0; row < gameSize; row++){
        for(let col = 0; col < gameSize; col++){
            if(numbers[row][col] === 0){
                isOver = false;
            }
        }
    }

    for(let row = 0; row < gameSize; row++){
        for(let col = 0; col < gameSize - 1; col++){
            if(numbers[row][col] === numbers[row][col + 1]){
                isOver = false;
                break;
            }
        }

        if(!isOver){
            break;
        }
    }

    for(let col = 0; col < gameSize; col++){
        for(let row = 0; row < gameSize - 1; row++){
            if(numbers[row][col] === numbers[row + 1][col]){
                isOver = false;
                break;
            }
        }

        if(!isOver){
            break;
        }
    }


    return isOver;

}

function drawScore(){
    textSize(scoreSize);
    textAlign(CENTER);
    fill(colors.score);
    text('Score: ' + score, w / 2, (h - w) / 2);
}

function drawGrid() {
    let color = colors.c0;

    for (let y = 0; y < gameSize; y++) {
        for (let x = 0; x < gameSize; x++) {
            let val = numbers[y][x];

            switch (val) {
                case 0:
                    color = colors.c0;
                    break;
                case 2:
                    color = colors.c2;
                    break;
                case 4:
                    color = colors.c4;
                    break;
                case 8:
                    color = colors.c8;
                    break;
                case 16:
                    color = colors.c16;
                    break;
                case 32:
                    color = colors.c32;
                    break;
                case 64:
                    color = colors.c64;
                    break;
                case 128:
                    color = colors.c128;
                    break;
                case 256:
                    color = colors.c256;
                    break;
            }

            fill(color);
            noStroke();
            rect(x * gridSize + offset, y * gridSize + (h - boardSize) + offset, gridSize - offset, gridSize - offset, 10);
        }
    }
}

function addNumber() {
    let grids = [];
    for (let y = 0; y < gameSize; y++) {
        for (let x = 0; x < gameSize; x++) {
            if (numbers[y][x] === 0) {
                grids.push({ x: x, y: y });
            }
        }
    }

    if(grids.length === 0){
        return;
    }

    let randomGrid = random(grids);
    let randomNumber = random(1);

    numbers[randomGrid.y][randomGrid.x] = randomNumber > 0.5 ? 2 : 4;
}


function slideLeft(row) {
    let arr = row.filter(val => val);
    let zeros = row.filter(val => !val);
    return arr.concat(zeros);
}

function mergeLeft(row) {
    for (let i = 0; i < row.length - 1; i++) {
        let a1 = row[i];
        let a2 = row[i + 1];

        if (a1 === a2) {
            row[i] = a1 + a2;
            row[i + 1] = 0;

            i = i + 1;

            score = score + a1 * 2;
        }
    }
    return row;
}

function left(row) {
    row = slideLeft(row);
    row = mergeLeft(row);
    row = slideLeft(row);

    return row;
}

function slideRight(row) {
    let arr = row.filter(val => val);
    let zeros = row.filter(val => !val);
    return zeros.concat(arr);
}

function mergeRight(row) {
    for (let i = row.length - 1; i >= 1 - 1; i--) {
        let a1 = row[i];
        let a2 = row[i - 1];

        if (a1 === a2) {
            row[i] = a1 + a2;
            row[i - 1] = 0;

            i = i - 1;
            score = score + a1 * 2;
        }
    }
    return row;
}

function right(row) {
    row = slideRight(row);
    row = mergeRight(row);
    row = slideRight(row);

    return row;
}

function slideUp(board) {
    for (let col = 0; col < board[0].length; col++) {
        let nums = [];
        let zeros = [];
        let arr = [];
        for (let row = 0; row < board.length; row++) {

            let val = board[row][col];
            if (val !== 0) {
                nums.push(val);
            }
            else {
                zeros.push(val);
            }

        }

        arr = nums.concat(zeros);
        let count = 0;

        for (let row = 0; row < board.length; row++) {
            board[row][col] = arr[count];
            count = count + 1;
        }
    }

    return board;
}

function mergeUp(board) {
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 1; row++) {
            let a1 = board[row][col];
            let a2 = board[row + 1][col];
            if (a1 === a2) {
                board[row][col] = a1 + a2;
                board[row + 1][col] = 0;
                row = row + 1;
                score = score + a1 * 2;
            }
        }
    }

    return board;
}

function up(board) {
    board = slideUp(board);
    board = mergeUp(board);
    board = slideUp(board);

    return board;
}


function slideDown(board) {
    for (let col = 0; col < board[0].length; col++) {
        let nums = [];
        let zeros = [];
        let arr = [];
        for (let row = 0; row < board.length; row++) {

            let val = board[row][col];
            if (val !== 0) {
                nums.push(val);
            }
            else {
                zeros.push(val);
            }

        }

        arr = zeros.concat(nums);
        let count = 0;

        for (let row = 0; row < board.length; row++) {
            board[row][col] = arr[count];
            count = count + 1;
        }
    }

    return board;
}

function mergeDown(board) {
    for (let col = 0; col < board[0].length; col++) {
        for (let row = board.length - 1; row >= 1; row--) {
            let a1 = board[row][col];
            let a2 = board[row - 1][col];
            if (a1 === a2) {
                board[row][col] = a1 + a2;
                board[row - 1][col] = 0;
                row = row - 1;
                score = score + a1 * 2;
            }
        }
    }

    return board;
}

function down(board) {
    board = slideDown(board);
    board = mergeDown(board);
    board = slideDown(board);

    return board;
}