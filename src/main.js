import notify from "./Notification";

import img from "./learn.png";

notify.log("Here is my log");
//notify.announce("Here is my alert");

class Dog {
  constructor() {
    console.log("Made a dog.");
  }
}

const dog = new Dog();
