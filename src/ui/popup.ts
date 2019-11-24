import Grid from "./grid";
import Events from "../core/events";
export default class Popup extends fgui.GComponent {
    private _types = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.renderList();
    }
    public constructor() {
        super();
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    renderList() {
        var list: fgui.GList = this.getChild("panel").asList;
        list.removeChildrenToPool();
        list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        for (let i: number = 0; i < this._types.length; i++) {
            const item = list.addItemFromPool() as Grid;
            const title = this._types[i];
            item.title = title;
        }
    }

    onClickItem(evt: Grid) {
        console.log(evt.title);
        Laya.stage.event(Events.CHOOSE_NUMBER,evt.title);
        this.hide();
    }

}