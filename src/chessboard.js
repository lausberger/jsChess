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
		Space.setElementOnClickCallback((space) => { return this.handleClick(space) })
		var spaces = {}
		var switchColor = false
		for (var i in Utils.coordMatrix) {
			for (var j in Utils.coordMatrix[i]) {
				let coord = Utils.coordMatrix[i][j]
				let color = switchColor ? '#a3524e' : '#f2e8e7'
				spaces[coord] = new Space(color, Coordinates[coord])
				switchColor = !switchColor
			}
			switchColor = !switchColor
		}

		return spaces
	}

	// creates a dictionary of Piece objects
	generatePieces() {
		// lets a Piece's element select itself on click
		Piece.setElementSelectionCallback((piece) => { this.select(piece) })
		// lets a Piece check the contents of a Space
		Piece.setSpaceCheckCallback((pos) => { return this.spaces[pos] || null })
		var pieces = {}
		// black pawns
		pieces['pb1'] = new Pawn('pb1', Coordinates.A7)
		pieces['pb2'] = new Pawn('pb2', Coordinates.B7)
		pieces['pb3'] = new Pawn('pb3', Coordinates.C7)
		pieces['pb4'] = new Pawn('pb4', Coordinates.D7)
		pieces['pb5'] = new Pawn('pb5', Coordinates.E7)
		pieces['pb6'] = new Pawn('pb6', Coordinates.F7)
		pieces['pb7'] = new Pawn('pb7', Coordinates.G7)
		pieces['pb8'] = new Pawn('pb8', Coordinates.H7)

		// black pieces
		pieces['Rb1'] = new Rook('Rb1', Coordinates.A8)
		pieces['Rb2'] = new Rook('Rb2', Coordinates.H8)
		pieces['Nb1'] = new Knight('Nb1', Coordinates.B8)
		pieces['Nb2'] = new Knight('Nb2', Coordinates.G8)
		pieces['Bb1'] = new Bishop('Bb1', Coordinates.C8)
		pieces['Bb2'] = new Bishop('Bb2', Coordinates.F8)
		pieces['Qb'] = new Queen('Qb', Coordinates.D8)
		pieces['Kb'] = new King('Kb', Coordinates.E8)

		// white pawns
		pieces['pw1'] = new Pawn('pw1', Coordinates.A2)
		pieces['pw2'] = new Pawn('pw2', Coordinates.B2)
		pieces['pw3'] = new Pawn('pw3', Coordinates.C2)
		pieces['pw4'] = new Pawn('pw4', Coordinates.D2)
		pieces['pw5'] = new Pawn('pw5', Coordinates.E2)
		pieces['pw6'] = new Pawn('pw6', Coordinates.F2)
		pieces['pw7'] = new Pawn('pw7', Coordinates.G2)
		pieces['pw8'] = new Pawn('pw8', Coordinates.H2)

		// white pieces
		pieces['Rw1'] = new Rook('Rw1', Coordinates.A1)
		pieces['Rw2'] = new Rook('Rw2', Coordinates.H1)
		pieces['Nw1'] = new Knight('Nw1', Coordinates.B1)
		pieces['Nw2'] = new Knight('Nw2', Coordinates.G1)
		pieces['Bw1'] = new Bishop('Bw1', Coordinates.C1)
		pieces['Bw2'] = new Bishop('Bw2', Coordinates.F1)
		pieces['Qw'] = new Queen('Qw', Coordinates.D1)
		pieces['Kw'] = new King('Kw', Coordinates.E1)

		return pieces
	}

	// places all Piece objects into their starting Space
	// TODO: what if this happened in the constructor of a Piece?
	populateBoard() {
		for (var p in this.pieces) {
			let piece = this.pieces[p]
			// it makes sense for addPieceToSpace() to be called here, but since 
			// piece.position doesn't need to change we can call addPiece directly
			this.spaces[piece.position].addPiece(piece)
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
		for (var pos in piece.moves) {
			this.spaces[pos].addHighlight() // TODO: make this work
		}
	}

	// returns all of a Piece's legal moves to their default color
	removeHighlights(piece) {
		for (var pos in piece.moves) {
			// TODO better way of fixing highlight bug
			this.spaces[pos].removeHighlight()
		}
	}

	// return a reference to the Space occupied by a given Piece, else null
	getSpaceOfPiece(piece) {
		return this.spaces[piece.position] || null
	}

	// only the ChessBoard should be able to manage both Space and Piece properties
	// TODO should this return a status boolean?
	removePieceFromSpace(piece, space) {
		space.removePiece(piece)
		piece.setPosition(Coordinates.NONE)
	}

	// only the ChessBoard should be able to manage both Space and Piece properties
	// TODO should this return a status boolean?
	addPieceToSpace(piece, space) {
		space.addPiece(piece)
		piece.setPosition(Coordinates[space.id])
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
			if (this.selected.isEnemyOf(piece) || this.castlingIsValid(this.selected, piece)) {
				return
			}
			// else, deselect and continue with selection process
			this.deselect()
		}
		this.selected = piece
		// DEBUG
		console.log(piece)
		this.updateMovesOf(piece)
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
		// TODO implement getPieceByID() which performs a sanity check
		let piece = this.pieces[update[1]]
		let pos2 = update[3]
		return piece.canMoveTo(pos2)
	}

	// updates the board based on the contents of an update
	executeUpdate(update) {
		let piece = this.pieces[update[1]]
		let coord = update[3]
		let src = this.getSpaceOfPiece(piece)
		let dst = this.spaces[coord]
		// DEBUG ensures check highlighting doens't persist
		// TODO decide if this sanity check needs to exist
		if (piece.moves[coord] == 'm' || piece.moves[coord] == 'a') {
			if (piece instanceof King) {
				src.removeHighlight()
			}
			return this.handleAction(src, dst)
		} else if (piece.moves[coord][0] == 'c') {
			let rookid = piece.moves[coord][1].replace(/[bw]/, '')
			return this.handleCastling(src, dst, rookid)
		} else {
			throw new Error('Unknown action type for ' + piece.id + ': ' + piece.legalMoves[coord])
		}
	}

	// moves a Piece from src Space to dst Space, removing dead pieces as needed
	handleAction(src, dst) {
		let pieceA = src.contents
		if (! dst.isEmpty() && pieceA != 'empty') { // attack
			let pieceB = dst.contents
			this.removePieceFromSpace(pieceA, src)
			this.removePieceFromSpace(pieceB, dst)
			this.addPieceToSpace(pieceA, dst)
			pieceB.kill()
			// TODO more OO implementation?
			pieceA.handleFirstMove()
			// TODO DEBUG better implementation that doesn't require this to be here
			if (pieceA instanceof King) {
				src.removeHighlight()
			}
			if (pieceB instanceof King) {
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

	// helper function for executeUpdate; calls handleAction twice during castling
	handleCastling(src, dst, rookid)  {
		var kingDst, rookDst
		if (rookid == 'R1') {
			kingDst = this.spaces[Utils.coord(dst.id, 2, 0)]
			rookDst = this.spaces[Utils.coord(src.id, -1, 0)]
	  } else if (rookid == 'R2') {
			kingDst = this.spaces[Utils.coord(dst.id, -1, 0)]
			rookDst = this.spaces[Utils.coord(src.id, 1, 0)]
	  } else {
			return false
		}		
		return this.handleAction(src, kingDst) && this.handleAction(dst, rookDst)
	}

	// onclick callback for a Space's element
	handleClick(space) {
		let piece = this.selected
		if (piece != 'none') {
			if (piece.position != space.id) {
				let from = piece.position
				let to = space.id
				// TODO an implementation that makes more sense, perhaps an 'Update' class object
				// TODO third value is never used, just pass in this.selected and space.getID()
				var update = ['action', piece.id, from, to]
				if (this.legalityCheck(update)) {
					this.updateQueue.push(update)
					this.updateBoard()
				} else {
					console.log(`Illegal move attempted: ${update[1]} to ${update[2]} from ${update[3]}`)
				}
			}
		}
	}

	// updates the appearance of King Spaces if in check
	updateCheckHighlighting() {
		for (let [k, inCheck] of Object.entries(this.kingsCheckStatuses())) {
			let p = this.pieces[k]
			let s = this.getSpaceOfPiece(p)
			if (inCheck) {
				s.redden()
			} else if (s) { // dead King space is null
				s.removeHighlight()
			}
		}
	}

	// execute all actions stored within the update queue
	updateBoard() {
		while (this.updateQueue.length) {
			let update = this.updateQueue.shift()
			if (this.executeUpdate(update)) {
				this.deselect()
			} else {
				throw new Error(`executeUpdate returned false for update: ${update}`)
			}
		}
		this.updateCheckHighlighting()
	}

	// generates and sets a piece's legal moves. used for selection and highlightinge
	updateMovesOf(piece) {
		let moves = this.computeLegalMovesOf(piece)
		piece.setMoves(moves)
	}

	// legal move filtering for each type of piece
	computeLegalMovesOf(piece) {
		let filteredMoves = {}
		let possibleMoves = piece.getPossibleMoves()
		// slightly different algorithm for Pieces with special moves
		switch (piece.constructor) {
			case Pawn:
				for (var pos of possibleMoves) {
					let space = this.spaces[pos]
					if (space.isEmpty()) {
						if (pos[0] == piece.position[0]) {
							filteredMoves[pos] = 'm'
						}
					} else {
						if (piece.isEnemyOf(space.contents)) {
							if (pos[0] != piece.position[0]) {
								filteredMoves[pos] = 'a'
							}
							// TODO implement promotion
						} else if (piece == space.contents) {
							// filteredMoves[pos] = 'p'
						}
					}
				}
				break
			case King:
				let castlingOptions = this.getCastlingOptions(piece)
				let canCastle = castlingOptions.length > 0
				if (canCastle) {
					possibleMoves = possibleMoves.concat(castlingOptions)
				}
				for (var pos of possibleMoves) {
					let space = this.spaces[pos]
					if (space.isEmpty()) {
						filteredMoves[pos] = 'm'
					} else {
						if (piece.isEnemyOf(space.contents)) {
							filteredMoves[pos] = 'a'
						} else {
							if (canCastle && space.contents instanceof Rook) {
								filteredMoves[pos] = ['c', space.contents.id]
							}
						}
					}
				}
				break
			default:
				for (var pos of possibleMoves) {
					let space = this.spaces[pos]
					if (space.isEmpty()) {
						filteredMoves[pos] = 'm'
					} else {
						if (piece.isEnemyOf(space.contents)) {
							filteredMoves[pos] = 'a'
						}
					}
				}
		}
		return filteredMoves
	}

	// a hash indicating whether either king is currently in check
	kingsCheckStatuses() {
		var result = {}
		let kings = [this.pieces['Kw'], this.pieces['Kb']]
		for (var k of kings) {
			result[k.id] = false
			if (! k.alive) {
				continue
			}
			for (var direction in Utils.coordIncrementer) {
				var c = k.position
				var done = false
				while (! done) {
					c = Utils.coordIncrementer[direction](c)
					if (Utils.isValidCoord(c)) {
						let s = this.spaces[c]
						if (! s.isEmpty()) {
							let p = s.contents
							if (p.isEnemyOf(k)) {
								this.updateMovesOf(p)
								if (p.canMoveTo(k.position)) {
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
			for (var c of Utils.validKnightCoords(k.position)) {
				let s = this.spaces[c]
				if (! s.isEmpty()) {
					let p = s.contents
					if (p .isEnemyOf(k) && p instanceof Knight) {
						result[k.id] = true
						break
					}
				}
			}
		}
		return result
	}

	// the full set of conditions for castling
	// TODO require King not be in check here
	castlingIsValid(king, piece) {
		return king instanceof King && ! king.hasMoved && piece instanceof Rook && ! piece.hasMoved && ! king.isEnemyOf(piece)
	}

	// returns coordinates of any rooks that may be castled with
	getCastlingOptions(king) {
		if (! king instanceof King || king.hasMoved) {
			return []
		}
		var validCastles = []
		var hitLeft = false
		var hitRight = false
		var left = Utils.coordIncrementer['left'](king.position)
		var right = Utils.coordIncrementer['right'](king.position)
		while (! hitLeft) {
			if (! this.spaces[left].isEmpty()) {
				hitLeft = true
				let piece = this.spaces[left].contents
				if (this.castlingIsValid(king, piece)) {
					validCastles.push(piece.position)
				}
			} else {
				left = Utils.coordIncrementer['left'](left)
			}
		}
		while (! hitRight) {
			if (! this.spaces[right].isEmpty()) {
				hitRight = true
				let piece = this.spaces[right].contents
				if (this.castlingIsValid(king, piece)) {
					validCastles.push(piece.position)
				}
			} else {
				right = Utils.coordIncrementer['right'](right)
			}
		}
		return validCastles
	}
}
