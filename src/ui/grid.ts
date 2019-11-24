export default class Grid extends fgui.GComponent {
    private _title: fairygui.GTextField;
    private _text: string;
    private _bg: fairygui.GGraph;
    private _isAuto: boolean = false;
    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this._title = this.getChild("title").asTextField;
        this._bg = this.getChild("bg").asGraph;
    }
    public constructor() {
        super();
    }

    set bgColor(string: string) {
        this._bg.color = string;
    }

    set title(string: string) {
        this._text = string;
        this._title.text = string;
    }

    get title(): string {
        return this._text;
    }

    set isAuto(bool: boolean) {
        this._isAuto = bool;
    }

    get isAuto(): boolean {
        return this._isAuto;
    }
}