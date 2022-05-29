class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;

    this.top = -infinity;
    this.bottom = infinity;
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /**
   * getLaneCenter - get the center of the given index road lane
   * @param {number} laneIndex - index of the lane needed -- lane indexed from left to right  |0|1|2|3|....
   * @returns {double} - center point of the given index lane
   */
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      laneWidth * Math.min(laneIndex, this.laneCount - 1)
    );
  }

  draw(canvasCtx) {
    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = "white";
    for (let i = 0; i <= this.laneCount; i++) {
      /* 
      to get the middle point in x-axis for road lan ----> |   x    |   x   |
                                                           |   x    |   x   |
      */
      let x = linearInterpolation(this.left, this.right, i / this.laneCount);

      if (i > 0 && i < this.laneCount) {
        // [20,20] mean that the every dash will be 20 - the tall and the distance between them
        canvasCtx.setLineDash([20, 20]);
      } else {
        canvasCtx.setLineDash([]);
      }

      //to draw the lines of the the road;
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, this.top);
      canvasCtx.lineTo(x, this.bottom);
      canvasCtx.stroke();
    }
  }
}
