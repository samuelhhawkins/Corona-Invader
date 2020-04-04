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
      if(enemyBullets[i].x < ENEMY_W_H + player.x &&
         enemyBullets[i].x + SOAP_W_H > player.x &&
         enemyBullets[i].y < ENEMY_W_H + player.y &&
         enemyBullets[i].y + SOAP_W_H > player.y &&
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
