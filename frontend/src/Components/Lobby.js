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
            opponentPlayer: ''
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

        //Communication Socket ->>>>>
        const communicationRoomName = this.props.user;
        this.communicationSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/communication/'
            + communicationRoomName
            + '/'
        );

        this.communicationSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            // console.log(Object.keys(data));
            const userSender = data.user_sender;
            let receivedInvitations = this.state.receivedInvitations;

            if (data.info === 'invite') {
                receivedInvitations.push(userSender);
                this.setState({receivedInvitations: receivedInvitations});
            } else if (data.info === 'cancel') {
                const index = receivedInvitations.indexOf(userSender);
                if (index > -1) {
                    receivedInvitations.splice(index, 1);
                    this.setState({receivedInvitations: receivedInvitations});
                }
            } else if (data.info === 'reject') {
                let sentInvitations = this.state.sentInvitations;
                let buttonList = this.state.buttonList;
                console.log("Sent invs: ", sentInvitations);
                console.log("Reject sent from: ", userSender);
                const index = sentInvitations.indexOf(userSender);
                if (index > -1) {
                    sentInvitations.splice(index, 1);
                    console.log("Sent invs: ", sentInvitations);
                    this.setState({sentInvitations: sentInvitations});
                    for (let i = 0; i < buttonList.length; i++) {
                        if (userSender in buttonList[i]) {
                            buttonList[i][userSender].inviteButtonValue = "Invite";
                            this.setState({buttonList: buttonList});
                            break;
                        }
                    }
                }
            } else if (data.info === 'accept') {
                console.log("game accepted!")
                this.props.setOpponent(userSender);
                this.props.playGame();

            } else {
                console.error("Invitation message handling error");
            }

        };

        this.communicationSocket.onclose = function (e) {
            console.error('Communication socket closed unexpectedly');
        };

        //<<<<-Communication Socket
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


    clickTab = (e) => {
        if (e.key === 'Enter') {
            this.handleCommunicationMessage();
            // document.getElementById("chat-message-submit").click();
        }
    };

    handleCommunicationMessage = (e) => {
        console.log("Communication window, handlechatmessage: " + this.props.user);
        const element = document.getElementById("communication-message-input");
        const message = element.value;
        this.communicationSocket.send(JSON.stringify({
            'data': {
                'message': message,
                'state': ''
            },
            'userSender': this.props.user,
            'receiver': 'sara'
        }));
        element.value = '';
    }

    acceptOrRejectInvitation = (e) => {
        e.preventDefault();
        const button = e.target.textContent;
        let id = e.target.id;
        const name = id.substring(id.indexOf('-') + 1)
        if (button === "Accept") {
            this.communicationSocket.send(JSON.stringify({
                'userSender': this.props.user,
                'user': name,
                'info': "accept"
            }));
            this.props.setOpponent(name);
            this.props.playGame();
            console.log("game accepted!")
        } else if (button === "Reject") {
            const receivedInvitations = this.state.receivedInvitations;
            const index = receivedInvitations.indexOf(name);
            if (index > -1) {
                receivedInvitations.splice(index, 1);
                this.setState({receivedInvitations: receivedInvitations});
                this.communicationSocket.send(JSON.stringify({
                    'userSender': this.props.user,
                    'user': name,
                    'info': "reject"
                }));
            }

        } else {
            console.error("Problem with game invitation")
        }
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
                    this.communicationSocket.send(JSON.stringify({
                        'userSender': this.props.user,
                        'user': name,
                        'info': "invite"
                    }));
                    console.log(`Message has been sent to communicationSocket:                         
                        'userSender': ${this.props.user},
                        'user': ${name}`)
                    break;
                } else {
                    buttonList[i][name].inviteButtonValue = "Invite";
                    const index = sentInvitations.indexOf(name);
                    if (index > -1) {
                        sentInvitations.splice(index, 1);
                        this.setState({sentInvitations: sentInvitations});
                        this.communicationSocket.send(JSON.stringify({
                            'userSender': this.props.user,
                            'user': name,
                            'info': "cancel"
                        }));
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
        const people = this.state.receivedInvitations;
        return (
            <div className="website-styles center-main-container lobby-page">
                <div>
                    <h3 className="badge-success centered title">
                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Please log out and log in again...'}
                    </h3>
                </div>
                <div className="flex-wrapper button-group-padding btn-group margin-top-zero">
                    <button className="btn btn-sm btn-success margin-top-zero" onClick={() => this.props.playGame()}>Look at gameboard
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
                                    {people.includes(person) &&
                                    <React.Fragment>
                                        <div style={{flex: 1}}>
                                            <button id={index + "_acceptButton-" + person}
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={(e) => {
                                                        this.acceptOrRejectInvitation(e)
                                                    }}>Accept
                                            </button>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <button id={index + "_rejectButton-" + person}
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                        this.acceptOrRejectInvitation(e)
                                                    }}>Reject
                                            </button>
                                        </div>
                                    </React.Fragment>
                                    }
                                    {!people.includes(person) &&
                                    <div style={{flex: 1}}>
                                        <button id={index + "_invitationButton-" + person}
                                                className="btn btn-sm btn-outline-dark"
                                                onClick={(e) => {
                                                    this.handleInvitation(e)
                                                }}
                                        >{(this.state.buttonList.length > 1) ? this.state.buttonList[index][person].inviteButtonValue : "Wassup"}
                                        </button>
                                    </div>
                                    }
                                    {/*<div style={{flex: 1}}>*/}
                                    {/*    <button id={"chatButton-" + index}*/}
                                    {/*            className="btn btn-sm btn-outline-dark">Chat*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
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

