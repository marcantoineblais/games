import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = ['grid']

  connect() {
    console.log("tetris game")

  }

  move(e) {
    console.log(e)
  }
}
