import Grid from "./ui/grid";
import Sudoku from "./core/sudoku"
import Popup from "./ui/popup";
import Events from "./core/events";
import Toolkit from "./core/toolkit";
import Checker from "./core/checker";
export default class App {
    private _view: fgui.GComponent;
    private _popup: Popup;
    private _chooseGrid: Grid;
    private _list: fgui.GList;
    constructor() {
        fgui.UIPackage.loadPackage("res/ui/sudoku", Laya.Handler.create(this, this.onUILoaded));
        Laya.stage.on(Events.CHOOSE_NUMBER, this, this.onChooseNumber);
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("sudoku", "Main").asCom;
        this._view.x = (Laya.Browser.clientWidth - this._view.width / window.devicePixelRatio) / 2;
        fgui.GRoot.inst.addChild(this._view);
        this._popup = this._view.getChild('n8') as Popup;
        this._list = this._view.getChild("n9").asList;
        this._list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.renderList();
        this._view.getChild("n3").onClick(this, this.check);
        this._view.getChild("n4").onClick(this, this.reset);
        this._view.getChild("n5").onClick(this, this.renderList);
        
    }

    renderListItem() {

    }

    renderList() {
        this._popup.hide();
        this._list.removeChildrenToPool();
        const sudoku = new Sudoku();
        sudoku.make(5);
        const martrix = sudoku.puzzlexMatrix;
        for (let i: number = 0; i < martrix.length; i++) {
            for (let j = 0; j < 9; j++) {
                const item = this._list.addItemFromPool() as Grid;
                const title = martrix[i][j];
                item.title = "";
                item.bgColor = "#ffffff";
                if (title) {
                    item.isAuto = true;
                    item.title = "" + title;
                    item.bgColor = "#eeeeee";
                }

            }
        }
    }

    onClickItem(evt: Grid) {
        if (!evt.isAuto) {
            this._chooseGrid = evt;
            this._popup.show();
        }
    }

    onChooseNumber(evt: any) {
        this._chooseGrid.title = evt;
    }

    check() {
        this._popup.hide();
        let result = Toolkit.makeMatrix(), j = 0;
        for (let i = 0; i < 81; i++) {
            const item = this._list.getChildAt(i) as Grid;
            const title = +item.title || 0;
            result[j][i % 9] = title;
            if ((i + 1) % 9 == 0) {
                j++;
            }
        }

        const checker = new Checker(result);
        if (checker.check()) {
            alert("恭喜你全部都作对啦！");
        }

        const marks = checker.martixMarks;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const item = this._list.getChildAt(i * 9 + j) as Grid;
                if (!marks[i][j]) {
                    if (!item.isAuto) item.bgColor = "#FEB6C3";
                } else {
                    item.bgColor = "#ffffff"
                }
            }
        }
    }

    reset() {
        this._popup.hide();
        for (let i = 0; i < 81; i++) {
            const item = this._list.getChildAt(i) as Grid;
            if (!item.isAuto) {
                item.bgColor = "#ffffff";
                item.title = "";
            }
        }
    }
}