function invariant(condition, msg, ...args) {
    if (!condition){
        console.error(msg, ...args);
    } 
}

class NodeList {
    constructor() {
        this.nodeList = {};
    }
    exists(id) {
        return typeof this.nodeList[id] !== 'undefined';
    }
    add(node) {
        invariant(!this.exists(node._rootNodeID), 'Node already exists', node._rootNodeID, this.nodeList[node._rootNodeID]);
        this.nodeList[node._rootNodeID] = node;
    }
    get(id) {
        if (!id) {
            return null
        };
        invariant(this.exists(id), 'Id does not exist to get', id);
        return this.nodeList[id];
    }
    remove(id) {
        invariant(this.exists(id), 'Id does not exist to remove', id);
        delete this.nodeList[id];
    }
}

export default new NodeList();
