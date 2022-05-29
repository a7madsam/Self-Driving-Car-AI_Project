class Controls {
  constructor() {
    // 4 - direction
    this.forward = false;
    this.reverse = false;
    this.right = false;
    this.left = false;

    //Private method to listen
    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    });
  }
}
