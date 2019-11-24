import toolkit from "./toolkit";

export default class Generator {
    martrix: number[][] = [];
    _orders: number[][] = [];

    generate(){
        while(!this.internalGenerate()){
            console.log("generate again!");
        }
    }

    internalGenerate():boolean{
        this.martrix = toolkit.makeMatrix();
        //随机排列组合的九宫
        this._orders = toolkit.makeMatrix()
            .map(row => row.map((v, i) => i))
            .map(row => toolkit.shuffle(row));

        for (let index = 1; index <= 9; index++) {
            if(!this.fillNumber(index)){
                return false;
            }
        };
        return true;
    }

    fillNumber(n: number) {
        return this.fillRow(n, 0);
    }

    fillRow(n: number, rowIndex: number): boolean {
        //当前行填写n成功，递归调用fillRow()在下一行填写n
        if (rowIndex > 8) {
            return true;
        }

        const row = this.martrix[rowIndex];
        const orders = this._orders[rowIndex];
        for (let i = 0; i < 9; i++) {
            const colIndex = orders[i];
            if (row[colIndex]) {//已存在数据，跳过
                continue;
            }

            //检查该位置是否可以填入信息
            if (!toolkit.checkFillable(this.martrix,n,rowIndex,colIndex)) {
                continue;
            }

            row[colIndex] = n;
            //递归寻找下一行填写n,如果没填进去，就继续寻找当前行的下一个位置
            if (!this.fillRow(n, rowIndex + 1)) {
                row[colIndex] = 0;
                continue;
            }
            return true;

        }

        return false;

    }
}

