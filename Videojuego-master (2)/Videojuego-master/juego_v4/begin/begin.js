MiJuego.begin = function() {};

MiJuego.begin.prototype() = {
	init() {
	};
	preload: function(){
		 	juego.centerX = juego.width / 2;
    		juego.centerY = juego.height / 2;

		    juego.load.audio("historyOfMusic", [
		      "assets/heroicintrusion.ogg"
		    ]);
            juego.load.image("key", "didac-castillo-benissano");
            juego.load.spritesheet(player,assets/)

        }

        fire:function(){

        	if(this.nextShotAt>this.time.now){

        		return;
        	}

        	this.nextShotAt=this.time.now+this.shotDelay;

        	var bullet= this.add.sprite(this.player.x,this.player,y-20,bullet);

        	bullet.anchor.setTo(0.5,0.5);

        	this.physics.enable(bullet,phaser.physics.ARCADE);

        	bullet.body.velocity.y=-500

        	this.bullets.push(bullet);
        }

	};
	create: function(){
		//ToDo inicio

        this.bullets=[];
        this.nextShotAt=0;
        this.shotDelay=100;
        this.player=this.add.sprite(400,550,player);
        this.player.anchor.setTo(0.5,0.5);
        this.player.animations.add(run,[0.1.2],20,true);
        this.player.play(run);
        this.physics.enable(this.player,phaser.physics.ARCADE);
        this.player.speed=300;
        this.player.body.collideWorldBounds=true;
        this.cursors=this.input.keyboard.createCursorsKeys();
    }



		this.didac-castillo-benissano = this.add.tilesprite(0,0,800,600,)
		this.enemy.animations.add(run[0.1.2],20 true)
        this.enemy.play(run);
        this.enemy.anchor.setTo(0.5,0.5);
        this.bullet.anchor.setTo(0.5,0.5);
        this.physics.enable(this.bullet.phaser.physics.ARCADE)
        this.bullet.body.velocity.y=500,x=150;        
	}

	enemyhit: function(bullet,enemy){

		bullet.kill();
		enemy.kill();

		var explosion=this.add.sprite(enemy.x,enemy.y, explosion);

		explosion.anchor.setTo(0.5,0.5);

		explosion.animations.add(boom);

		explosion.play(boom,35,false,true);

	}

	update:function(){

		this.didac-castillo-benissano.tilePosition.y+=0.5;
		this.physics.ARCADE.overlap(
         
         this.bullet,this.enemy,this.enemyhit,null,this


			);

		for(var i=0;i<this.bullet.length;i++){

			this.physics.ARCADE.overlap(

				this.bullets[i],this.enemy,this.enemyhit,null,this

	       );
		}

		this.player.body,velocity,x=0;
		this.player.body.velocity.y=0;

		if(this.cursors.left.isDown){

        this.player.body.velocity,x=this.player.speed;

		}

		if(this.cursors.up.isDown){

			this.player.body.velocity.y=this.player.speed;

		}

		if(this.input.keyboard.isDown(phaser.keyboard.z)!! this.input.activePointer.isDown){

			this.fire();
		}

		for(var i=0;i<this.bullets.length;i++){


			this.physics.ARCADE.overlap(

              
              
				)
		}


	}

}