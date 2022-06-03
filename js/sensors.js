class Sensors {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150; // mean the range of each individual ray
    this.raySpread = Math.PI / 2; // the angle between rays - Math.PI / 4 = 45 degree

    this.rays = [];
    this.readings = []; //this responsible to tell/store for each ray if it close/near to any border or not
  }
  update(roadBorders, traffic) {
    this.#raysConfig();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }
  #getReading(ray, roadBorders, traffic) {
    let touches = []; //to store all intersection point of the ray and other component in the track
    for (let i = 0; i < roadBorders.length; i++) {
      //ray[0] - start point of ray, ray[1], end point on the ray
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      ); // we send the ray x and y coordinates , and the border coordinates
      if (touch) {
        // if we find a touch then store it
        touches.push(touch);
      }
    }
    //to make sensors detect any traffic
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }
    if (touches.length === 0) {
      return null;
    } else {
      /**
       * 1- we extract all the offsets (the distance between the center of the car and the intersection)
       * 2- find the minimum distance among them
       * 3- return the intersect that has the minimum intersection
       */
      const offsets = touches.map((element) => element.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((element) => element.offset === minOffset);
    }
  }
  #raysConfig() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle; //we add this.car.angle to th linear Interpolation to make these sensors lines move and rotate with the car

      const start = { x: this.car.x, y: this.car.y }; // basically the middle point of the car
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]); // as segment
    }
  }
  draw(canvasCtx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      canvasCtx.beginPath();
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "yellow";
      canvasCtx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      canvasCtx.lineTo(end.x, end.y);
      canvasCtx.stroke();

      canvasCtx.beginPath();
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "black";
      canvasCtx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      canvasCtx.lineTo(end.x, end.y);
      canvasCtx.stroke();
    }
  }
}
