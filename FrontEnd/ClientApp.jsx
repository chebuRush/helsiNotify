import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstPage from './FirstPage.jsx';
import UserPage from './UserPage.jsx'


const ClientApp = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path={'/'} component={FirstPage} />
            <Route path={'/user/:id/doctors'} component={UserPage} />
        </Switch>
    </BrowserRouter>
);
export default ClientApp;
