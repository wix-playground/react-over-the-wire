import ReactMultiChildUpdateTypes from 'react/lib/ReactMultiChildUpdateTypes';
import ReactWWIDOperations from './ReactWWIDOperations';

const {
    INSERT_MARKUP, MOVE_EXISTING, SET_MARKUP, TEXT_CONTENT, REMOVE_NODE
} =
ReactMultiChildUpdateTypes;

export const actions = {
    [INSERT_MARKUP](inst, update) {
        const parent = ReactWWIDOperations.get(inst._rootNodeID);
        const child = update.content;

        if (typeof child === 'string' || typeof child === 'number') {
            parent.setContent(child);
        } else {
            if (update.toIndex){
                parent.addChildAtIndex(child.getPublicInstance(), update.toIndex);
            } else {
                parent.addChild(child.getPublicInstance());
            }
        }
    }, [MOVE_EXISTING]() {
        console.log(MOVE_EXISTING);
    }, [SET_MARKUP]() {
        console.log(SET_MARKUP);
    }, [TEXT_CONTENT]() {
        console.log(TEXT_CONTENT);
    }, [REMOVE_NODE](inst, update) {
        const parent = ReactWWIDOperations.get(inst._rootNodeID);
        parent.removeChildByReactId(update.fromNode.reactId);
    }
};

export function processChildrenUpdates(inst, updates) {
    for (let i = 0, l = updates.length; i < l; ++i) {
        let update = updates[i];
        actions[update.type](inst, update);
    }
}

export function replaceNodeWithMarkupByID(reactId, markup) {
    // reactId here is the reactId of the old node
    // By the time we are here, the oldNode is already unmounted and hence gone from ReactWWOps
    // ASSUMPTION: The nextNode has the same reactId as the old node

    const nextNode = markup.getPublicInstance();
    nextNode.replaceAt(reactId);

}
