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
		//this.array = this.oldgenerateBoard()
		this.spaces = this.generateBoard()
		this.pieces = this.generatePieces()
		//this.updateStack = [] // could keep a list of rendering updates needed?
		this.populateBoard()
	}

	/*
	// should no longer be needed
	oldgenerateBoard() {
		var array = []
		var switchColor = false
		var rPtr = 0 
		var fPtr = 0
		for (var i = 0; i < this.size; i++) {
			array.push([])
			for (var j = 0; j < this.size; j++) {
				let sq = new Square(
					switchColor === true ? '#a3524e' : '#f2e8e7', 
					GameBoard.positions[rPtr][fPtr])
				array[i].push(sq)
				if (fPtr == 7) {
					fPtr = 0
				} else {
					fPtr += 1
				}
				switchColor = !switchColor
			}
			switchColor = !switchColor
			rPtr += 1
		}

		return array
	}
	*/

	// alternative way that lets us phase out array, as it is too hard to
	// access specific Square objects by name
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
		//console.log(spaces)
		return spaces
	}

	generatePieces() {
		var pieces = {}	
		// black pawns
		pieces['P1b'] = new Pawn('black', 'a7')
		pieces['P2b'] = new Pawn('black', 'b7')
		pieces['P3b'] = new Pawn('black', 'c7')
		pieces['P4b'] = new Pawn('black', 'd7')
		pieces['P5b'] = new Pawn('black', 'e7')
		pieces['P6b'] = new Pawn('black', 'f7')
		pieces['P7b'] = new Pawn('black', 'g7')
		pieces['P8b'] = new Pawn('black', 'h7')

		// black pieces
		pieces['R8b'] = new Rook('black', 'a8')
		pieces['R2b'] = new Rook('black', 'h8')
		pieces['N8b'] = new Knight('black', 'b8')
		pieces['N2b'] = new Knight('black', 'g8')
		pieces['B8b'] = new Bishop('black', 'c8')
		pieces['B2b'] = new Bishop('black', 'f8')
		pieces['Qb'] = new Queen('black', 'd8')
		pieces['Kb'] = new King('black', 'e8')
		
		// white pawns
		pieces['P1w'] = new Pawn('white', 'a2')
		pieces['P2w'] = new Pawn('white', 'b2')
		pieces['P3w'] = new Pawn('white', 'c2')
		pieces['P4w'] = new Pawn('white', 'd2')
		pieces['P5w'] = new Pawn('white', 'e2')
		pieces['P6w'] = new Pawn('white', 'f2')
		pieces['P7w'] = new Pawn('white', 'g2')
		pieces['P8w'] = new Pawn('white', 'h2')

		// white pieces
		pieces['R1w'] = new Rook('white', 'a1')
		pieces['R2w'] = new Rook('white', 'h1')
		pieces['N1w'] = new Knight('white', 'b1')
		pieces['N2w'] = new Knight('white', 'g1')
		pieces['B1w'] = new Bishop('white', 'c1')
		pieces['B2w'] = new Bishop('white', 'f1')
		pieces['Qw'] = new Queen('white', 'd1')
		pieces['Kw'] = new King('white', 'e1')
		
		return pieces
	}

	populateBoard() { // hard coded for 8x8 board
		for (var name in this.pieces) {
			let p = this.pieces[name]
			this.spaces[p.pos].addPiece(p)
		}
		console.log(this.spaces)
	}

	/* 
	// initial board rendering that used the array object
	oldrenderBoard() {
		var rBoard = document.getElementById('chessBoard')
		for (var i in this.array) {
			var rRow = document.createElement('div')
			rRow.className = 'row'
			rRow.id = i
			for (var j in this.array[i]) {
				var rSquare = document.createElement('div')
				rSquare.className = 'square'
				rSquare.id = this.array[i][j].id
				rSquare.style.backgroundColor = this.array[i][j].color 
				rRow.appendChild(rSquare)
				if (this.array[i][j].contents != 'empty') {
					var rPiece = document.createElement('img')
					rPiece.className = 'piece'
					rPiece.src = this.array[i][j].contents.img
					rSquare.appendChild(rPiece)
				}
			}
			rBoard.appendChild(rRow)
		}
	}
	*/

	// generate html elements from top to bottom
	renderBoard() {
		var rBoard = document.getElementById('chessBoard')
		for (var i = 8; i > 0; i--) {
			var rRow = document.createElement('div')
			rRow.className = 'row'
			rRow.id = i 
			for (var j in GameBoard.fileHelper[i]) {
				let id = GameBoard.fileHelper[i][j]
				var rSquare = document.createElement('div')
				rSquare.className = 'square'
				rSquare.id = id
				rSquare.style.backgroundColor = this.spaces[id].color
				rRow.appendChild(rSquare)
				if (this.spaces[id].contents != 'empty') {
					var rPiece = document.createElement('img')
					rPiece.className = 'piece'
					rPiece.src = this.spaces[id].contents.img
					/*
					we will need something like below to be able to alter
					an rSquare's children after a move
					*/
					//rPiece.id = this.spaces[id].contents.id
					rSquare.appendChild(rPiece)
				}
			}
			rBoard.appendChild(rRow)
		}
	}

	updateBoard() {
					
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

// perhaps some kind of id is required? ex. 'R1w' 'Kb' 'N2w'
class Piece {
	constructor(position) {
		this.pos = position
	}

	move(position) {
		this.pos = position
	}
}

class Pawn extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['pawn moveset']
		if (this.color == 'white') {
			this.img = 'pieces/plt60.png'
		} else {
			this.img = 'pieces/pdt60.png'
		}
	}
}

class Rook extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['rook moveset']
		if (this.color == 'white') {
			this.img = 'pieces/rlt60.png'
		} else {
			this.img = 'pieces/rdt60.png'
		}
	}
}

class Knight extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['knight moveset']
		if (this.color == 'white') {
			this.img = 'pieces/nlt60.png'
		} else {
			this.img = 'pieces/ndt60.png'
		}
	}
}

class Bishop extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['bishop moveset']
		if (this.color == 'white') {
			this.img = 'pieces/blt60.png'
		} else {
			this.img = 'pieces/bdt60.png'
		}
	}
}

class Queen extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['queen moveset']
		if (this.color == 'white') {
			this.img = 'pieces/qlt60.png'
		} else {
			this.img = 'pieces/qdt60.png'
		}
	}
}

class King extends Piece {
	constructor(color, position) {
		super(position)
		this.color = color
		this.moveset = ['king moveset']
		if (this.color == 'white') {
			this.img = 'pieces/klt60.png'
		} else {
			this.img = 'pieces/kdt60.png'
		}
	}
}

const chessBoard = new GameBoard()
chessBoard.renderBoard()
