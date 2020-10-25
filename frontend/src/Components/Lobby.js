import React from "react";
import Chatwindow from "./Chatwindow";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: ["There are no other players online right now, please wait"],
            numbersOfPlayers: 1,
            invitationText: "Invite",
            buttonList: [],
            sentInvitations: [],
            receivedInvitations: [],
        }
    }

    async componentDidMount() {
        try {
            const activeUsersResponse = await this.getActiveUsers();
            if (activeUsersResponse.ok) {
                let json = await activeUsersResponse.json()
                let userList = json["active_users"];
                let listWithoutClientName = userList.filter(person => person !== this.props.user);
                this.setState({
                    currentUsers: listWithoutClientName,
                    numbersOfPlayers: userList.length
                });
            }
        } catch (error) {
            console.log(error);
        }
        this.produceButtonValues(this.state.currentUsers);
    }

    produceButtonValues = (currentUsersList) => {
        let inputList = currentUsersList
            .map((nickname) => {
                    return ({
                        [nickname]: {
                            "inviteButtonValue": "Invite",
                            "chatButtonValue": "Chat"
                        }
                    })
                }
            );
        this.setState({buttonList: inputList});
    }

    getActiveUsers() {
        return fetch('http://localhost:8000/api-auth/active_users/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    };

    playGame = () => {
        this.props.displayForm('game')
    }

    runNewIndividualWebSocket = (sender, receiver) => {
        const roomName = "communication";

        const communicationSocket = new WebSocket(
            'ws://'
            + window.location.host
            + roomName
            + sender
            + '/'
            + receiver
            + '/'
        );
    }




    handleInvitation = (e) => {
        e.preventDefault();
        let buttonList = this.state.buttonList;
        let sentInvitations = this.state.sentInvitations;
        let id = e.target.id;
        const name = id.substring(id.indexOf('-') + 1);
        for (let i = 0; i < buttonList.length; i++) {
            if (name in buttonList[i]) {
                if (buttonList[i][name].inviteButtonValue === "Invite") {
                    buttonList[i][name].inviteButtonValue = "Cancel";
                    sentInvitations.push(name);
                    this.setState({sentInvitations: sentInvitations});
                    this.setState({buttonList: buttonList});
                    break;
                } else {
                    buttonList[i][name].inviteButtonValue = "Invite";
                    const index = sentInvitations.indexOf(name);
                    if (index > -1) {
                        sentInvitations.splice(index, 1);
                        this.setState({sentInvitations: sentInvitations});
                    } else {
                        console.warn("Warning regarding invitation handling");
                    }
                    this.setState({buttonList: buttonList});
                    break;
                }
            }
        }
    }

    render() {
        let currentUsersList = this.state.currentUsers;

        return (
            <div className="website-styles center-main-container lobby-page">
                <div>
                    <h3 className="badge-success centered title">
                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Please log out and log in again...'}
                    </h3>
                </div>
                <div className="flex-wrapper button-group-padding btn-group margin-top-zero">
                    <button className="btn btn-sm btn-success margin-top-zero" onClick={this.playGame}>Look at gameboard
                        layout
                    </button>
                    <button className="btn btn-sm btn-success margin-top-zero"
                            onClick={this.props.handleLogout}>Logout
                    </button>
                </div>
                <div className="offset-from-border">
                    Active players: {this.state.numbersOfPlayers}
                </div>
                <div>
                    <div id="user-list" className="div-scrollable">
                        {/*Todo - check if any other players are online*/}
                        {/*if ({this.state.numbersOfPlayers <2}) {*/}
                        {/*        <div key={index} className="current-users flex-wrapper task-wrapper">*/}
                        {/*                <div style={{flex: 7}}>*/}
                        {/*                    <span>currentUsersList[0]</span>*/}
                        {/*                </div>*/}
                        {/*    } else*/}
                        {currentUsersList
                            .map((person, index) => (
                                <div key={index} className="current-users flex-wrapper task-wrapper">
                                    <div style={{flex: 7}}>
                                        <span>{person}</span>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <button id={index + "_invitationButton-" + person}
                                                className="btn btn-sm btn-outline-info"
                                                onClick={(e) => {
                                                    this.handleInvitation(e)
                                                }}
                                        >{(this.state.buttonList.length > 1) ? this.state.buttonList[index][person].inviteButtonValue : "Wassup"}
                                        </button>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <button id={"chatButton-" + index}
                                                className="btn btn-sm btn-outline-dark">Chat
                                        </button>
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

