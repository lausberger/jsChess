// utility class with data structures that make it easy to iterate through spaces
class Utils {
	// useful when iterating through spaces in a double loop
	static PositionMatrix = [
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
	static PositionArray = [
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
	static RowTable = {
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
	static ColumnTable = {
		1: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
		2: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
		3: ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
		4: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
		5: ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
		6: ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
		7: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
		8: ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
	}

    // can find the next space in a given direction
    // TODO: add logic to return false if output is not a real space
    static PositionIncrementer = {
        'up': (pos) => { return pos[0] + String.fromCharCode(pos.charCodeAt(1)+1) },

        'upright': (pos) => { return String.fromCharCode(pos.charCodeAt(0)+1) + String.fromCharCode(pos.charCodeAt(1)+1) },

        'right': (pos) => { return String.fromCharCode(pos.charCodeAt(0)+1) + pos[1] },
        'downright': (pos) =>  { return String.fromCharCode(pos.charCodeAt(0)+1) + String.fromCharCode(pos.charCodeAt(1)-1) },

        'down': (pos) => { return pos[0] + String.fromCharCode(pos.charCodeAt(1)-1) },

        'downleft': (pos) => { return String.fromCharCode(pos.charCodeAt(0)-1) + String.fromCharCode(pos.charCodeAt(1)-1) },

        'left': (pos) => { return String.fromCharCode(pos.charCodeAt(0)-1) + pos[1] },

        'upleft': (pos) => { return String.fromCharCode(pos.charCodeAt(0)-1) + String.fromCharCode(pos.charCodeAt(1)+1) }
    }

    static isValidSpace(pos) {
        let row = pos[0]
        let file = parseInt(pos[1])
        return (row in Utils.RowTable && file in Utils.ColumnTable)
    }

    // returns a list of all position a knight could attack pos from
    static getKnightCircle(pos) {
        let ur = String.fromCharCode(pos.charCodeAt(0)+1) + String.fromCharCode(pos.charCodeAt(1)+2) 
        let ul = String.fromCharCode(pos.charCodeAt(0)-1) + String.fromCharCode(pos.charCodeAt(1)+2)
        let ru = String.fromCharCode(pos.charCodeAt(0)+2) + String.fromCharCode(pos.charCodeAt(1)+1)
        let rd = String.fromCharCode(pos.charCodeAt(0)+2) + String.fromCharCode(pos.charCodeAt(1)-1)
        let dr = String.fromCharCode(pos.charCodeAt(0)+1) + String.fromCharCode(pos.charCodeAt(1)-2)
        let dl = String.fromCharCode(pos.charCodeAt(0)-1) + String.fromCharCode(pos.charCodeAt(1)-2)
        let lu = String.fromCharCode(pos.charCodeAt(0)-2) + String.fromCharCode(pos.charCodeAt(1)+1)
        let ld = String.fromCharCode(pos.charCodeAt(0)-2) + String.fromCharCode(pos.charCodeAt(1)-1)
        var circle = [ur, ul, ru, rd, dr, dl, lu, ld]
        var res = []
        // TODO: functional implementation that prunes circle
        for (var i=0; i<circle.length; i++) {
            var cur = circle[i]
            if (Utils.isValidSpace(cur)) {
                res.push(cur)
            }
        }
        return res 
    }
}
