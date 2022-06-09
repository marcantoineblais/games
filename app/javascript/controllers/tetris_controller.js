import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = ['grid', 'row', 'startBtn', 'replayBtn', 'gameOver', 'score', 'level']

  connect() {
    const game = this.element
    this.cols = 11
    this.rows = 21
    this.speed = 1000
    this.destroyedLines = 0
    this.inputs = []
    this.score = 0
    this.frame = 16.6
    this.game = true
  }

  start(e) {
    e.currentTarget.style.display = "none"
    this.startInputBuffer()
    this.newPiece()
  }

  replay(e) {
    this.gameOverTarget.style.display = "none"

    this.gridTargets.forEach((space) => {
      space.className = 'grid'
    })

    this.speed = 1000
    this.score = 0
    this.destroyedLines = 0
    this.game = true

    this.#drawLevel()
    this.#drawScore()
    this.newPiece()
  }

  newPiece() {

    const straigtPiece = [
      {color: 'pink', radiusX: -2, radiusY: -2, x: 6, y: 3},
      {color: 'pink', radiusX: -1, radiusY: -1, x: 6, y: 2},
      {color: 'pink', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'pink', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]

    const lPiece = [
      {color: 'orange', radiusX: 1, radiusY: -1, x: 5, y: 2},
      {color: 'orange', radiusX: 0, radiusY: 0, x: 6, y: 2},
      {color: 'orange', radiusX: 1, radiusY: 1, x: 6, y: 1},
      {color: 'orange', radiusX: 2, radiusY: 2, x: 6, y: 0}
    ]

    const reversedLPiece = [
      {color: 'purple', radiusX: -1, radiusY: 1, x: 6, y: 2},
      {color: 'purple', radiusX: 0, radiusY: 0, x: 5, y: 2},
      {color: 'purple', radiusX: 1, radiusY: 1, x: 5, y: 1},
      {color: 'purple', radiusX: 2, radiusY: 2, x: 5, y: 0}
    ]

    const zPiece = [
      {color: 'blue', radiusX: 1, radiusY: -1, x: 4, y: 1},
      {color: 'blue', radiusX: 0, radiusY: 0, x: 5, y: 1},
      {color: 'blue', radiusX: 1, radiusY: 1, x: 5, y: 0},
      {color: 'blue', radiusX: 0, radiusY: 2, x: 6, y: 0}
    ]

    const reversedZPiece = [
      {color: 'red', radiusX: -1, radiusY: 1, x: 7, y: 1},
      {color: 'red', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'red', radiusX: 1, radiusY: 1, x: 6, y: 0},
      {color: 'red', radiusX: 2, radiusY: 0, x: 5, y: 0}
    ]

    const tPiece = [
      {color: 'green', radiusX: -1, radiusY: -1, x: 6, y: 2},
      {color: 'green', radiusX: -1, radiusY: 1, x: 7, y: 1},
      {color: 'green', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'green', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]

    const squarePiece = [
      {color: 'yellow', radiusX: -1, radiusY: 1, x: 7, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 2, x: 7, y: 0},
      {color: 'yellow', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]

    const pieces = [straigtPiece, lPiece, reversedLPiece, zPiece, reversedZPiece, tPiece, squarePiece]

    this.piece = {blocks: pieces[Math.floor((Math.random() * 7))], falling: true}
    this.startFallTimer()
    this.#drawPiece()
  }

  startInputBuffer() {
    this.keysInput = setInterval(() => {this.move()}, this.frame)
  }

  stopInputBuffer() {
    clearInterval(this.keysInput)
  }

  startFallTimer() {
    this.stopFallTimer()
    this.fallTimer = setInterval(() => {this.#moveDown()}, this.speed)
  }

  stopFallTimer() {
    clearInterval(this.fallTimer)
  }

  moveInput(e) {
    if (e && !this.inputs.includes(e.key.toLowerCase())) {
      this.inputs.push(e.key.toLowerCase())
    }
  }

  removeInput(e) {
    this.inputs = this.inputs.filter(key => key !== e.key.toLowerCase())

    if (e.key == ' ') {
      this.#rotate()
    }
  }

  move() {
    this.stopInputBuffer()

    if (this.inputs.includes('arrowleft') || this.inputs.includes('a')) {
      this.#moveLeft()
    }

    if (this.inputs.includes('arrowright') || this.inputs.includes('d')) {
      this.#moveRight()
    }

    if (this.inputs.includes('arrowdown') || this.inputs.includes('s')) {
      this.stopFallTimer()
      this.#moveDown()
      this.startFallTimer()
    }

    this.buffer().then(() => this.startInputBuffer())
  }

  buffer() {
    return new Promise(resolve => setTimeout(resolve, this.frame * 2));
  }

  #drawPiece() {
    this.piece.blocks.forEach((block) => {
      this.gridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}` && space.classList.value.includes('taken')) {
          this.game = false
          this.stopFallTimer()
          this.stopInputBuffer()
          this.gameOverTarget.style.display = 'flex'
          this.replayBtnTarget.style.display = "block"
        }

        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("empty")
          space.classList.add(`${block.color}`)
          space.classList.add("active")
        }
      })
    })
  }

  #stopFalling() {
    this.stopFallTimer()
    this.piece.falling = false

    this.piece.blocks.forEach((block) => {
      this.gridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("active")
          space.classList.add("taken")
        }
      })
    })

    this.#destroyFullLine()
    if (this.game) {
      this.newPiece()
    }
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
      !document.getElementById(`${block.x + 1},${block.y}`).classList.value.includes("taken") &&
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
      this.#stopFalling()
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
      let buffer

      if (block.radiusX <= 0 && block.radiusY < 0) {
        buffer = block.radiusX
        block.radiusX = -block.radiusY
        block.radiusY = buffer
      } else if (block.radiusX >= 0 && block.radiusY <= 0) {
        buffer = block.radiusX
        block.radiusX = -block.radiusY
        block.radiusY = buffer
      } else if (block.radiusX >= 0 && block.radiusY >= 0) {
        buffer = block.radiusX
        block.radiusX = -block.radiusY
        block.radiusY = buffer
      } else if (block.radiusX < 0 && block.radiusY >= 0) {
        buffer = block.radiusX
        block.radiusX = -block.radiusY
        block.radiusY = buffer
      }
    })
  }

  #destroyFullLine() {
    let fullLines = 0

    this.rowTargets.forEach((row) => {
      const spacesArray = Array.from(row.children)
      const fullLine = spacesArray.every((space) => {
        return space.classList.value.includes("taken")
      })

      if (fullLine) {
        this.destroyedLines += 1
        fullLines += 1
        const rowYPosition = parseInt(spacesArray[0].id.split(',')[1])
        spacesArray.forEach((space) => {
          space.className = "grid empty"
        })

        this.gridTargets.reverse().forEach((space) => {
          const coordinates = space.id.split(',')
          const x = parseInt(coordinates[0])
          const y = parseInt(coordinates[1])

          if (y < rowYPosition) {
            const block = space.className
            space.className = 'grid empty'
            document.getElementById(`${x},${y + 1}`).className = block
          }
        })
      }
    })

    this.#score(fullLines)
  }

  #score(fullLines) {
    if (fullLines == 1) {
      this.score += 40
    } else if (fullLines == 2) {
      this.score += 100
    } else if (fullLines == 3) {
      this.score += 300
    } else if (fullLines == 4) {
      this.score += 1200
    }

    if (fullLines > 0) {
      this.#drawScore()
      if (this.speed > 300) {
        this.speed = 1000 - (50 * Math.floor(this.destroyedLines / 10))
      }
      this.#drawLevel()
    }
  }

  #drawLevel() {
    this.levelTarget.innerText = `Level ${1 + Math.floor(this.destroyedLines / 10)}`
  }

  #drawScore() {
    this.scoreTarget.innerText = this.score
  }
}
