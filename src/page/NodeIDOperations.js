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
        invariant(!this.exists(node.reactId), 'Node already exists', node.reactId, this.nodeList[node.reactId]);
        this.nodeList[node.reactId] = node;
    }
    get(id) {
        invariant(this.exists(id), 'Id does not exist to get', id);
        return this.nodeList[id];
    }
    getByReactId(reactId) {
        this.get(reactId);
    }
    remove(id) {
        invariant(this.exists(id), 'Id does not exist to remove', id);
        delete this.nodeList[id];
    }
}

export default new NodeList();
