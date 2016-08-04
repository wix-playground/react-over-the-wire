import WorkerDomNodeStub from './WorkerDomNodeStub';

const nodes = {};
const parents = {};
/**
 * Backend for ID operations.
 */
class ReactWWIDOperations {
    setRoot(root, ID) {
        nodes[ID] = root;
    }

    add(ID, node, parentID) {
        nodes[ID] = node;
        parents[ID] = parentID;
        return this;
    }
    get(ID) {
        return nodes[ID];
    }
    drop(ID) {
        delete nodes[ID];
        delete parents[ID];
        return this;
    }

    getRoot(ID) {
        while (parents.hasOwnProperty(ID)) {
            ID = parents[ID];
        }
        return nodes[ID];
    }

    getParent(ID) {
        // If the node is root, we return the rootNode itself
        if (parents.hasOwnProperty(ID)) {
            ID = parents[ID];
        }
        return nodes[ID];
    }
}

export default new ReactWWIDOperations();
