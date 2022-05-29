const canvas = document.getElementById("main-canvas");
canvas.height = window.innerHeight;
canvas.width = 350;

//get context for the canvas ... in my project i will work with 2D-Canvas
const canvasCtx = canvas.getContext("2d");

/**
 * const car = new Car(x-coordinate, y-coordinate, width, height)
 * const road = new Road(x-axis for the center of the road, width of the road);
 */
const road = new Road(canvas.width / 2, canvas.width * 0.94);
const car = new Car(road.getLaneCenter(1), 200, 30, 50);

animate();
function animate() {
  car.update(road.borders);

  //to make car move not stretch
  canvas.height = window.innerHeight;

  canvasCtx.save();
  //this to make appear that camera follow the car from above - we just simply move the canvas along with the car
  canvasCtx.translate(0, -car.y + canvas.height * 0.7);

  // draw the road
  road.draw(canvasCtx);
  //draw the car on canvas
  car.draw(canvasCtx);

  canvasCtx.restore();
  //make an illusion of movement when we call animation method again and again
  requestAnimationFrame(animate);
}
