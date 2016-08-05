import ReactBrowserEventEmitter from 'react/lib/ReactBrowserEventEmitter';
import EventConstants from 'react/lib/EventConstants';

export default class WorkerDomNodeImpl {
    constructor(reactId, el, options) {
        this.el = el;
        this.options = options;
        this.reactId = reactId;
        if (el === '#text') {
            this.ref = document.createTextNode(options.value);
            this.type = 'TEXT_NODE';
        } else {
            this.ref = document.createElement(el);
            this.ref.setAttribute('data-reactid', this.reactId);
            this.setAttributes(this.options);
        }
    }
    addChild(node, afterNode) {
        this.ref.appendChild(node.ref);
    }
    addChildAtIndex(node, index) {
        var nextNode = this.ref.childNodes[index];
        if (nextNode){
            this.ref.insertBefore(node.ref, nextNode);
        } else {
            this.ref.appendChild(node.ref);
        }
    }
    removeChild(node) {
        this.ref.removeChild(node.ref);
    }
    removeChildAtIndex(index) {
        var nodeToRemove = this.ref.childNodes[index];
        let reactId = null;
        if (nodeToRemove.nodeType !== Node.TEXT_NODE){
            reactId = nodeToRemove.getAttribute('data-reactid');
        }
        this.ref.removeChild(nodeToRemove);
        return reactId;
    }
    replace(oldNode) {
        oldNode.ref.parentNode.replaceChild(this.ref, oldNode.ref);
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
            ReactBrowserEventEmitter.listenTo(handler, container);
            ReactBrowserEventEmitter.putListener(this.reactId, handler, (syntheticEvent, reactId, e) => {
                onEvent(handler, syntheticEvent, reactId, e);
            });
        });
    }

    removeEventHandlers() {
        ReactBrowserEventEmitter.deleteAllListeners(this.reactId);
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
