/**
 * Created by avim on 6/27/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import recursion from './recursion/app.jsx';
import dbmonster from './dbmonster/app.jsx';
import drag from './drag/app.jsx';
import masonry from './masonry/app.jsx';
import todo from './todo/app.jsx';
import nativeExtensions from './nativeExtensions';

const demoApps = {recursion,dbmonster,drag,masonry,todo};

class NativeInvocationContext extends React.Component {
  render() {
    return this.props.children;
  }
  getChildContext() {
    return {nativeExtensions: nativeExtensions};
  }
}
NativeInvocationContext.childContextTypes = {
  nativeExtensions: React.PropTypes.object
};

function renderVanilla(targetId) {
    var Demo = demoApps[window.chosenDemo]
    ReactDOM.render(
        <NativeInvocationContext>
            <Demo/>
        </NativeInvocationContext>,
        document.getElementById(targetId))
}

renderVanilla('content');