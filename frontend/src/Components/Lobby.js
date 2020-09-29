import Main_photo from "./checkers_placeholder.png";
import React from "react";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: [{username: "There is an error"}, {username: "Seriously"}],
            randomString: "This is random string"
        }
    }

    componentDidMount() {
        // this.fetchNames()
        console.log(this.props.getTokenFromLocal());
        console.log(this.getActiveUsers());
        this.getActiveUsers();
    }

    // fetchNames() {
    //     fetch('http://127.0.0.1:8000/api/all_users/')
    //         .then(response => response.json())
    //         .then(response => this.setState({currentUsers: response}))
    // }

    // fetchOnlineNames() {
    //     console.log("Before fetching...")
    //     fetch('http://127.0.0.1:8000/api/current_users/')
    //         .then(response => response.json())
    //         .then(response => console.log(response))
        //     .then(response => this.setState({currentUsers: response}))
        // console.log("log after fetch");
        // console.log("Data: ", this.state.currentUsers);
        // this.state.randomString = "This is not a random string";
    // }

    // componentDidMount() {
    //     if (this.state.logged_in) {
    //         fetch('http://localhost:8000/login_and_register/current_user/', {
    //             headers: {
    //                 Authorization: `JWT ${localStorage.getItem('token')}`
    //             }
    //         })
    //             .then(res => res.json())
    //             .then(json => {
    //                 this.setState({username: json.username});
    //             });
    //     }
    // }



    getActiveUsers() {
        var userList;
            fetch('http://localhost:8000/api-auth/active_users/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json()
                            .then(res => {
                                userList = res;
                                this.setState({currentUsers: res});
                                console.log(res);
                            })
                    }
                })
    };



    render() {
        var currentUsersList = this.state.currentUsers
        return (
            <div id="main-page">
                <div>
                    <h6>Logged in!</h6>
                    <h3 className="centered" id="title">
                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Something went wrong...'}
                    </h3>
                </div>
                <div>
                    <p>{this.state.randomString}</p>
                    <ul>
                        {currentUsersList.map((current_person) => (
                            <li className="current-users">
                                {current_person['username']}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="close-to-bottom centered">Do you want to
                        <span className="span-link" onClick={this.props.handleLogout}
                        > log out? </span>
                    </p>
                </div>
            </div>
        );
    };
}

export default Lobby;