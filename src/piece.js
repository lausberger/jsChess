// provides default functions for Piece objects
class Piece {
	constructor(board, id, position) {
		this.board = board
		this.id = id
		this.moveset = null
		this.pos = position
        this.legalMoves = {}
		this.alive = true
		this.element = document.createElement('img')
		this.initializeElement()
	}

	// creates corresponding html element and gives it a click function
	initializeElement() {
		this.element.className = 'piece'
		this.element.id = this.id
		this.element.style.opacity = 1
		let _this = this
		this.element.onclick = () => {
            _this.board.select(_this)
		}
	}

	// cheap interface for pos variable with no sanity checking
	// TODO decide if sanity check is needed
	setPosition(pos) {
		this.pos = pos
	}

	getType() {
		return this.id[0]
	}

	// checks to see if a position is in this Piece's list of legal mvoes
    checkIfLegal(position) {
        if (this.legalMoves[position]) {
            return true
        }
        return false
    }

	// each Piece subclass has a different way of checking for legal moves
    // TODO: improve, right now it is called by both ChessBoard.select() and King.inCheck()
    generateLegalMoves() {
        throw new Error("generic move generation function called")
    }

	// checks whether a Piece belongs to the opposing team, used to find legal moves
	isEnemyOf(otherPiece) {
		if (this.id[1] != otherPiece.id[1]) {
			return true
		}
		return false
	}

	kill() {
		this.alive = false
	}

	isAlive() {
		return this.alive
	}

	getMoveset() {
		return this.moveset
	}

	// does nothing unless Pawn
	handleFirstMove() {
	}
}

class Pawn extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.firstMove = true
		this.moveset = ['pawn']
		if (this.id[1] == 'w') {
			this.img = 'pieces/plt60.png'
		} else { // assumes color is 'b'
			this.img = 'pieces/pdt60.png'
		}
		this.element.src = this.img
	}

    generateLegalMoves() {
        // black pawns move down, white pawns move up
        // TODO: if performance becomes an issue, check if piece has moved since last time
        let dir = this.id[1] == 'w' ? 1 : -1
        var newLegalMoves = {}
		let possibleMoves = [
			[Utils.coord(this.pos, 1, dir), 'a'],
			[Utils.coord(this.pos, -1, dir), 'a'],
			[Utils.coord(this.pos, 0, dir), 'm']
		]

		for (var i=0; i<possibleMoves.length; i++) {
			let move = possibleMoves[i][0]
			let type = possibleMoves[i][1]
			if (Utils.isValidSpace(move)) {
				let space = this.board.spaces[move]
				if (space.isEmpty()) {
					if (type == 'm') {
						newLegalMoves[move] = 'm'
						if (this.firstMove) {
							let move2 = Utils.coord(move, 0, dir)
							if (this.board.spaces[move2].isEmpty()) {
								newLegalMoves[move2] = 'm'
							}
						}
					}
				} else {
					if (type == 'a') {
						if (this.isEnemyOf(space.contents)) {
							newLegalMoves[move] = 'a'
						}
					}
				}	
			}
		}

        this.legalMoves = newLegalMoves
    }

	handleFirstMove() {
		if (this.firstMove) {
			this.firstMove = false
		}
	}
}

class Rook extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['up', 'down', 'left', 'right']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/rlt60.png'
		} else {
			this.img = 'pieces/rdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}

		for (var i=0; i<this.moveset.length; i++) {
            let dir = this.moveset[i]
            var cur = this.pos
            var done = false
            while (!done) {
                cur = Utils.coordIncrementer[dir](cur)
                if (Utils.isValidSpace(cur)) {
                    let space = this.board.spaces[cur]
                    if (space.isEmpty()) {
                        newLegalMoves[cur] = 'm'
                    } else {
                        if (this.isEnemyOf(space.contents)) {
                            newLegalMoves[cur] = 'a'
                        }
                        done = true
                    }
                } else {
					done = true
				}
            }
        }

		this.legalMoves = newLegalMoves
	}
}

class Knight extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['knight']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/nlt60.png'
		} else {
			this.img = 'pieces/ndt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		let possibleMoves = Utils.knightCoords(this.pos)

		for (var i=0; i<possibleMoves.length; i++) {
			let move = possibleMoves[i]
			if (Utils.isValidSpace(move)) {
				let space = this.board.spaces[move]
                if (!space.isEmpty()) {
					if (this.isEnemyOf(space.contents)) {
						newLegalMoves[move] = 'a'
					}
				} else {
					newLegalMoves[move] = 'm'
				}
			}
		}

		this.legalMoves = newLegalMoves
	}
}

class Bishop extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['upleft', 'upright', 'downleft', 'downright']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/blt60.png'
		} else {
			this.img = 'pieces/bdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}

		for (var i=0; i<this.moveset.length; i++) {
            let dir = this.moveset[i]
            var cur = this.pos
            var done = false
            while (!done) {
                cur = Utils.coordIncrementer[dir](cur)
                if (Utils.isValidSpace(cur)) {
                    let space = this.board.spaces[cur]
                    if (space.isEmpty()) {
                        newLegalMoves[cur] = 'm'
                    } else {
                        if (this.isEnemyOf(space.contents)) {
                            newLegalMoves[cur] = 'a'
                        }
                        done = true
                    }
                } else {
					done = true
				}
            }
        }

		this.legalMoves = newLegalMoves
	}
}

class Queen extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['up', 'upleft', 'upright', 'down', 'downleft', 'downright', 'left', 'right']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/qlt60.png'
		} else {
			this.img = 'pieces/qdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}

        for (var i=0; i<this.moveset.length; i++) {
            let dir = this.moveset[i]
            var cur = this.pos
            var done = false
            while (!done) {
                cur = Utils.coordIncrementer[dir](cur)
                if (Utils.isValidSpace(cur)) {
                    let space = this.board.spaces[cur]
                    if (space.isEmpty()) {
                        newLegalMoves[cur] = 'm'
                    } else {
                        if (this.isEnemyOf(space.contents)) {
                            newLegalMoves[cur] = 'a'
                        }
                        done = true
                    }
                } else {
					done = true
				}
            }
        }
		
		this.legalMoves = newLegalMoves
	}
}

class King extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['up', 'upleft', 'upright', 'down', 'downleft', 'downright', 'left', 'right']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/klt60.png'
		} else {
			this.img = 'pieces/kdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}

        for (var i=0; i<this.moveset.length; i++) {
            let dir = this.moveset[i]
            let pos = Utils.coordIncrementer[dir](this.pos)
            if (Utils.isValidSpace(pos)) {
                let space = this.board.spaces[pos]
                if (space.isEmpty()) {
                    newLegalMoves[pos] = 'm'
                } else {
                    if (this.isEnemyOf(space.contents)) {
                        newLegalMoves[pos] = 'a'
                    }
                }
            }
        }

		this.legalMoves = newLegalMoves
	}
}
