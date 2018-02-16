import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import FirstPage from './FirstPage';
import UserMainPage from './UserMainPage';

import Alert from './dialogBoxes/alert';
import Confirm from './dialogBoxes/confirm';

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
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
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
            case 'confirm': {
                this.setState({
                    dialogBoxType: 'confirm',
                    dialogBoxMessage: dialogBox.confirm.text,
                    dialogBoxColor: dialogBox.confirm.color,
                    dialogBoxYes: dialogBox.confirm.chooseYes,
                    dialogBoxNo: dialogBox.confirm.chooseNo
                });
                break;
            }
            default: {
                break;
            }
        }
    }
    handleCloseConfirm() {
        this.setState({
            dialogBoxType: ''
        });
    }
    render() {
        let dialogBox = '';
        switch (this.state.dialogBoxType) {
            case 'alert': {
                dialogBox = <Alert alertInfo={this.state.dialogBoxMessage} alertColor={this.state.dialogBoxColor} />;
                setTimeout(() => this.setState({ dialogBoxType: '' }), 5000);
                break;
            }
            case 'confirm': {
                dialogBox = (
                    <Confirm
                        confirmInfo={this.state.dialogBoxMessage}
                        chooseYes={this.state.dialogBoxYes}
                        chooseNo={this.state.dialogBoxNo}
                        confirmColor={this.state.dialogBoxColor}
                        closeConfirm={this.handleCloseConfirm}
                    />
                );
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
                            <Route
                                path={'/user/:uid/'}
                                render={props => <UserMainPage {...props} handleDialogBox={this.handleDialogBox} />}
                            />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
