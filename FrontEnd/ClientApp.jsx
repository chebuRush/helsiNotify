import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstPage from './FirstPage';
// import UserDoctorPage from './UserDoctorPage';
// import UserSettingPage from './UserSettingPage';
// import EnsureLoggedInContainer from './EnsureLoggedInContainer';

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
                <div className="app">
                    <Switch>
                        <Route exact path="/" component={FirstPage} />
                        {/* <Route render={props => <EnsureUserLogin {...props} toggleLogin={this.toggleLogin} />}> */}
                        {/* <Route path={'/user/:id/doctors'} component={UserDoctorPage} /> */}
                        {/* <Route path={'/user/:id/settings'} component={UserSettingPage} /> */}
                        {/* </Route> */}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
