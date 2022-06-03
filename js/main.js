const carCanvas = document.getElementById("car-canvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 350;

const networkCanvas = document.getElementById("network-canvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 500;

const numberOfCarSelect = document.getElementById("numberOfCar");
const mutationRatioSelect = document.getElementById("mutationRatio");

//get context for the car canvas ... in my project i will work with 2D-Canvas
const carCtx = carCanvas.getContext("2d");

//get context for the network canvas ... in my project i will work with 2D-Canvas
const networkCtx = networkCanvas.getContext("2d");

/**
 * const car = new Car(x-coordinate, y-coordinate, width, height)
 * const road = new Road(x-axis for the center of the road, width of the road);
 */
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.94);
let N = 100;
let mutationRatio = 0.1;
mutationRatioSelect.value = mutationRatio;
if (localStorage.getItem("numberOfCar")) {
  N = Number(localStorage.getItem("numberOfCar"));
  numberOfCarSelect.value = N;
}
if (localStorage.getItem("mutationRatio")) {
  mutationRatio = Number(localStorage.getItem("mutationRatio"));
  mutationRatioSelect.value = mutationRatio;
}
const cars = generateCar(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, mutationRatio);
    }
  }
}

//simulate traffic
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2),
];

/**
 * used to generate number of cars
 * @param {number} N - number of cars you want to generate
 * @returns - array of generated cars
 */
function generateCar(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 0, 30, 50, "AI"));
  }
  return cars;
}

animate();

//to save the best car we got in localStorage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
//to delete the best car we got from localStorage
function discard() {
  localStorage.removeItem("bestBrain");
}

//edit number of the generated car
function setNumberOfCar(event) {
  localStorage.setItem("numberOfCar", event.target.value);
}
function setMutationRatio(event) {
  localStorage.setItem("mutationRatio", event.target.value);
}
function animate(time) {
  //to update each car of traffic according to the road
  for (let i = 0; i < traffic.length; i++) {
    //we pass an empty array here for each car in traffic because we do not want
    //the traffic interact with them self our focus will be in the main car
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  //to get the best car of the generated cars
  /**
   * this is out fitness function - it can be any thing than that
   * this will find always the minimum y for each generated car and chose it as the best car
   */
  bestCar = cars.find((car) => {
    return car.y === Math.min(...cars.map((car) => car.y));
  });
  //to make car move not stretch
  carCanvas.height = window.innerHeight;

  networkCanvas.height = window.innerHeight;

  carCtx.save();
  //this to make appear that camera follow the car from above - we just simply move the canvas along with the car
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // draw the road
  road.draw(carCtx);
  //draw the traffic cars
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  //to make generate less mess
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    //draw the main generated cars on canvas
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  //this for draw the animated version of neural network
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  //make an illusion of movement when we call animation method again and again
  requestAnimationFrame(animate);
}
