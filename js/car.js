class Car {
  // controlType = "KEYS" OR "DUMMY" ---- KEYS THE MAIN ONE, DUMMY THE TRAFFIC
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    /**
     * To make car move like Real car we need speed and acceleration
     */
    this.speed = 0;
    this.acceleration = 0.2;

    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    // for rotate the car left or right
    this.angle = 0;

    this.useBrain = controlType == "AI";
    //for sensors
    if (controlType !== "DUMMY") {
      this.sensors = new Sensors(this);
      //we specified the layers of out neural network
      //input - rayCounts, hidden - 6-neurons, output - 4-neurons {represent direction}
      this.brain = new NeuralNetwork([this.sensors.rayCount, 6, 4]);
    }

    //to control car movement -- we pass {controlType} to the control class to specify
    //                           which car is the main car(in other word which car is the one we want to control it with keys)
    this.controls = new Controls(controlType);
  }

  /**
   * update()
   * used to update the position of car
   */
  update(roadBorders, traffic) {
    //if the car damaged stop every thing !
    if (!this.damaged) {
      this.#move();
      //for car shape
      this.polygon = this.#createPolygon();
      //to detect damaged from the border of the road and other traffic
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensors) {
      this.sensors.update(roadBorders, traffic);
      /**
       * here we iterate through all readings of sensors,
       * and if the reading is null {theres no object detected by sensor} then return 0
       * but if not we return {1 - read.offset} because i want neurons receive high values with near object and low one's with far object
       */
      const offsets = this.sensors.readings.map((read) => {
        return read === null ? 0 : 1 - read.offset;
      });
      const output = NeuralNetwork.feedForward(offsets, this.brain);
      console.log(output);
      if (this.useBrain) {
        this.controls.forward = output[0];
        this.controls.left = output[1];
        this.controls.right = output[2];
        this.controls.reverse = output[3];
      }
    }
  }
  /**
   * Detect any crash between the main car(polygon) with the road borders and the traffic car
   * @param {array} roadBorders
   * @param {array} traffic - punch of cars represent traffic
   * @returns {boolean} - true if theres a damage, false otherwise
   */
  #assessDamage(roadBorders, traffic) {
    // to detect damage when crash with road boarders
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    // to detect damage when crash with traffic
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
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

  draw(canvasCtx, color) {
    if (this.damaged) {
      canvasCtx.fillStyle = "gray";
    } else {
      canvasCtx.fillStyle = color;
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
    if (this.sensors) {
      this.sensors.draw(canvasCtx);
    }
  }
}
