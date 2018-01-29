import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstPage from './FirstPage';
import UserMainPage from './UserMainPage';

export default class App extends React.Component {
    static updateLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: JSON.parse(localStorage.getItem('login')) || false
        };
        this.toggleLogin = this.toggleLogin.bind(this);
    }
    toggleLogin() {
        this.setState(
            {
                loggedIn: !this.state.loggedIn
            },
            () => {
                App.updateLocalStorage('login', this.state.loggedIn);
            }
        );
    }
    render() {
        return (
            <BrowserRouter>
                <div className="main_wrap">
                    <Switch>
                        <Route exact path="/" component={FirstPage} />
                        <Route path={'/user/:uid/'} component={UserMainPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
