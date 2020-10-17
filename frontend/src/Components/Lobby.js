import Main_photo from "./checkers_placeholder.png";
import React from "react";
import Chatwindow from "./Chatwindow";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: [{username: "Player list in temporary unavailable"}, {username: "Seriously"}],
            numbersOfPlayers: 2,
            invitationText : "Invite",
            invitationButtonValues : [],
        }
    }

    componentDidMount() {
        // console.log(this.getActiveUsers());
        this.getActiveUsers()
        // this.produceButtonValues();
        // console.log(" invitationButtonValues: " +  this.state.invitationButtonValues.length);

    }

    produceButtonValues = () => {
        var currentUsersList = this.state.currentUsers;
        var buttonList = [];
        console.log("currentUsersList: " + currentUsersList.length);
        currentUsersList
            .filter(person => person.username !== this.props.user)
            .map( (current_person) => ( buttonList.push({
                person: current_person['username'],
                value: "Invite"
                }
            )
            ));
        this.setState({invitationButtonValues: buttonList});
    }




    getActiveUsers() {
        // var userList;
        fetch('http://localhost:8000/api-auth/active_users/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(res => {
                            // userList = res;
                            this.setState({
                                currentUsers: res,
                                numbersOfPlayers: res.length
                            });
                            return res
                            // console.log(res);
                        })
                }
                else {
                //  ToDO:  Handle Server Error
                }
            })
    };

    playGame = () => {
        // console.log("It works!");
        this.props.displayForm('game')
        // document.getElementById("user-list").value = "";
    }


    handleInvitation = (e) => {
        e.preventDefault();
        // console.log("handle Invitation triggered!");
        switch (e.target.value) {
            case "Invite":
                e.target.value = "Cancel";
                break;
            case "Cancel":
                e.target.value = "Invite";
                break;
            default:
                return null;
        }
    }

    changeText = (text) => {

  this.setState({ text });
}

    render() {
        var currentUsersList = this.state.currentUsers
        var invitationText = this.state.invitationText
        // console.log ("this.state.invitationText: " + this.state.invitationText)

        return (
            <div className="website-styles center-main-container lobby-page">
                <div>

                    <h3 className="badge-success centered title">

                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Something went wrong...'}
                    </h3>
                </div>
                <div className="flex-wrapper button-group-padding btn-group margin-top-zero">
                    <button className="btn btn-sm btn-success margin-top-zero" onClick={this.playGame}>Look at gameboard layout</button>
                    <button className="btn btn-sm btn-success margin-top-zero" onClick={this.props.handleLogout}>Logout</button>
                </div>
                <div className="offset-from-border">
                    Active players: {this.state.numbersOfPlayers}
                </div>
                <div>
                    <div id="user-list" className="div-scrollable">
                        {currentUsersList
                            .filter(person => person.username !== this.props.user)
                            .map((current_person, index) => (
                            <div key={index} className="current-users flex-wrapper task-wrapper">
                                <div style={{flex: 7}}>
                                    <span>{current_person['username']}</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <button id={"invitationButton-" + index} className="btn btn-sm btn-outline-info" onClick={ (e) => {this.handleInvitation(e)}}>{invitationText}</button>
                                </div>
                                <div style={{flex: 1}}>
                                    <button id={"chatButton-" + index} className="btn btn-sm btn-outline-dark">Chat</button>
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

