/*
Mostly conceptual idea for an object type that could be used to efficiently
represent piece moves. These object could then be popped from a stack to 
perform GameBoard state changes.

Array-based representation this could replace:

White pawn 5 moves from e2 to e4
let pawnToE4 = ["move", "p5w", "e2", "e4"]

White knight 2 moves from g1 to capture piece on f3
let knightXF3 = ["take", "g1", "f3", "N2w"]

*/
class Update {
	constructor() {

	}
}

class Attack extends Update {
	constructor() {
		super()

	}
}

class Move extends Update {
	constructor() {
		super()

	}
}
