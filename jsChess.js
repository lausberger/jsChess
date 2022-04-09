class Chess {

}

class GameBoard {
	static positions = [
		['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
		['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']]
	
	// appears largely useless at the moment
	static altPositions = [
		'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
		'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
		'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
		'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
		'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
		'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
		'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
		'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
		
	// maybe these will be useful for iterating through many spaces at once?
	static rankHelper = {
		'a': ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'],
		'b': ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'],
		'c': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
		'd': ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
		'e': ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
		'f': ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
		'g': ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'],
		'h': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']};

	static fileHelper = {
		1: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
		2: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		3: ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		4: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		5: ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		6: ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		7: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		8: ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']};

	constructor(dimension = 8) { // create an 8 by 8 chessboard
		this.size = dimension
		this.spaces = this.generateBoard()
		this.pieces = this.generatePieces()
		this.selected = "none"
		this.updateQueue = []
		this.populateBoard()
        this.renderBoard()
        //GameBoard._instance = this // in case a singleton is desired
	}

    // take the selected piece and show its legal moves
    // moves in blue, attacks in red
    highlightSquares(piece) {
        for (var square in piece.legalMoves) {
            this.spaces[square].addHighlight() // TODO: make this work
            //var squareElement = document.getElementById(square)
            //squareElement.style.backgroundColor = "#FDFF47"
            /*
            if (piece.legalMoves[square] == 'm') {
                squareElement.style.backgroundColor = "#FDFF47"
            } else if (piece.legalMoves[square] == 'a') {
                squareElement.style.backgroundColor = "#FFFF28"
            }
            */
        }
    }

    removeHighlights(piece) {
        console.log("removing highlights")
        for (var square in piece.legalMoves) {
            //var squareElement = document.getElementById(square)
            //squareElement.style.backgroundColor = this.spaces[square].color
            this.spaces[square].removeHighlight()
        }
    }

	// holder is mainly for debugging but could be expanded upon in future
	select(piece) {
        // deselect when clicking already selected piece
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

	deselect() {
        this.removeHighlights(this.selected)
		this.selected = "none"
		let holder = document.getElementById('holder')
		holder.removeChild(holder.firstChild)
	}

	// #a3524e = burgundy
	// #f2e8e7 = red-tinted white
	generateBoard() {
		var spaces = {}
		var switchColor = false
		for (var i in GameBoard.positions) {
			for (var j in GameBoard.positions[i]) {
				let key = GameBoard.positions[i][j]
				spaces[key] = new Square(
					switchColor === true ? '#a3524e' : '#f2e8e7', 
					key)
				switchColor = !switchColor
			}
			switchColor = !switchColor
		}
		return spaces
	}

	generatePieces() {
		var pieces = {}	
		// black pawns
		pieces['pb1'] = new Pawn('pb1', 'a7')
		pieces['pb2'] = new Pawn('pb2', 'b7')
		pieces['pb3'] = new Pawn('pb3', 'c7')
		pieces['pb4'] = new Pawn('pb4', 'd7')
		pieces['pb5'] = new Pawn('pb5', 'e7')
		pieces['pb6'] = new Pawn('pb6', 'f7')
		pieces['pb7'] = new Pawn('pb7', 'g7')
		pieces['pb8'] = new Pawn('pb8', 'h7')

		// black pieces
		pieces['Rb1'] = new Rook('Rb1', 'a8')
		pieces['Rb2'] = new Rook('Rb2', 'h8')
		pieces['Nb1'] = new Knight('Nb1', 'b8')
		pieces['Nb2'] = new Knight('Nb2', 'g8')
		pieces['Bb1'] = new Bishop('Bb1', 'c8')
		pieces['Bb2'] = new Bishop('Bb2', 'f8')
		pieces['Qb'] = new Queen('Qb', 'd8')
		pieces['Kb'] = new King('Kb', 'e8')
		
		// white pawns
		pieces['pw1'] = new Pawn('pw1', 'a2')
		pieces['pw2'] = new Pawn('pw2', 'b2')
		pieces['pw3'] = new Pawn('pw3', 'c2')
		pieces['pw4'] = new Pawn('pw4', 'd2')
		pieces['pw5'] = new Pawn('pw5', 'e2')
		pieces['pw6'] = new Pawn('pw6', 'f2')
		pieces['pw7'] = new Pawn('pw7', 'g2')
		pieces['pw8'] = new Pawn('pw8', 'h2')

		// white pieces
		pieces['Rw1'] = new Rook('Rw1', 'a1')
		pieces['Rw2'] = new Rook('Rw2', 'h1')
		pieces['Nw1'] = new Knight('Nw1', 'b1')
		pieces['Nw2'] = new Knight('Nw2', 'g1')
		pieces['Bw1'] = new Bishop('Bw1', 'c1')
		pieces['Bw2'] = new Bishop('Bw2', 'f1')
		pieces['Qw'] = new Queen('Qw', 'd1')
		pieces['Kw'] = new King('Kw', 'e1')
		
		return pieces
	}

	// NOTE what if this happened in the constructor of a Piece?
	populateBoard() { // hard coded for 8x8 board
		for (var name in this.pieces) {
			let p = this.pieces[name]
			this.spaces[p.pos].addPiece(p)
		}
	}

	// generate html elements from top to bottom
	// NOTE This could also likely happen in the Piece constructor
	renderBoard() {
		let _self = this
		let boardElement = document.getElementById('chessBoard')
		for (var i = 8; i > 0; i--) {
			let rowElement = document.createElement('div')
			rowElement.className = 'row'
			rowElement.id = i 
			for (var j in GameBoard.fileHelper[i]) {
				let coord = GameBoard.fileHelper[i][j]
				let space = this.spaces[coord]
				rowElement.appendChild(space.element)
			}
			boardElement.appendChild(rowElement)
		}
	}

	updateBoard() {
		while (this.updateQueue.length) { // update queue is not empty
			// not very efficient way of popping an element
			let u = this.updateQueue.shift()
			let piece = u[1]
			let dst = u[3]

			// TODO: should legality check be here instead of in move?
			if (this.pieces[piece].move(dst)) {
				this.deselect()
			}
		}
	}
}

class Square {
	constructor(color, id) {
		this.color = color
		this.id = id
		this.contents = 'empty'
		this.element = document.createElement('div')
		this.initializeElement()
	}

	initializeElement() {
		this.element.className = 'square'
		this.element.id = this.id
		this.element.style.backgroundColor = this.color
		this.element.onclick = function() {
			if (chessBoard.selected != "none") {
				if (chessBoard.selected.pos != this.id) {
					// TODO: replace this with chessBoard.Update(update) or something
					let update = ['move', chessBoard.selected.id, chessBoard.selected.pos, this.id]
					chessBoard.updateQueue.push(update)
					chessBoard.updateBoard()
				}
			}
		}
	}

    addHighlight() { // TODO: make this useful
		/*
        console.log("applying highlight to " + this.id)
        let highlight = document.createElement('div')
        highlight.className = 'highlight'
        highlight.id = 'hl'
        //this.element.appendChild(highlight)
		if (this.element.hasChildNodes()) {
			this.element.insertBefore(highlight, this.element.firstChild)
		} else {
			this.element.appendChild(highlight)
		}
		*/
		this.element.style.backgroundColor = "#FDFF47"
    }

    removeHighlight() {
		/*
        if (this.element.querySelector('#hl')) {
            let hl = this.element.childNodes.item('hl')
            this.element.removeChild(hl)
        } else {
            throw new Error("Attempting to remove highlight that is not there")
        }
		*/
		this.element.style.backgroundColor = this.color
    }
    
    // TODO this is not being called by the move function, should it?
	addPiece(piece) {
		this.contents = piece
		this.element.appendChild(piece.element)
	}

	// TODO: decide whether to remove piece argument and just use contents
	removePiece(piece) {
        if (!this.hasPiece(piece)) {
		//if (this.contents != piece) {
			throw new Error("Attempting to remove a piece that is not there!")
		} else {
			this.contents = "empty"
			this.element.removeChild(piece.element)
		}
	}

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

    isEmpty() {
        let contentsEmpty = this.contents == 'empty'
        // an empty square either has no children, or only a highlight
        let elementEmpty = !this.element.hasChildNodes() || this.element.querySelector('#hl')
        if (contentsEmpty && elementEmpty) {
            return true
        } else {
            /*
            console.log("Error in " + this.id + " empty check")
            console.log("\tContents are empty: " + contentsEmpty)
            console.log("\tElement is empty: " + elementEmpty)
            */
            return false
        }
    }
}

class Piece {
	constructor(id, position) {
		this.id = id
		this.pos = position
        this.legalMoves = {}
		this.element = document.createElement('img')
		this.initializeElement()
	}

	initializeElement() {
		this.element.className = 'piece'
		this.element.id = this.id
		this.element.style.opacity = 1
		let _this = this
		this.element.onclick = function() {
            // deselect on reclick
            /*
            if (chessBoard.selected == _this) {
                chessBoard.deselect()
			} else 
            */
            chessBoard.select(_this)
            /*
            if (chessBoard.selected != 'none') {
                // don't try to select enemy piece when attacking
				if (!_this.isEnemyWith(chessBoard.selected)) {
                    chessBoard.select(_this)
				} 
			} else {
				chessBoard.select(_this)
			}
            */
		}
	}

	move(position) {
		if (this.checkIfLegal(position)) {
			let src = chessBoard.spaces[this.pos]
			let dst = chessBoard.spaces[position]

			if (this.legalMoves[position] == 'a') {
                console.log("attacking!")
                if (src.hasPiece(this) && !dst.isEmpty()) {
                //if (src.contents == this && dst.contents != 'empty') {
					dst.removePiece(dst.contents)
					src.removePiece(this)
					dst.addPiece(this)
					this.pos = position
					this.firstMove = false
					return true
				} else {
					console.log("failure during attack")
                    console.log("src has piece: " + src.hasPiece(this))
                    console.log("dst is not empty: " + !dst.isEmpty())
				}
                //TODO: add an attack function
            } else if (this.legalMoves[position] == 'm') {
                console.log("moving")
                //if (src.contents == this && dst.contents == 'empty') {
                if (src.hasPiece(this) && dst.isEmpty()) {
					src.removePiece(this)
					dst.addPiece(this)
					this.pos = position
					this.firstMove = false
					return true
				} else {
					console.log("something has gone horribly wrong")
					console.log("src has piece: " + src.hasPiece(this))
					console.log("dst is empty: " + dst.isEmpty())
				}
            } else {
                throw new Error("Unknown action type in move for " + this)
            }	
		} else {
            console.log("Illegal move attempted: " + this.id + " to " + position + " from " + this.pos)
        }
		return false
    }

    checkIfLegal(position) {
        if (this.legalMoves[position]) {
            return true
        }
        return false
    }

    generateLegalMoves() {
        throw new Error("generic move generation function called")
    }

	isEnemyWith(otherPiece) {
		if (this.id[1] != otherPiece.id[1]) {
			return true
		}
		return false
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

    /* TODO: limit firstMove logic to Pawn class
    move(position) {
        if (super.move(position) == true) {
            console.log("it works")
            this.firstMove = false
        }
    }
    */

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
        if (chessBoard.spaces[atk1]) {
            // if said space is currently occupied
            if (!chessBoard.spaces[atk1].isEmpty()) {
            //if (chessBoard.spaces[atk1].contents != 'empty') {
                // and if it is occupied by an enemy piece
				if (this.isEnemyWith(chessBoard.spaces[atk1].contents)) {
                    newLegalMoves[atk1] = 'a'
                }
            }
        }
        if (chessBoard.spaces[atk2]) {
            if (!chessBoard.spaces[atk2].isEmpty()) {
            //if (chessBoard.spaces[atk2].contents != 'empty') {
				if (this.isEnemyWith(chessBoard.spaces[atk2].contents)) {
                    newLegalMoves[atk2] = 'a'
                }
            }
        }
        // validate regular movement
        // TODO: logic for when a pawn reaches the end
        //if (chessBoard.spaces[mov] && chessBoard.spaces[mov].contents == 'empty') {
        if (chessBoard.spaces[mov]) { 
            if (chessBoard.spaces[mov].isEmpty()) {
                newLegalMoves[mov] = 'm'
                // pawns can move 2 spaces on their first turn
                if (this.firstMove) {
                    let mov2 = this.pos[0] + String.fromCharCode(this.pos.charCodeAt(1)+2*direction)
                    //if (chessBoard.spaces[mov2].contents == 'empty') {
                    if (chessBoard.spaces[mov2].isEmpty()) {
                        newLegalMoves[mov2] = 'm'
                    }
                }
            }
        }

        this.legalMoves = newLegalMoves
    }
}

class Rook extends Piece {
	constructor(id, position) {
		super(id, position)
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

			if (chessBoard.spaces[left] && validDirs[0]) {
                if (!chessBoard.spaces[left].isEmpty()) {
				//if (chessBoard.spaces[left].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[left].contents)) {
						newLegalMoves[left] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[left] = 'm'
				}
			}
			if (chessBoard.spaces[right] && validDirs[1]) {
                if (!chessBoard.spaces[right].isEmpty()) {
				//if (chessBoard.spaces[right].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[right].contents)) {
						newLegalMoves[right] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[right] = 'm'
				}
			} 
			if (chessBoard.spaces[up] && validDirs[2]) {
                if (!chessBoard.spaces[up].isEmpty()) {
				//if (chessBoard.spaces[up].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[up].contents)) {
						newLegalMoves[up] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[up] = 'm'
				}
			} 
			if (chessBoard.spaces[down] && validDirs[3]) {
                if (!chessBoard.spaces[down].isEmpty()) {
				//if (chessBoard.spaces[down].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[down].contents)) {
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
	constructor(id, position) {
		super(id, position)
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
			if (chessBoard.spaces[move]) {
                if (!chessBoard.spaces[move].isEmpty()) {
				//if (chessBoard.spaces[move].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[move].contents)) {
						newLegalMoves[move] = 'a'
					}
				} else {
					newLegalMoves[move] = 'm'
				}
			}
		}
		console.log(newLegalMoves)
		
		this.legalMoves = newLegalMoves
	}
}

class Bishop extends Piece {
	constructor(id, position) {
		super(id, position)
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

			if (chessBoard.spaces[upleft] && validDirs[0]) {
                if (!chessBoard.spaces[upleft].isEmpty()) {
				//if (chessBoard.spaces[upleft].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[upleft].contents)) {
						newLegalMoves[upleft] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[upleft] = 'm'
				}
			}
			if (chessBoard.spaces[upright] && validDirs[1]) {
                if (!chessBoard.spaces[upright].isEmpty()) {
				//if (chessBoard.spaces[upright].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[upright].contents)) {
						newLegalMoves[upright] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[upright] = 'm'
				}
			} 
			if (chessBoard.spaces[downleft] && validDirs[2]) {
                if (!chessBoard.spaces[downleft].isEmpty()) {
				//if (chessBoard.spaces[downleft].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[downleft].contents)) {
						newLegalMoves[downleft] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[downleft] = 'm'
				}
			} 
			if (chessBoard.spaces[downright] && validDirs[3]) {
                if (!chessBoard.spaces[downright].isEmpty()) {
				//if (chessBoard.spaces[downright].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[downright].contents)) {
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
	constructor(id, position) {
		super(id, position)
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

			if (chessBoard.spaces[upleft] && validDirs[0]) {
                if (!chessBoard.spaces[upleft].isEmpty()) {
				//if (chessBoard.spaces[upleft].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[upleft].contents)) {
						newLegalMoves[upleft] = 'a'
					}
					validDirs[0] = false
				} else {
					newLegalMoves[upleft] = 'm'
				}
			}
			if (chessBoard.spaces[upright] && validDirs[1]) {
                if (!chessBoard.spaces[upright].isEmpty()) {
				//if (chessBoard.spaces[upright].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[upright].contents)) {
						newLegalMoves[upright] = 'a'
					}
					validDirs[1] = false
				} else {
					newLegalMoves[upright] = 'm'
				}
			} 
			if (chessBoard.spaces[downleft] && validDirs[2]) {
                if (!chessBoard.spaces[downleft].isEmpty()) {
				//if (chessBoard.spaces[downleft].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[downleft].contents)) {
						newLegalMoves[downleft] = 'a'
					}
					validDirs[2] = false
				} else {
					newLegalMoves[downleft] = 'm'
				}
			} 
			if (chessBoard.spaces[downright] && validDirs[3]) {
                if (!chessBoard.spaces[downright].isEmpty()) {
				//if (chessBoard.spaces[downright].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[downright].contents)) {
						newLegalMoves[downright] = 'a'
					}
					validDirs[3] = false
				} else {
					newLegalMoves[downright] = 'm'
				}
			}			
			if (chessBoard.spaces[left] && validDirs[4]) {
                if (!chessBoard.spaces[left].isEmpty()) {
				//if (chessBoard.spaces[left].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[left].contents)) {
						newLegalMoves[left] = 'a'
					}
					validDirs[4] = false
				} else {
					newLegalMoves[left] = 'm'
				}
			}
			if (chessBoard.spaces[right] && validDirs[5]) {
                if (!chessBoard.spaces[right].isEmpty()) {
				//if (chessBoard.spaces[right].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[right].contents)) {
						newLegalMoves[right] = 'a'
					}
					validDirs[5] = false
				} else {
					newLegalMoves[right] = 'm'
				}
			} 
			if (chessBoard.spaces[up] && validDirs[6]) {
                if (!chessBoard.spaces[up].isEmpty()) {
				//if (chessBoard.spaces[up].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[up].contents)) {
						newLegalMoves[up] = 'a'
					}
					validDirs[6] = false
				} else {
					newLegalMoves[up] = 'm'
				}
			} 
			if (chessBoard.spaces[down] && validDirs[7]) {
                if (!chessBoard.spaces[down].isEmpty()) {
				//if (chessBoard.spaces[down].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[down].contents)) {
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
	constructor(id, position) {
		super(id, position)
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
			if (chessBoard.spaces[move]) {
                if (!chessBoard.spaces[move].isEmpty()) {
				//if (chessBoard.spaces[move].contents != 'empty') {
					if (this.isEnemyWith(chessBoard.spaces[move].contents)) {
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

const chessBoard = new GameBoard()
console.log(chessBoard)