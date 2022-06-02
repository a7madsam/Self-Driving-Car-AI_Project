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
const car = new Car(road.getLaneCenter(1), 200, 30, 50, "AI");

//simulate traffic
const traffic = [new Car(road.getLaneCenter(1), 100, 30, 50, "DUMMY", 2)];

animate();
function animate() {
  //to update each car of traffic according to the road
  for (let i = 0; i < traffic.length; i++) {
    //we pass an empty array here for each car in traffic because we do not want
    //the traffic interact with them self our focus will be in the main car
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  //to make car move not stretch
  canvas.height = window.innerHeight;

  canvasCtx.save();
  //this to make appear that camera follow the car from above - we just simply move the canvas along with the car
  canvasCtx.translate(0, -car.y + canvas.height * 0.7);

  // draw the road
  road.draw(canvasCtx);
  //draw the traffic cars
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(canvasCtx, "red");
  }
  //draw the main car on canvas
  car.draw(canvasCtx, "blue");

  canvasCtx.restore();
  //make an illusion of movement when we call animation method again and again
  requestAnimationFrame(animate);
}
