class Visualizer {
  /**
   * this method responsible of draw the network you given on the canvas
   * @param {canvas object} canvasCtx
   * @param {object} network - the network you want to draw
   */
  static drawNetwork(canvasCtx, network) {
    //specify some dimensions for the network
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = canvasCtx.canvas.width - margin * 2;
    const height = canvasCtx.canvas.height - margin * 2;

    /**
     * we gone draw this network in the canvas level by level
     */
    //the height of each level
    const levelHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        linearInterpolation(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );
      canvasCtx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        canvasCtx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }
  /**
   * this method take a level an draw the inputs and outputs of it
   * @param {canvas object} canvasCtx
   * @param {object} level - the specific level of the network that you want draw
   * @param {number} left - left position of the level you want to draw
   * @param {number} top - top position of the level you want to draw
   * @param {number} width - width of the level you want to draw
   * @param {number} height - height of the level you want to draw
   */
  static drawLevel(canvasCtx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;
    const nodeRadius = 20; //radius of the neuron

    /**
     * draw all links between inputs and outputs
     * we are going to represent weight of the link depends on it color opacity
     * - if it weight far from zero it color will be clearer then the one which near to zero
     */
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(Visualizer.#getNode(inputs, i, left, right), bottom);
        canvasCtx.lineTo(Visualizer.#getNode(outputs, j, left, right), top);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = getRGBA(weights[i][j]);
        canvasCtx.stroke();
      }
    }
    //draw inputs of specific {level}
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNode(inputs, i, left, right);
      canvasCtx.beginPath();
      canvasCtx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      canvasCtx.fillStyle = "black";
      canvasCtx.fill();
      canvasCtx.beginPath();
      canvasCtx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      canvasCtx.fillStyle = getRGBA(inputs[i]);
      canvasCtx.fill();
    }

    //draw outputs of specific {level}
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNode(outputs, i, left, right);
      canvasCtx.beginPath();
      canvasCtx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      canvasCtx.fillStyle = "black";
      canvasCtx.fill();
      canvasCtx.beginPath();
      canvasCtx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      canvasCtx.fillStyle = getRGBA(outputs[i]);
      canvasCtx.fill();

      canvasCtx.beginPath();
      canvasCtx.lineWidth = 2;
      canvasCtx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      canvasCtx.strokeStyle = getRGBA(biases[i]);
      canvasCtx.setLineDash([3, 3]);
      canvasCtx.stroke();
      canvasCtx.setLineDash([]);

      if (outputLabels[i]) {
        canvasCtx.beginPath();
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseLine = "middle";
        canvasCtx.fillStyle = "black";
        canvasCtx.strokeStyle = "white";
        canvasCtx.font = nodeRadius * 1.5 + "px Arial";
        canvasCtx.fillText(outputLabels[i], x, top + nodeRadius * 0.5);
        canvasCtx.lineWidth = 0.5;
        canvasCtx.strokeText(outputLabels[i], x, top + nodeRadius * 0.5);
      }
    }
  }

  static #getNode(node, index, left, right) {
    return linearInterpolation(
      left,
      right,
      node.length === 1 ? 0.5 : index / (node.length - 1)
    );
  }
}
