// creates the ChessBoard object and corresponding html element
class ChessBoard {
	// create an 8 by 8 chessboard
	constructor(size = 8) { 
		this.size = size
		this.spaces = this.generateBoard()
        this.pieces = this.generatePieces()
        this.selected = "none"
		this.updateQueue = []
		this.populateBoard()
        this.renderBoard()
	}

	// creates a dictionary of Square objects with alternating colors
	// #a3524e = burgundy
	// #f2e8e7 = red-tinted white
	generateBoard() {
		var spaces = {}
		var switchColor = false
		for (var i in Utils.PositionMatrix) {
			for (var j in Utils.PositionMatrix[i]) {
				let key = Utils.PositionMatrix[i][j]
				spaces[key] = new Square(
					this,
					switchColor === true ? '#a3524e' : '#f2e8e7', 
					key)
				switchColor = !switchColor
			}
			switchColor = !switchColor
		}
		return spaces
	}

	// creates a dictionary of Piece objects
	generatePieces() {
		var pieces = {}
		// black pawns
		pieces['pb1'] = new Pawn(this, 'pb1', 'a7')
		pieces['pb2'] = new Pawn(this, 'pb2', 'b7')
		pieces['pb3'] = new Pawn(this, 'pb3', 'c7')
		pieces['pb4'] = new Pawn(this, 'pb4', 'd7')
		pieces['pb5'] = new Pawn(this, 'pb5', 'e7')
		pieces['pb6'] = new Pawn(this, 'pb6', 'f7')
		pieces['pb7'] = new Pawn(this, 'pb7', 'g7')
		pieces['pb8'] = new Pawn(this, 'pb8', 'h7')

		// black pieces
		pieces['Rb1'] = new Rook(this, 'Rb1', 'a8')
		pieces['Rb2'] = new Rook(this, 'Rb2', 'h8')
		pieces['Nb1'] = new Knight(this, 'Nb1', 'b8')
		pieces['Nb2'] = new Knight(this, 'Nb2', 'g8')
		pieces['Bb1'] = new Bishop(this, 'Bb1', 'c8')
		pieces['Bb2'] = new Bishop(this, 'Bb2', 'f8')
		pieces['Qb'] = new Queen(this, 'Qb', 'd8')
		pieces['Kb'] = new King(this, 'Kb', 'e8')
		
		// white pawns
		pieces['pw1'] = new Pawn(this, 'pw1', 'a2')
		pieces['pw2'] = new Pawn(this, 'pw2', 'b2')
		pieces['pw3'] = new Pawn(this, 'pw3', 'c2')
		pieces['pw4'] = new Pawn(this, 'pw4', 'd2')
		pieces['pw5'] = new Pawn(this, 'pw5', 'e2')
		pieces['pw6'] = new Pawn(this, 'pw6', 'f2')
		pieces['pw7'] = new Pawn(this, 'pw7', 'g2')
		pieces['pw8'] = new Pawn(this, 'pw8', 'h2')

		// white pieces
		pieces['Rw1'] = new Rook(this, 'Rw1', 'a1')
		pieces['Rw2'] = new Rook(this, 'Rw2', 'h1')
		pieces['Nw1'] = new Knight(this, 'Nw1', 'b1')
		pieces['Nw2'] = new Knight(this, 'Nw2', 'g1')
		pieces['Bw1'] = new Bishop(this, 'Bw1', 'c1')
		pieces['Bw2'] = new Bishop(this, 'Bw2', 'f1')
		pieces['Qw'] = new Queen(this, 'Qw', 'd1')
		pieces['Kw'] = new King(this, 'Kw', 'e1')
		
		return pieces
	}

	// places all Piece objects into their starting Square
	// TODO: what if this happened in the constructor of a Piece?
	populateBoard() {
		for (var p in this.pieces) {
			let piece = this.pieces[p]
			this.spaces[piece.pos].addPiece(piece)
		}
	}

	// display ChessBoard by creating row elements containing each Square's element
	renderBoard() {
		let boardElement = document.getElementById('chessBoard')
		for (var i = 8; i > 0; i--) {
			let rowElement = document.createElement('div')
			rowElement.className = 'row'
			rowElement.id = i 
			for (var j in Utils.ColumnTable[i]) {
				let coord = Utils.ColumnTable[i][j]
				let space = this.spaces[coord]
				rowElement.appendChild(space.element)
			}
			boardElement.appendChild(rowElement)
		}
	}

    // shows all of a Piece's legal moves in yellow
    highlightSquares(piece) {
        for (var square in piece.legalMoves) {
            this.spaces[square].addHighlight() // TODO: make this work
        }

    }

	// returns all of a Piece's legal moves to their default color
    removeHighlights(piece) {
        for (var square in piece.legalMoves) {
            this.spaces[square].removeHighlight()
        }
    }

	// places a Piece inside of the holder element and allows it to perform actions
	select(piece) {
        // deselect when clicking the same piece that is selected
        if (this.selected == piece) {
            this.deselect()
            return
        // otherwise, determine whether we're reselecting or attacking
        } else if (this.selected != 'none') {
            // do nothing if we're attacking
            console.log(this.selected)
            if (this.selected.isEnemyWith(piece)) {
                return
            // else, deselect and continue with selection process
            } else {
                this.deselect()
            }
        }
		this.selected = piece
		console.log(piece)
    	piece.generateLegalMoves()
        this.highlightSquares(piece)
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
		this.selected = "none"
		let holder = document.getElementById('holder')
		holder.removeChild(holder.firstChild)
	}

	// used to send a Piece's desired action to the board so it can be executed
	pushUpdate(update) {
		this.updateQueue.push(update)
	}

	// execute all actions stored within the update queue
	// this system makes it easy to move multiple pieces in one turn (ex. Castling)
	updateBoard() {
		while (this.updateQueue.length) { // while update queue is not empty
			let u = this.updateQueue.shift()
			let piece = u[1]
			let dst = u[3]

			if (this.pieces[piece].move(dst)) {
				this.deselect()
			}
		}
        // DEBUG this is only for testing
        // BUG: things often get weird when a king moves out of check
        if (this.pieces['Kb'].inCheck()) {
            this.spaces[this.pieces['Kb'].pos].redden() // TODO: make this work
        } else {
            this.spaces[this.pieces['Kb'].pos].removeHighlight() // TODO: make this work
        }
        if (this.pieces['Kw'].inCheck()) {
            this.spaces[this.pieces['Kw'].pos].redden() // TODO: make this work
        } else {
            this.spaces[this.pieces['Kw'].pos].removeHighlight() // TODO: make this work
        }
	}
}
