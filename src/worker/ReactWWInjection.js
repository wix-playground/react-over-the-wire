/**
 * Injecting the renderer's needed dependencies into React's internals.
 */

import BeforeInputEventPlugin from 'react/lib/BeforeInputEventPlugin';
import ChangeEventPlugin from 'react/lib/ChangeEventPlugin';
import DefaultEventPluginOrder from 'react/lib/DefaultEventPluginOrder';
import EnterLeaveEventPlugin from 'react/lib/EnterLeaveEventPlugin';
import HTMLDOMPropertyConfig from 'react/lib/HTMLDOMPropertyConfig';
import ReactDOMComponentTree from 'react/lib/ReactDOMComponentTree';
import ReactDOMTreeTraversal from 'react/lib/ReactDOMTreeTraversal';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactEventListener from 'react/lib/ReactEventListener';
import ReactInjection from 'react/lib/ReactInjection';
import ReactReconcileTransaction from 'react/lib/ReactReconcileTransaction';
import SVGDOMPropertyConfig from 'react/lib/SVGDOMPropertyConfig';
import SelectEventPlugin from 'react/lib/SelectEventPlugin';
import SimpleEventPlugin from 'react/lib/SimpleEventPlugin';


import ReactWWReconcileTransaction from './ReactWWReconcileTransaction';
import ReactWWComponent from './ReactWWComponent';
import ReactWWTextComponent from './ReactWWTextComponent';


import {
    processChildrenUpdates, replaceNodeWithMarkupByID
}
from './ReactWWChildOperations';

let rootIndex = 1;

export default function inject() {


  ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree);
  ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });

  ReactInjection.HostComponent.injectGenericComponentClass(ReactWWComponent);

  ReactInjection.HostComponent.injectTextComponentClass(ReactWWTextComponent);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
    return null;//new ReactDOMEmptyComponent(instantiate);
  });

  ReactInjection.Updates.injectReconcileTransaction(ReactWWReconcileTransaction);
  ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);

  ReactInjection.Component.injectEnvironment(
      {

          processChildrenUpdates: processChildrenUpdates,

          replaceNodeWithMarkup: replaceNodeWithMarkupByID,

          unmountIDFromEnvironment: function (rootNodeID) { }

      });




    // ReactInjection.RootIndex.injectCreateReactRootIndex(function () {
    //     return '' + rootIndex++;
    // });
}
