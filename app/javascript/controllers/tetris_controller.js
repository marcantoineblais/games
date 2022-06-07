import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = ['grid', 'startBtn']

  connect() {
    console.log("tetris game")
    this.cols = 11
    this.rows = 21
    this.end = this.rows * this.cols
  }

  start(e) {
    e.currentTarget.outerHTML = ""
    this.newPiece()
  }

  newPiece() {
    const straigtPiece = [
      {color: 'grey', radiusX: -2, radiusY: -2, x: 6, y: 3},
      {color: 'grey', radiusX: -1, radiusY: -1, x: 6, y: 2},
      {color: 'grey', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'grey', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]

    const lPiece = [
      {color: 'orange', radiusX: 1, radiusY: -1, x: 5, y: 2},
      {color: 'orange', radiusX: 0, radiusY: 0, x: 6, y: 2},
      {color: 'orange', radiusX: 1, radiusY: 1, x: 6, y: 1},
      {color: 'orange', radiusX: 2, radiusY: 2, x: 6, y: 0}
    ]

    this.piece = {blocks: lPiece, falling: true}

    this.#drawPiece()
    this.move = setInterval(() => {
      this.#moveDown()
    }, 1000)
  }

  moveInput(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.#moveLeft()
    }

    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.#moveRight()
    }

    if (e.key === 'ArrowDown' || e.key === 's') {
      this.#moveDown()
    }

    if ((e.key === ' ' || e.key === 'e')) {
      this.#rotate()
    }
  }

  #drawPiece() {
    this.piece.blocks.forEach((block) => {
      this.gridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("empty")
          space.classList.add(`${block.color}`)
          space.classList.add("active")
        }
      })
    })
  }

  #stopFalling() {
    this.piece.blocks.forEach((block) => {
      this.gridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("active")
          space.classList.add("taken")
        }
      })
      this.piece.falling = false
    })
  }

  #moveLeft() {
    const canMove = this.piece.blocks.every((block) => {
      return block.x > 0 &&
      !document.getElementById(`${block.x - 1},${block.y}`).classList.value.includes("taken") &&
      this.piece.falling
    })

    if (canMove) {
      this.piece.blocks.forEach((block) => {
        this.gridTargets.forEach((space) => {
          if (space.id === `${block.x},${block.y}`) {
            space.classList.add("empty")
            space.classList.remove(`${block.color}`)
          }
        })
        block.x -= 1
      })
      this.#drawPiece()
    }
  }

  #moveRight() {
    const canMove = this.piece.blocks.every((block) => {
      return block.x < this.cols &&
      !document.getElementById(`${block.x + 1},${block.y}`).classList.value.includes("taken")
      this.piece.falling
    })

    if (canMove) {
      this.piece.blocks.forEach((block) => {
        this.gridTargets.forEach((space) => {
          if (space.id === `${block.x},${block.y}`) {
            space.classList.add("empty")
            space.classList.remove(`${block.color}`)
          }
        })
        block.x += 1
      })
      this.#drawPiece()
    }
  }

  #moveDown() {
    const canMove = this.piece.blocks.every((block) => {
      return block.y < this.rows &&
      !document.getElementById(`${block.x},${block.y + 1}`).classList.value.includes("taken") &&
      this.piece.falling
    })

    if (canMove) {
      this.piece.blocks.forEach((block) => {
        this.gridTargets.forEach((space) => {
          if (space.id === `${block.x},${block.y}`) {
            space.classList.add("empty")
            space.classList.remove(`${block.color}`)
          }
        })
        block.y += 1
      })
      this.#drawPiece()
    } else {
      clearInterval(this.move)
      this.#stopFalling()
      this.newPiece()
    }
  }

  #rotate() {

    let canMove
    let offSet = 0

    canMove = this.piece.blocks.every((block) => {
      return block.y + block.radiusY <= this.rows && block.y + block.radiusY >= 0 &&
      block.x + block.radiusX <= this.cols && block.x + block.radiusX >= 0 &&
      !document.getElementById(`${block.x + block.radiusX},${block.y + block.radiusY}`).classList.value.includes("taken") &&
      this.piece.falling
    })

    if (!canMove) {
      canMove = this.piece.blocks.every((block) => {
        return block.y + block.radiusY <= this.rows && block.y + block.radiusY >= 0 &&
        (block.x + block.radiusX -1) <= this.cols && (block.x + block.radiusX -1) >= 0 &&
        !document.getElementById(`${block.x + block.radiusX - 1},${block.y + block.radiusY}`).classList.value.includes("taken") &&
        this.piece.falling
      })
      offSet = -1
    }

    if (!canMove) {
      canMove = this.piece.blocks.every((block) => {
        return block.y + block.radiusY <= this.rows && block.y + block.radiusY >= 0 &&
        (block.x + block.radiusX -2) <= this.cols && (block.x + block.radiusX -2) >= 0 &&
        !document.getElementById(`${block.x + block.radiusX - 2},${block.y + block.radiusY}`).classList.value.includes("taken") &&
        this.piece.falling
      })
      offSet = -2
    }

    if (!canMove) {
      canMove = this.piece.blocks.every((block) => {
        return block.y + block.radiusY <= this.rows && block.y + block.radiusY >= 0 &&
        (block.x + block.radiusX +1) <= this.cols && (block.x + block.radiusX +1) >= 0 &&
        !document.getElementById(`${block.x + block.radiusX + 1},${block.y + block.radiusY}`).classList.value.includes("taken") &&
        this.piece.falling
      })
      offSet = 1
    }

    if (!canMove) {
      canMove = this.piece.blocks.every((block) => {
        return block.y + block.radiusY <= this.rows && block.y + block.radiusY >= 0 &&
        (block.x + block.radiusX +2) <= this.cols && (block.x + block.radiusX +2) >= 0 &&
        !document.getElementById(`${block.x + block.radiusX + 2},${block.y + block.radiusY}`).classList.value.includes("taken") &&
        this.piece.falling
      })
      offSet = 2
    }

    if (canMove) {
      this.piece.blocks.forEach((block) => {
        this.gridTargets.forEach((space) => {
          if (space.id === `${block.x},${block.y}`) {
            space.classList.add("empty")
            space.classList.remove(`${block.color}`)
          }
        })
        block.x += offSet
      })
      this.#afterRotation()
      this.#drawPiece()
    }

  }

  #afterRotation() {
    this.piece.blocks.forEach((block) => {
      block.x += block.radiusX
      block.y += block.radiusY

      if (block.radiusX < 0 && block.radiusY < 0) {
        block.radiusX = -block.radiusX
      } else if (block.radiusX > 0 && block.radiusY < 0) {
        block.radiusY = -block.radiusY
      } else if (block.radiusX > 0 && block.radiusY > 0) {
        block.radiusX = -block.radiusX
      } else if (block.radiusX < 0 && block.radiusY > 0) {
        block.radiusY = -block.radiusY
      }
    })
  }
}
