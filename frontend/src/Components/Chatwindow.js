import React from "react";

const roomName = 'all';

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    document.getElementById("chat-log").value += (data.user + ": " + data.message + '\n');
    const chatarea = document.getElementById('chat-log');
    chatarea.scrollTop = chatarea.scrollHeight;
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};







class Chatwindow extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log("Chat window, componentdidmount: " + this.props.user);
        //Communication Socket ->>>>>
        const communicationRoomName = this.props.user;
        // const communicationRoomName = "meme";
        // console.log(this.props.user);
        // console.log(communicationRoomName);
        this.communicationSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/communication/'
            + communicationRoomName
            + '/'
        );

        this.communicationSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            //To-do: parse userSender and add him to receivedInvitations state in Lobby - extra funnction to be trigerred
            document.getElementById("communication-log").value += (data.user + " to " + data.receiver + ": " + data.message + '\n');
            const communicationarea = document.getElementById('communication-log');
            communicationarea.scrollTop = communicationarea.scrollHeight;
        };

        this.communicationSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };

        //<<<<-Communication Socket
    }

    onResetInfoMessage = () => {
        this.setState(
            {'infoMessage': ''}
        )
    }

    clickEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleChatMessage();
            // document.getElementById("chat-message-submit").click();
        }
    };

    clickTab = (e) => {
        if (e.key === 'Enter') {
            this.handleCommunicationMessage();
            // document.getElementById("chat-message-submit").click();
        }
    };


    handleChatMessage = (e) => {
        console.log("Chat window, handlechatmessage: " + this.props.user);
        const element = document.getElementById("chat-message-input");
        const message = element.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'user': this.props.user,

        }));
        element.value = '';
    }

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


    render() {

        return (
            <div>
                <div id="chat-window">
                    <textarea className="border-padding border-padding-larger" id="chat-log" cols="40" rows="4"
                              disabled></textarea>
                    <br/>
                    <div className="flex-wrapper">
                        <input className="pull-left border-padding border-padding-larger border-padding-lastitem"
                               id="chat-message-input"
                               type="text"
                               size="40"
                               onKeyPress={this.clickEnter}
                               style={{flex: 7}}
                               placeholder="Write something..."
                        />
                        <br/>
                        {/*<input*/}
                        {/*    className="pull-right"*/}
                        {/*    id="chat-message-submit"*/}
                        {/*    type="button"*/}
                        {/*    value="Send"*/}
                        {/*    onClick={this.handleChatMessage}*/}
                        {/*    style={{flex: 1}}*/}
                        {/*/>*/}
                    </div>
                </div>
                <p>Extra window</p>
                <div id="communication-window">
                    <textarea className="border-padding border-padding-larger" id="communication-log" cols="40" rows="4"
                              disabled></textarea>
                    <br/>
                    <div className="flex-wrapper">
                        <input className="pull-left border-padding border-padding-larger border-padding-lastitem"
                               id="communication-message-input"
                               type="text"
                               size="40"
                               onKeyPress={this.clickTab}
                               style={{flex: 7}}
                               placeholder="Write something..."
                        />
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chatwindow;
