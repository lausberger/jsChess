class Game {
	// Use this class to create game logic
	// Example functionality: generates a ChessBoard, then keeps track of whose turn it is
}

// utility class with data structures that make it easy to iterate through spaces
class Utils {
	// useful when iterating through spaces in a double loop
	static PositionMatrix = [
		['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
		['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
	]
	
	// useful when iterating through all spaces at once
	static PositionArray = [
		'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
		'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
		'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
		'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
		'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
		'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
		'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
		'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
	]

	// useful when iterating through a specific row
	static RowTable = {
		'a': ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'],
		'b': ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'],
		'c': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
		'd': ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
		'e': ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
		'f': ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
		'g': ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'],
		'h': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']
	}
	
	// useful when iterating through a specific column
	static ColumnTable = {
		1: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
		2: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		3: ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		4: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		5: ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		6: ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		7: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		8: ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
	}
}

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
	}
}

// represents one space on the ChessBoard
class Square {
	constructor(board, color, id) {
		this.board = board
		this.color = color
		this.id = id
		this.contents = 'empty'
		this.element = document.createElement('div')
		this.initializeElement()
	}

	// creates the html element that is tied to this object
	initializeElement() {
		this.element.className = 'square'
		this.element.id = this.id
		this.element.style.backgroundColor = this.color
		this.element.onclick = () => {
			if (this.board.selected != "none") {
				if (this.board.selected.pos != this.id) {
					// TODO: replace this with this.board.Update(update) or something
					let update = ['move', this.board.selected.id, this.board.selected.pos, this.id]
					this.board.pushUpdate(update)
					this.board.updateBoard()
				}
			}
		}
	}

	// turns this square yellow to show a piece's legal moves
    addHighlight() {
		this.element.style.backgroundColor = "#FDFF47"
    }

	// restores this square to its normal color
    removeHighlight() {
		this.element.style.backgroundColor = this.color
    }
    
	// places a piece in this square
	addPiece(piece) {
		this.contents = piece
		this.element.appendChild(piece.element)
	}

	// makes this square empty again
	// TODO: decide whether to remove piece argument
	removePiece(piece) {
        if (!this.hasPiece(piece)) {
			throw new Error("Attempting to remove a piece that is not there!")
		} else {
			this.contents = "empty"
			this.element.removeChild(piece.element)
		}
	}

	// check if a given piece is in this square
    hasPiece(piece) {
        let containsPiece = this.contents == piece
        let elementContains = this.element.contains(piece.element)
        if (containsPiece && elementContains) {
            return true
        } else {
            console.log("Error in " + this.id + " contains check")
            console.log("\tContains piece object: " + containsPiece)
            console.log("\tElement contains piece element: " + elementContains)
            return false
        }
    }

	// check if this square is empty
    isEmpty() {
        let contentsEmpty = this.contents == 'empty'
        // an empty square either has no children, or only a highlight
        let elementEmpty = !this.element.hasChildNodes() || this.element.querySelector('#hl')
        if (contentsEmpty && elementEmpty) {
            return true
        } else {
            return false
        }
    }
}

// interface class that provides default functions for Piece objects
class Piece {
	constructor(board, id, position) {
		this.board = board
		this.id = id
		this.pos = position
        this.legalMoves = {}
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

	// move a Piece to a Square, given the id string of the position
	// makes sure the move is legal first
	move(position) {
		if (this.checkIfLegal(position)) {
			let src = this.board.spaces[this.pos]
			let dst = this.board.spaces[position]

			if (this.legalMoves[position] == 'a') {
                console.log("attacking!")
                if (src.hasPiece(this) && !dst.isEmpty()) {
					dst.removePiece(dst.contents)
					src.removePiece(this)
					dst.addPiece(this)
					this.pos = position
					this.firstMove = false
					return true
				} else {
					console.log("failure during attack")
                    console.log("assert src has piece: " + src.hasPiece(this))
                    console.log("assert dst is not empty: " + !dst.isEmpty())
				}
            //TODO: add an attack function
            } else if (this.legalMoves[position] == 'm') {
                console.log("moving")
                if (src.hasPiece(this) && dst.isEmpty()) {
					src.removePiece(this)
					dst.addPiece(this)
					this.pos = position
					this.firstMove = false
					return true
				} else {
					console.log("something has gone horribly wrong when moving")
					console.log("assert src has piece: " + src.hasPiece(this))
					console.log("assert dst is empty: " + dst.isEmpty())
				}
            } else {
                throw new Error("Unknown action type in move for " + this)
            }	
		} else {
            console.log("Illegal move attempted: " + this.id + " to " + position + " from " + this.pos)
        }
		return false
    }

	// checks to see if a position is in this Piece's list of legal mvoes
    checkIfLegal(position) {
        if (this.legalMoves[position]) {
            return true
        }
        return false
    }

	// each Piece subclass has a different way of checking for legal moves
    generateLegalMoves() {
        throw new Error("generic move generation function called")
    }

	// checks whether a Piece belongs to the opposing team, used to find legal moves
	isEnemyWith(otherPiece) {
		if (this.id[1] != otherPiece.id[1]) {
			return true
		}
		return false
	}

}

class Pawn extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.firstMove = true
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
        var direction = this.id[1] == 'w' ? 1 : -1
        var newLegalMoves = {}

        let atk1 = String.fromCharCode(this.pos.charCodeAt(0)+1) + String.fromCharCode(this.pos.charCodeAt(1)+direction)
        let atk2 = String.fromCharCode(this.pos.charCodeAt(0)-1) + String.fromCharCode(this.pos.charCodeAt(1)+direction)
        let mov = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+direction)
		      
        
        // first generate valid attacks
        // if the position exists on the board
        if (this.board.spaces[atk1]) {
            // if said space is currently occupied
            if (!this.board.spaces[atk1].isEmpty()) {
                // and if it is occupied by an enemy piece
				if (this.isEnemyWith(this.board.spaces[atk1].contents)) {
                    newLegalMoves[atk1] = 'a'
                }
            }
        }
        if (this.board.spaces[atk2]) {
            if (!this.board.spaces[atk2].isEmpty()) {
				if (this.isEnemyWith(this.board.spaces[atk2].contents)) {
                    newLegalMoves[atk2] = 'a'
                }
            }
        }
        // validate regular movement
        // TODO: logic for when a pawn reaches the end
        if (this.board.spaces[mov]) { 
            if (this.board.spaces[mov].isEmpty()) {
                newLegalMoves[mov] = 'm'
                // pawns can move 2 spaces on their first turn
                if (this.firstMove) {
                    let mov2 = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+2*direction)
                    if (this.board.spaces[mov2].isEmpty()) {
                        newLegalMoves[mov2] = 'm'
                    }
                }
            }
        }

        this.legalMoves = newLegalMoves
    }
}

class Rook extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/rlt60.png'
		} else {
			this.img = 'pieces/rdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		var validDirs = [true, true, true, true]

		for (var inc=1; inc<=8; inc++) {
			let left = String.fromCharCode(this.pos.charCodeAt(0)-inc) + this.pos[1]
			let right = String.fromCharCode(this.pos.charCodeAt(0)+inc) + this.pos[1] 
			let up = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+inc)
			let down = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)-inc)

			if (this.board.spaces[left] && validDirs[0]) {
                if (!this.board.spaces[left].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[left].contents)) {
						newLegalMoves[left] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[left] = 'm'
				}
			}
			if (this.board.spaces[right] && validDirs[1]) {
                if (!this.board.spaces[right].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[right].contents)) {
						newLegalMoves[right] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[right] = 'm'
				}
			} 
			if (this.board.spaces[up] && validDirs[2]) {
                if (!this.board.spaces[up].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[up].contents)) {
						newLegalMoves[up] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[up] = 'm'
				}
			} 
			if (this.board.spaces[down] && validDirs[3]) {
                if (!this.board.spaces[down].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[down].contents)) {
						newLegalMoves[down] = 'a'
					}
					validDirs[3] = false
				} else {
					newLegalMoves[down] = 'm'
				}
			} 
		}

		this.legalMoves = newLegalMoves
	}
}

class Knight extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['knight moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/nlt60.png'
		} else {
			this.img = 'pieces/ndt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		let up1 = String.fromCharCode(this.pos.charCodeAt(0)-1) + String.fromCharCode(this.pos.charCodeAt(1)+2)
		let up2 = String.fromCharCode(this.pos.charCodeAt(0)+1) + String.fromCharCode(this.pos.charCodeAt(1)+2)
		let down1 = String.fromCharCode(this.pos.charCodeAt(0)-1) + String.fromCharCode(this.pos.charCodeAt(1)-2)
		let down2 = String.fromCharCode(this.pos.charCodeAt(0)+1) + String.fromCharCode(this.pos.charCodeAt(1)-2)
		let left1 = String.fromCharCode(this.pos.charCodeAt(0)-2) + String.fromCharCode(this.pos.charCodeAt(1)+1)
		let left2 = String.fromCharCode(this.pos.charCodeAt(0)-2) + String.fromCharCode(this.pos.charCodeAt(1)-1)
		let right1 = String.fromCharCode(this.pos.charCodeAt(0)+2) + String.fromCharCode(this.pos.charCodeAt(1)+1)
		let right2 = String.fromCharCode(this.pos.charCodeAt(0)+2) + String.fromCharCode(this.pos.charCodeAt(1)-1)
		let possibleMoves = [up1, up2, down1, down2, left1, left2, right1, right2]

		for (var i=0; i<possibleMoves.length; i++) {
			let move = possibleMoves[i]
			if (this.board.spaces[move]) {
                if (!this.board.spaces[move].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[move].contents)) {
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
		this.moveset = ['bishop moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/blt60.png'
		} else {
			this.img = 'pieces/bdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		var validDirs = [true, true, true, true]

		for (var inc=1; inc<=8; inc++) {
			let upleft = String.fromCharCode(this.pos.charCodeAt(0)-inc) + String.fromCharCode(this.pos.charCodeAt(1)+inc) 
			let upright = String.fromCharCode(this.pos.charCodeAt(0)+inc) + String.fromCharCode(this.pos.charCodeAt(1)+inc) 
			let downleft = String.fromCharCode(this.pos.charCodeAt(0)-inc) + String.fromCharCode(this.pos.charCodeAt(1)-inc) 
			let downright = String.fromCharCode(this.pos.charCodeAt(0)+inc) + String.fromCharCode(this.pos.charCodeAt(1)-inc) 

			if (this.board.spaces[upleft] && validDirs[0]) {
                if (!this.board.spaces[upleft].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[upleft].contents)) {
						newLegalMoves[upleft] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[upleft] = 'm'
				}
			}
			if (this.board.spaces[upright] && validDirs[1]) {
                if (!this.board.spaces[upright].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[upright].contents)) {
						newLegalMoves[upright] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[upright] = 'm'
				}
			} 
			if (this.board.spaces[downleft] && validDirs[2]) {
                if (!this.board.spaces[downleft].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[downleft].contents)) {
						newLegalMoves[downleft] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[downleft] = 'm'
				}
			} 
			if (this.board.spaces[downright] && validDirs[3]) {
                if (!this.board.spaces[downright].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[downright].contents)) {
						newLegalMoves[downright] = 'a'
					}
					validDirs[3] = false
				} else {
					newLegalMoves[downright] = 'm'
				}
			}
		}

		this.legalMoves = newLegalMoves
	}
}

class Queen extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['queen moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/qlt60.png'
		} else {
			this.img = 'pieces/qdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		var validDirs = [true, true, true, true, true, true, true, true]
		
		for (var inc=1; inc<=8; inc++) {
			let upleft = String.fromCharCode(this.pos.charCodeAt(0)-inc) + String.fromCharCode(this.pos.charCodeAt(1)+inc) 
			let upright = String.fromCharCode(this.pos.charCodeAt(0)+inc) + String.fromCharCode(this.pos.charCodeAt(1)+inc) 
			let downleft = String.fromCharCode(this.pos.charCodeAt(0)-inc) + String.fromCharCode(this.pos.charCodeAt(1)-inc) 
			let downright = String.fromCharCode(this.pos.charCodeAt(0)+inc) + String.fromCharCode(this.pos.charCodeAt(1)-inc) 
			let left = String.fromCharCode(this.pos.charCodeAt(0)-inc) + this.pos[1]
			let right = String.fromCharCode(this.pos.charCodeAt(0)+inc) + this.pos[1] 
			let up = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+inc)
			let down = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)-inc)

			if (this.board.spaces[upleft] && validDirs[0]) {
                if (!this.board.spaces[upleft].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[upleft].contents)) {
						newLegalMoves[upleft] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[upleft] = 'm'
				}
			}
			if (this.board.spaces[upright] && validDirs[1]) {
                if (!this.board.spaces[upright].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[upright].contents)) {
						newLegalMoves[upright] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[upright] = 'm'
				}
			} 
			if (this.board.spaces[downleft] && validDirs[2]) {
                if (!this.board.spaces[downleft].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[downleft].contents)) {
						newLegalMoves[downleft] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[downleft] = 'm'
				}
			} 
			if (this.board.spaces[downright] && validDirs[3]) {
                if (!this.board.spaces[downright].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[downright].contents)) {
						newLegalMoves[downright] = 'a'
					}
					validDirs[3] = false
				} else {
					newLegalMoves[downright] = 'm'
				}
			}			
			if (this.board.spaces[left] && validDirs[4]) {
                if (!this.board.spaces[left].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[left].contents)) {
						newLegalMoves[left] = 'a'
					}
					validDirs[4] = false
				} else {
					newLegalMoves[left] = 'm'
				}
			}
			if (this.board.spaces[right] && validDirs[5]) {
                if (!this.board.spaces[right].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[right].contents)) {
						newLegalMoves[right] = 'a'
					}
					validDirs[5] = false
				} else {
					newLegalMoves[right] = 'm'
				}
			} 
			if (this.board.spaces[up] && validDirs[6]) {
                if (!this.board.spaces[up].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[up].contents)) {
						newLegalMoves[up] = 'a'
					}
					validDirs[6] = false
				} else {
					newLegalMoves[up] = 'm'
				}
			} 
			if (this.board.spaces[down] && validDirs[7]) {
                if (!this.board.spaces[down].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[down].contents)) {
						newLegalMoves[down] = 'a'
					}
					validDirs[7] = false
				} else {
					newLegalMoves[down] = 'm'
				}
			} 
		}

		this.legalMoves = newLegalMoves
	}
}

class King extends Piece {
	constructor(board, id, position) {
		super(board, id, position)
		this.moveset = ['king moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/klt60.png'
		} else {
			this.img = 'pieces/kdt60.png'
		}
		this.element.src = this.img
	}

	generateLegalMoves() {
		var newLegalMoves = {}
		let upleft = String.fromCharCode(this.pos.charCodeAt(0)-1) + String.fromCharCode(this.pos.charCodeAt(1)+1) 
		let upright = String.fromCharCode(this.pos.charCodeAt(0)+1) + String.fromCharCode(this.pos.charCodeAt(1)+1) 
		let downleft = String.fromCharCode(this.pos.charCodeAt(0)-1) + String.fromCharCode(this.pos.charCodeAt(1)-1) 
		let downright = String.fromCharCode(this.pos.charCodeAt(0)+1) + String.fromCharCode(this.pos.charCodeAt(1)-1) 
		let left = String.fromCharCode(this.pos.charCodeAt(0)-1) + this.pos[1]
		let right = String.fromCharCode(this.pos.charCodeAt(0)+1) + this.pos[1] 
		let up = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+1)
		let down = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)-1)
		let possibleMoves = [upleft, upright, downleft, downright, left, right, up, down]

		for (var i=0; i<possibleMoves.length; i++) {
			let move = possibleMoves[i]
			if (this.board.spaces[move]) {
                if (!this.board.spaces[move].isEmpty()) {
					if (this.isEnemyWith(this.board.spaces[move].contents)) {
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

const chessBoard = new ChessBoard()
console.log(chessBoard)