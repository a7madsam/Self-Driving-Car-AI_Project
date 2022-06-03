/**
 * our architecture of ANN is typical one fully connected layers [multi-layer Perceptron]
 * it contain three layers :
 * Output layer(controllers in my project)     # # # # 4-neurons
 *                                           // \ . . . .
 *                                          # # # # # # # 7-neurons
 * Hidden layer                             |/| those are links between all layers
 *                                          # # # # # # # 7-neurons
 *                                           \|/ . . .
 * Input layer(sensors)         ==>           # # # # # 5-neurons
 *
 *
 * We will begin build neural network by split it to two level to make implementation easier
 */
class NeuralNetwork {
  /**
   *
   * @param {array} neuronCounts - represent number of neuron in each level
   */
  constructor(neuronCounts) {
    //my neural network will be an array of levels, as I mentioned to make implementation easier
    this.levels = [];
    //simply we create the levels between layers
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }
  static feedForward(givenInput, network) {
    //to get the output for first level
    let outputs = Level.feedForward(givenInput, network.levels[0]);

    //update output for the rest of levels
    for (let i = 1; i < network.levels.length; i++) {
      //it simply putting the output of the last level we evaluate as an input of new level :)
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }
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
class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    //each link between any input and output point have weight SO,
    this.weights = [];
    // we iterate over all inputs and for each input point we define an array has size of output count,
    // because every single input should connect with each output
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    // we should put real values for biases and weight, well for now we will put random
    // values between -1 to 1 (in other word we will initialize the brine of the  car with random values)
    Level.#randomize(this);
  }

  // we make this method static because we want to serialize this object afterwards and method do not serialized
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        //set the weight for each input-output link
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    //for biases
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  /**
   * popular method that used to move input from current layer(input one) to output layer in one direction
   * - in my project i am just get the new data which received me from sensors and update the current output
   *   depends on them
   * @param {array} givenInput - new input got from the sensors about environment
   * @param {object} level - the level of neural network we work in
   * @returns {array} - the level.outputs neurons after adjust
   */
  static feedForward(givenInput, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInput[i];
    }
    //the output will be a sum between the value of the input and the weight
    //formula ==> summation(input[i]*weight[i]) -- the sum of all inputs with there link weight
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      //we can call this the threshold function
      // => called threshold because we check if the gotten sum is stratified our bias then take it if not don't
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
