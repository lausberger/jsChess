// represents one space on a ChessBoard
class Space {
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
		this.element.className = 'space'
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

	// turns this space yellow to show a piece's legal moves
    addHighlight() {
		this.element.style.backgroundColor = "#FDFF47"
    }

    // DEBUG only used to show a king in check
    redden() {
        this.element.style.backgroundColor = "#FF0000"
    }

	// restores this space to its normal color
    removeHighlight() {
		this.element.style.backgroundColor = this.color
    }
    
	// places a Piece in this space
	// does NOT update Piece's position (see ChessBoard.addPieceToSpace())
	addPiece(piece) {
		if (!this.isEmpty()) {
			throw new Error("Attempting to add piece to occupied space!")
		}
		this.contents = piece
		this.element.appendChild(piece.element)
	}

	// makes this space empty again
	// does NOT update Piece's position (see ChessBoard.removePieceFromSpace())
	removePiece(piece) {
        if (!this.hasPiece(piece)) {
			throw new Error("Attempting to remove a piece that is not there!")
		}
		this.contents = "empty"
		this.element.removeChild(piece.element)	
	}

	// check if a given piece is in this space
    hasPiece(piece) {
        let containsPiece = this.contents == piece
        let elementContains = this.element.contains(piece.element)
        if (containsPiece && elementContains) {
            return true
        } else {
            console.log("Error in " + this.id + " contents check")
            console.log("\tContains piece object: " + containsPiece)
            console.log("\tElement contains piece element: " + elementContains)
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
}
