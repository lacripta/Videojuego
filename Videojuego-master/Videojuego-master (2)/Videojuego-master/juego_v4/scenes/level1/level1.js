//Inicializo la función EstadoInicio vacía
MiJuego.level1 = function(juego) {};

//Este es el prototipo o "plantilla" que se cargará cada vez que inicialice una nueva función  MiJuego.EstadoInicio
MiJuego.level1.prototype = {
  //Aquí cargaremos las imágenes y todos aquellos recursos de modo que estén listos para utilizarlos en el juego
  preload() {
    juego.load.image("cielo", "scenes/level1/assets/sky.png");
    juego.load.image("suelo", "scenes/level1/assets/platform.png");
    juego.load.image("estrella", "scenes/level1/assets/star.png");
    juego.load.spritesheet("jugador", "scenes/level1/assets/dude.png", 32, 48);
    //Inicializo el movimiento de los cursores
    cursores = juego.input.keyboard.createCursorKeys();
  },

  //Aquí iniciamos diferentes componentes del juego y lo arrancamos
  create() {
    //Pinto el fondo
    juego.add.sprite(0, 0, "cielo");

    //Inicializo el grupo para el suelo y las vigas
    plataformas = juego.add.group();

    //Habilito la física para cualquier elemento del grupo
    plataformas.enableBody = true;

    //Pinto el suelo
    suelo = plataformas.create(0, juego.world.height - 64, "suelo");

    //Escalo el suelo para que ocupe el ancho completo y el doble de alto (de 400x32 a 800x64)
    suelo.scale.setTo(2, 2);

    //Evito que el suelo se "caiga" al caer un objeto sobre él
    suelo.body.immovable = true;

    //Primera viga (uso la misma imagen que para el suelo)
    viga1 = plataformas.create(400, 400, "suelo");
    viga1.body.immovable = true;

    //Segunda viga
    viga2 = plataformas.create(-150, 250, "suelo");
    viga2.body.immovable = true;

    //Dibujo el jugador con su spritesheet
    jugador = juego.add.sprite(10, 100, "jugador");

    //Habilitiamos la física al jugador
    juego.physics.arcade.enable(jugador);

    //Propiedades físicas del jugador
    jugador.body.bounce.y = 0.2; //Rebote al chocar con un objeto
    jugador.body.gravity.y = 300; //Gravedad
    jugador.body.collideWorldBounds = true; //Hago que se choque con los bordes del juego

    //Animaciones para los movimientos izquierda y derecha
    jugador.animations.add("izquierda", [0, 1, 2, 3], 10, true); //Alterna esas imágenes a 10 frames por segundo en bucle
    jugador.animations.add("derecha", [5, 6, 7, 8], 10, true); //Alterna esas imágenes a 10 frames por segundo en bucle
  },

  //Aquí añadimos lo que debe ir actualizándose a medida que transcurre el videojuego
  update() {
    //Variable que comprueba si el jugador está chocando con una plataforma
    var sobrePlataforma = juego.physics.arcade.collide(jugador, plataformas);

    //Reseteo la velocidad del jugador
    jugador.body.velocity.x = 0;

    //Mover a la izquierda
    if (cursores.left.isDown) {
      jugador.body.velocity.x = -150;
      jugador.animations.play("izquierda");

      //Mover a la derecha
    } else if (cursores.right.isDown) {
      jugador.body.velocity.x = 150;
      jugador.animations.play("derecha");
    }
    //Quedarse quieto
    else {
      jugador.animations.stop();
      jugador.frame = 4;
    }

    //Saltar (si está tocando una plataforma
    if (cursores.up.isDown && jugador.body.touching.down && sobrePlataforma) {
      jugador.body.velocity.y = -350;
    }
  }
};
