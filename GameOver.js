class GameOver extends Phaser.Scene{
  constructor() {
  super("GameOver");
}
init(data){
  console.log('init', data);
  this.timer = data.timer
  this.Scene = data.scene
}
preload(){
  this.load.image('star', 'assets/star.png');
}
create(){
  
  this.add.text(150,200,"Game Over")
  this.clickButton = this.add.text(270, 300, 'Retry!',{ fill: '#0f0' })
    .setInteractive()
    .on('pointerup', () => {
      this.scene.start(this.Scene);
  });
}
update(){

}
}