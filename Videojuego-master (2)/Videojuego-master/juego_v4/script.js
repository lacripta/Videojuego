//Variable juego
var config = {
  type: Phaser.AUTO,
  width: 625,
  height: 625,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      setBounds: {
        x: 0,
        y: 0,
        width: 1270,
        height: 625,
        thickness: 32
      }
    }
  }
};

var juego = new Phaser.Game(config);

//Controles por defecto (que se pueden cambir en opciones)
var controles = "flechas";
var plataformas; //Grupo para definir las características del suelo y las vigas
var suelo, viga1, viga2; //Para los diferentes elementos del grupo plataformas
var cursores, sobrePlataforma; //Para los cursores y la colisión con la plataforma
var enemyBullet;



//Creador de estados
juego.state.add("EstadoInicio", MiJuego.begin);

//Inicio el estado por defecto
juego.state.start("EstadoInicio");
