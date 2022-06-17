import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = [
    'grid',
    'nextGrid',
    'row',
    'start',
    'startBtn',
    'replayBtn',
    'paused',
    'gameOver',
    'highscores',
    'score',
    'level',
    'music',
    'loseAudio',
    'pauseAudio',
    'lineClearAudio',
    'muteBtn',
    'unmuteBtn'
  ]

  static values = {
    link: String
  }

  connect() {
    this.scoreTarget.scrollIntoView(true)
    this.cols = 11
    this.rows = 21
    this.speed = 800
    this.destroyedLines = 0
    this.inputs = []
    this.score = 0
    this.frame = 16.6
    this.musicTarget.volume = 0.35
    this.loseAudioTarget.volume = 0.35
    this.pauseAudioTarget.volume = 0.1
    this.lineClearAudioTarget.volume = 0.75
  }

  start() {
    this.startTarget.outerHTML = ""
    this.musicTarget.play()
    this.game = true
    this.newPiece()
  }

  replay() {
    this.gridTargets.forEach((space) => {
      space.className = 'grid empty'
    })
    this.gameOverTarget.innerHTML = ""
    this.speed = 1000
    this.score = 0
    this.destroyedLines = 0
    this.game = true
    this.newPieceCue = false
    this.#drawLevel()
    this.#drawScore()
    this.musicTarget.currentTime = 0
    this.musicTarget.play()
    this.newPiece()
  }

  newPiece() {

    const straigtPiece = [
      {color: 'pink', radiusX: -1, radiusY: -1, x: 6, y: 3},
      {color: 'pink', radiusX: 0, radiusY: 0, x: 6, y: 2},
      {color: 'pink', radiusX: 1, radiusY: 1, x: 6, y: 1},
      {color: 'pink', radiusX: 2, radiusY: 2, x: 6, y: 0}
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
      {color: 'green', radiusX: 1, radiusY: 1, x: 6, y: 0},
    ]

    const squarePiece = [
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 7, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 6, y: 1},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 7, y: 0},
      {color: 'yellow', radiusX: 0, radiusY: 0, x: 6, y: 0},
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
      this.piece = {blocks: pieces[Math.floor((Math.random() *  pieces.length))], falling: true}
    }

    this.nextPiece = {blocks: pieces[Math.floor((Math.random() * pieces.length))], falling: true}

    while (this.nextPiece.blocks[0].color == this.piece.blocks[0].color) {
      this.nextPiece.blocks = pieces[Math.floor((Math.random() * pieces.length))]
    }

    this.piece.blocks.forEach((block) => {
      if (document.getElementById(`${block.x},${block.y}`).classList.value.includes('taken')) {
        this.#endOfGame()
      }
    })

    this.rotated = 0
    this.startFallTimer()
    this.#drawNextPiece()
    this.startInputBuffer()
  }

  startInputBuffer() {
    this.keysInput = setInterval(() => {
      this.move()
      this.#drawPiece()
    }, this.frame)
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

  touchControl(e) {
    e.preventDefault()

    if (!this.touchCue) {
      const clientX = e.touches[0].clientX
      const clientY = e.touches[0].clientY

      if (clientX + 5 < this.clientX) {
        this.touchCue = true
        this.#moveLeft()
        this.buffer(4).then(() => {
          this.clientX = clientX
          this.clientY = clientY
          this.touchCue = false
        })
      } else if (clientX - 5 > this.clientX) {
        this.touchCue = true
        this.#moveRight()
        this.buffer(4).then(() => {
          this.clientX = clientX
          this.clientY = clientY
          this.touchCue = false
        })
      } else if (clientY - 5 > this.clientY) {
        this.touchCue = true
        this.#moveDown()
        this.buffer(1).then(() => {
          this.clientX = clientX
          this.clientY = clientY
          this.touchCue = false
        })
      }
    }
  }

  setTouchCoordinates(e) {
    this.clientX = e.touches[0].clientX
    this.clientY = e.touches[0].clientY
  }

  touchRotate() {
    this.#rotate()
  }

  moveInput(e) {
    if (e && !this.inputs.includes(e.key.toLowerCase())) {
      this.inputs.push(e.key.toLowerCase())
    }
  }

  otherInput(e) {
    this.inputs = this.inputs.filter(key => key !== e.key.toLowerCase())

    if (e.key == ' ') {
      this.#rotate()
    }

    if (e.key.toLowerCase() == 'm') {
      if (this.muted) {
        this.unmuteBtnTarget.click()
      } else {
        this.muteBtnTarget.click()
      }
    }

    if (e.key.toLowerCase() == 'p' && this.game) {
      if (this.paused) {
        this.#unpause()
      } else {
        this.#pause()
      }
    }

    if (e.key.toLowerCase() == 'enter' && !this.game) {
      this.startBtnTarget.click()
    }
  }

  async move() {
    if (this.inputs.includes('arrowleft') || this.inputs.includes('a')) {
      if(!this.leftCue) {
        this.leftCue = true
        this.#moveLeft()
        await this.buffer(4)
        this.leftCue = false
      }
    }

    if (this.inputs.includes('arrowright') || this.inputs.includes('d')) {
      if(!this.rightCue) {
        this.rightCue = true
        this.#moveRight()
        await this.buffer(4)
        this.rightCue = false
      }
    }

    if ((!this.disableDown && this.inputs.includes('arrowdown')) || (!this.disableDown && this.inputs.includes('s'))) {
      if(!this.downCue) {
        this.downCue = true
        this.stopFallTimer()
        this.#moveDown()
        await this.buffer(1)
        this.startFallTimer()
        this.downCue = false
      }
    }
  }

  buffer(num = 3) {
    return new Promise(resolve => setTimeout(resolve, this.frame * num));
  }

  #waitForIt(param) {
    return new Promise((resolve) => resolve(param))
  }

  mute(e) {
    this.musicTarget.volume = 0
    this.loseAudioTarget.volume = 0
    this.pauseAudioTarget.volume = 0
    this.lineClearAudioTarget.volume = 0
    this.muted = true
    e.currentTarget.style.display = 'none'
    this.unmuteBtnTarget.style.display = 'inline-block'
  }

  unmute(e) {
    this.musicTarget.volume = 0.35
    this.loseAudioTarget.volume = 0.35
    this.pauseAudioTarget.volume = 0.1
    this.lineClearAudioTarget.volume = 0.75
    this.muted = false
    e.currentTarget.style.display = 'none'
    this.muteBtnTarget.style.display = 'inline-block'
  }

  #pause() {
    this.paused = true
    this.stopInputBuffer()
    this.stopFallTimer()
    this.musicTarget.pause()
    this.pauseAudioTarget.play()
    this.pausedTarget.innerHTML = '<div id="paused"><h2>PAUSED</h2></div>'
  }

  async #unpause() {
    if (!this.pausedCue) {
      this.pausedCue = true
      this.pauseAudioTarget.play()
      await this.buffer(60)
      this.musicTarget.play()
      this.startInputBuffer()
      this.startFallTimer()
      this.pausedTarget.innerHTML = ''
      this.paused = false
      this.pausedCue = false
    }
  }

  #drawPiece() {
    this.piece.blocks.forEach((block) => {
        document.getElementById(`${block.x},${block.y}`).className = `grid active ${block.color}`
      })
  }

  #drawNextPiece() {
    this.nextGridTargets.forEach((space) => {
      space.className = "next-grid"
    })

    this.nextPiece.blocks.forEach((block) => {
      document.getElementById(`next-${block.x},${block.y}`).classList.add(`${block.color}`)
    })
  }


  async #stopFalling() {
    if (!this.newPieceCue) {
      this.stopInputBuffer()
      this.stopFallTimer()
      this.newPieceCue = true
      this.piece.falling = false

      this.piece.blocks.forEach((block) => {
        document.getElementById(`${block.x},${block.y}`).className = `taken grid ${block.color}`
      })

      const frames = await this.#destroyFullLine()
      await this.buffer(frames)
      if (this.game) {
        this.newPiece()
        this.disableDown = false
        this.newPieceCue = false
      }
    }
  }

  async #endOfGame() {
    if (!this.endGameCue) {
      this.endGameCue = true
      this.game = false
      this.stopInputBuffer()
      this.stopFallTimer()
      this.musicTarget.pause()
      this.loseAudioTarget.play()
      const data = await this.#registerScore()
      this.gameOverTarget.innerHTML = data.gameOver
      this.highscoresTarget.innerHTML = data.highscores
      this.endGameCue = false
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
        document.getElementById(`${block.x},${block.y}`).className = "grid empty"
        block.x -= 1
      })
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
        document.getElementById(`${block.x},${block.y}`).className = "grid empty"
        block.x += 1
      })
    }
  }

  async #moveDown() {
    if (!this.disableDown) {
      const canMove = this.piece.blocks.every((block) => {
        return block.y < this.rows &&
        !document.getElementById(`${block.x},${block.y + 1}`).classList.value.includes("taken") &&
        this.piece.falling
      })


      if (canMove) {
        this.piece.blocks.forEach((block) => {
          document.getElementById(`${block.x},${block.y}`).className = "grid empty"
          block.y += 1
        })

      } else {
        this.disableDown = true

        await this.buffer()
        const canMove = this.piece.blocks.every((block) => {
          return block.y < this.rows &&
          !document.getElementById(`${block.x},${block.y + 1}`).classList.value.includes("taken") &&
          this.piece.falling
        })

        if (!canMove) {
          this.#stopFalling()
        }

        this.disableDown = false
      }
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
        document.getElementById(`${block.x},${block.y}`).className = "grid empty"
        block.x += offSet
      })
      this.#afterRotation()
    }
  }

  #afterRotation() {

    this.rotated += 1

    this.piece.blocks.forEach((block) => {
      block.x += block.radiusX
      block.y += block.radiusY
      let buffer

      buffer = block.radiusX
      block.radiusX = -block.radiusY
      block.radiusY = buffer
    })

    if (this.rotated == 2 && ['pink', 'orange', 'purple', 'blue', 'red'].includes(this.piece.blocks[0].color)) {
      this.piece.blocks.forEach((block) => {
        block.radiusX += 1
        block.radiusY += 1
      })
      this.rotated = 0
    }
  }

  async #destroyFullLine() {
    let fullLines = 0
    let frames = 15

    const promises = this.rowTargets.map((row) => {
      const spacesArray = Array.from(row.children)
      const fullLine = spacesArray.every((space) => {
        return space.classList.value.includes("taken")
      })

      if (fullLine) {
        this.destroyedLines += 1
        fullLines += 1
        frames = 60
        this.lineClearAudioTarget.currentTime = 0
        this.lineClearAudioTarget.play()
        const rowYPosition = parseInt(spacesArray[0].id.split(',')[1])

        spacesArray.forEach((space) => {
          space.classList.add("no-borders")
        })

        row.classList.add("explosion")

        this.buffer(60).then(() =>{
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
      }
    })

    await Promise.all(promises)
    this.#score(fullLines)
    return this.#waitForIt(frames)
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
        this.speed = 800 * (0.8 ** Math.floor(this.destroyedLines / 10))
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

  async #registerScore() {
    const csrfToken = document.querySelector("[name='csrf-token']").content
    const url = this.linkValue
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({'key': this.#hash(`${this.score}`), 'points': this.score})
    }

    const res = await fetch(url, options)
    const data = await res.json()
    return data
  }

  #hash(string) {
    const { createHash } = require('crypto')
    return createHash('sha256').update(string).digest('hex')
  }
}
