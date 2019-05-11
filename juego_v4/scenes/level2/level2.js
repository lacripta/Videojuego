MiJuego.level2 = function() {};

MiJuego.level2.prototype = {
  init() {},
  preload() {
    juego.knight = {};
    juego.centerX = juego.width / 2;
    juego.centerY = juego.height / 2;

    juego.load.audio("firebolt_sfx", [
      "scenes/level2/assets/fireball-cast-1.ogg"
    ]);
    juego.load.spritesheet(
      "mage",
      "scenes/level2/assets/idle_sprite.png",
      408,
      424
    );
    juego.load.spritesheet(
      "knight",
      "scenes/level2/assets/knight_sprite.png",
      475,
      470
    );

    juego.load.image("fire_bolt", "scenes/level2/assets/fire_bolt.png");
    juego.load.image("bg", "scenes/level2/assets/mapa_2.png");
    juego.load.image("enemyBullet", "scenes/level2/assets/");
  },
  create() {
    juego.world.setBounds();
    juego.background = juego.add.image(0, 0, "bg");

    juego.firebolt_sfx = juego.add.audio("firebolt_sfx");

    juego.mage = juego.add.sprite(100, 550, "mage");
    juego.mage.scale.setTo(0.1, 0.1);
    juego.mage.animations.add("cast_fire_bolt", [1, 2, 0], 8, false);

    for (let row = 0; row < 3; row++) {
      let offsetY = row * 40;

      for (let col = 0; col < 2; col++) {
        let offsetX = col * 80;
        let knight = juego.add.sprite(
          juego.centerX + 40 + offsetX,
          juego.centerY - (-150)+ offsetY,
          "knight"
        );
        knight.scale.setTo(0.2, 0.2);
        knight.scale.x *= -1;
        knight.inputEnabled = true;

        knight.animations.add("hurt", [1, 2, 0], 8, false);

        knight.events.onInputDown.add(function(sprite, pointer) {
          juego.mage.play("cast_fire_bolt");
          juego.firebolt_sfx.play();
          sprite.play("hurt");
        }, this);

        juego.knight["kn" + col + row] = knight;
      }
    }
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
  },

  update() {}
};
