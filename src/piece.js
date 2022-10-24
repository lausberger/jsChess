// provides default functions for Piece objects
class Piece {
	constructor(id, position) {
		this.id = id
		this.directions = []
		this.pos = position
        this.legalMoves = {}
		this.alive = true
		this.element = document.createElement('img')
		this.initializeElement()
	}

	// overrides the spaceHelper instance method of each Piece
	static setSpaceCheckCallback(func) {
		this.prototype.spaceHelper = func
	}

	// overrides the _elementOnClick instance method of each Piece
	static setElementSelectionCallback(func) {
		this.prototype._elementOnClick = func
	}

	spaceHelper() {
		throw new Error("Piece spaceHelper was never overwritten")
	}

	_elementOnClick(arg) {
		throw new Error("Piece elementOnClick was never overwritten")
	}

	// creates corresponding html element and gives it a click function
	initializeElement() {
		this.element.className = 'piece'
		this.element.id = this.id
		this.element.style.opacity = 1
		this.element.onclick = () => this._elementOnClick(this)
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

	// generalized for most Pieces
	legalityFilter(possibleMoves) {
		let moves = {}
		for (var pos of possibleMoves) {
			let space = this.spaceHelper(pos)
			if (space.isEmpty()) {
				moves[pos] = 'm'
			} else {
				if (this.isEnemyOf(space.getContents())) {
					moves[pos] = 'a'
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
	constructor(id, position) {
		super(id, position)
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
		// forward is relative
		let fwd = this.id[1] == 'w' ? 'up' : 'down'
		var moves = [
			Utils.coordIncrementer[fwd](this.pos),
			Utils.coordIncrementer[fwd+'left'](this.pos),
			Utils.coordIncrementer[fwd+'right'](this.pos)
		]
		moves = moves.filter(pos => Utils.isValidSpace(pos))
		// not ideal, but some filtering here is the most elegant option
		if (this.firstMove && this.spaceHelper(moves[0]).isEmpty()) {
			moves.push(Utils.coordIncrementer[fwd](moves[0]))
		} 
		// no on-board moves remaining signifies a Pawn promotion
		// TODO this adds a move but does not highlight or execute properly
		if (moves.length == 0) {
			moves.push(this.pos)
		}
		return moves
	}

	legalityFilter(possibleMoves) {
		let moves = {}
		for (var pos of possibleMoves) {
			let space = this.spaceHelper(pos)
			if (space.isEmpty()) {
				if (pos[0] == this.getPosition()[0]) {
					moves[pos] = 'm'
				}
			} else {
				if (this.isEnemyOf(space.getContents())) {
					if (pos[0] != this.getPosition()[0]) {
						moves[pos] = 'a'
					}
				// TODO implement promotion
				} else if (this == space.getContents()) {
					// moves[pos] = 'p'
				}
			}
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
	constructor(id, position) {
		super(id, position)
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
	constructor(id, position) {
		super(id, position)
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
	constructor(id, position) {
		super(id, position)
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
	constructor(id, position) {
		super(id, position)
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
	constructor(id, position) {
		super(id, position)
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

	legalityFilter(possibleMoves) {
		let moves = {}
		for (var pos of possibleMoves) {
			let space = this.spaceHelper(pos)
			if (space.isEmpty()) {
				moves[pos] = 'm'
			} else {
				if (this.isEnemyOf(space.getContents())) {
					moves[pos] = 'a'
				} else {
					// TODO implement castling
					if (space.getContents().getType() == "Rook") {
						// moves[pos] = 'c'
					}
				}
			}
		}
		return moves
	}
}
