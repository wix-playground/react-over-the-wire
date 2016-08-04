import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
// import ReactIsomorphic from 'react/lib/ReactIsomorphic'
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import invariant from 'invariant';

import inject from './ReactWWInjection';
import ReactWWIDOperations from './ReactWWIDOperations';
import WorkerDomNodeStub from './WorkerDomNodeStub';
import WorkerBridge from './WorkerBridge';

import ReactChildren from 'react/lib/ReactChildren';
import ReactComponent from 'react/lib/ReactComponent';
import ReactPureComponent from 'react/lib/ReactPureComponent';
import ReactClass from 'react/lib/ReactClass';
import ReactDOMFactories from 'react/lib/ReactDOMFactories';
import ReactPropTypes from 'react/lib/ReactPropTypes';
import ReactVersion from 'react/lib/ReactVersion';

import onlyChild from 'react/lib/onlyChild';

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

/**
 * Injecting dependencies.
 */
inject();
let guid = 0;
/**
 * Renders the given react element using a web worker.
 *
 * @param  {ReactElement}   element   - Node to update.
 * @return {ReactComponent}           - The rendered component instance.
 */
function render(element, channel) {
    // Is the given element valid?
    invariant(
        ReactElement.isValidElement(element),
        'render(): You must pass a valid ReactElement.'
    );

    const id = ReactInstanceHandles.createReactRootID('r' + guid++); // Creating a root id & creating the screen
    const component = instantiateReactComponent(element); // Mounting the app
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    const bridge = new WorkerBridge(channel);
    const root = new WorkerDomNodeStub(id, 'div', {}, bridge);

    ReactWWIDOperations.setRoot(root, id);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    ReactUpdates.batchedUpdates(() => {
        transaction.perform(() => {
            //transaction, hostParent, hostContainerInfo, context
            component.mountComponent(transaction, root, {}, {});
        });
        ReactUpdates.ReactReconcileTransaction.release(transaction);
    });

    return component._instance;
}

var ReactOverTheWire = {

  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function (mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  render: render
}


module.exports = ReactOverTheWire;
