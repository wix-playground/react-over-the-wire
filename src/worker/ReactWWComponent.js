import ReactMultiChild from 'react/lib/ReactMultiChild';

import WorkerDomNodeStub from './WorkerDomNodeStub';
import ReactWWIDOperations from './ReactWWIDOperations';

const eventsHandlers = {
  onAbort: true,
  onAnimationEnd: true,
  onAnimationIteration: true,
  onAnimationStart: true,
  onBlur: true,
  onCanPlay: true,
  onCanPlayThrough: true,
  onChange: true,
  onClick: true,
  onCompositionEnd: true,
  onCompositionStart: true,
  onCompositionUpdate: true,
  onContextMenu: true,
  onCopy: true,
  onCut: true,
  onDoubleClick: true,
  onDrag: true,
  onDragEnd: true,
  onDragEnter: true,
  onDragExit: true,
  onDragLeave: true,
  onDragOver: true,
  onDragStart: true,
  onDrop: true,
  onDurationChange: true,
  onEmptied: true,
  onEncrypted: true,
  onEnded: true,
  onError: true,
  onFocus: true,
  onInput: true,
  onKeyDown: true,
  onKeyPress: true,
  onKeyUp: true,
  onLoadedData: true,
  onLoadedMetadata: true,
  onLoadStart: true,
  onMouseDown: true,
  onMouseMove: true,
  onMouseOut: true,
  onMouseOver: true,
  onMouseUp: true,
  onPaste: true,
  onPause: true,
  onPlay: true,
  onPlaying: true,
  onProgress: true,
  onRateChange: true,
  onScroll: true,
  onSeeked: true,
  onSeeking: true,
  onSelectionChange: true,
  onStalled: true,
  onSuspend: true,
  onTextInput: true,
  onTimeUpdate: true,
  onTouchCancel: true,
  onTouchEnd: true,
  onTouchMove: true,
  onTouchStart: true,
  onTransitionEnd: true,
  onVolumeChange: true,
  onWaiting: true,
  onWheel: true,
  onSubmit: true,
  onReset: true
}

let guid = 1;

//mountComponent(transaction, parent, hostInfo, context) {}


/**
 * Function to separate event Handlers and regular props
 * @param  {Object} props Props passed to a React Component
 * @return {eventHandlers: {}, options: {}}       An object containing eventHandlers and options
 */
function extractEventHandlers(props) {
    let result = {
        eventHandlers: {},
        options: {}
    };
    for (let key in props) {
        if (eventsHandlers.hasOwnProperty(key)) {
            result.eventHandlers[key] = props[key];
        } else {
            result.options[key] = props[key];
        }
    }
    return result;
}

/**
 * Renders the given react element with webworkers.
 *
 * @constructor ReactWWComponent
 * @extends ReactMultiChild
 */
export default class ReactWWComponent {
    constructor(element) {
        this._tag = element.type.toLowerCase();
        this._currentElement = element;
        this._renderedChildren = null;
        this._previousStyle = null;
        this._previousStyleCopy = null;
        this._wrapperState = null;
        this._topLevelWrapper = null;
        this._nodeWithLegacyProperties = null;
        this._rootNodeID = null;
    }

    /**
     * Mounting the root component.
     *
     * @internal
     * @param  {string} rootID - The root ID for this node.
     * @param  {ReactReconcileTransaction} transaction
     * @param  {object} context
     */
    mountComponent(transaction, parent, hostInfo, context) {
        this._rootNodeID = 'c' + guid++;

        const node = this.mountNode(transaction, parent, this._currentElement);


        // Mounting children
        let childrenToUse = this._currentElement.props.children;
        childrenToUse = childrenToUse === null ? [] : [].concat(childrenToUse);

        if (childrenToUse.length) {
            this.mountChildren(childrenToUse, transaction, context);
        }

        // Rendering the rootNode
        ReactWWIDOperations.getRoot(this._rootNodeID).render();
        return this;
    }

    /**
     * Mounting the node itself.
     *
     * @param   {Node}          parent  - The parent node.
     * @param   {ReactElement}  element - The element to mount.
     * @return  {Node}                  - The mounted node.
     */
    mountNode(transaction, parent, element) {
        const {
            props, type
        } = element, {
            children, ...restProps
        } = props;

        let {
            eventHandlers, options
        } = extractEventHandlers(restProps);
        const parentNode = parent instanceof WorkerDomNodeStub ? parent : ReactWWIDOperations.get(parent._rootNodeID);

        const node = new WorkerDomNodeStub(this._rootNodeID, type, options, parentNode.bridge );
        ReactWWIDOperations.add(this._rootNodeID, node, parentNode.reactId);
        parentNode.addChild(node);

        transaction.getReactMountReady().enqueue(function(){
            this.node.addEventHandlers(this.eventHandlers);
        }, {
            node, eventHandlers
        });

        return node;
    }

    /**
     * Receive a component update.
     *
     * @param {ReactElement}              nextElement
     * @param {ReactReconcileTransaction} transaction
     * @param {object}                    context
     * @internal
     * @overridable
     */
    receiveComponent(nextElement, transaction, context) {
        const {
            props: {
                children, ...restProps
            }
        } = nextElement, {
            eventHandlers, options
        } = extractEventHandlers(restProps);

        let node = ReactWWIDOperations.get(this._rootNodeID);

        node.setAttributes(options);
        //node.addEventHandlers(eventHandlers);

        this.updateChildren(children, transaction, context);
        //ReactWWIDOperations.rootNode.render(); <- No real need to update the parent also
        return this;
    }

    /**
     * Dropping the component.
     */
    unmountComponent() {
        this.unmountChildren();

        const node = ReactWWIDOperations.get(this._rootNodeID);
        node.removeEventHandlers();

        // Unmounting should not remove Child
        // THey will be removed when they are replaced in markup
        // Or when REMOVE_NODE in Child openrations is called
        //var parent = ReactWWIDOperations.getParent(node.reactId);
        //parent.removeChild(node);

        const root = ReactWWIDOperations.getRoot(this._rootNodeID);


        ReactWWIDOperations.drop(this._rootNodeID);

        this._rootNodeID = null;

        root.render();
    }

    /**
     * Getting a public instance of the component for refs.
     *
     * @return {Node} - The instance's node.
     */
    getPublicInstance() {
        return ReactWWIDOperations.get(this._rootNodeID);
    }

    getHostNode() {
        return ReactWWIDOperations.get(this._rootNodeID);
    }
}

/**
 * Extending the component with the MultiChild mixin.
 */
Object.assign(
    ReactWWComponent.prototype,
    ReactMultiChild.Mixin
);
