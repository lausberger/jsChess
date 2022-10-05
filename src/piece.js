// provides default functions for Piece objects
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
    // TODO: improve, right now it is called by ChessBoard.select() and King.inCheck()
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

    inCheck() {
        for (var dir in Utils.PositionIncrementer) {
            var cur = this.pos
            var done = false 
            while (!done) {
                cur = Utils.PositionIncrementer[dir](cur)
                if (Utils.isValidSpace(cur)) {
                    var space = this.board.spaces[cur]
                    if (!space.isEmpty()) {
                        var piece = space.contents
                        if (piece.isEnemyWith(this)) {
                            // TODO: less hacky legal move implementation
                            piece.generateLegalMoves()
                            if (piece.checkIfLegal(this.pos)) {
                                return true
                            }
                        }
                    }
                } else {
                    done = true
                }
            }
        }
        let knightPositions = Utils.getKnightCircle(this.pos)
        for (var i=0; i<knightPositions.length; i++) {
            var space = this.board.spaces[knightPositions[i]]
            if (!space.isEmpty()) {
                var piece = space.contents
                if (piece.isEnemyWith(this) && piece.id[0] == 'N') {
                    return true 
                }
            }
        }
        return false
    }
}
