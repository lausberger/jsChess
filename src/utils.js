// utility class with data structures that make it easy to iterate through spaces
class Utils {
	// useful when iterating through spaces in a double loop
	static coordMatrix = [
		['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8'],
		['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7'],
		['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6'],
		['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5'],
		['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4'],
		['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3'],
		['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'],
		['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1']
	]
	
	// useful when iterating through all spaces at once
	static coordArray = [
		'A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8',
		'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7',
		'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6',
		'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5',
		'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4',
		'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3',
		'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2',
		'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'
	]

	// useful when iterating through a specific row
	static rowTable = {
		'A': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
		'B': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
		'C': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
		'D': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
		'E': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
		'F': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
		'G': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'],
		'H': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8']
	}
	
	// useful when iterating through a specific column
	static columnTable = {
		'1': ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'],
		'2': ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'],
		'3': ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3'],
		'4': ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4'],
		'5': ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5'],
		'6': ['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6'],
		'7': ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7'],
		'8': ['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8']
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

    static isValidCoord(coord) {
        return coord[0] in this.rowTable && coord[1] in this.columnTable
    }

    // returns a list of all positions a knight could attack from
    static validKnightCoords(pos) {
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
		return positions.filter(c => this.isValidCoord(c))
    }

    static coord(position, xIncrement, yIncrement) {
        let rank = String.fromCharCode(position.charCodeAt(0) + xIncrement)
        let file = String.fromCharCode(position.charCodeAt(1) + yIncrement)
        return rank + file
    }
}
