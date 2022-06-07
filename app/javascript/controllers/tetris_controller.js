import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = ['grid']

  connect() {
    console.log("tetris game")
    this.cols = 11
    this.rows = 21
    this.end = this.rows * this.cols

    this.straigtPiece = [
      {radius: 2, x: 6, y: 3},
      {radius: 1, x: 6, y: 2},
      {radius: 1, x: 6, y: 1},
      {radius: 2, x: 6, y: 0}
    ]

    this.piece = this.straigtPiece
    this.#drawPiece()
    const timer = setInterval(this.#moveDown(), 1000)
  }

  move(e) {
    if (e === 'ArrowLeft' || e === 'a') {
      this.moveLeft()
    } else if (e === 'ArrowRight' || e === 'd') {
      this.moveRigth()
    } else if (e === 'ArrowDown' || e === 's') {
      this.moveDown()
    }
  }

  #drawPiece() {
    this.piece.forEach((block) => {
      this.gridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("empty")
          space.classList.add("grey")
        }
      })
    })
  }

  #moveLeft() {

  }

  #moveRigth() {

  }

  #moveDown() {
    const canMove = this.piece.every((block) => {
      block.y < this.rows && document.getElementById(`${block.x},${block.y + 1}`).classList !== "taken"
    })

    if (canMove) {
      this.piece.forEach((block) => {
        this.gridTargets.forEach((space) => {
          if (space.id === `${block.x},${block.y}`) {
            space.classList.add("empty")
            space.classList.remove("grey")
          }
        })
        block.y += 1
      })
      this.#drawPiece()
    }
  }
}
