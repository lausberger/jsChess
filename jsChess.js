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

	constructor(dimension = 8) { // create an 8 by 8 chessboard
		this.height = dimension
		this.width = dimension
		this.array = this.generateBoard()
		//this.updateStack = [] // could keep a list of rendering updates needed?
		this.populateBoard()
	}

	generateBoard() {
		var array = []
		var switchColor = true
		var rPtr = 0 
		var fPtr = 0
		for (var i = 0; i < this.width; i++) {
			array.push([])
			for (var j = 0; j < this.height; j++) {
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

	populateBoard() { // hard coded for 8x8 board
		// black pawns
		for (var j = 0; j < 8; j++) {
			var cur = this.array[1][j]
			cur.addPiece(new Pawn('black', cur.id))
		}

		// white pawns
		for (var k = 0; k < 8; k++) {
			var cur = this.array[6][k]
			cur.addPiece(new Pawn('white', cur.id))
		}

		// black pieces
		this.array[0][0].addPiece(new Rook('black', this.array[0][0].id))
		this.array[0][7].addPiece(new Rook('black', this.array[0][7].id))
		this.array[0][1].addPiece(new Knight('black',this.array[0][1].id))
		this.array[0][6].addPiece(new Knight('black',this.array[0][6].id))
		this.array[0][2].addPiece(new Bishop('black',this.array[0][2].id))
		this.array[0][5].addPiece(new Bishop('black',this.array[0][5].id))
		this.array[0][3].addPiece(new Queen('black',this.array[0][3].id))
		this.array[0][4].addPiece(new King('black',this.array[0][4].id))
		
		// white pieces
		this.array[7][0].addPiece(new Rook('white', this.array[7][0].id))
		this.array[7][7].addPiece(new Rook('white', this.array[7][7].id))
		this.array[7][1].addPiece(new Knight('white',this.array[7][1].id))
		this.array[7][6].addPiece(new Knight('white',this.array[7][6].id))
		this.array[7][2].addPiece(new Bishop('white',this.array[7][2].id))
		this.array[7][5].addPiece(new Bishop('white',this.array[7][5].id))
		this.array[7][3].addPiece(new Queen('white',this.array[7][3].id))
		this.array[7][4].addPiece(new King('white',this.array[7][4].id))
	}

	renderBoard() {
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
		console.log(this.array)
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

class Piece {
	/*
	What if Pieces were assigned a Square object instead of a coord string?

	Perferably this is done in a way such that the Square is easily accessed
	within the GameBoard object (ex. this.space is an index tuple that
	corresponds with the Square's location in the GameBoard's array)
	*/

	constructor(coordinate) {
		this.space = coordinate 
	}

	move(coordinate) {
		this.space = coordinate
	}
}

class Pawn extends Piece {
	constructor(color, coordinate) {
		super(coordinate)
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
	constructor(color, coordinate) {
		super(coordinate)
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
	constructor(color, coordinate) {
		super(coordinate)
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
	constructor(color, coordinate) {
		super(coordinate)
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
	constructor(color, coordinate) {
		super(coordinate)
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
	constructor(color, coordinate) {
		super(coordinate)
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
