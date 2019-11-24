(function () {
    'use strict';

    class Grid extends fgui.GComponent {
        constructor() {
            super();
            this._isAuto = false;
        }
        constructFromXML(xml) {
            super.constructFromXML(xml);
            this._title = this.getChild("title").asTextField;
            this._bg = this.getChild("bg").asGraph;
        }
        set bgColor(string) {
            this._bg.color = string;
        }
        set title(string) {
            this._text = string;
            this._title.text = string;
        }
        get title() {
            return this._text;
        }
        set isAuto(bool) {
            this._isAuto = bool;
        }
        get isAuto() {
            return this._isAuto;
        }
    }

    class Events {
    }
    Events.CHOOSE_NUMBER = "choose_number";

    class Popup extends fgui.GComponent {
        constructor() {
            super();
            this._types = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        }
        constructFromXML(xml) {
            super.constructFromXML(xml);
            this.renderList();
        }
        show() {
            this.visible = true;
        }
        hide() {
            this.visible = false;
        }
        renderList() {
            var list = this.getChild("panel").asList;
            list.removeChildrenToPool();
            list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
            for (let i = 0; i < this._types.length; i++) {
                const item = list.addItemFromPool();
                const title = this._types[i];
                item.title = title;
            }
        }
        onClickItem(evt) {
            console.log(evt.title);
            Laya.stage.event(Events.CHOOSE_NUMBER, evt.title);
            this.hide();
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            fgui.UIObjectFactory.setExtension("ui://sudoku/grid", Grid);
            fgui.UIObjectFactory.setExtension("ui://sudoku/popup", Popup);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class toolkit {
        static makeRow(value = 0) {
            const array = new Array(9);
            array.fill(value);
            return array;
        }
        static makeMatrix(value = 0) {
            return Array.from({ length: 9 }, () => this.makeRow(value));
        }
        static shuffle(array) {
            const endIndex = array.length - 2;
            for (let i = 0, length = array.length; i < endIndex; i++) {
                const j = Math.floor(Math.random() * (length - i));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        static checkFillable(martix, n, rowIndex, colIndex) {
            const row = martix[rowIndex];
            const column = toolkit.makeRow().map((v, i) => martix[i][colIndex]);
            const { boxIndex } = toolkit.convertToBoxIndex(rowIndex, colIndex);
            const box = toolkit.getBoxCells(martix, boxIndex);
            for (let i = 0; i < 9; i++) {
                if (row[i] === n || column[i] === n || box[i] === n) {
                    return false;
                }
            }
            return true;
        }
        static convertToBoxIndex(rowIndex, colIndex) {
            return {
                boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
                cellIndex: rowIndex % 3 * 3 + colIndex % 3
            };
        }
        static convertFromBoxIndex(boxIndex, cellIndex) {
            return {
                rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
                colIndex: boxIndex % 3 * 3 + cellIndex % 3
            };
        }
        static getBoxCells(martix, boxIndex) {
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

    class Generator {
        constructor() {
            this.martrix = [];
            this._orders = [];
        }
        generate() {
            while (!this.internalGenerate()) {
                console.log("generate again!");
            }
        }
        internalGenerate() {
            this.martrix = toolkit.makeMatrix();
            this._orders = toolkit.makeMatrix()
                .map(row => row.map((v, i) => i))
                .map(row => toolkit.shuffle(row));
            for (let index = 1; index <= 9; index++) {
                if (!this.fillNumber(index)) {
                    return false;
                }
            }
            return true;
        }
        fillNumber(n) {
            return this.fillRow(n, 0);
        }
        fillRow(n, rowIndex) {
            if (rowIndex > 8) {
                return true;
            }
            const row = this.martrix[rowIndex];
            const orders = this._orders[rowIndex];
            for (let i = 0; i < 9; i++) {
                const colIndex = orders[i];
                if (row[colIndex]) {
                    continue;
                }
                if (!toolkit.checkFillable(this.martrix, n, rowIndex, colIndex)) {
                    continue;
                }
                row[colIndex] = n;
                if (!this.fillRow(n, rowIndex + 1)) {
                    row[colIndex] = 0;
                    continue;
                }
                return true;
            }
            return false;
        }
    }

    class Sudoku {
        constructor() {
            this._solutionMatrix = [];
            this.puzzlexMatrix = [];
            const generator = new Generator();
            generator.generate();
            this._solutionMatrix = generator.martrix;
        }
        make(level = 5) {
            this.puzzlexMatrix = this._solutionMatrix.map(row => {
                return row.map(cell => Math.random() * 9 < level ? 0 : cell);
            });
        }
    }

    class checker {
        constructor(matrix) {
            this._isSuccess = false;
            this._matrix = [];
            this._matrixMarks = [];
            this._matrix = matrix;
            this._matrixMarks = toolkit.makeMatrix(true);
        }
        get martixMarks() {
            return this._matrixMarks;
        }
        get isSuccess() {
            return this._isSuccess;
        }
        check() {
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
        static checkArray(array) {
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

    class App {
        constructor() {
            fgui.UIPackage.loadPackage("res/ui/sudoku", Laya.Handler.create(this, this.onUILoaded));
            Laya.stage.on(Events.CHOOSE_NUMBER, this, this.onChooseNumber);
        }
        onUILoaded() {
            this._view = fgui.UIPackage.createObject("sudoku", "Main").asCom;
            this._view.x = (Laya.Browser.clientWidth - this._view.width / window.devicePixelRatio) / 2;
            fgui.GRoot.inst.addChild(this._view);
            this._popup = this._view.getChild('n8');
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
            for (let i = 0; i < martrix.length; i++) {
                for (let j = 0; j < 9; j++) {
                    const item = this._list.addItemFromPool();
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
        onClickItem(evt) {
            if (!evt.isAuto) {
                this._chooseGrid = evt;
                this._popup.show();
            }
        }
        onChooseNumber(evt) {
            this._chooseGrid.title = evt;
        }
        check() {
            this._popup.hide();
            let result = toolkit.makeMatrix(), j = 0;
            for (let i = 0; i < 81; i++) {
                const item = this._list.getChildAt(i);
                const title = +item.title || 0;
                result[j][i % 9] = title;
                if ((i + 1) % 9 == 0) {
                    j++;
                }
            }
            const checker$1 = new checker(result);
            if (checker$1.check()) {
                alert("恭喜你全部都作对啦！");
            }
            const marks = checker$1.martixMarks;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const item = this._list.getChildAt(i * 9 + j);
                    if (!marks[i][j]) {
                        if (!item.isAuto)
                            item.bgColor = "#FEB6C3";
                    }
                    else {
                        item.bgColor = "#ffffff";
                    }
                }
            }
        }
        reset() {
            this._popup.hide();
            for (let i = 0; i < 81; i++) {
                const item = this._list.getChildAt(i);
                if (!item.isAuto) {
                    item.bgColor = "#ffffff";
                    item.title = "";
                }
            }
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            Laya.stage.bgColor = "#000000";
            new App();
        }
    }
    new Main();

}());
