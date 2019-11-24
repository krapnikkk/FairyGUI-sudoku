import Generator from "./generator"
export default class Sudoku {
    private _solutionMatrix: number[][] = [];
    public puzzlexMatrix: number[][] = [];
    constructor() {
        const generator = new Generator();
        generator.generate();
        this._solutionMatrix = generator.martrix;
    }

    make(level: number = 5) {
        this.puzzlexMatrix = this._solutionMatrix.map(row => {
            return row.map(cell => Math.random() * 9 < level ? 0 : cell);
        })
    }
}