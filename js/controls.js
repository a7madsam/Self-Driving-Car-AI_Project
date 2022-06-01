class Controls {
  constructor(controlType) {
    // 4 - direction
    this.forward = false;
    this.reverse = false;
    this.right = false;
    this.left = false;

    //different control for different type of car - main or traffic
    switch (controlType) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
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
