var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 500 },
          debug: false
      }
  },
  scene: [{
      preload: preload,
      create: create,
      update: update
  },LevelComplete,Scene2,Scene3,Scene4,GameOver]
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var beam;
var explosions;
var robos
var completeStage = false;
var timer = 0;
var intervalo;
var next="Scene2"
var times;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
  this.load.spritesheet('beam', 'assets/shoot.png', { frameWidth: 32, frameHeight: 40
  });
  this.load.spritesheet("explosion", "assets/explosion.png",{
          frameWidth: 16,
          frameHeight: 16
      });
  this.load.image('robo1','assets/robo2.png')
  this.load.image('espinhos','assets/espinhos.png')
  this.load.image('espinhos2','assets/espinhos2.png')
}

function create ()
{
  times = {
      low:5,
      medium:7,
      high:10
  }
  //  A simple background for our game
  this.add.image(400, 300, 'sky');
  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();
  robos = this.physics.add.group();
  explosions = this.physics.add.group();


  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(300, 400, 'ground').setScale(0.5).refreshBody();
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  robos.create(40,205,'robo1').setScale(0.15)
  robos.create(750,170,'robo1').setScale(0.15)
  robos.create(720,500,'robo1').setScale(0.15)

  // The player and its settings
  player = this.physics.add.sprite(300, 250, 'dude');
  
  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8  }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
    key: "beam_anim",
    frames: this.anims.generateFrameNumbers('beam', { start: 117, end: 118  }),
    frameRate: 90,
    repeat: -1
  });
  this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 5}),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
      duration: 10000000000,
  });
  

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();
  console.log(cursors)

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis


  bombs = this.physics.add.group();
  beams = this.physics.add.group()

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(robos, platforms);


  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function

  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(beams,robos,killRobo,null,null)


   intervalo = setInterval(() => {
      conta()
  }, 1000);
}

function update ()
{
  
  if(robos.getLength() == 0){
      clearInterval(intervalo)
      this.scene.start("LevelComplete", {timer:timer, scene: next, times: times});

  }
  

  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
      if(player.body.touching.down){
      player.anims.play('left', true);
      }
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      if(player.body.touching.down){
      player.anims.play('right', true);
      }
  }
  else
  {
      player.setVelocityX(0);

      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.anims.play('turn');
      player.setVelocityY(-400);
  }
  if(this.input.keyboard.checkDown(cursors.space, 1000)){
      let velocity = 300
      if(cursors.left.isDown){
       velocity = velocity * -1
      }
    beam = beams.create(player.x,player.y,'beam')
    beam.anims.play("beam_anim")
    beam.body.setAllowGravity(false)
    beam.rotarion += 180
    beam.setVelocityX(velocity)
  }
}



function hitBomb (player, bomb)
{
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}
function killRobo (beam,robo){
 robo.destroy()
}
function conta(){
  timer+=1
  console.log(timer)
}