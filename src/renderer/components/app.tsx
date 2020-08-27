import React from 'react';
import { Typography, Container } from '@material-ui/core';
import io from 'socket.io-client';
import Store from 'electron-store';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { remote } = require('electron');
const { screen } = remote;
const size = screen.getPrimaryDisplay().size;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nicoJS = require('nicoJS');
const nico = new nicoJS({
  app: document.getElementById('contents'),
  width: size.width,
  height: size.height,
});

nico.listen();

const defaultBotUrl = 'http://localhost:3000';
type StoreType = {
  botUrl: string;
};

const store = new Store<StoreType>();
const botUrl = store.get('botUrl', defaultBotUrl);

const socketio = io(botUrl);

const App: React.FC = () => {
  nico.send('This is NicoDisplay APP!(Bot URL: ' + botUrl + ')');

  socketio.on('message', function (chatmsg: string) {
    console.log(chatmsg);
    nico.send(chatmsg);
  });

  return (
    <Container>
      <Typography variant="h3" component="h1" className="caption"></Typography>
    </Container>
  );
};

export default App;
