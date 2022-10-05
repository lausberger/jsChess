// utility class with data structures that make it easy to iterate through spaces
class Utils {
	// useful when iterating through spaces in a double loop
	static coordMatrix = [
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
	static coordArray = [
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
	static rowTable = {
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
	static columnTable = {
		'1': ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
		'2': ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		'3': ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		'4': ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		'5': ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		'6': ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		'7': ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		'8': ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
	}

    // returns the next coord in a given direction
    // useful for generically exploring in multiple directions
    // TODO: add logic to return false if output is not a real space
    static coordIncrementer = {
        'up': (pos) => { return this.coord(pos, 0, 1) },
        'upleft': (pos) => { return this.coord(pos, -1, 1) },
        'upright': (pos) => { return this.coord(pos, 1, 1) },
        'down': (pos) => { return this.coord(pos, 0, -1) },
        'downleft': (pos) => { return this.coord(pos, -1, -1) },
        'downright': (pos) =>  { return this.coord(pos, 1, -1) },
        'left': (pos) => { return this.coord(pos, -1, 0) },
        'right': (pos) => { return this.coord(pos, 1, 0) }
    }

    static isValidSpace(pos) {
        return pos[0] in this.rowTable && pos[1] in this.columnTable
    }

    // returns a list of all positions a knight could attack from
    static knightCoords(pos) {
        var positions = [
			this.coord(pos, 1, 2),
			this.coord(pos, -1, 2),
			this.coord(pos, 2, 1),
			this.coord(pos, 2, -1),
			this.coord(pos, 1, -2),
			this.coord(pos, -1, -2),
			this.coord(pos, -2, 1),
			this.coord(pos, -2, -1)
		]
		return positions.filter(c => this.isValidSpace(c))
    }

    static coord(position, xIncrement, yIncrement) {
        let rank = String.fromCharCode(position.charCodeAt(0) + xIncrement)
        let file = String.fromCharCode(position.charCodeAt(1) + yIncrement)
        return rank + file
    }
}
