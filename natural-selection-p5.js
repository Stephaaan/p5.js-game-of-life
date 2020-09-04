let entities = []
let food = []
let phase = {
  number: 1,
  running: true
}

function setup() {

  createCanvas(800, 800);
  for(let i = 0; i < 10; i++)
    entities.push(new Entity(10, false))
  spawnFood();
  
  frameRate(30)
  
  setTimerForNextPhase()
}

function setTimerForNextPhase () {
  setTimeout(() => {
    phase.running = false;
  }, 10000)
}


function draw() {
  if(phase.running){
    background(30,255,30);
    fill(0)
    text("Phase: " + phase.number, 20,20 ) 
    entities.forEach(entity => {
      entity.tick()
      entity.render()
    })
    food.forEach(f => {
      f.tick();
      f.render();
    })
    //remove all eaten food
    food = food.filter(({eaten}) => !eaten)
  }else {
    //TODO: spawn new food and remove entities with zero food;
    noLoop()
    const newEntities = []
    entities.forEach(e => {
      e.cloned = false;
      //checking if entity should die
      e.isDead = e.food === 0;
      //cloning entity if has more than two pieces of food;
      if(e.food > 1) {
        newEntities.push(new Entity(e.speed, true))
      }

      //reseting food
      e.food = 0
    })
    
    entities = entities.filter(e => !e.isDead)
    entities = [...entities, ...newEntities]
    spawnFood();
    if(entities.length > 0) {
      setTimeout(() => {
        phase.number++;
        phase.running = true;
        setTimerForNextPhase()
        loop()
      }, 5000)
    }
    else{
      fill(0)
      textSize(50)
      text("END OF THE WORLD", 200,400)
    }
    
  }
 
  
}



function spawnFood() {
 food = [];
 for(let i = 0; i < 10; i++)
    food.push(new Food())
} 
class Entity {
  constructor(speed, cloned) {
    this.food = 0;
    this.foodTotal = 0;
    this.x = random(38) * 40 + 20
    this.y = 20
    this.speed = speed + random(40)/10 - 2;
    this.angleOfMove = random(360)
    this.frCounter = 0;
    this.frLimit = random(30)
    this.width = 15
    this.isDead = false;
    this.cloned = cloned;
    this.phaseBorn = phase.number
  }
  render() {
    fill(0,0,255)
    if(this.cloned) {
      fill(255, 0, 0);
    }
    
    circle(this.x, this.y, this.width + this.foodTotal * 5)
    fill(0)
    text(this.phaseBorn, this.x, this.y - this.width - 10 + this.foodTotal * 5)
  }
  tick() {
    this.frCounter++;
    this.move();
    this.checkBounds();
    this.checkCollisions()
  }
  checkCollisions() {
    food.forEach(f => {
      let colX = false;
      let colY = false;
      if(f.x > this.x) {
         if(f.x - this.x < (this.width + this.foodTotal * 5)/2 + f.width/2 ){
           colX = true;
         }
      }
      if(f.x < this.x) {
         if(this.x - f.x < (this.width + this.foodTotal * 5)/2 + f.width/2 ){
           colX = true;
         }
      }
      
      if(f.y > this.y) {
         if(f.y - this.y < (this.width + this.foodTotal * 5)/2 + f.width/2 ){
           colY = true;
         }
      }
      if(f.y < this.y) {
         if(this.y - f.y < (this.width + this.foodTotal * 5)/2 + f.width/2 ){
           colY = true;
         }
      }
      
      if(colX && colY) {
        if(!f.eaten){
          f.eaten = true;
          this.food++;
          this.foodTotal++;
        }
      }
       
    })
  }
  move() {
    if(this.frCounter > this.frLimit){
      this.angleOfMove+= random(10) < 2 ? random(20)-10 : this.angleOfMove
      this.frCounter = 0;
      this.frLimit = random(30)
    }
      
    const vectorOfMove = p5.Vector.fromAngle(radians(this.angleOfMove), this.speed);
    this.x += vectorOfMove.x;
    this.y += vectorOfMove.y;
  }
  checkBounds() {
   //x
   if(this.x < 0)
     this.x = 0;
   else if(this.x > 800) 
     this.x = 800
    
   if(this.y < 0)
     this.y = 0;
   else if(this.y > 800) 
     this.y = 800
  }
}

class Food {
  constructor(){
    this.x = random(800)
    this.y = random(800)
    this.width = 10;
    this.eaten = false;
  }
  tick () {
  
  }
  render() {
    fill(255,255,0)
    circle(this.x, this.y, this.width)
  }
}