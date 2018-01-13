import React from 'react';
import ReactDOM from 'react-dom';
import App from './ClientApp';

const renderApp = Component => {
    ReactDOM.render(<Component />, document.getElementById('app'));
};

renderApp(App);

if (module.hot) {
    module.hot.accept();
}
