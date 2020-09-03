import React from 'react';
import { Typography, Container } from '@material-ui/core';
import io from 'socket.io-client';
import Store from 'electron-store';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { remote } = require('electron');
const { screen } = remote;
const size = screen.getPrimaryDisplay().size;
const fs = require('fs');
const console = require('electron').remote.require('console');

// eslint-disable-next-line @typescript-eslint/no-var-requires
type StoreType = {
  botUrl: string;
};
const store = new Store<StoreType>();
var fontsize = store.get("fontSize", "50"); //fontsizeをstoreから呼び出し

const nicoJS = require('nicoJS');
const nico = new nicoJS({
  app: document.getElementById('contents'),
  width: size.width,
  height: Math.round(size.height*0.95),
  color: "white",
  font_size: fontsize,
  speed: 10,
});

nico.listen(); //入力待ちかな

const defaultBotUrl = 'http://localhost:3000';

const botUrl = store.get('botUrl', defaultBotUrl);

const socketio = io(botUrl); //connectionを呼び出す

const App: React.FC = () => {
  nico.send('This is NicoDisplay APP!(Bot URL: ' + botUrl + ')');

  socketio.on('message', function (chatmsg: string) {  //待ってる
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
