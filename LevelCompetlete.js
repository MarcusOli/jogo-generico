class LevelComplete extends Phaser.Scene{
  constructor() {
  super("LevelComplete");
}
init(data){
  console.log('init', data);
  this.timer = data.timer
  this.Scene = data.scene
  this.times = data.times
}
preload(){
  this.load.image('star', 'assets/star.png');
}
create(){
  this.add.text(20, 20, "Level Complete");
  if(this.timer<=this.times.low){
      for(let i=0;i<3;i++){
          this.add.image(250+i*40,170,"star")
      }
  }else if(this.timer<=this.times.medium){
      for(let i=0;i<2;i++){
          this.add.image(250+i*40,170,"star")
      }
  }else{
      this.add.image(250,170,"star")
  }
  this.add.text(150,200,"Tempo Gasto:"+this.timer+ " segundos")
  if(this.Scene == "Scene4"){
  this.add.text(200,320,"Parece que você Zerou o jogo,parabens por gastar seu tempo")    
  }else{
  this.clickButton = this.add.text(270, 300, 'Next Level!',{ fill: '#0f0' })
    .setInteractive()
    .on('pointerup', () => {
        console.log(this.Scene)
      this.scene.start(this.Scene);
  });
  }
}
update(){

}
}