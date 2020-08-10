class Scene3 extends Phaser.Scene{
  constructor() {
  super("Scene3");
  this.intervalo;
  this.timer = 0
  this.tiros = 3;
  this.tirosLeft;
  this.velocity = 0;
  this.cena = "Scene3"
  this.next = "Scene4"
  this.gameOver;
  this.times;
}
preload(){
  
}
create(){
    this.times = {
        low: 5,
        medium: 7,
        high: 10
    }
    this.tiros = 3;
  this.gameOver = false;
  this.timer = 0
  this.cameras.main.setBounds(0, 0, 1300, 1000);
  this.physics.world.setBounds(0,0,1300,1000)
  this.physics.world.setBoundsCollision(true,true,true,false)
  this.add.image(0, 0, 'sky').setScale(4)
  this.platforms = this.physics.add.staticGroup();
  this.robos = this.physics.add.group();
  this.platforms.create(160, 750, 'ground').setScale(0.5).refreshBody();
  this.platforms.create(400, 300, 'ground').setScale(0.5).refreshBody();
  this.platforms.create(50, 250, 'ground');
  this.platforms.create(750, 270, 'ground').setScale(0.1).refreshBody();
  this.platforms.create(1230, 470, 'ground').setScale(0.3).refreshBody();
  this.platforms.create(1000, 570, 'ground').setScale(0.1).refreshBody();
  this.platforms.create(700, 600, 'ground').setScale(0.4).refreshBody();
  this.movingplatform = this.physics.add.image(400, 600, 'ground')
  .setImmovable(true)
  .setVelocityY(-100);
  this.movingplatform.setScale(0.4)
  this.movingplatform.body.setAllowGravity(false);
  this.robos.create(40,205,'robo1').setScale(0.15)
  this.robos.create(750,170,'robo1').setScale(0.15)
  this.robos.create(400,530,'robo1').setScale(0.15)
  this.robos.create(700,560,'robo1').setScale(0.15)

  this.player = this.physics.add.sprite(150, 720, 'dude');
  
  //  Player physics properties. Give the little guy a slight bounce.
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);
  this.cameras.main.startFollow(this.player)
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
  this.cursors = this.input.keyboard.createCursorKeys();
  console.log(cursors)

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis


  this.bombs = this.physics.add.group();
  this.beams = this.physics.add.group()

  for(let i=0;i<Phaser.Math.Between(4, 10);i++){
      var bomb = this.bombs.create(Phaser.Math.Between(player.x-400, player.x+400), 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(false);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
  }
  //  The score
  this.tirosLeft = this.add.text(16, 16, 'tiros restantes:'+this.tiros, { fontSize: '32px', fill: '#000' });
  this.tirosLeft.fixedToCamera = true;

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.bombs, this.platforms);
  this.physics.add.collider(this.robos, this.platforms);
  this.physics.add.collider(this.bombs, this.platforms);
  this.physics.add.collider(this.player, this.movingplatform);
  this.physics.add.collider(this.robos, this.movingplatform);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function

  this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  this.physics.add.collider(this.beams,this.robos,this.killRobo,null,null)


   this.intervalo = setInterval(() => {
      this.conta()
  }, 1000);
}
update(){
  if(this.movingplatform.y<420){
      this.movingplatform.setVelocityY(100)
  }
  if(this.movingplatform.y>700){
      this.movingplatform.setVelocityY(-100)
  }
  if(this.player.y>1300){
      this.gameOver = true;
  }
  if(this.robos.getLength() == 0){
      clearInterval(this.intervalo)
      console.log(this.timer+"tempofinal")
      this.scene.start("LevelComplete", {timer: this.timer, scene: this.next,times: this.times});

  }

  if (this.gameOver)
  {
      this.scene.start("GameOver", {timer:this.timer, scene: this.cena});
  }

  if (this.cursors.left.isDown)
  {
      this.player.setVelocityX(-160);
      if(this.player.body.touching.down){
      this.player.anims.play('left', true);
      }
  }
  else if (this.cursors.right.isDown)
  {
      this.player.setVelocityX(160);
      if(this.player.body.touching.down){
      this.player.anims.play('right', true);
      }
  }
  else
  {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
  }

  if (this.cursors.up.isDown && this.player.body.touching.down)
  {
      this.player.anims.play('turn');
      this.player.setVelocityY(-400);
  }
  if(this.input.keyboard.checkDown(this.cursors.space, 1000) && this.tiros>0){
      let velocity = 300
      this.tiros= this.tiros - 1;
      console.log(this.tiros)
      this.tirosLeft.setText('tiros restantes:'+this.tiros)
      if(this.cursors.left.isDown){
          velocity = velocity * -1
      }
    beam = this.beams.create(this.player.x,this.player.y,'beam')
    beam.anims.play("beam_anim")
    beam.body.setAllowGravity(false)
    beam.rotarion += 180
    this.velocity = velocity
    beam.setVelocityX(velocity)
  }
}
hitBomb (player, bomb)
{
  this.physics.pause();

  this.player.setTint(0xff0000);

  this.player.anims.play('turn');

  this.gameOver = true;
}
killRobo (beam,robo){
 robo.destroy()
}
conta(){
  this.timer+=1
  console.log(this.timer)
}
}