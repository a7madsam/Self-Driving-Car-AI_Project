
# Self-Driving Car Simulation

This project is intended to simulate self driving car model and how they make their decisions whenever obstacles comes into their path however real cars have much more complex algorithms, decision making processes and deep learning concepts. This is a simplified project of the same.


## Why did We build it ?
We built this project as a requirement for an artificial intelligence course at my university and also to help me gain a deeper understanding of the topic of neural networks and genetic algorithms.


## Detials of the project
This section contains a deep explanation of the project with all its components.
### Table of Contents

* [Car driving mechanics](#car-driving-mechanics)
* [Road definition](#road-definition)
* [Artificial sensors](#artificial-sensors)
* [Collision detection](#collision-detection)
* [Traffic simulation](#traffic-simulation)
* [Neural network](#neural-network)
* [Visualizing neural networks](#visualizing-neural-networks)
* [Genetic Algorithm](#genetic-algorithm)
### Car driving mechanics
In this project, We draw the car via Canvas JS and I tried to make the car's movement close to reality in terms of turning, reversing and many other things.

- In terms of turning, We relied on the turning angle after determining it depending on the unit circle.
  <div><img width="119" alt="carDrivingMechanics_1" src="https://user-images.githubusercontent.com/63476270/172000191-12b8b2b1-62c8-425e-a6b1-a125382c1d2f.png"></div>

- In terms of forward and backward movement, it is controlled with speed and acceleration, the speed becomes constant when the vehicle reaches the specified maximum speed.

### Road definition
The road is created using Canvas with a dynamic number of lanes. 
* The number of lanes is determined and the lane split based on the given number by **linear interpolation**.
<div><img width="261" alt="road" src="https://user-images.githubusercontent.com/63476270/172000357-80ccbad4-e156-4bee-9294-1cee260719f1.png">
</div>

* Linear interpolation:
```js
/**
* Find linear Interpolation - in another word we ask the function to give us the point between A and B depends on t
* t -  actually is the percentage of how the return number is far from A
* EX. if t == 0 then the return value is A ==> A + (B - A)*0 = A
*     if t == 1 then the return value is B ==> A + (B - A)*1 = A + B - A = B
* @param {number} A - left point
* @param {number} B - right point
* @param {double} t - the ration between left and right point
* @returns {double} - the linear interpolation between A and B
*/
function linearInterpolation(A, B, t) {
return A + (B - A) * t;
} 
```

### Artificial sensors
We build a simple car model with 5 rays upfront (as an initial value, you can customize that). These rays will detect cars and road borders.
* It has a certain length and spread in which it tries to detect the obstacle.
* Each of them has its reading so that it is displayed on it in a different color and also stored for use.
<div><img width="218" alt="Screenshot 2022-06-04 163935" src="https://user-images.githubusercontent.com/63476270/172003194-26ae82d4-4709-4cfb-8fa4-be9b3a04b4d2.png"</div>

### Collision detection
Any damage that occurs to the car is monitored by checking if there is any intersection between the car and any other obstacle
and if the car is damaged, stop immediately.
<div><img src="https://user-images.githubusercontent.com/63476270/172002348-45765d91-c00f-4f7c-bd92-e735d2d71244.gif"/</div>

  * This intersection is checked by Intersection of Polygons:
```js
/**
 *  Method help to find if there is an intersection between two polygon by check if there intersection
 *  between sides segments of the two polygon
 * @param {array} poly1 - array of corner coordinates
 * @param {array} poly2 - array of corner coordinates
 * @returns {boolean} - true if there is intersection between two polygon, false otherwise
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
```
### Traffic simulation
Traffic is represented by creating multiple cars as a dummy car moving forward.
  <div><img width="263" alt="Screenshot 2022-06-04 164124" src="https://user-images.githubusercontent.com/63476270/172003288-1212dce3-4100-4ce4-94f1-f168c15fe562.png">
  </div>

### Neural network
Our architecture of ANN is typical one fully connected layers [multi-layer Perceptron]
* It contain three layers :
  - Input layer (sensors).
  - Hidden layer.
  - Output layer (controlars).
* We built our neural network by splitting it into two levels to make implementation easier.
The levels are linked by links that have random weights at first, These weights range from [-1, 1]
* Each level Output has biases ranging from [-1, 1]

  <div><img width="540" alt="Screenshot 2022-06-04 165010" src="https://user-images.githubusercontent.com/63476270/172004461-771ae124-cf73-428e-9a7f-eb1ed5351d24.png"></div>
#### How will neural networks work in our project?
It all starts when the sensors pick up something close to them, 
then these signals are read, analyzed and sent as inputs to our first level in neural networks, 
then each output we have at the first level is calculated as the sum of the link weight multiplied by the input, 
and checked if possible We take advantage of this output (i.e., can it help us to avoid a certain obstacle) by comparing it with bias, 
and accordingly making it an output, and this process is repeated at all the levels we have in the neural networks.

#### How will you learn neural networks in a project?
* Before the learning process, we must define our goal.
* Our goal in the project is to enable the car to avoid the obstacles in front of it and move forward as much as possible.
Therefore, the fit coupling will depend on the value of the y-coordinates for the car, 
whereby the best car will be defined as the car that has the least y-coordinates (i.e. the most successful and advanced car) out of all the cars that have been generated
 and its data (i.e. its brain) will be saved for later use.
* Note: we will use localstorage to store best car brain.

### Visualizing neural networks
All layers in our neural networks (all neurons, connections with weights, biases, and interactions) are represented as an animated graph that explains the process of data transmission from one level to another.

### Genetic Algorithm
The genetic algorithm of the project is to perform mutations in different proportions on the best selected car and generate several cars from them to obtain the best possible results from each generation
```js
 /**
   * This mutate function gone mutate biases and weights for each level in out network depends on ratio so,
   * if ratio = 1 ==> we will get full mutation (random number)
   * if ratio = 0 ==> then nothing will happen (there is no mutate)
   * if ration between -1 and 1 we will get a value far from the original one depends on the ratio
   * @param {object} network - the network you need to mutate
   * @param {number} amount - the ratio of mutate
   */
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = linearInterpolation(
          level.biases[i],
          Math.random() * 2 - 1,
          amount
        );
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = linearInterpolation(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}
```
## Preview
**Try it!! :**
<a href="https://a7madsam.github.io/Self-Driving-Car-AI_Project/">Self Driving Car</a>

<img width="217" alt="Screenshot 2022-06-04 172926" src="https://user-images.githubusercontent.com/63476270/172007087-db88ac96-e27d-44f1-a68b-130560edba0d.png">

<img src="https://user-images.githubusercontent.com/63476270/172006086-a86079af-a0d0-4935-8c67-8c530a2b9550.gif"/>
  

## Authors
- [@A7madsam](https://www.github.com/a7madsam)
- [@AboodW](https://www.github.com/AboodW)


  

                                                 


