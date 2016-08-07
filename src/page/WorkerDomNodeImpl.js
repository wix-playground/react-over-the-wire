import ReactBrowserEventEmitter from 'react/lib/ReactBrowserEventEmitter';
import EventConstants from 'react/lib/EventConstants';
import EventPluginHub from 'react/lib/EventPluginHub';
import NodeIDOperations from './NodeIDOperations';

const nodeKey = '$reactId$';

export default class WorkerDomNodeImpl {
    constructor(reactId, el, options) {
        this.el = el;
        this.options = options;
        this._rootNodeID = reactId;
        if (el === '#text') {
            this.ref = document.createTextNode(options.value);
            this.type = 'TEXT_NODE';
        } else {
            this.ref = document.createElement(el);
            this.ref.setAttribute('data-reactid', this._rootNodeID);
            this.setAttributes(this.options);
        }
        this.ref[nodeKey] = reactId;
        this._hostParent = null;
   }
    addChild(node, afterNode) {
        this.ref.appendChild(node.ref);
         node._hostParent = this;
   }
    addChildAtIndex(node, index) {
        var nextNode = this.ref.childNodes[index];
        if (nextNode){
            this.ref.insertBefore(node.ref, nextNode);
        } else {
            this.ref.appendChild(node.ref);
        }
        node._hostParent = this;
    }
    removeChild(node) {
        this.ref.removeChild(node.ref);
        node._hostParent = null;
    }
    removeChildAtIndex(index) {
        var nodeToRemove = this.ref.childNodes[index];
        let reactId = nodeToRemove[nodeKey];
        NodeIDOperations.get(reactId)._hostParent = null;
        this.ref.removeChild(nodeToRemove);
        return reactId;
    }
    replace(oldNode) {
        var parentNode = oldNode.ref.parentNode;
        parentNode.replaceChild(this.ref, oldNode.ref);
        this._hostParent = NodeIDOperations.get(parentNode[nodeKey]);
    }
    setContent(content) {
        if (this.type === 'TEXT_NODE') {
            this.ref.nodeValue = content;
        } else {
            this.ref.innerHTML = escape(content);
        }
    }
    setAttributes(options) {
        for (let key in options) {
            setAttribute(this.ref, key, options[key]);
        }
    }
    addEventHandlers(container, onEvent, ...handlers) {
        handlers.forEach((handler) => {
            switch (this.el) {
                case 'form':
                    this._listeners = [
                        ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset', this.ref),
                        ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit', this.ref)
                    ];
                    // TODO - Add more cases of events that do not bubble
                    // Look at trapBubbledEventsLocal in REactDomComponent in react-dom
            }
            const reactId = this._rootNodeID;
            ReactBrowserEventEmitter.listenTo(handler, container);
            EventPluginHub.putListener({_rootNodeID: this._rootNodeID, _hostNode: this.ref, ref:this.ref}, handler, (syntheticEvent) => {
                onEvent(handler, syntheticEvent, reactId);
            });
        });
    }

    removeEventHandlers() {
        EventPluginHub.deleteAllListeners({_rootNodeID: this._rootNodeID, _hostNode: this.ref, ref:this.ref});
    }
}

function setAttribute(node, key, value) {
    switch (key) {
        case 'style':
            for (var prop in value) {
                node.style[prop] = value[prop];
            }
            break;
        case 'dangerouslySetInnerHTML':
            node.innerHTML = value.__html;
            break;
        case 'checked':
            if (value) {
                node.checked = true;
            } else {
                node.checked = false;
            }
            break;
        case 'className':
            node.className = value;
            break;
        case 'value':
            node.value = value;
        default:
            node.setAttribute(key, value);

    }
}
