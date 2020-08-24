import React, { useState } from 'react';
import { Typography, Container } from '@material-ui/core';
import io from 'socket.io-client';
import Store from 'electron-store';

const defaultBotUrl = 'http://localhost:3000';
type StoreType = {
  botUrl: string;
};

const store = new Store<StoreType>();
const botUrl = store.get('botUrl', defaultBotUrl);

const socketio = io(botUrl);

const App: React.FC = () => {
  const [msgList, setMsgList] = useState([
    'This is Subtitlebar APP!(Bot URL: ' + botUrl + ')',
  ]);

  socketio.on('message', function (chatmsg: string) {
    console.log(chatmsg);
    const msgListCopy = msgList;
    if (msgListCopy.length >= 20) {
      msgListCopy.pop();
    }
    setMsgList([chatmsg, ...msgListCopy]);
  });

  return (
    <Container>
      <Typography variant="h3" component="h1" className="caption">
        <ul>
          {msgList.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </Typography>
    </Container>
  );
};

export default App;
