// creates the ChessBoard object and corresponding html element
class ChessBoard {
	// create an 8 by 8 chessboard
	constructor() {
		this.spaces = this.generateBoard()
		this.pieces = this.generatePieces()
		this.selected = 'none'
		this.updateQueue = []
		this.populateBoard()
		this.renderBoard()
	}

	// creates a dictionary of Space objects with alternating colors
	// #a3524e = burgundy
	// #f2e8e7 = red-tinted white
	generateBoard() {
		const handleClick = (space) => {
			if (this.selected != 'none') {
				let piece = this.selected
				if (piece.getPosition() != space.getID()) {
					let from = piece.getPosition()
					let to = space.getID()
					// TODO an implementation that makes more sense, perhaps an 'Update' class object
					// TODO third value is never used, just pass in this.selected and space.getID()
					var update = ['move', piece.getID(), from, to]
					if (this.legalityCheck(update)) {
						if (this.canCastleWith(space.getContents())) {
							update[0] = 'castle'
						}
						this.pushUpdate(update)
						this.updateBoard()
					} else {
						console.log(`Illegal move attempted: ${this.selected.getID()} to ${space.getID()} from ${this.selected.getPosition()}`)
					}
				}
			}
		}
		var spaces = {}
		var switchColor = false
		for (var i in Utils.coordMatrix) {
			for (var j in Utils.coordMatrix[i]) {
				let coord = Utils.coordMatrix[i][j]
				spaces[coord] = new Space(
					switchColor === true ? '#a3524e' : '#f2e8e7',
					coord,
					handleClick
				)
				switchColor = !switchColor
			}
			switchColor = !switchColor
		}
		return spaces
	}

	// creates a dictionary of Piece objects
	generatePieces() {
		const clickFn = (piece) => {
			this.select(piece)
		}
		const spaceFn = (pos) => {
			return this.spaces[pos] || null
		}
		const castleFn = (king) => {
			return this.handleCastling(king)
		}
		var pieces = {}
		// black pawns
		pieces['pb1'] = new Pawn('pb1', 'a7', clickFn, spaceFn)
		pieces['pb2'] = new Pawn('pb2', 'b7', clickFn, spaceFn)
		pieces['pb3'] = new Pawn('pb3', 'c7', clickFn, spaceFn)
		pieces['pb4'] = new Pawn('pb4', 'd7', clickFn, spaceFn)
		pieces['pb5'] = new Pawn('pb5', 'e7', clickFn, spaceFn)
		pieces['pb6'] = new Pawn('pb6', 'f7', clickFn, spaceFn)
		pieces['pb7'] = new Pawn('pb7', 'g7', clickFn, spaceFn)
		pieces['pb8'] = new Pawn('pb8', 'h7', clickFn, spaceFn)

		// black pieces
		pieces['Rb1'] = new Rook('Rb1', 'a8', clickFn, spaceFn)
		pieces['Rb2'] = new Rook('Rb2', 'h8', clickFn, spaceFn)
		pieces['Nb1'] = new Knight('Nb1', 'b8', clickFn, spaceFn)
		pieces['Nb2'] = new Knight('Nb2', 'g8', clickFn, spaceFn)
		pieces['Bb1'] = new Bishop('Bb1', 'c8', clickFn, spaceFn)
		pieces['Bb2'] = new Bishop('Bb2', 'f8', clickFn, spaceFn)
		pieces['Qb'] = new Queen('Qb', 'd8', clickFn, spaceFn)
		pieces['Kb'] = new King('Kb', 'e8', clickFn, spaceFn, castleFn)

		// white pawns
		pieces['pw1'] = new Pawn('pw1', 'a2', clickFn, spaceFn)
		pieces['pw2'] = new Pawn('pw2', 'b2', clickFn, spaceFn)
		pieces['pw3'] = new Pawn('pw3', 'c2', clickFn, spaceFn)
		pieces['pw4'] = new Pawn('pw4', 'd2', clickFn, spaceFn)
		pieces['pw5'] = new Pawn('pw5', 'e2', clickFn, spaceFn)
		pieces['pw6'] = new Pawn('pw6', 'f2', clickFn, spaceFn)
		pieces['pw7'] = new Pawn('pw7', 'g2', clickFn, spaceFn)
		pieces['pw8'] = new Pawn('pw8', 'h2', clickFn, spaceFn)

		// white pieces
		pieces['Rw1'] = new Rook('Rw1', 'a1', clickFn, spaceFn)
		pieces['Rw2'] = new Rook('Rw2', 'h1', clickFn, spaceFn)
		pieces['Nw1'] = new Knight('Nw1', 'b1', clickFn, spaceFn)
		pieces['Nw2'] = new Knight('Nw2', 'g1', clickFn, spaceFn)
		pieces['Bw1'] = new Bishop('Bw1', 'c1', clickFn, spaceFn)
		pieces['Bw2'] = new Bishop('Bw2', 'f1', clickFn, spaceFn)
		pieces['Qw'] = new Queen('Qw', 'd1', clickFn, spaceFn)
		pieces['Kw'] = new King('Kw', 'e1', clickFn, spaceFn, castleFn)

		return pieces
	}

	// places all Piece objects into their starting Space
	// TODO: what if this happened in the constructor of a Piece?
	populateBoard() {
		for (var p in this.pieces) {
			let piece = this.pieces[p]
			// it makes sense for addPieceToSpace() to be called here, but since 
			// piece.pos doesn't need to change we can call addPiece directly
			this.spaces[piece.pos].addPiece(piece)
		}
	}

	// display ChessBoard by creating row elements containing each Space's element
	renderBoard() {
		let boardElement = document.getElementById('chessBoard')
		for (var i = 8; i > 0; i--) {
			let rowElement = document.createElement('div')
			rowElement.className = 'row'
			rowElement.id = i
			for (var j in Utils.columnTable[i]) {
				let coord = Utils.columnTable[i][parseInt(j)]
				let space = this.spaces[coord]
				rowElement.appendChild(space.element)
			}
			boardElement.appendChild(rowElement)
		}
	}

	// shows all of a Piece's legal moves in yellow
	highlightLegalMoves(piece) {
		for (var space in piece.legalMoves) {
			this.spaces[space].addHighlight() // TODO: make this work
		}
	}

	// returns all of a Piece's legal moves to their default color
	removeHighlights(piece) {
		for (var pos in piece.legalMoves) {
			// TODO better way of fixing highlight bug
			this.spaces[pos].removeHighlight()
		}
	}

	// return a reference to the Space occupied by a given Piece, else null
	getSpaceOfPiece(piece) {
		return this.spaces[piece.getPosition()] || null
	}

	// only the ChessBoard should be able to manage both Space and Piece properties
	// TODO should this return a status boolean?
	removePieceFromSpace(piece, space) {
		space.removePiece(piece)
		piece.setPosition('')
	}

	// only the ChessBoard should be able to manage both Space and Piece properties
	// TODO should this return a status boolean?
	addPieceToSpace(piece, space) {
		space.addPiece(piece)
		piece.setPosition(space.getID())
	}

	canCastleWith(piece) {
		return this.selected.getType() == 'King' && ! this.selected.hasMoved && piece.getType() == 'Rook' && ! piece.hasMoved && ! this.selected.isEnemyOf(piece)
	}

	// places a Piece inside of the holder element and allows it to perform actions
	select(piece) {
		// deselect when clicking the same piece that is selected
		if (this.selected == piece) {
			this.deselect()
			return
		// otherwise, determine whether we're reselecting or attacking
		} else if (this.selected != 'none') {
			// skip next steps if we're attacking or castling
			if (this.selected.isEnemyOf(piece) || this.canCastleWith(piece)) {
				return
			// else, deselect and continue with selection process
			} else {
				this.deselect()
			}
		}
		this.selected = piece
		console.log(piece)
		piece.updateLegalMoves()
		this.highlightLegalMoves(piece)
		// TODO wrap this in another function
		let holder = document.getElementById('holder')
		let rPiece = document.getElementById(piece.id).cloneNode(true)
		if (holder.firstChild) {
			holder.removeChild(holder.firstChild)
		}
		holder.appendChild(rPiece)
	}

	// remove currently selected Piece from the holder element
	deselect() {
		this.removeHighlights(this.selected)
		this.selected = 'none'
		let holder = document.getElementById('holder')
		holder.removeChild(holder.firstChild)
	}

	// given an update, returns true if it is legal or false otherwise
	legalityCheck(update) {
		let type = update[0]
		// TODO implement getPieceByID() which performs a sanity check
		let piece = this.pieces[update[1]]
		let pos1 = update[2]
		let pos2 = update[3]
		return piece.checkIfLegal(pos2)
	}

	// replacement for Piece.move(); performs a move or attack and returns the result
	executeUpdate(update) {
		let piece = this.pieces[update[1]]
		let coord = update[3]
		let src = this.getSpaceOfPiece(piece)
		let dst = this.spaces[coord]
		// DEBUG ensures check highlighting doens't persist
		// TODO decide if this sanity check needs to exist
		if (piece.legalMoves[coord] == 'm' || piece.legalMoves[coord] == 'a') {
			if (piece.getType() == 'King') {
				src.removeHighlight()
			}
			return this.handleAction(src, dst)
		} else if (piece.legalMoves[coord][0] == 'c') {
			// remove team identifier for easier string matching
			let id = piece.legalMoves[coord][1].replace(/[bw]/, '')
			if (id == 'R1') {
				let kingDst = this.spaces[Utils.coord(dst.getID(), 2, 0)]
				let rookDst = this.spaces[Utils.coord(src.getID(), -1, 0)]
				return this.handleAction(src, kingDst) && this.handleAction(dst, rookDst)
			} else if (id == 'R2') {
				let kingDst = this.spaces[Utils.coord(dst.getID(), -1, 0)]
				let rookDst = this.spaces[Utils.coord(src.getID(), 1, 0)]
				return this.handleAction(src, kingDst) && this.handleAction(dst, rookDst)
			} else {
				throw new Error('Error occurred during castling. Details: ' + update)
			}
		} else {
			throw new Error('Unknown action type for ' + piece.getID() + ': ' + piece.legalMoves[coord])
		}
	}

	handleAction(src, dst) {
		let pieceA = src.getContents()
		if (!dst.isEmpty() && pieceA != 'empty') { // attack
			let pieceB = dst.getContents()
			this.removePieceFromSpace(pieceA, src)
			this.removePieceFromSpace(pieceB, dst)
			this.addPieceToSpace(pieceA, dst)
			pieceB.kill()
			// TODO more OO implementation?
			pieceA.handleFirstMove()
			// TODO DEBUG better implementation that doesn't require this to be here
			if (pieceA.getType() == 'King') {
				src.removeHighlight()
			}
			if (pieceB.getType() == 'King') {
				dst.removeHighlight()
			}
			// DEBUG
			console.log(`${pieceA.id} x ${pieceB.id} -> ${dst.id}`)
			return true
		} else if (dst.isEmpty() && pieceA != 'empty') { // movement
			this.removePieceFromSpace(pieceA, src)
			this.addPieceToSpace(pieceA, dst)
			pieceA.handleFirstMove()
			// DEBUG
			console.log(`${pieceA.id} ${src.id} -> ${dst.id}`)
			return true
		} else {
			// DEBUG
			console.log('something has gone horribly wrong during action')
			console.log('Source space:')
			console.log(src)
			console.log('Destination space:')
			console.log(dst)
			return false
		}
	}

	kingsCheckStatuses() {
		var result = {}
		let kings = [this.pieces['Kw'], this.pieces['Kb']]
		for (var k of kings) {
			result[k.id] = false
			// DEBUG here so this can be called when a king is dead
			if (!k.isAlive()) {
				continue
			}
			for (var direction in Utils.coordIncrementer) {
				var c = k.pos
				var done = false
				while (!done) {
					c = Utils.coordIncrementer[direction](c)
					if (Utils.isValidSpace(c)) {
						let s = this.spaces[c]
						if (!s.isEmpty()) {
							let p = s.getContents()
							if (p.isEnemyOf(k)) {
								p.updateLegalMoves()
								if (p.checkIfLegal(k.pos)) {
									result[k.id] = true
								}
							}
							done = true
						}
					} else {
						done = true
					}
				}
			}
			for (var c of Utils.validKnightCoords(k.pos)) {
				let s = this.spaces[c]
				if (!s.isEmpty()) {
					let p = s.getContents()
					if (p.isEnemyOf(k) && p.getType() == 'Knight') {
						result[k.id] = true
						break
					}
				}
			}
		}
		return result
	}

	// return true/false, then set of rook coords
	handleCastling(king) {
		var validRooks = []
		var canCastle = false
		if (!king.hasMoved) {
			var hitLeft = false
			var hitRight = false
			var left = Utils.coordIncrementer['left'](king.getPosition())
			var right = Utils.coordIncrementer['right'](king.getPosition())
			while (!hitLeft) {
				if (!this.spaces[left].isEmpty()) {
					hitLeft = true
					let piece = this.spaces[left].getContents()
					// BUG? hasMoved SHOULD be enough to check if both pieces are allies
					// TODO use getters
					if (piece.getType() == 'Rook' && !piece.hasMoved) {
						validRooks.push(piece.getPosition())
						canCastle = true
					}
				} else {
					left = Utils.coordIncrementer['left'](left)
				}
			}
			while (!hitRight) {
				if (!this.spaces[right].isEmpty()) {
					hitRight = true
					let piece = this.spaces[right].getContents()
					if (piece.getType() == 'Rook' && !piece.hasMoved) {
						validRooks.push(piece.getPosition())
						canCastle = true
					}
				} else {
					right = Utils.coordIncrementer['right'](right)
				}
			}
		}
		return [canCastle, validRooks]
	}

	// updates the appearance of King Spaces if in check
	updateCheckHighlighting() {
		for (let [k, inCheck] of Object.entries(this.kingsCheckStatuses())) {
			let p = this.pieces[k]
			let s = this.getSpaceOfPiece(p)
			if (inCheck) {
				s.redden()
				console.log(`reddening ${p.id} in check`)
				console.log(`${p.id} board position: ${p.pos}`)
			} else if (s) { // dead King space is null
				s.removeHighlight()
			}
		}
	}

	// used to send a Piece's desired action to the board so it can be executed
	pushUpdate(update) {
		this.updateQueue.push(update)
	}

	// execute all actions stored within the update queue
	// this system makes it easy to move multiple pieces in one turn (ex. Castling)
	updateBoard() {
		while (this.updateQueue.length) {
			let update = this.updateQueue.shift()
			if (this.executeUpdate(update)) {
				this.deselect()
			} else { // TODO remove this eventually
				throw new Error(`executeUpdate returned false for update: ${update}`)
			}
		}
		// DEBUG this is only for testing, for now
		this.updateCheckHighlighting()
	}
}
