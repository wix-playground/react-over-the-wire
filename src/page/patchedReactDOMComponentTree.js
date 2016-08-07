
import NodeIDOperations from './NodeIDOperations';

const nodeKey = '$reactId$';


function getClosestInstanceFromNode(node) {
    return NodeIDOperations.get(node[nodeKey]);
}

function getNodeFromInstance(inst) {
    return inst.ref;
}

function noop() {}

var ReactDOMComponentTree = {
  getClosestInstanceFromNode: getClosestInstanceFromNode,
  getInstanceFromNode: getClosestInstanceFromNode,
  getNodeFromInstance: getNodeFromInstance,
  precacheChildNodes: noop,
  precacheNode: noop,
  uncacheNode: noop
};
module.exports = ReactDOMComponentTree;