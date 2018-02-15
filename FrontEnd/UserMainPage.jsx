import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Link, Route } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import UserSettingPage from './UserSettingPage';
import UserDoctorPage from './UserDoctorPage';
import UserLogOut from './UserLogOut';

export default class UserMainPage extends React.Component {
    static propTypes = {
        handleDialogBox: PropTypes.func,
        history: PropTypes.shape({
            push: PropTypes.func
        }),
        location: PropTypes.shape({
            state: PropTypes.shape({
                email: PropTypes.string,
                emailVerified: PropTypes.bool,
                userDoctors: PropTypes.object,
                ONE_DOCTOR_VISIT_COST: PropTypes.string
            })
        }),
        match: PropTypes.shape({
            params: PropTypes.shape({
                uid: PropTypes.string
            })
        })
    };
    static defaultProps = {
        handleDialogBox() {},
        history: PropTypes.shape({
            push() {}
        }),
        location: PropTypes.shape({
            state: {
                email: '',
                emailVerified: false,
                userDoctors: {},
                ONE_DOCTOR_VISIT_COST: '0'
            }
        }),
        match: PropTypes.shape({
            params: {
                uid: ''
            }
        })
    };
    constructor(props) {
        super(props);
        if (this.props.location.state) {
            this.state = {
                email: this.props.location.state.email,
                emailVerified: this.props.location.state.emailVerified,
                doctorsArr: this.props.location.state.userDoctors,
                ONE_DOCTOR_VISIT_COST: this.props.location.state.ONE_DOCTOR_VISIT_COST,
                loading: false
            };
        } else {
            this.state = {
                email: '',
                loading: true,
                emailVerified: false,
                doctorsArr: {},
                ONE_DOCTOR_VISIT_COST: 0
            };
        }
        this.changeDoctorState = this.changeDoctorState.bind(this);
    }
    componentWillMount() {
        axios
            .post('http://localhost:8090/getNotifications')
            .then(dataBack => {
                if (dataBack.data.email) {
                    this.setState({
                        email: dataBack.data.email,
                        emailVerified: dataBack.data.emailVerified,
                        doctorsArr: dataBack.data.userDoctors,
                        ONE_DOCTOR_VISIT_COST: dataBack.data.ONE_DOCTOR_VISIT_COST,
                        loading: false
                    });
                } else {
                    this.props.history.push('/');
                }
            })
            .catch(() => {
                this.props.history.push('/');
            });
    }
    changeDoctorState(newDoctorObj) {
        this.setState({
            doctorsArr: newDoctorObj
        });
    }
    render() {
        const emailNeedToBeConfirmed = !this.state.emailVerified
            ? <p style={{ position: 'absolute', bottom: '1vh', right: '0.5vw', fontSize: '1.8vmin', color: '#ff3349' }}>
                  Email не підтвердженно. Обмежений функціонал
              </p>
            : '';
        if (this.state.loading) {
            return (
                <div className="sweet-loading" align="center">
                    <PulseLoader color={'#0000c8'} loading={this.state.loading} />
                </div>
            );
        }
        return (
            <div className="UserMainPage">
                <Route
                    path={`/user/${this.props.match.params.uid}/notify`}
                    render={props => (
                        <UserDoctorPage
                            {...props}
                            handleDialogBox={this.props.handleDialogBox}
                            ONE_DOCTOR_VISIT_COST={this.state.ONE_DOCTOR_VISIT_COST}
                            doctorsArr={this.state.doctorsArr}
                            changeDoctorState={this.changeDoctorState}
                        />
                    )}
                />
                <Route
                    path={`/user/${this.props.match.params.uid}/settings`}
                    render={props => (
                        <UserSettingPage
                            {...props}
                            handleDialogBox={this.props.handleDialogBox}
                            email={this.state.email}
                        />
                    )}
                />
                <Route path={`/user/${this.props.match.params.uid}/logout`} component={UserLogOut} />
                <aside>
                    <h3>Вітаємо, {this.state.email}</h3>
                    <ul className="mainMenu">
                        <li><Link style={{ textDecoration: 'none' }} to={'/'}>Головна</Link></li>
                        <li>
                            <Link style={{ textDecoration: 'none' }} to={`/user/${this.props.match.params.uid}/notify`}>
                                Cповіщення
                            </Link>
                        </li>
                        <li>
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={`/user/${this.props.match.params.uid}/settings`}>
                                Налаштування
                            </Link>
                        </li>
                        <li>
                            <Link style={{ textDecoration: 'none' }} to={`/user/${this.props.match.params.uid}/logOut`}>
                                Вихід
                            </Link>
                        </li>
                    </ul>
                    {emailNeedToBeConfirmed}
                </aside>
            </div>
        );
    }
}
