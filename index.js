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
  event.target.innerHTML = isPlayerOne ? 'X' : 'O'
  isPlayerOne = !isPlayerOne
  playerIndicator.innerHTML = isPlayerOne ? 'player one\'s turn'  : 'player two\'s turn'
  event.target.removeEventListener('click', markSquare)
  if (victoryChecker()) {

    // getDomById('board').setAttribute('style', 'opacity: 0;')
    playerIndicator.innerHTML = winner + ' wins!'
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

    classes = classes + type === 'win' ? ' win' : ' lose'
    
    console.log('post classes', classes)
    cell.setAttribute('class', classes)
  }
}

function victoryChecker() {
  for (var key in victoryCombinations) {
    var squares = victoryCombinations[key]
    var values = squares.map(function (square) { return square.innerHTML })
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
    }

    if (doms.length) {
      console.log('doms', doms)
      highlightCells(doms, 'win')
      return true
    }


    console.log('no winner')
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