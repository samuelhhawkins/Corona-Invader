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
