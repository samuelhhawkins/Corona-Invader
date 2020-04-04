//Globals
const $GAME = document.getElementById('game')
const LS_NAME = 'highScores'
const SCORE_SLOTS = 5
let Name
let context = game.getContext('2d')
let player
let bullets = []
let bullet
let eBullet
let enemyBullets = []
let shooting = false;
const ENEMY_W_H = 10
const SOAP_W_H = 12
const SHIP_W_H = 16
const SHOOT_KEY = 32
const LEFT = 65
const RIGHT =68
let enemies = []
let score = 0
let contact
let bulletTimer = 0
let timer = 0
let rain
let gameI
let eShootI
let hkeyI
let moveEI


function updateScore() {
 score += 18
 document.getElementById('score').textContent = score

}

function updateContact(){
  document.getElementById('contact').textContent = contact
}


function start() {
  $("#SplashScreen").show()
  $('#table-body').show()
  $("#container").hide()
}

$("#container").hide();
$("#StartButton").click(function () {
       $("#SplashScreen").hide();
       name = document.getElementById('name').value
       document.getElementById('name').value = ''
       runGame();
       $("#container").show();
   });

//*****************************enemys


function enemy(x, y, color, src){
  this.x = x;
  this.y = y;
  this.color = color;
  this.src = src;
  this.img = document.createElement('img');
  this.width = ENEMY_W_H
  this.height = ENEMY_W_H
  this.alive = true;
  this.render = () => {
  if(this.src) {
    this.img.src = this.src
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
  }else {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}


function makeEnemy() {
  for(let i = 0; i < 55; i++) {
    let yPos;
    let xPos;
    let imgSrc
    if(i < 11) {
      yPos = 5;
      xPos = 20 + (i * (ENEMY_W_H + 7))
      imgSrc = 'resources/virus1.png'
    } else if(i < 22) {
      yPos = 15;
      xPos = 20 + ((i - 11) * (ENEMY_W_H + 7))
      imgSrc = 'resources/virus2.png'
    } else if(i < 33) {
      yPos = 25
      xPos = 20 + ((i - 22) * (ENEMY_W_H + 7))
      imgSrc = 'resources/virus1.png'
    } else if(i < 44) {
      yPos = 35;
      xPos = 20 + ((i - 33) * (ENEMY_W_H + 7))
      imgSrc = 'resources/virus2.png'
    } else if(i < 55) {
      yPos = 45
      xPos = 20 + ((i - 44) * (ENEMY_W_H + 7))
      imgSrc = 'resources/virus1.png'
    }
    let virus = new enemy(xPos, yPos, 'white', imgSrc)
    enemies.push(virus)
  }
}

function displayEnemies() {
  for(let i = 0; i < enemies.length; i++) {
    if(enemies[i].alive) {
      enemies[i].render()
    }
  }
}

let movingLeft = true
function moveEnemies() {
  for(let i = 0; i < enemies.length; i++) {
    if(movingLeft) {
      enemies[i].x += 1.5
      if(enemies[i].x >= $GAME.width - 10 && enemies[i].alive) {
        for(let j = 0; j < enemies.length; j++) {
          enemies[j].y += 5
        }
        movingLeft = false
      }
    } else {
      enemies[i].x -= 1.5
      if(enemies[i].x <= 0 && enemies[i].alive) {
        for(let j = 0; j < enemies.length; j++) {
          enemies[j].y += 5
        }
        movingLeft = true
      }
    }
  }
}



const detectHit = () => {
  for(let i = 0; i < bullets.length; i++) {
    for(let j = enemies.length - 1; j >= 0; j--) {
      if(bullets[i].x < ENEMY_W_H + enemies[j].x &&
         bullets[i].x + SHIP_W_H > enemies[j].x &&
         bullets[i].y < ENEMY_W_H + enemies[j].y &&
         bullets[i].y + SHIP_W_H > enemies[j].y &&
         bullets[i].alive && enemies[j].alive) {
          enemies[j].alive = false;
          bullets[i].alive = false;
          updateScore()
        }
    }
  }
}

function enemyBullet(color, width, height) {
  let rand = Math.floor(Math.random() * enemies.length)
  while(!enemies[rand].alive) {
    rand = Math.floor(Math.random() * enemies.length)
  }
  this.x = enemies[rand].x
  this.y = enemies[rand].y
  this.color = color
  this.width = width
  this.height = height
  this.alive = true
  this.render = () => {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.height, this.width)
  }
}

function Eshoot() {
   eBullet = new enemyBullet('red', 3, 1);
   enemyBullets.push(eBullet)
}

function moveEBullets() {
  for(let i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i].y += 3;
  }
}




//******************************* enemy




// ****************************************
//ship function


// more like edgecase!!
  function edgecase() {
    player.x = Math.min(Math.max(player.x,0+10),$GAME.width-40);

}

function Ship(x, y, color, width, height,  src){
  this.x = x;
  this.y = y;
  this.color = color;
  this.src = src;
  this.img = document.createElement('img');
  this.width = width;
  this.height = height;
  this.alive = true;
  this.render = () => {
  if(this.src) {
    this.img.src = this.src
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
  }else {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}

 player = new Ship(20, 120, 'white', SHIP_W_H, SHIP_W_H, "resources/hero1.png");
player.render();


//player movement handler
function handleKey(e) {
  switch(e.keyCode) {
    case (65):
        player.x -= 12
        break
    case (68):
        player.x += 12
        break
    case (SHOOT_KEY):
        if(bulletTimer < timer) {
          shoot()
          bulletTimer = 450/60 + timer
        }
        break

  }
}

function onKeyDown(e) {
  e.preventDefault();
  keyStates[e.keyCode] = true;
}

function onKeyUp(e) {
  e.preventDefault();
  keyStates[e.keyCode] = false;
}
//document.addEventListener('keypressed', handleKey)
document.addEventListener('keydown', handleKey)
//document.addEventListener('keyup', handleKey)


const detectPHit = () => {
  for(let i = 0; i < enemyBullets.length; i++) {
      if(enemyBullets[i].x < ENEMY_W_H + player.x + 5 &&
         enemyBullets[i].x + SOAP_W_H > player.x + 10 &&
         enemyBullets[i].y < ENEMY_W_H + player.y + 10 &&
         enemyBullets[i].y + SOAP_W_H > player.y + 8 &&
         enemyBullets[i].alive ) {
          contact--
            checkForGO()
          enemyBullets[i].alive = false;
          updateContact()
        }
    }
}

//********************SOAP BULLETS SHOOT *********************


function soap(width, height,  src){
  this.src = src;
  this.img = document.createElement('img');
  this.x = player.x + SHIP_W_H/2
  this.y = player.y + player.height/3
  this.width = width;
  this.height = height;
  this.alive = true;
  this.render = () => {
    if(this.src) {
      this.img.src = this.src
      context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }else {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height)
      }
    }
  }

function shoot() {
   bullet = new soap(10, 10, "resources/soap.png");
  bullets.push(bullet)
}

function moveBullets() {
  for(let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 3;
  }
}

//********************SOAP BULLETS SHOOT *********************
//***************************************




function checkForW() {
    let win = true
  for( i = 0; i < enemies.length; i++){
    if(enemies[i].alive){
     win = false
    }
  }
  if(win){
    makeEnemy()
  }
}



function checkForGO() {
  for(let i  = enemies.length - 1; i >= 0; i--) {
    if(enemies[i].y >= player.y || contact === 0){
      //if game over push score and name to leaderboard then update scores
      // and return to startscreen
      console.log('GameOver Show leaderboard')
      clearInterval(gameI)
      clearInterval(eShootI)
      clearInterval(hkeyI)
      clearInterval(moveEI)
      enemies = []
      addHighScore()
      updateScores()
      start()
    }
  }
}


function gameLoop () {
  context.clearRect(0,0,$GAME.width,$GAME.height)
  player.render()
  edgecase()
  detectHit()
  moveEnemies()
  displayEnemies()
  moveBullets()
  //Eshoot()
  moveEBullets()
  checkForW()
  checkForGO()
  detectPHit()
  timer++
  for(let i = 0; i < bullets.length; i++) {
    if(bullets[i].alive) {
      bullets[i].render()
    }
  }
  for(let i = 0; i < enemyBullets.length; i++) {
    if(enemyBullets[i].alive) {
      enemyBullets[i].render()
    }
  }
}

function runGame () {
  contact = 3
  makeEnemy()
  gameI = setInterval(gameLoop, 60)
  eShootI = setInterval(Eshoot, 800)
  hkeyI = setInterval(handleKey, 30)
  moveEI = setInterval(moveEnemies, 150)
}






const addHighScore = () => {
    // Grab the scores out of localStorage (this is an array)
    let scores = getHighScores()
    // Add to the scores array
    scores.push({ name: name, score: score })
    // Sort the scores in order by the score property
    // SORT:
    // ArrayInstance.sort(comparisonFunction)
    // comparisonFunction: function that compares two elements within the array
    // and returns an order for them
    scores.sort((a, b) => {
        return b.score - a.score
    })
    // Limit the number of scores to the top X number of SCORE_SLOTS
    // SLICE: start index, stop index RETURNS: Subset of array (copy)
    scores = scores.slice(0, SCORE_SLOTS)
    // Turn the data into a string
    let stringData = JSON.stringify(scores)
    // Write it back to localStorage
    localStorage.setItem(LS_NAME, stringData)
}
const getHighScores = () => {
    // Go into localStorage, fetch the high scores, turn them into JS objects
    let stringScores = localStorage.getItem(LS_NAME)
    // If there was nothing in LS, just assume empty
    if (!stringScores) {
        return []
    }
    // Turn the string data back into an array
    let arrayOfScores = JSON.parse(stringScores)
    // Return it, conveniently as an array
    return arrayOfScores
}
const updateScores = () => {
    // Empty the table
    document.getElementById('table-body').innerHTML = ''
    // Grab the scores out of localStorage
    let scores = getHighScores()
    // Loop through the scores, put each score in a score table
    for (let i = 0; i < scores.length; i++) {
        // Create some new elements
        let tr = document.createElement('tr')
        let tdName = document.createElement('td')
        let tdScore = document.createElement('td')
        // Set the text of the new elements
        tdName.textContent = scores[i].name
        tdScore.textContent = scores[i].score
        // Set the new elements into the DOM
        tr.append(tdName)
        tr.append(tdScore)
        document.getElementById('table-body').append(tr)
    }
}
