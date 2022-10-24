// represents one space on a ChessBoard
class Space {
	constructor(color, id) {
		this.color = color
		this.id = id
		this.contents = 'empty'
		this.element = document.createElement('div')
		this.initializeElement()
		// temporary highlighting when in check bug fix
		// TODO more intuitive way to do this? i.e. bgColor
		this.isRed = false
		this.wasRed = false
	}

	// must be called before elementOnClick can be used
	static setElementOnClickCallback(func) {
		super.elementOnClick = func
	}

	// creates the html element that is tied to this object
	initializeElement() {
		this.element.className = 'space'
		this.element.id = this.id
		this.element.style.backgroundColor = this.color
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
			this.element.style.backgroundColor = this.color
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
		this.contents = piece
		this.element.appendChild(piece.element)
	}

	// makes this space empty again
	// does NOT update Piece's position (see ChessBoard.removePieceFromSpace())
	removePiece(piece) {
        if (!this.hasPiece(piece)) {
			throw new Error('Attempting to remove a piece that is not there!')
		}
		this.contents = 'empty'
		this.element.removeChild(piece.element)	
	}

	// check if a given piece is in this space
    hasPiece(piece) {
        let containsPiece = this.contents == piece
        let elementContains = this.element.contains(piece.element)
        if (containsPiece && elementContains) {
            return true
        } else {
            console.log('Error in ' + this.id + ' contents check')
            console.log('\tContains piece object: ' + containsPiece)
            console.log('\tElement contains piece element: ' + elementContains)
            return false
        }
    }

	// check if this space is empty
    isEmpty() {
        let contentsEmpty = this.contents == 'empty'
        // an empty space either has no children, or only a highlight
        let elementEmpty = !this.element.hasChildNodes() || this.element.querySelector('#hl')
        if (contentsEmpty && elementEmpty) {
            return true
        } else {
            return false
        }
    }

	getContents() {
		return this.contents
	}
}
