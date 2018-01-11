import React from 'react';
import { render } from 'react-router-dom';
import App from './ClientApp';

render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.access();
}
