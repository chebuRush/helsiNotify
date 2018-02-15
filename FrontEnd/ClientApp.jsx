import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstPage from './FirstPage';
import UserMainPage from './UserMainPage';

import Alert from './dialogBoxes/alert';

export default class App extends React.Component {
    static updateLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: JSON.parse(localStorage.getItem('login')) || false,
            dialogBoxType: '',
            dialogBoxMessage: '',
            dialogBoxColor: ''
        };
        this.toggleLogin = this.toggleLogin.bind(this);
        this.handleDialogBox = this.handleDialogBox.bind(this);
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
    handleDialogBox(dialogBox) {
        switch (Object.keys(dialogBox)[0]) {
            case 'alert': {
                this.setState({
                    dialogBoxType: 'alert',
                    dialogBoxMessage: dialogBox.alert.text,
                    dialogBoxColor: dialogBox.alert.color
                });
                break;
            }
            default: {
                console.log('default');
                break;
            }
        }
    }
    render() {
        let dialogBox = '';
        switch (this.state.dialogBoxType) {
            case 'alert': {
                dialogBox = <Alert alertInfo={this.state.dialogBoxMessage} alertColor={this.state.dialogBoxColor} />;
                setTimeout(() => this.setState({ dialogBoxType: '' }), 5000);
                break;
            }
            default: {
                dialogBox = '';
            }
        }
        return (
            <BrowserRouter>
                <div>
                    {dialogBox}
                    <div className="main_wrap">
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={props => <FirstPage {...props} handleDialogBox={this.handleDialogBox} />}
                            />
                            <Route path={'/user/:uid/'} component={UserMainPage} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
