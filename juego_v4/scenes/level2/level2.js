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
      "scenes/level2/assets/knight_sprite_2.png",
      475,
      470
    );

    juego.load.image("fire_bolt", "scenes/level2/assets/fire_bolt.png");
    juego.load.image("bg", "scenes/level2/assets/mapa_2.png");
    juego.load.image("enemyBullet", "scenes/level2/assets/");
    juego.load.image("key", "scenes/level2/assets/boss_key.png");
  },
  create() {
    juego.world.setBounds();
    juego.background = juego.add.image(0, 0, "bg");
    juego.key = juego.add.image(0, 0, "key");
    juego.key.visible = false;
    juego.key.statistics = {
      owner: undefined
    };
    juego.firebolt_sfx = juego.add.audio("firebolt_sfx");

    juego.mage = juego.add.sprite(100, 500, "mage");
    juego.mage.scale.setTo(0.15, 0.15);
    juego.mage.animations.add("cast_fire_bolt", [1, 2, 0], 8, false);

    juego.mage.animations.currentAnim.onComplete.add(function(
      target,
      animation
    ) {
      if (juego.key.statistics.owner.statistics.id === target.statistics.id) {
        target.frame = 5;
      }
    });

    juego.mage.statistics = {
      id: "mage",
      health: 800,
      power: 12,
      defense: {
        blunt: 4,
        pierce: 4,
        magic: 16
      },
      pouch: {
        slot1: undefined,
        slot2: undefined,
        slot3: undefined,
        slot4: undefined
      },
      spells: {
        firebolt: {
          name: "Firebolt",
          animation: "cast_fire_bolt",
          power: 1
        },
        nova: {
          name: "Nova",
          animation: "cast_nova",
          power: 4
        },
        heal: {
          name: "Heal",
          animation: "cast_heal",
          power: 6
        }
      }
    };

    for (let row = 0; row < 3; row++) {
      let offsetY = row * 40;

      for (let col = 0; col < 2; col++) {
        let offsetX = col * 80;
        let id = "kn" + col + row;
        let knight = juego.add.sprite(
          juego.centerX + 40 + offsetX,
          juego.centerY - -150 + offsetY,
          "knight"
        );

        if (!juego.key.statistics.owner) {
          juego.key.statistics.owner = knight;
          knight.frame = 5;
        }

        knight.statistics = {
          id: id,
          health: 10,
          power: 2,
          pouch: {
            slot1: juego.key
          },
          defense: {
            blunt: 8,
            pierce: 4,
            magic: 0
          }
        };

        knight.scale.setTo(0.2, 0.2);
        knight.scale.x *= -1;
        knight.inputEnabled = true;

        let hurt = knight.animations.add("hurt", [1, 2, 0], 8, false);
        let heal = knight.animations.add("heal", [3, 4, 0], 8, false);
        let die = knight.animations.add("die", [6, 7, 8], 8, false);

        knight.motion = {
          hurt: hurt,
          heal: heal,
          die: die
        };

        knight.events.onInputDown.add(function(sprite, pointer) {
          let knight = juego.knight[sprite.statistics.id];
          juego.mage.play("cast_fire_bolt");
          juego.firebolt_sfx.play();

          sprite.statistics.health -=
            juego.mage.statistics.spells.firebolt.power;

          if (sprite.statistics.health <= 0) {
            sprite.play("die");

            if (
              juego.key.statistics.owner.statistics.id === sprite.statistics.id
            ) {
              juego.mage.statistics.pouch.slot1 = juego.key;
              juego.key.statistics.owner = juego.mage;
              juego.mage.frame = 5;
            }

            setTimeout(function() {
              sprite.destroy();
            }, 1000);
          } else {
            sprite.frame = 0;
            sprite.play("hurt");
          }

          sprite.animations.currentAnim.onComplete.add(function(
            target,
            animation
          ) {
            if (
              juego.key.statistics.owner.statistics.id === target.statistics.id
            ) {
              target.frame = 5;
            }
          });
        }, this);

        juego.knight[id] = knight;
      }
    }
  },

  update() {}
};
