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
                {/*<p>Extra window</p>*/}
                {/*<div id="communication-window">*/}
                {/*    <textarea className="border-padding border-padding-larger" id="communication-log" cols="40" rows="4"*/}
                {/*              disabled></textarea>*/}
                {/*    <br/>*/}
                {/*    <div className="flex-wrapper">*/}
                {/*        <input className="pull-left border-padding border-padding-larger border-padding-lastitem"*/}
                {/*               id="communication-message-input"*/}
                {/*               type="text"*/}
                {/*               size="40"*/}
                {/*               onKeyPress={this.props.clickTab}*/}
                {/*               style={{flex: 7}}*/}
                {/*               placeholder="Write something..."*/}
                {/*        />*/}
                {/*        <br/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Chatwindow;
