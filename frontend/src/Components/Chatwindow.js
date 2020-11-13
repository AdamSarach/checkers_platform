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
    document.getElementById("chat-log").value += (data.user + ":  " + data.message + '\n');
    // document.getElementById("chat-log").innerHTML += (<span style={{fontWeight: "bold"}}> data.user + ":  " </span>+ data.message + '\n');
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

    }

    onResetInfoMessage = () => {
        this.setState(
            {'infoMessage': ''}
        )
    }

    clickEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleChatMessage();
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


    render() {

        return (
                <React.Fragment>
                    <div id="chat-log" disabled></div>
                    <input id="chat-message-input"
                           type="text"
                           onKeyPress={this.clickEnter}
                           placeholder="Press enter to send a message..."
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
                </React.Fragment>

        )
    }
}

export default Chatwindow;
