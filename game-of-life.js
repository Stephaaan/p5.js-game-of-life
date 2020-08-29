const WIDTH = 40;
const ALIVE = 1;
const DEAD = 0;
const CELL_WIDTH = 10;
const matrix = [];

/*
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

function setup() {
  createCanvas(400, 400);
  frameRate(1)
  //init "world" with random alive or dead entities
  for(let i = 0; i < WIDTH; i++){
    matrix[i] = new Array(30);
    for(let j = 0; j < WIDTH; j++){
      matrix[i][j] = Math.random() > 0.5 ? ALIVE : DEAD;
    }
  }
}

function draw() {
  background(240);
  drawMatrix(matrix)
  recalculateMatrix(matrix)
}
function recalculateMatrix(matrix) {
  for(let i = 0; i < WIDTH; i++){
    for(let j = 0; j < WIDTH; j++){
      const countOfAliveCells = getAliveCells(matrix, i, j)
      
      if(matrix[i][j] === ALIVE){
        //if there are less than two alive neighbours, cell dies
        if(countOfAliveCells < 2)
        matrix[i][j] = DEAD
        //if there more than three alive neighbours, cell dies
        if(countOfAliveCells > 3) 
          matrix[i][j] = DEAD    
      }else {
        if(countOfAliveCells === 3)
          matrix[i][j] = ALIVE
      }
    }
  }
}
function getAliveCells(matrix, i, j) {
  let counter = 0;
  //left neighbors of cell
  if(i > 0){
    if(matrix[i-1][j] === ALIVE) {
      counter++
    }
    if(j > 0){
      if(matrix[i-1][j-1] === ALIVE) {
        counter++
      }
    }
    if(j < WIDTH-1){
      if(matrix[i-1][j+1] === ALIVE) {
        counter++
      }
    }
  }
  //top and bottom neighbors
  if(j > 0) {
    if(matrix[i][j-1] === ALIVE) {
      counter++
    }
  }
  
  if(j < WIDTH-1) {
    if(matrix[i][j+1] === ALIVE) {
      counter++
    }
  }
  //right neighbors
  if(i < WIDTH-1){
    if(matrix[i+1][j] === ALIVE) {
      counter++
    }
    if(j > 0){
      if(matrix[i+1][j-1] === ALIVE) {
        counter++
      }
    }
    if(j < WIDTH-1){
      if(matrix[i+1][j+1] === ALIVE) {
        counter++
      }
    }
  }
  
  return counter;
}
function drawMatrix(matrix) {
  let x = 0, y = 0;
  matrix.forEach(row => {
    row.forEach(cell => {
      if(cell === ALIVE) {
        fill(0)
        rect(x*CELL_WIDTH,y*CELL_WIDTH, CELL_WIDTH, CELL_WIDTH)
      }
      x++;
    })
    y++;
    x = 0;
  })
}

