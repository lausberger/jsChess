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
		// should this be a Stack for fast popping?
		this.updateQueue = [] // could keep a list of rendering updates needed?
		this.populateBoard()
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
		let rBoard = document.getElementById('chessBoard')
		for (var i = 8; i > 0; i--) {
			let rRow = document.createElement('div')
			rRow.className = 'row'
			rRow.id = i 
			for (var j in GameBoard.fileHelper[i]) {
				let coordinate = GameBoard.fileHelper[i][j]
				let rSquare = document.createElement('div')
				rSquare.className = 'square'
				rSquare.id = coordinate
				rSquare.style.backgroundColor = _self.spaces[coordinate].color
				// NOTE This is how movement is currently implemented
				// will likely need to be changed when adding attacks
				rSquare.onclick = function() {
					if (_self.selected != "none") {
						if (_self.selected.pos != rSquare.id) {
							let update = ["move", _self.selected.id, _self.selected.pos, rSquare.id]
							_self.updateQueue.push(update)
							_self.updateBoard()
						}
					}
				}
				rRow.appendChild(rSquare)
				if (_self.spaces[coordinate].contents != 'empty') {
					let rPiece = document.createElement('img')
					rPiece.className = 'piece'
					rPiece.src = _self.spaces[coordinate].contents.img
					rPiece.id = _self.spaces[coordinate].contents.id
					rPiece.style.opacity = 1
					rPiece.onclick = function() {
						_self.selected = _self.pieces[rPiece.id]
					}
					rSquare.appendChild(rPiece)
				}
			}
			rBoard.appendChild(rRow)
		}
	}

	updateBoard() {
		while (this.updateQueue.length) { // update queue is not empty
			// not very efficient way of popping an element
			let u = this.updateQueue.shift()

			// string identifiers
			let piece = u[1]
			let src = u[2]
			let dst = u[3]
			
			// HTML DOM objects
			let rPiece = document.getElementById(piece)
			let rSrc = document.getElementById(src)
			let rDst = document.getElementById(dst)
			console.log(u)
			
			// assume all updates are moves and are legal for now
			if (rSrc.contains(rPiece) && !rDst.hasChildNodes()) {
				this.spaces[src].contents = "empty"
				this.spaces[dst].contents = this.pieces[piece]
				this.pieces[piece].move(dst)
				rSrc.removeChild(rPiece)
				rDst.appendChild(rPiece)
			} else {
				console.log("something has gone horribly wrong")
			}
			this.selected = "none"
		}
	}
}

class Square {
	constructor(color, id) {
		this.color = color
		this.id = id
		this.contents = 'empty'
	}

	addPiece(piece) {
		this.contents = piece
	}
}

class Piece {
	constructor(id, position) {
		this.id = id
		this.pos = position
	}

	move(position) {
		this.pos = position
	}
}

class Pawn extends Piece {
	constructor(id, position) {
		super(id, position)
		this.moveset = ['pawn moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/plt60.png'
		} else { // assumes color is 'b'
			this.img = 'pieces/pdt60.png'
		}
	}
}

class Rook extends Piece {
	constructor(id, position) {
		super(id, position)
		this.moveset = ['rook moveset']
		if (this.id.charAt(1) == 'w') {
			this.img = 'pieces/rlt60.png'
		} else {
			this.img = 'pieces/rdt60.png'
		}
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
	}
}

const chessBoard = new GameBoard()
chessBoard.renderBoard()

// Check Square 'e4'. Why does it have a pawn before updateBoard
// has even been called?
console.log(chessBoard.spaces)

// for testing movement
/*
let testMove = ["move", "pw5", "e2", "e4"]
let testResponse = ["move", "pb5", "e7", "e5"]
chessBoard.updateQueue.push(testMove)

setTimeout(function() {
	chessBoard.updateBoard()
	console.log(chessBoard.spaces)
	console.log("These two dictionaries should not be the same at 'e4'")
}, 3000);

setTimeout(function() {
	chessBoard.updateQueue.push(testResponse)
	chessBoard.updateBoard()
}, 5000);
*/
