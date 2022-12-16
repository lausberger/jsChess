// provides default functions for Piece objects
class Piece {
	// must be called before spaceHelper can be used
	static setSpaceCheckCallback(func) {
		super.spaceHelper = func
	}

	// must be called before elementOnClick can be used
	static setElementSelectionCallback(func) {
		super.elementOnClick = func
	}

	constructor(id, pos) {
		this.id = id
		this.moves = {}
		this.alive = true
		this.pos = pos
		this.hasMoved = false
		this.element = document.createElement('img')
		this.directions = []
		this.initializeElement()
	}

	get position() {
		return this.pos.str
	}

	setPosition(coord) {
		if (!coord instanceof Coord) {
			throw new Error(`Attempted to assign invalid Coord to ${this.id}: ${coord}`)
		}
		this.pos = coord
	}

	// creates corresponding html element and gives it a click function
	initializeElement() {
		this.element.className = 'piece'
		this.element.id = this.id
		this.element.style.opacity = 1
		this.element.onclick = () => Piece.elementOnClick(this)
	}

	setMoves(moves) {
		this.moves = moves
	}

	// checks to see if a position is in this Piece's list of legal mvoes
	canMoveTo(position) {
		return this.moves[position] || false
	}

	// generalized for all Pieces that can move any number of spaces in a direction
	getPossibleMoves() {
		let moves = []
		for (var dir of this.directions) {
			var cur = this.position
			var done = false
			while (!done) {
				cur = Utils.coordIncrementer[dir](cur)
				if (Utils.isValidCoord(cur)) {
					let space = Piece.spaceHelper(cur)
					if (space.isEmpty()) {
						moves.push(cur)
					} else {
						if (this.isEnemyOf(space.contents)) {
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
		if (!this.hasMoved) {
			this.hasMoved = true
		}
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

	getPossibleMoves() {
		// forward is relative
		let fwd = this.id[1] == 'w' ? 'up' : 'down'
		var moves = [
			Utils.coordIncrementer[fwd](this.position),
			Utils.coordIncrementer[fwd + 'left'](this.position),
			Utils.coordIncrementer[fwd + 'right'](this.position)
		]
		moves = moves.filter(pos => Utils.isValidCoord(pos))
		// not ideal, but some filtering here is the most elegant option
		if (! this.hasMoved && Piece.spaceHelper(moves[0]).isEmpty()) {
			moves.push(Utils.coordIncrementer[fwd](moves[0]))
		}
		// no on-board moves remaining signifies a Pawn promotion
		// TODO this adds a move but does not highlight or execute properly
		if (moves.length == 0) {
			moves.push(this.position)
		}
		return moves
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

	getPossibleMoves() {
		return Utils.validKnightCoords(this.position)
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

	getPossibleMoves() {
		let moves = []
		for (var dir in Utils.coordIncrementer) {
			let cur = Utils.coordIncrementer[dir](this.position)
			if (Utils.isValidCoord(cur)) {
				moves.push(cur)
			}
		}
		return moves
	}
}
