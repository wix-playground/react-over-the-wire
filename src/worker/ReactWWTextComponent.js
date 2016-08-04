import ReactWWIDOperations from './ReactWWIDOperations';
import WorkerDomNodeStub from './WorkerDomNodeStub';

let guid = 0;

export default class ReactWWTextComponent {
    constructor(props) {}

    construct(text) {
        this._currentElement = text;
        this._rootNodeID = 't' + guid++;
    }

    mountComponent(transaction, parent, hostInfo, context) {
        const parentNode = parent instanceof WorkerDomNodeStub ? parent : ReactWWIDOperations.get(parent._rootNodeID);
        const node = new WorkerDomNodeStub(this._rootNodeID, '#text', {
            value: this._currentElement
        }, parentNode.bridge);
        parentNode.addChild(node);
        ReactWWIDOperations.add(this._rootNodeID, node, parentNode.reactId);
        return node;
    }

    receiveComponent(nextText, transaction) {
        if (this._currentElement !== nextText) {
            this._currentElement = nextText;
            const node = ReactWWIDOperations.get(this._rootNodeID);
            node.setContent(this._currentElement);
        }
        return this;
    }

    unmountComponent() {
        // Nothing really to do, since this just sets the content
    }

    getPublicInstance() {
        return this._currentElement;
    }
}
