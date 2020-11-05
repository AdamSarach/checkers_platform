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
            const onlineUsersResponse = await this.getActiveUsers();
            const gameUsersResponse = await this.getInGameUsers();
            const lobbyState = await this.getPlayersInLobby(onlineUsersResponse, gameUsersResponse);
            const buttons = await this.produceButtonValues(lobbyState.userList);
            const lobbyUpdated = await this.updateLobbyState(lobbyState.userList, lobbyState.numberOfPlayers, buttons)
        } catch (error) {
            console.warn(error);
        }

        // this.produceButtonValues(this.state.currentUsers);

        //Individual Communication Socket ->>>>>
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

            switch (data.info) {
                case 'invite':
                    receivedInvitations.push(userSender);
                    this.setState({receivedInvitations: receivedInvitations});
                    break;
                case 'cancel':
                    const receiveIndex = receivedInvitations.indexOf(userSender);
                    if (receiveIndex > -1) {
                        receivedInvitations.splice(receiveIndex, 1);
                        this.setState({receivedInvitations: receivedInvitations});
                    }
                    break;
                case 'reject':
                    let sentInvitations = this.state.sentInvitations;
                    let buttonList = this.state.buttonList;
                    // console.log("Sent invs: ", sentInvitations);
                    // console.log("Reject sent from: ", userSender);
                    const sendIndex = sentInvitations.indexOf(userSender);
                    if (sendIndex > -1) {
                        sentInvitations.splice(sendIndex, 1);
                        // console.log("Sent invs: ", sentInvitations);
                        this.setState({sentInvitations: sentInvitations});
                        for (let i = 0; i < buttonList.length; i++) {
                            if (userSender in buttonList[i]) {
                                buttonList[i][userSender].inviteButtonValue = "Invite";
                                this.setState({buttonList: buttonList});
                                break;
                            }
                        }
                    }
                    console.warn("Communication message: Player not seen in online list")
                    break;
                case 'accept':
                    console.log("game accepted!")
                    this.props.setOpponent(userSender);
                    this.props.makeFirstPlayer();
                    this.props.setGameDB("in")
                        .then(() => {
                            this.informLobbyGamePlayers([this.props.user, userSender], "notlobby")
                        })
                    this.props.playGame();
                    break;
                default:
                    console.error("communication message error");

            }
        };

        this.communicationSocket.onclose = function (e) {
            console.error('Communication socket closed unexpectedly');
        };
        //<<<<- IndividualCommunication Socket


        //Communication Global Socket ->>>>>
        this.communicationGlobalSocket = await new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/communication-global/'
        );

        this.communicationGlobalSocket.onmessage = (e) => {
            if (this.props.displayedScreen === "game") {
                return;
            }
            const data = JSON.parse(e.data);

            if ('ignored_consumers' in data) {
                console.group("TO CHECK...")
                console.log("ignored consumers received")
                if (!(data.ignored_consumers.includes(this.props.user))) {
                    this.getOnlineAndGamers()
                        .then(([online, gamers]) => {
                            console.log("online: ", online)
                            console.log("gamers: ", gamers)
                            const newLobbyState = this.getPlayersInLobby(online, gamers);
                            console.log("new lobby state: ", newLobbyState)
                            const newButtons = this.getNewButtonList(data.ignored_consumers, data.mode)
                            console.log("newButtons: ", newButtons)
                            console.groupEnd()
                            const newLobbyUpdated = this.updateLobbyState(newLobbyState.userList, newLobbyState.numberOfPlayers, newButtons)
                        })

                }

            } else {
                const userSender = data.user_sender;
                let users = this.state.currentUsers;
                switch (data.info) {
                    case 'login-noticed':
                        if (userSender === this.props.user) {
                            break;
                        } else {
                            if (!(this.state.currentUsers.includes((userSender)))) {
                                users.push(userSender);
                                const buttonList = this.getNewButtonList([userSender], "lobby");
                                this.setState({
                                    currentUsers: users,
                                    buttonList: buttonList,
                                    numbersOfPlayers: users.length + 1
                                });
                            }
                        }
                        break;
                    case 'logout-noticed':
                        if (userSender === this.props.user) {
                            console.log("Logout noticed from you");
                            break;
                        } else {
                            const logoutIndex = users.indexOf(userSender);
                            if (logoutIndex > -1) {
                                users.splice(logoutIndex, 1);
                                const buttonList = this.getNewButtonList([userSender], "notlobby");
                                this.setState({
                                    currentUsers: users,
                                    buttonList: buttonList,
                                    numbersOfPlayers: users.length + 1
                                });
                            }
                            break;
                        }
                    default:
                        console.error("communication message error");
                }
            }


        };

        this.communicationGlobalSocket.onclose = function (e) {
            console.error('Communication Global Socket closed unexpectedly');
        };


        this.communicationGlobalSocket.onopen = () => {
            if (this.props.finishedGameRecently === true) {
                console.log("FROM GAME TO LOBBY")
                this.props.finishedGameRecentlyProp(false);
            }
            ;
            this.communicationGlobalSocket.send(JSON.stringify({
                'userSender': this.props.user,
                'info': "login-noticed"
            }));

        }
        //<<<<-CommunicationGlobal Socket
    }


    updateLobbyState = (lobbyList, number, buttonList) => {
        this.setState({
            currentUsers: lobbyList,
            numbersOfPlayers: number,
            buttonList: buttonList
        });
    }


    informLobbyGamePlayers = (ignoredConsumers, mode) => {
        this.communicationGlobalSocket.send(JSON.stringify({
            'ignoredConsumers': ignoredConsumers,
            'mode': mode
        }));
    }

    getPlayersInLobby = (onlinePlayersJson, gamePlayersJson) => {
        let userList = onlinePlayersJson["active_users"];
        let gameUserList = gamePlayersJson["game_users"];
        const number = userList.length
        const filteredList = this.subtractLists(userList, gameUserList)
        let lobbyList = filteredList.filter(person => person !== this.props.user);
        return {
            "userList": lobbyList,
            "numberOfPlayers": number
        };
    }

    subtractLists = (mainList, subtractList) => {
        return mainList.filter(user => !subtractList.includes(user))
    }

    produceButtonValues = (currentUsersList) => {
        return currentUsersList
            .map((nickname) => {
                    return ({
                        [nickname]: {
                            "inviteButtonValue": "Invite",
                            "chatButtonValue": "Chat"
                        }
                    })
                }
            );
    }

    getNewButtonList = (names, strategy) => {
        let list = this.state.buttonList;
        if (strategy === "lobby") {
            for (const name of names) {
                let newState = {
                    [name]: {
                        "inviteButtonValue": "Invite",
                        "chatButtonValue": "Chat"
                    }
                }
                list.push(newState)
            }
            return list;

        } else if (strategy === "notlobby") {
            for (const name of names) {
                for (let i = 0; i < list.length; i++) {
                    if (name in list[i]) {
                        list.splice(i, 1);
                    }
                }
            }
            return list;

        } else {
            console.warn("getNewButtonList warning")
        }
    }


    getActiveUsers() {
        const url = 'http://' + window.location.host + '/api-auth/active_users/'
        return fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
    };

    getInGameUsers() {
        const url = 'http://' + window.location.host + '/api-auth/game_users/'
        return fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
    };


    getOnlineAndGamers = () => {
        return Promise.all([this.getActiveUsers(), this.getInGameUsers()])
    }


    acceptOrRejectInvitation = (e) => {
        e.preventDefault();
        const button = e.target.textContent;
        let id = e.target.id;
        const name = id.substring(id.indexOf('-') + 1)
        if (button === "Accept") {
            this.props.setGameDB("in");
            this.communicationSocket.send(JSON.stringify({
                'userSender': this.props.user,
                'user': name,
                'info': "accept"
            }));
            this.props.setOpponent(name);
            this.props.playGame();
            console.log("Game is starting!")
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
                    console.log(`Invitation sent to : ${this.props.user}`)
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

    prepareLogout = () => {
        this.communicationGlobalSocket.send(JSON.stringify({
            'userSender': this.props.user,
            'info': "logout-noticed"
        }));
        try {
            this.communicationGlobalSocket.close()
        } catch (error) {
            console.log("Chat ended properly")
        }
        this.props.handleLogout();
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
                <div>
                    <div className="offset-from-border">
                        Active players: {this.state.numbersOfPlayers}
                    </div>
                    <button className="btn btn-sm btn-secondary margin-top-zero close-to-right"
                            onClick={this.prepareLogout}>Logout
                    </button>

                </div>


                <div>
                    <div id="user-list" className="div-scrollable">
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

