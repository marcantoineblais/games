import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = [
    'grid',
    'nextGrid',
    'row',
    'startBtn',
    'replayBtn',
    'gameOver',
    'score',
    'level',
    'music',
    'loseAudio',
    'lineClearAudio',
    'muteBtn',
    'unmuteBtn'
  ]

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
    this.musicTarget.volume = 0.35
    this.loseAudioTarget.volume = 0.35
    this.lineClearAudioTarget.volume = 0.75
  }

  start(e) {
    e.currentTarget.style.display = "none"
    this.musicTarget.play()
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
    this.musicTarget.currentTime = 0
    this.musicTarget.play()
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
      {color: 'purple', radiusX: -1, radiusY: 1, x: 7, y: 2},
      {color: 'purple', radiusX: 0, radiusY: 0, x: 6, y: 2},
      {color: 'purple', radiusX: 1, radiusY: 1, x: 6, y: 1},
      {color: 'purple', radiusX: 2, radiusY: 2, x: 6, y: 0}
    ]

    const zPiece = [
      {color: 'blue', radiusX: 1, radiusY: -1, x: 5, y: 1},
      {color: 'blue', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'blue', radiusX: 1, radiusY: 1, x: 6, y: 0},
      {color: 'blue', radiusX: 0, radiusY: 2, x: 7, y: 0}
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
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 7, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 7, y: 0},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 6, y: 0}
    ]

    const singlePiece = [
      {color: 'cyan', radiusX: 0, radiusY: 0, x: 6, y: 1}
    ]

    const angledPiece = [
      {color: 'magenta', radiusX: -1, radiusY: 1, x: 7, y: 1},
      {color: 'magenta', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'magenta', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]

    const reversedAngledPiece = [
      {color: 'peach', radiusX: 1, radiusY: -1, x: 5, y: 1},
      {color: 'peach', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'peach', radiusX: 1, radiusY: 1, x: 6, y: 0}
    ]


    const pieces = [
      straigtPiece,
      lPiece,
      reversedLPiece,
      zPiece,
      reversedZPiece,
      tPiece,
      squarePiece,
      singlePiece,
      angledPiece,
      reversedAngledPiece,
    ]

    if (this.nextPiece) {
      this.piece = this.nextPiece
    } else {
      this.piece = {blocks: pieces[Math.floor((Math.random() * 7))], falling: true}
    }

    this.nextPiece = {blocks: pieces[Math.floor((Math.random() * pieces.length))], falling: true}

    while (this.nextPiece.blocks[0].color == this.piece.blocks[0].color) {
      this.nextPiece.blocks = pieces[Math.floor((Math.random() * pieces.length))]
    }


    this.startFallTimer()
    this.#drawPiece()
    this.#drawNextPiece()
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

    if ((!this.disableDown && this.inputs.includes('arrowdown')) || (!this.disableDown && this.inputs.includes('s'))) {
      this.stopFallTimer()
      this.#moveDown()
      this.startFallTimer()
    }

    this.buffer().then(() => this.startInputBuffer())
  }

  buffer(num = 3) {
    return new Promise(resolve => setTimeout(resolve, this.frame * num));
  }

  #waitForIt() {
    return new Promise((resolve) => resolve())
  }

  mute(e) {
    this.musicTarget.volume = 0
    this.loseAudioTarget.volume = 0
    this.lineClearAudioTarget.volume = 0
    e.currentTarget.style.display = 'none'
    this.unmuteBtnTarget.style.display = 'inline-block'
  }

  unmute(e) {
    this.musicTarget.volume = 0.35
    this.loseAudioTarget.volume = 0.35
    this.lineClearAudioTarget.volume = 0.75
    e.currentTarget.style.display = 'none'
    this.muteBtnTarget.style.display = 'inline-block'
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
          this.musicTarget.pause()
          this.loseAudioTarget.play()
        }

        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("empty")
          space.classList.add(`${block.color}`)
          space.classList.add("active")
        }
      })
    })
  }

  #drawNextPiece() {
    this.nextGridTargets.forEach((space) => {
      space.className = "next-grid"
    })

    this.nextPiece.blocks.forEach((block) => {
      this.nextGridTargets.forEach((space) => {
        if (space.id === `${block.x},${block.y}`) {
          space.classList.remove("empty")
          space.classList.add(`${block.color}`)
        }
      })
    })
  }


  #stopFalling() {

    if (!this.newPieceCue) {
      this.newPieceCue = true
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

      this.#destroyFullLine().then(() => {
        this.buffer(30).then(() => {
          if (this.game) {
            this.newPiece()
            this.disableDown = false
            this.newPieceCue = false
          }
        })
      })
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
      this.disableDown = true

      this.buffer(5).then(() => {
        const canMove = this.piece.blocks.every((block) => {
          return block.y < this.rows &&
          !document.getElementById(`${block.x},${block.y + 1}`).classList.value.includes("taken") &&
          this.piece.falling
        })

        if (canMove) {
          this.#drawPiece()
        } else {
          this.#stopFalling()
        }

        this.disableDown = false
      })
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
        this.lineClearAudioTarget.play()
        const rowYPosition = parseInt(spacesArray[0].id.split(',')[1])
        spacesArray.forEach((space) => {
          space.classList.add("no-borders")
        })
        row.classList.add("explosion")

        this.buffer(60).then(() => {
          row.classList.remove("explosion")
          spacesArray.forEach((space) => {
            space.className = "grid empty"
          })

          this.gridTargets.reverse().forEach((space) => {
            const coordinates = space.id.split(',')
            const x = parseInt(coordinates[0])
            const y = parseInt(coordinates[1])

            if (y < rowYPosition && !space.classList.value.includes('active')) {
              const block = space.className
              space.className = 'grid empty'
              document.getElementById(`${x},${y + 1}`).className = block
            }
          })

        })
        this.#score(fullLines)
      }
    })
    return this.#waitForIt()
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
      if (this.speed > 120) {
        this.speed = 1000 - (80 * Math.floor(this.destroyedLines / 10))
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
