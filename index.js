function getDomById (id) {
  return document.getElementById(id)
}

function getDomsByClass (className) {
  return document.getElementsByClassName(className)
}

// Game object creator.
function Game () {
  this.squareDoms = getDomsByClass('square')
  this.board = getDomById('game')
  this.indicator = getDomById('playerTurn')
  this.button = getDomById('gameStart')
  this.scores = getDomById('scores')
}

// Properties of the Game object.
Game.prototype = {
  // Game attributes
  active: false,
  playerOne: null,
  playerTwo: null,
  firstPlayer: 'One',
  playerOneWins: 0,
  playerTwoWins: 0,
  draws: 0,
  turn: 'playerOne',
  currentValue: 'X',
  squares: {
    bottom: null,
    bottomLeft: null,
    bottomRight: null,
    middle: null,
    middleLeft: null,
    middleRight: null,
    top: null,
    topLeft: null,
    topRight: null
  },

  // game methods
  start: function () {
    if (this.active) {
      this.reset()
    }
    this.getPlayerName('One')
    this.getPlayerName('Two')
    this.active = true
    this.board.classList.add('active')
    this.setIndicator(this.firstPlayer)
    this.indicator.classList.add('active')
    this.bindEvents()
    this.button.disabled = true
  },

  setIndicator: function (player) {
    this.indicator.innerHTML =
      this['player' + player] + '\'s turn ' +
        '(' + (player === 'One' ? 'X' : 'O') + ').'
  },

  togglePlayer: function () {
    if (this.turn === 'playerOne') {
      this.turn = 'playerTwo'
      this.currentValue = 'O'
      this.setIndicator('Two')
    } else {
      this.turn = 'playerOne'
      this.currentValue = 'X'
      this.setIndicator('One')
    }
    this.checkForVictory()
  },

  checkForVictory: function () {
    var topRow =
      this.squares.top === this.squares.topLeft &&
      this.squares.top === this.squares.topRight &&
      this.squares.top !== null
    var middleRow =
      this.squares.middle === this.squares.middleLeft &&
      this.squares.middle === this.squares.middleRight &&
      this.squares.middle !== null
    var bottomRow =
      this.squares.bottom === this.squares.bottomLeft &&
      this.squares.bottom === this.squares.bottomRight &&
      this.squares.bottom !== null
    var leftColumn =
      this.squares.topLeft === this.squares.middleLeft &&
      this.squares.topLeft === this.squares.bottomLeft &&
      this.squares.topLeft !== null
    var centerColumn =
      this.squares.middle === this.squares.top &&
      this.squares.top === this.squares.bottom &&
      this.squares.top !== null
    var rightColumn =
      this.squares.topRight === this.squares.middleRight &&
      this.squares.middleRight === this.squares.bottomRight &&
      this.squares.topRight !== null
    var leftDiagonal =
      this.squares.topLeft === this.squares.middle &&
      this.squares.middle === this.squares.bottomRight &&
      this.squares.middle !== null
    var rightDiagonal =
      this.squares.topRight === this.squares.middle &&
      this.squares.middle === this.squares.bottomLeft &&
      this.squares.middle !== null
    var noWinner =
      this.squares.topLeft !== null &&
      this.squares.top !== null &&
      this.squares.topRight !== null &&
      this.squares.middleLeft !== null &&
      this.squares.middle !== null &&
      this.squares.middleRight !== null &&
      this.squares.bottomLeft !== null &&
      this.squares.bottom !== null &&
      this.squares.bottomRight !== null


    if (topRow) { this.end('topRow', this.squares.top) }
    if (middleRow) { this.end('middleRow', this.squares.middle) }
    if (bottomRow) { this.end('bottomRow', this.squares.bottom) }
    if (leftColumn) { this.end('leftColumn', this.squares.middleLeft) }
    if (centerColumn) { this.end('centerColumn', this.squares.middle) }
    if (rightColumn) { this.end('rightColumn', this.squares.middleRight) }
    if (leftDiagonal) { this.end('leftDiagonal', this.squares.middle) }
    if (rightDiagonal) { this.end('rightDiagonal', this.squares.middle) }
    if (noWinner) { this.end('square', false) }
  },

  markSquare: function (event) {
    var dom = event.target
    var value = gameObj.currentValue
    event.target.querySelector('.display').innerHTML = value
    gameObj.squares[dom.getAttribute('id')] = value
    gameObj.togglePlayer()
  },

  end: function (domClassToTarget, winningSymbol) {
    var classToAdd
    var message

    if (winningSymbol) {
      classToAdd = 'win'
      if (winningSymbol === 'X') {
        this.playerOneWins++
        message = this.playerOne
      }else {
        this.playerTwoWins++
        message = this.playerTwo
      }
        message += ' wins!'
    } else {
      message = 'No winner!'
      classToAdd = 'lose'
      this.draws++
    }

    this.indicator.innerHTML = message

    var doms = getDomsByClass(domClassToTarget)
    for (var i = 0; i < doms.length; i++) {
      var dom = doms[i]
      dom.classList.add(classToAdd)
    }

    this.button.disabled = false

    this.scores.querySelector('#playerOne').innerHTML = this.playerOneWins
    this.scores.querySelector('#playerTwo').innerHTML = this.playerTwoWins
    this.scores.querySelector('#draws').innerHTML = this.draws
    this.scores.classList.add('active')
    this.unBindEvents()
  },

  getPlayerName: function (player) {
    if (this['player' + player] !== null) { return false }
    var input = window.prompt('Player ' + player + ' name:')
    this['player' + player] =
       input === '' ?
        'Player ' + player :
         input
  },

  bindEvents: function () {
    for (var i = 0; i < this.squareDoms.length; i++) {
      var dom = this.squareDoms[i]
      dom.addEventListener('click', this.markSquare)
    }
  },

  unBindEvents: function (domToRemove) {
    if (domToRemove) {
      domToRemove.removeEventListener('click', this.markSquare)
    } else {
      for (var i = 0; i < this.squareDoms.length; i++) {
        var dom = this.squareDoms[i]
        dom.removeEventListener('click', this.markSquare)
      }
    }
  },

  reset: function () {
    for (var i = 0; i < this.squareDoms.length; i++) {
      var dom = this.squareDoms[i]
      dom.querySelector('.display').innerHTML = ''
      dom.classList.remove('win', 'lose')
    }
    this.scores.classList.remove('active')
    for (var key in this.squares) {
      if (this.squares.hasOwnProperty(key)) {
        this.squares[key] = null
      }
    }
    if (this.firstPlayer === 'One') {
      this.firstPlayer = 'Two'
      this.turn = 'playerTwo'
      this.currentValue = 'O'
    } else {
      this.firstPlayer = 'One'
      this.turn = 'playerOne'
      this.currentValue = 'X'
    }
  }
}

var gameObj

document.addEventListener("DOMContentLoaded", function (event) {
  gameObj = new Game()
})

/* Old Code */
/*
function getDomById (id) {
  return document.getElementById(id)
}

function getDomsByClass (className) {
  return document.getElementsByClassName(className)
}

var squares
var isPlayerOne = true
var playerIndicator
var victoryCombinations = {
  topRow: [],
  middleRow: [],
  bottomRow: [],
  leftColumn: [],
  centerColumn: [],
  rightColumn: [],
  leftDiagonal: [],
  rightDiagonal: [],
}
var winner = null
var gameOver = false

function markSquare (event) {
  event.target.querySelector('.display').innerHTML = isPlayerOne ? 'X' : 'O'
  isPlayerOne = !isPlayerOne
  playerIndicator.innerHTML = isPlayerOne ? 'player one\'s turn'  : 'player two\'s turn'
  event.target.removeEventListener('click', markSquare)
  if (victoryChecker()) {

    // getDomById('board').setAttribute('style', 'opacity: 0;')
    playerIndicator.innerHTML = (winner || 'no one') + ' wins!'
    for (var i = 0; i < squares.length; i++) {
      var square = squares[i]
      square.removeEventListener('click', markSquare)
    }
    gameOver = true
  }
}

function highlightCells (cells, type) {
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var classes = cell.getAttribute('class')
    console.log('classes', classes)

    console.log('post classes', classes)
    cell.setAttribute('class', classes)
    cell.classList.add(type)
    console.log('cell', cell)
  }
}

function victoryChecker() {
  var availableSpaces = 0

  for (var key in victoryCombinations) {
    var _squares = victoryCombinations[key]
    var values = _squares.map(function (square) { return square.innerHTML })
    var hasX = values.includes('X')
    var hasO = values.includes('O')
    var hasEmpty = values.includes('')
    var doms = []

    if (hasX && !hasO && !hasEmpty) {
      winner = 'player one'
      doms = getDomsByClass(key)
    } else if (!hasX && hasO && !hasEmpty) {
      winner = 'player two'
      doms = getDomsByClass(key)
    } else if (hasEmpty) {
      values.filter(function (square) { return square.innerHTML === '' })
      availableSpaces += values.length
    }

    if (doms.length) {
      console.log('doms', key, doms)
      highlightCells(doms, 'win')
      return true
    }




  }
  if (availableSpaces === 0) {
    highlightCells(squares, 'lose')
    console.log('no winner')
    return true
  }
  return false
}

document.addEventListener("DOMContentLoaded", function (event) {
  playerIndicator = getDomById('playerTurn')
  squares = getDomsByClass('grid')

  for (var i = 0; i < squares.length; i++) {
    var square = squares[i]
    var keys = []

    switch (i) {
      case 0:
        keys.push('topRow')
        keys.push('leftColumn')
        keys.push('leftDiagonal')
        break
      case 1:
        keys.push('centerColumn')
        keys.push('topRow')
        break
      case 2:
        keys.push('topRow')
        keys.push('rightColumn')
        keys.push('rightDiagonal')
        break
      case 3:
        keys.push('leftColumn')
        keys.push('middleRow')
        break
      case 4:
        keys.push('centerColumn')
        keys.push('leftDiagonal')
        keys.push('rightDiagonal')
        keys.push('middleRow')
        break
      case 5:
        keys.push('rightColumn')
        keys.push('middleRow')
        break
      case 6:
        keys.push('bottomRow')
        keys.push('rightDiagonal')
        keys.push('leftColumn')
        break
      case 7:
        keys.push('bottomRow')
        keys.push('centerColumn')
        break
      case 8:
        keys.push('bottomRow')
        keys.push('rightColumn')
        keys.push('leftDiagonal')
        break
    }

    for (var j = 0; j < keys.length; j++) {
      var obj = victoryCombinations[keys[j]]
      obj.push(square)
    }

    square.addEventListener('click', markSquare)
  }

})

*/