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
    //if the car damaged stop every thing !
    if (!this.damaged) {
      this.#move();
      //for car shape
      this.polygon = this.#createPolygon();
      //to detect damaged
      this.damaged = this.#assessDamage(roadBorders);
    }
    this.sensors.update(roadBorders);
  }
  /**
   * Detect any crash between the car(polygon) and the road borders
   * @param {array} roadBorders
   * @returns {boolean} - true if theres a damage, false otherwise
   */
  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
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

  /**
   * @returns {array} - the coordinates of the coroners of the polygon (car)
   */
  #createPolygon() {
    //The corners of the polygon
    const points = [];
    //hypot -- used to find the sqrt of the sum of arg^2 ==> sqrt(arg1^2 + arg3^2 + arg3^2 + .....);
    //we divide by two because we want radius not diameter
    const rad = Math.hypot(this.width, this.height) / 2;

    //atan2 -- used to find the angle between the x-axis(width) and y-axis(height)
    const alpha = Math.atan2(this.width, this.height);

    //top right point
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    //top left point
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    //bottom left point
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    //bottom right point
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  draw(canvasCtx) {
    if (this.damaged) {
      canvasCtx.fillStyle = "gray";
    } else {
      canvasCtx.fillStyle = "black";
    }
    canvasCtx.beginPath();
    // it is like move the pencel to begin draw
    canvasCtx.moveTo(this.polygon[0].x, this.polygon[0].y);

    //draw lines to all other points of polygon
    for (let i = 1; i < this.polygon.length; i++) {
      canvasCtx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    canvasCtx.fill();

    //draw sensors of the car
    this.sensors.draw(canvasCtx);
  }
}
