class Coord {
    static all = {}
    #rank
    #file

    constructor(str = '') {
        if (str) {
            if (str.length > 2 || ! Utils.isValidCoord(str)) {
                throw new Error('Coord instantiated with invalid position string')
            }
        }
        if (str in Coord.all) {
            throw new Error('Attempted to create redundant Coord instance')
        }
        this.#rank = str[0] || ''
        this.#file = str[1] || ''
        Coord.all[str] = this
    }

    get str() {
        return this.#rank + this.#file
    }
}

const Coordinates = Object.freeze({
    A1: new Coord('A1'),
    A2: new Coord('A2'),
    A3: new Coord('A3'),
    A4: new Coord('A4'),
    A5: new Coord('A5'),
    A6: new Coord('A6'),
    A7: new Coord('A7'),
    A8: new Coord('A8'),

    B1: new Coord('B1'),
    B2: new Coord('B2'),
    B3: new Coord('B3'),
    B4: new Coord('B4'),
    B5: new Coord('B5'),
    B6: new Coord('B6'),
    B7: new Coord('B7'),
    B8: new Coord('B8'),

    C1: new Coord('C1'),
    C2: new Coord('C2'),
    C3: new Coord('C3'),
    C4: new Coord('C4'),
    C5: new Coord('C5'),
    C6: new Coord('C6'),
    C7: new Coord('C7'),
    C8: new Coord('C8'),

    D1: new Coord('D1'),
    D2: new Coord('D2'),
    D3: new Coord('D3'),
    D4: new Coord('D4'),
    D5: new Coord('D5'),
    D6: new Coord('D6'),
    D7: new Coord('D7'),
    D8: new Coord('D8'),

    E1: new Coord('E1'),
    E2: new Coord('E2'),
    E3: new Coord('E3'),
    E4: new Coord('E4'),
    E5: new Coord('E5'),
    E6: new Coord('E6'),
    E7: new Coord('E7'),
    E8: new Coord('E8'),

    F1: new Coord('F1'),
    F2: new Coord('F2'),
    F3: new Coord('F3'),
    F4: new Coord('F4'),
    F5: new Coord('F5'),
    F6: new Coord('F6'),
    F7: new Coord('F7'),
    F8: new Coord('F8'),

    G1: new Coord('G1'),
    G2: new Coord('G2'),
    G3: new Coord('G3'),
    G4: new Coord('G4'),
    G5: new Coord('G5'),
    G6: new Coord('G6'),
    G7: new Coord('G7'),
    G8: new Coord('G8'),

    H1: new Coord('H1'),
    H2: new Coord('H2'),
    H3: new Coord('H3'),
    H4: new Coord('H4'),
    H5: new Coord('H5'),
    H6: new Coord('H6'),
    H7: new Coord('H7'),
    H8: new Coord('H8'),

    NONE: new Coord()
})