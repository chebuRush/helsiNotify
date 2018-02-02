import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Link, Route } from 'react-router-dom';

import UserSettingPage from './UserSettingPage';
import UserDoctorPage from './UserDoctorPage';
import UserLogOut from './UserLogOut';

export default class UserMainPage extends React.Component {
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func
        }),
        location: PropTypes.shape({
            state: PropTypes.shape({
                email: PropTypes.string,
                emailVerified: PropTypes.bool,
                userDoctors: PropTypes.object
            })
        }),
        match: PropTypes.shape({
            params: PropTypes.shape({
                uid: PropTypes.string
            })
        })
    };
    static defaultProps = {
        history: PropTypes.shape({
            push() {}
        }),
        location: PropTypes.shape({
            state: {
                email: '',
                emailVerified: false,
                userDoctors: {}
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
                doctorsArr: this.props.location.state.userDoctors
            };
        } else {
            this.state = {
                email: '',
                emailVerified: false,
                doctorsArr: {}
            };
        }
        this.changeDoctorState = this.changeDoctorState.bind(this);
    }
    componentWillMount() {
        axios
            .post('http://localhost:8090/getData')
            .then(dataBack => {
                if (dataBack.data.email) {
                    this.setState({
                        email: dataBack.data.email,
                        emailVerified: dataBack.data.emailVerified,
                        doctorsArr: dataBack.data.userDoctors
                    });
                } else {
                    console.log('ready to push', this.props.history.push);
                    this.props.history.push('/');
                }
            })
            .catch(err => {
                // TODO tell user that something went wrong
                console.error('axios error', err); // eslint-disable-line no-console
                this.props.history.push('/');
            });
        // TODO delete setTimeout and rewrite axios to sync query
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
        return (
            <div className="UserMainPage">
                <Route
                    path={`/user/${this.props.match.params.uid}/notify`}
                    render={props => (
                        <UserDoctorPage
                            {...props}
                            doctorsArr={this.state.doctorsArr}
                            changeDoctorState={this.changeDoctorState}
                        />
                    )}
                />
                <Route path={`/user/${this.props.match.params.uid}/settings`} component={UserSettingPage} />
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
