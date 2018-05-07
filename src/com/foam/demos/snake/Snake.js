/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'com.foam.demos.snake',
  name: 'Apple',
  extends: 'foam.graphics.Box',

  implements: [
    'foam.physics.Physical',
  ],

  properties: [
    {
      name: 'vx',
      preSet: function(_, v) {
        return -0.01;
      }
    },
  ],
});


foam.CLASS({
  package: 'com.foam.demos.snake',
  name: 'SnakeHead',
  extends: 'foam.graphics.Box',

  implements: [
    'foam.physics.Physical',
  ],

  properties: [
    [ 'color', 'white' ],
    [ 'width', 26 ],
    [ 'height', 26 ]
  ],
});

foam.CLASS({
  package: 'com.foam.demos.snake',
  name: 'Snake',
  extends: 'foam.u2.Element',

  requires: [
    'com.foam.demos.snake.Apple',
    'com.foam.demos.snake.SnakeHead',
    'foam.graphics.Box',
    'foam.graphics.Label',
    'foam.physics.PhysicsEngine'
  ],

  constants: {
    SNAKE_SPEED: 3
  },

  properties: [
    {
      name: 'canvas',
      factory: function() {
        return this.Box.create({
          width: 200 * this.SNAKE_SPEED,
          height: 200 * this.SNAKE_SPEED,
          color: 'lightgray'
        });
      }
    },
    {
      name: 'apple',
      factory: function() {
        return this.Apple.create({
          border: null,
          color: 'green',
          width: 26,
          height: 26
        });
      }
    },
    { //TODO  just for action ; to be deleted 
      name: 'appleMove',
      factory: function() {
        return this.Apple.create({
          border: null,
          color: 'red',
          width: 26,
          height: 26
        });
      }
    },
    {
      name: 'snake',
      factory: function() {
        return this.SnakeHead.create();
      }
    },
    [ 'dx', 1 ], //direction
    [ 'dy', 0 ],
    {
      name: 'collider',
      factory: function() {
        return this.PhysicsEngine.create();
      }
    }
  ],

  listeners: [
    {
      name: 'onAppleMove',
      isFramed: true,
      code: function() {

        if ( this.apple.x == this.snake.x && this.apple.y == this.snake.y ) {
          var gameGool = this.Label.create({
            text: "Gool",
            align: 'center',
            x: this.canvas.width / 4,
            y: 25,
            color: 'white',
            font: '70px Arial',
            width: 200,
            height: 70
          });
          this.canvas.add(gameGool);
        //TODO stop listeners, stop all scripts
        }

        if ( this.snake.x == 200 * this.SNAKE_SPEED || this.snake.x == 0 || this.snake.y == 200 * this.SNAKE_SPEED || this.snake.y == 0 ) {
          var gameOver = this.Label.create({
            text: "GameOver",
            align: 'center',
            x: this.canvas.width / 4,
            y: 25,
            color: 'white',
            font: '70px Arial',
            width: 200,
            height: 70
          });
          this.canvas.add(gameOver);
        }

        if ( this.dx != 0 ) {
          this.snake.x += this.SNAKE_SPEED * this.dx;
          this.snake.vx *= -0.01;
        } else {
          this.snake.y += this.SNAKE_SPEED * this.dy;
          this.snake.vx *= -0.01;
        }
      }
    }
  ],

  actions: [
    {
      name: 'rUp',
      keyboardShortcuts: [ 38 /* up arrow */ ],
      code: function() {
        this.dy = -1;
        this.dx = 0;
      }
    },
    {
      name: 'rDown',
      keyboardShortcuts: [ 40 /* down arrow */ ],
      code: function() {
        this.dy = 1;
        this.dx = 0;
      }
    },
    {
      name: 'rLeft',
      keyboardShortcuts: [ 37 /* left arrow */ ],
      code: function() {
        this.dx = -1;
        this.dy = 0;
      }
    },
    {
      name: 'rRight',
      keyboardShortcuts: [ 39 /* right arrow */ ],
      code: function() {
        this.dx = 1;
        this.dy = 0;
      }
    }
  ],

  methods: [
    function initE() {
      // TODO: CViews don't attach keyboard listeners yet, so
      // we wrap canvas in an Element. This extra level can
      // be removed when it's supported.
      this.SUPER();
      this.style({
        outline: 'none'
      }).focus().add(this.canvas);
    },

    function init() {
      this.SUPER();

      // start position SnakeHead
      this.snake.x = 2 * this.SNAKE_SPEED;
      this.snake.y = 2 * this.SNAKE_SPEED;

      // just to have the action active.   
      this.appleMove.x = 0;
      this.appleMove.y = 200 * this.SNAKE_SPEED;

      this.appleMove.vx = this.appleMove.vy = 1;

      this.appleMove.x$.sub(this.onAppleMove);

      // Setup apple 
      this.apple.x = 100 * this.SNAKE_SPEED;
      this.apple.y = 100 * this.SNAKE_SPEED;

      // Setup Physics
      this.collider.add(this.appleMove, this.snake).start();

      this.canvas.add(
        this.appleMove,
        this.apple,
        this.snake);
    }
  ]
});