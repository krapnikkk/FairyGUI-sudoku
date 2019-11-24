interface IBoxIndex {
    boxIndex: number
    cellIndex: number
}

interface IMatrixIndex {
    rowIndex: number
    colIndex: number
}

export default class toolkit {
    static makeRow(value: number = 0): Array<number> {//宫格数据填充
        const array = new Array(9);
        array.fill(value);
        return array;
    }

    
    static makeMatrix(value: any = 0): any[][] {
        return Array.from({ length: 9 }, () => this.makeRow(value));
    }

    /**
     * 
     * @param array Fisher-Yates 洗牌算法
     */
    static shuffle(array: number[]): number[] {
        const endIndex = array.length - 2;//最后一位无需洗牌替换
        for (let i = 0, length = array.length; i < endIndex; i++) {
            const j = Math.floor(Math.random() * (length - i));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * 检查矩阵中指定位置是否可以填写指定数字n
     * @param martix 
     * @param n 
     * @param rowIndex 
     * @param colIndex 
     */
    static checkFillable(martix: number[][], n: number, rowIndex: number, colIndex: number): boolean {
        const row = martix[rowIndex];//行
        const column = toolkit.makeRow().map((v, i) => martix[i][colIndex]);//列
        const { boxIndex } = toolkit.convertToBoxIndex(rowIndex, colIndex);
        const box =toolkit.getBoxCells(martix,boxIndex);//宫
        for (let i = 0; i < 9; i++) {
            if(row[i]===n||column[i]===n||box[i]===n){
                return false;
            }
            
        }
        return true;
    }

    static convertToBoxIndex(rowIndex: number, colIndex: number): IBoxIndex {
        return {
            boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
            cellIndex: rowIndex % 3 * 3 + colIndex % 3
        }
    }

    static convertFromBoxIndex(boxIndex: number, cellIndex: number):IMatrixIndex {
        return {
            rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
            colIndex: boxIndex % 3 * 3 + cellIndex % 3
        }
    }

    static getBoxCells(martix: number[][], boxIndex: number): number[] {
        const startRowIndex = Math.floor(boxIndex / 3) * 3;
        const startColIndex = boxIndex % 3 * 3;
        const result = [];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const rowIndex = startRowIndex + Math.floor(cellIndex / 3);
            const colIndex = startColIndex + cellIndex % 3;
            result.push(martix[rowIndex][colIndex]);
        }
        return result;
    }
}