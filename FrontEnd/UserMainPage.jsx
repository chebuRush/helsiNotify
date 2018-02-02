import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';

import UserSettingPage from './UserSettingPage';
import UserDoctorPage from './UserDoctorPage';

export default class UserMainPage extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                email: PropTypes.string,
                emailVerified: PropTypes.bool
            })
        }),
        match: PropTypes.shape({
            params: PropTypes.shape({
                uid: PropTypes.string
            })
        })
    };
    static defaultProps = {
        location: PropTypes.shape({
            state: {
                email: '',
                emailVerified: false
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
        this.state = {
            email: this.props.location.state.email,
            emailVerified: this.props.location.state.emailVerified
        };
    }
    render() {
        const emailNeedToBeConfirmed = !this.state.emailVerified
            ? <p style={{ position: 'absolute', bottom: '1vh', right: '0.5vw', fontSize: '1.8vmin', color: '#ff3349' }}>
                  Email не підтвердженно. Обмежений функціонал
              </p>
            : '';
        return (
            <div className="UserMainPage">
                <Route path={`/user/${this.props.match.params.uid}/notify`} component={UserDoctorPage} />
                <Route path={`/user/${this.props.match.params.uid}/settings`} component={UserSettingPage} />
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
