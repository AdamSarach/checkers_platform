import Main_photo from "./checkers_placeholder.png";
import React from "react";
import Chatwindow from "./Chatwindow";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: [{username: "There is an error"}, {username: "Seriously"}],
            numbersOfPlayers: 0
        }
    }

    componentDidMount() {
        // this.fetchNames()
        console.log("Lobby, componentdidmount: " + this.props.username);
        console.log(this.props.getTokenFromLocal());
        console.log(this.getActiveUsers());
        this.getActiveUsers();
    }


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
                            this.setState({
                                currentUsers: res,
                                numbersOfPlayers: res.length
                            });
                            console.log(res);
                        })
                }
            })
    };

    playGame = () => {
        console.log("It works!");
        this.props.displayForm('game')
        // document.getElementById("user-list").value = "";
    }


    render() {
        var currentUsersList = this.state.currentUsers
        return (
            <div id="main-page">
                <div>

<<<<<<< Updated upstream
                    <h3 className="centered" id="title">
=======
                    <h3 className="badge-success centered title">
>>>>>>> Stashed changes
                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Something went wrong...'}
                    </h3>
                </div>
                <div className="flex-wrapper button-group-padding btn-group">
                    <button className="btn btn-sm btn-success" onClick={this.playGame}>Look at gameboard layout</button>
                    <button className="btn btn-sm btn-success" onClick={this.props.handleLogout}>Logout</button>
                </div>
                <div className="offset-from-border">
                    Active players: {this.state.numbersOfPlayers}
                </div>
                <div>
                    <div id="user-list">
                        {currentUsersList.map((current_person, index) => (
                            <div key={index} className="current-users flex-wrapper task-wrapper">
                                <div style={{flex: 7}}>
                                    <span>{current_person['username']}</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <button className="btn btn-sm btn-outline-info">Invite</button>
                                </div>
                                <div style={{flex: 1}}>
                                    <button className="btn btn-sm btn-outline-dark">Chat</button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <Chatwindow
                        user={this.props.user}
                    />
                </div>
            </div>
        );
    };
}

export default Lobby;