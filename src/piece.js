// provides default functions for Piece objects
class Piece {
	constructor(id, position, clickHandler, spaceHandler) {
		this.id = id
		this.directions = []
		this.pos = position
        this.legalMoves = {}
		this.alive = true
		this.element = document.createElement('img')
		this.initializeElement(clickHandler)
		this.spaceHelper = spaceHandler
	}

	// creates corresponding html element and gives it a click function
	initializeElement(func) {
		this.element.className = 'piece'
		this.element.id = this.id
		this.element.style.opacity = 1
		this.element.onclick = () => func(this)
	}

	// cheap interface for pos variable with no sanity checking
	// TODO decide if sanity check is needed
	setPosition(pos) {
		this.pos = pos
	}

	getPosition() {
		return this.pos
	}

	getID() {
		return this.id
	}

	// checks to see if a position is in this Piece's list of legal mvoes
    checkIfLegal(position) {
        if (this.legalMoves[position]) {
            return true
        }
        return false
    }

	// generalized for all Pieces that can move any number of spaces in a direction
	getPossibleMoves() {
		let moves = []
		for (var dir of this.directions) {
			var cur = this.pos
			var done = false
			while (!done) {
				cur = Utils.coordIncrementer[dir](cur)
				if (Utils.isValidSpace(cur)) {
					let space = this.spaceHelper(cur)
					if (space.isEmpty()) {
						moves.push(cur)
					} else {
						if (this.isEnemyOf(space.getContents())) {
							moves.push(cur)
						}
						done = true
					}
				} else {
					done = true
				}	
			}
		}
		return moves
	}

	// generalized for all Pieces
	// TODO fragment by class
	legalityFilter(possibleMoves) {
		let moves = {}
		for (var pos of possibleMoves) {
			if (!Utils.isValidSpace(pos)) {
				console.log('DEBUG')
				console.log(possibleMoves)
				console.log(this)
			}
			let space = this.spaceHelper(pos)
			if (space.isEmpty()) {
				if (this.getType() == "Pawn") {
					if (pos[0] == this.getPosition()[0]) {
						moves[pos] = 'm'
					}
				} else {
					moves[pos] = 'm'
				}
			} else {
				if (this.isEnemyOf(space.getContents())) {
					if (this.getType() == "Pawn") {
						if (pos[0] != this.getPosition()[0]) {
							moves[pos] = 'a'
						}
					} else {
						moves[pos] = 'a'
					}
				} else {
					// TODO implement castling
					if (this.getType() == "King") {
						if (space.getContents().getType() == "Rook") {
							// moves[pos] = 'c'
						}
					// TODO implement promotion
					} else if (this.getType() == "Pawn") {
						if (this == space.getContents()) {
							// moves[pos] = 'p'
						}
					}
				}
			}
		}
		return moves
	}

	updateLegalMoves() {
		let moves = this.getPossibleMoves()
		this.legalMoves = this.legalityFilter(moves)
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

	// does nothing unless Pawn
	handleFirstMove() {
	}
}

class Pawn extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		this.firstMove = true
		if (this.id[1] == 'w') {
			this.img = 'pieces/plt60.png'
		} else { // assumes color is 'b'
			this.img = 'pieces/pdt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'Pawn'
	}

	getPossibleMoves() {
		var moves = [
			Utils.coordIncrementer['up'](this.pos),
			Utils.coordIncrementer['upleft'](this.pos),
			Utils.coordIncrementer['upright'](this.pos)
		]
		moves = moves.filter(pos => Utils.isValidSpace(pos))
		if (this.firstMove) {
			moves.push(Utils.coordIncrementer['up'](moves[0]))
		} 
		// no on-board moves remaining signifies a Pawn promotion
		if (moves.length == 0) {
			moves.push(this.pos)
		}
		return moves
	}

	handleFirstMove() {
		if (this.firstMove) {
			this.firstMove = false
		}
	}
}

class Rook extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		this.directions = ['up', 'down', 'left', 'right']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/rlt60.png'
		} else {
			this.img = 'pieces/rdt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'Rook'
	}
}

class Knight extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/nlt60.png'
		} else {
			this.img = 'pieces/ndt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'Knight'
	}

	getPossibleMoves() {
		return Utils.validKnightCoords(this.pos)
	}
}

class Bishop extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		this.directions = ['upleft', 'upright', 'downleft', 'downright']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/blt60.png'
		} else {
			this.img = 'pieces/bdt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'Bishop'
	}
}

class Queen extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		this.directions = ['up', 'upleft', 'upright', 'down', 'downleft', 'downright', 'left', 'right']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/qlt60.png'
		} else {
			this.img = 'pieces/qdt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'Queen'
	}
}

class King extends Piece {
	constructor(id, position, clickFn, spaceFn) {
		super(id, position, clickFn, spaceFn)
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/klt60.png'
		} else {
			this.img = 'pieces/kdt60.png'
		}
		this.element.src = this.img
	}

	getType() {
		return 'King'
	}

	getPossibleMoves() {
		let moves = []
		for (var dir in Utils.coordIncrementer) {
			let cur = Utils.coordIncrementer[dir](this.pos)
			if (Utils.isValidSpace(cur)) {
				moves.push(cur)
			}
		}
		return moves
	}
}
