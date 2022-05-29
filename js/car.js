class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    /**
     * To make car move like Real car we need speed and acceleration
     */
    this.speed = 0;
    this.acceleration = 0.2;

    this.maxSpeed = 3;
    this.friction = 0.05;

    // for rotate the car left or right
    this.angle = 0;

    //for sensors
    this.sensors = new Sensors(this);

    //to control car movement
    this.controls = new Controls();
  }

  /**
   * update()
   * used to update the position of car
   */
  update(roadBorders) {
    this.#move();
    this.sensors.update(roadBorders);
  }
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // to control the max speed could car reach FORWARD
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    // to control the max speed could car reach BACKWARD
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    //to make car stop after releasing the button
    // for forward movement
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    // for backward movement
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    /**
     * (this.speed != 0) then car is move so we can rotate but if it not then we can not rotate
     */
    if (this.speed != 0) {
      // this flip constant to make rotate look like real life in reverse
      const flip = this.speed > 0 ? 1 : -1;
      //for left movement
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      //for right movement
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    //to fix very small movement (when we click and release instantly)
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    //to make the car move depends on what angle it rotated
    this.x -= Math.sin(this.angle) * this.speed; // we put sine here because in the unit circle the sine present in x-axis
    this.y -= Math.cos(this.angle) * this.speed; // we put cosine here because in the unit circle the cosine present in y-axis
  }
  draw(canvasCtx) {
    //we can make the rotate here by canvas method

    //to store the current frame of car
    canvasCtx.save();

    canvasCtx.translate(this.x, this.y);
    canvasCtx.rotate(-this.angle);

    canvasCtx.beginPath();
    canvasCtx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    canvasCtx.fill();

    // to restore the current frame and make animation good
    canvasCtx.restore();

    //draw sensors of the car
    this.sensors.draw(canvasCtx);
  }
}
