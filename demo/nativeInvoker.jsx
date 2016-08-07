import React from 'react';

class NativeInvoker extends React.Component {
    invoke(ref, methodName, args) {
        if (ref.invoke) {
            ref.invoke(methodName, args);
        } else {
            this.context.nativeExtensions[methodName].apply(null, [ref].concat(args));
        }
    }
}

NativeInvoker.contextTypes = {
    nativeExtensions: React.PropTypes.object
}

module.exports = NativeInvoker;