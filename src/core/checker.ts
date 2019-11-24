import toolkit from "./toolkit";

export default class checker {
    private _isSuccess: boolean = false;
    private _matrix: number[][] = [];
    private _matrixMarks: boolean[][] = [];

    constructor(matrix) {
        this._matrix = matrix;
        this._matrixMarks = toolkit.makeMatrix(true);

    }

    get martixMarks(): boolean[][] {
        return this._matrixMarks;
    }

    get isSuccess(): boolean {
        return this._isSuccess;
    }


    check(): boolean {
        this.checkRows();
        this.checkCols();
        this.checkBoxes();

        this._isSuccess = this._matrixMarks.every(row => row.every(mark => mark));
        return this._isSuccess;
    }

    checkRows() {
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const row = this._matrix[rowIndex];
            const marks = checker.checkArray(row);
            for (let colIndex = 0; colIndex < marks.length; colIndex++) {
                if (!marks[colIndex]) {
                    this._matrixMarks[rowIndex][colIndex] = false;
                }
            }
        }
    }

    checkCols() {
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            const cols = [];
            for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
                cols[rowIndex] = this._matrix[rowIndex][colIndex];
            }

            const marks = checker.checkArray(cols);
            for (let rowIndex = 0; rowIndex < marks.length; rowIndex++) {
                if (!marks[rowIndex]) {
                    this._matrixMarks[rowIndex][colIndex] = false;
                }
            }
        }
    }

    checkBoxes() {
        for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
            const boxes = toolkit.getBoxCells(this._matrix, boxIndex);
            const marks = checker.checkArray(boxes);
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (!marks[cellIndex]) {
                    const { rowIndex, colIndex } = toolkit.convertFromBoxIndex(boxIndex, cellIndex);
                    this._matrixMarks[rowIndex][colIndex] = false;
                }
            }

        }
    }

    static checkArray(array: number[]): number[] {
        const length = array.length;
        const marks = new Array(length).fill(true);
        array.forEach((v, i) => {
            if (!v) {
                marks[i] = false;
                return;
            }

            if (marks[i]) {
                for (let j = i + 1; j < 9; j++) {
                    if (v === array[j]) {
                        marks[i] = marks[j] = false;
                    }
                }
            }
        });
        return marks;
    }

}