import React from "react";
import Chatwindow from "./Chatwindow";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: ["TestUser1", "TestUser2"],
            numbersOfPlayers: 2,
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
        console.log(this.state.buttonList);
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

        // if (buttonList[i].key === name) {
        //     console.log(name);
        // }
    }

    // buttonList[name].inviteButtonValue = "Cancel";
    // this.setState({buttonList: buttonList});
    // switch (e.target.value) {
    //     case "Invite":
    //         e.target.value = "Cancel";
    //         break;
    //     case "Cancel":
    //         e.target.value = "Invite";
    //         break;
    //     default:
    //         return null;
    // }


    changeText = (text) => {

        this.setState({text});
    }

    render() {
        let currentUsersList = this.state.currentUsers;
        // console.log(this.state.buttonList);

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

