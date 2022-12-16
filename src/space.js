// represents one space on a ChessBoard
class Space {
	#coord
	#color
	#piece

	constructor(color, coord) {
		this.#color = color
		this.#coord = coord
		this.#piece = null
		this.element = document.createElement('div')
		this.initializeElement()
		// temporary highlighting when in check bug fix
		// TODO more intuitive way to do this? i.e. bgColor
		this.isRed = false
		this.wasRed = false
	}

	get id() { return this.#coord.str }
	get contents() { return this.#piece || 'empty' }

	// must be called before elementOnClick can be used
	static setElementOnClickCallback(func) {
		super.elementOnClick = func
	}

	// creates the html element that is tied to this object
	initializeElement() {
		this.element.className = 'space'
		// use underlying string from a Coordinate Symbol
		this.element.id = this.id
		this.element.style.backgroundColor = this.#color
		this.element.onclick = () => Space.elementOnClick(this)
	}

	// turns this space yellow to show a piece's legal moves
	addHighlight() {
		this.element.style.backgroundColor = '#FDFF47'
		if (this.isRed) {
			this.isRed = false
			this.wasRed = true
		}
	}

	// DEBUG only used to show a king in check
	redden() {
		this.element.style.backgroundColor = '#FF0000'
		this.isRed = true
		this.wasRed = false
	}

	// restores this space to its normal color
	removeHighlight() {
		// TODO reimplement to not require this. otherwise it removes red
		if (!this.isRed && this.wasRed) {
			this.redden()
		} else {
			this.element.style.backgroundColor = this.#color
			this.isRed = false
			this.wasRed = false
		}
	}

	// places a Piece in this space
	// does NOT update Piece's position (see ChessBoard.addPieceToSpace())
	addPiece(piece) {
		if (!this.isEmpty()) {
			throw new Error('Attempting to add piece to occupied space!')
		}
		this.#piece = piece
		this.element.appendChild(piece.element)
	}

	// makes this space empty again
	// does NOT update Piece's position (see ChessBoard.removePieceFromSpace())
	removePiece(piece) {
		if (!this.hasPiece(piece)) {
			throw new Error('Attempting to remove a piece that is not there!')
		}
		this.#piece = null
		this.element.removeChild(piece.element)
	}

	// check if a given piece is in this space
	hasPiece(piece) {
		return this.contents == piece
	}

	// check if this space is empty
	isEmpty() {
		return this.contents == 'empty'
	}
}