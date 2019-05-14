MiJuego.level2 = function() {};

MiJuego.level2.prototype = {
  init() {},
  
  preload() {
    juego.knight = {};
    juego.centerX = juego.width / 2;
    juego.centerY = juego.height / 2;

    juego.load.audio("firebolt_sfx", [
      "scenes/level2/assets/sfx_fireball-cast-1.ogg"
    ]);
    juego.load.audio("heal_sfx", ["scenes/level2/assets/sfx_heal_cast.ogg"]);
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
    juego.load.spritesheet(
      "enemy_mage",
      "scenes/level2/assets/enemy_mage_sprite.png",
      408,
      424
    );

    juego.load.image("fire_bolt", "scenes/level2/assets/fire_bolt.png");
    juego.load.image("bg", "scenes/level2/assets/mapa_2.png");
    juego.load.image("key", "scenes/level2/assets/boss_key.png");
  },
  create() {
    juego.world.setBounds();
    juego.background = juego.add.image(0, 0, "bg");

    juego.enemyBatallion = {
      id: "main_force",
      support: {},
      troops: [],
      troopHit: function(target) {
        let that = this;
        if (!target.alive) {
          console.log("troop already defeated");
          return;
        }
        if (that.support.statistics.casting) {
          console.log(
            that.support.statistics.id + ", is already casting spell " + ""
          );
          return;
        }
        if (target.statistics.health <= 4) {
          that.support.statistics.busy = true;
          that.support.statistics.spells.prepareHeal.cast(target);
          setTimeout(function() {
            if (target.alive) {
              that.support.statistics.spells.prepareHeal.cancel(target);
              that.support.statistics.spells.heal.cast(target);

              target.motion.heal.play();

              that.support.statistics.busy = false;
              that.support.statistics.spells.heal.cancel(target);
            } else {
              that.support.statistics.spells.prepareHeal.cancel(target);
              console.log(
                target.statistics.id + " has died before beign healed."
              );
            }
          }, 3000);
        }
      },
      troopDefeated: function(target) {
        console.log(target.statistics.id + " has been defeated.");
      }
    };

    this.addLevelKey();
    juego.mage = this.addMainCharacter();

    let enemyMage = this.addEnemyWizard();
    juego.enemyBatallion.support = enemyMage;

    for (let row = 0; row < 3; row++) {
      let offsetY = row * 40;

      for (let col = 0; col < 2; col++) {
        let offsetX = col * 80;
        let id = "kn" + col + row;

        let knight = this.addEnemyKnight(id, offsetX, offsetY);

        if (!juego.key.statistics.owner) {
          juego.key.statistics.owner = knight;
          knight.frame = 5;
          knight.statistics.pouch.slot1 = juego.key;
        }
        juego.enemyBatallion.troops.push(knight);
      }
    }
  },
  addEnemyWizard() {
    let enemy_mage = juego.add.sprite(600, 500, "enemy_mage");
    enemy_mage.scale.setTo(0.15, 0.15);
    enemy_mage.scale.x *= -1;

    enemy_mage.statistics = {
      id: "enemy_mage_support",
      health: 10,
      power: 2,
      busy: false,
      pouch: {
        slot1: undefined,
        slot2: undefined,
        slot3: undefined,
        slot4: undefined
      },
      defense: {
        blunt: 1,
        pierce: 1,
        magic: 4
      },
      spells: {
        heal: {
          name: "Heal",
          power: 3,
          animation: enemy_mage.animations.add(
            "cast_heal",
            [1, 2, 0],
            8,
            false
          ),
          sfx: juego.add.audio("heal_sfx"),
          casting: false,
          cast: function(target) {
            if (!target.alive) {
              console.log(target.statistics.id + ", already defeated");
              return;
            }
            if (!this.casting) {
              console.log("casting heal spell at " + target.statistics.id);
              this.animation.play();
              this.sfx.play();
              this.casting = true;
              target.statistics.health += this.power;
            } else {
              console.log(this.name + ": spell is already beign casted.");
            }
          },
          cancel: function(target) {
            console.log(this.name + ": spell has finished.");
            this.casting = false;
          }
        },
        prepareHeal: {
          name: "Prepare Heal",
          power: 3,
          animation: enemy_mage.animations.add(
            "prepare_heal",
            [1, 0],
            12,
            true
          ),
          casting: false,
          cast: function(target) {
            if (!target.alive) {
              console.log(target.statistics.id + ", already defeated");
              return;
            }
            if (!this.casting) {
              console.log(
                this.name + ": casting spell at " + target.statistics.id
              );
              this.animation.play();
              this.casting = true;
            } else {
              console.log(this.name + ": spell is already beign casted.");
            }
          },
          cancel: function(target) {
            console.log(this.name + ": spell has finished.");
            this.animation.stop();
            this.casting = false;
          }
        }
      }
    };
    return enemy_mage;
  },
  addEnemyKnight(id, offsetX, offsetY) {
    let knight = juego.add.sprite(
      juego.centerX + 40 + offsetX,
      juego.centerY - -150 + offsetY,
      "knight"
    );

    knight.statistics = {
      id: id,
      health: 10,
      power: 2,
      pouch: {
        slot1: undefined,
        slot2: undefined,
        slot3: undefined,
        slot4: undefined
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

    knight.events.onInputDown.add(this.enemyKinghtHitCallback, this);
    return knight;
  },
  addLevelKey() {
    juego.key = juego.add.image(0, 0, "key");
    juego.key.visible = false;
    juego.key.statistics = {
      owner: undefined
    };
  },
  addMainCharacter() {
    let mage = juego.add.sprite(100, 500, "mage");
    mage.scale.setTo(0.15, 0.15);
    let fireboltAnim = mage.animations.add(
      "cast_fire_bolt",
      [1, 2, 0],
      8,
      false
    );
    let fireboltSfx = juego.add.audio("firebolt_sfx");

    mage.animations.currentAnim.onComplete.add(function(_self) {
      if (juego.key.statistics.owner.statistics.id === _self.statistics.id) {
        _self.frame = 5;
      }
    });

    mage.statistics = {
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
          animation: fireboltAnim,
          sfx: fireboltSfx,
          power: 1,
          cast: function(target) {
            this.animation.play();
            this.sfx.play();
            target.statistics.health -= this.power;
          }
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
    return mage;
  },
  enemyKinghtHitCallback(sprite, pointer) {
    juego.mage.statistics.spells.firebolt.cast(sprite);
    juego.enemyBatallion.troopHit(sprite);

    if (sprite.statistics.health <= 0) {
      sprite.motion.die.play();

      if (juego.key.statistics.owner.statistics.id === sprite.statistics.id) {
        juego.mage.statistics.pouch.slot1 = juego.key;
        juego.key.statistics.owner = juego.mage;
        juego.mage.frame = 5;
      }

      setTimeout(function() {
        sprite.destroy();
        juego.enemyBatallion.troopDefeated(sprite);
      }, 1000);
    } else {
      sprite.frame = 0;
      sprite.motion.hurt.play();
    }

    sprite.animations.currentAnim.onComplete.add(function(_self, animation) {
      if (juego.key.statistics.owner.statistics.id === _self.statistics.id) {
        _self.frame = 5;
      }
    });
  },
  update() {}
};
