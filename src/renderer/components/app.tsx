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
const child_process = require("child_process");

// eslint-disable-next-line @typescript-eslint/no-var-requires

//test領域

// storeからプロパティ呼び出し
type StoreType = {
  botUrl: string;
};

const store = new Store<StoreType>();
var stored_fontsize = store.get("stored_fontsize", "50");
var randomFontSize = store.get("randomFontSize", false);
var stored_color = store.get("color", "#ffffff");
var randomColor = store.get("randomColor", false);
var authorColor = store.get("authorColor", false);
// fontsize, colorがrandom=trueであればrandom
if (randomFontSize) {
  var fontsize = Math.floor(Math.random() * 50) + 40;
} else {
  var fontsize = Number(stored_fontsize);
};
if (randomColor) {
  var color = "#";
  for(var i = 0; i < 6; i++) {
      color += (16*Math.random() | 0).toString(16);
  };
} else {
  var color = stored_color;
};

const nicoJS = require('nicoJS');
const nico = new nicoJS({
  app: document.getElementById('contents'),
  width: size.width,
  height: Math.round(size.height*0.85),
  color: "white",
  font_size: 100, //はみだし回避のためフォントサイズを100で開始
  speed: 10,
});

nico.listen(); //入力待ちかな

const defaultBotUrl = 'http://localhost:3000';

const botUrl = store.get('botUrl', defaultBotUrl);

const socketio = io(botUrl); //connectionを呼び出す

const App: React.FC = () => {
  //nico.send('This is NicoDisplay APP!(Bot URL: ' + botUrl + ')', color, 50);
  nico.send("fs:" + fontsize + ", rfs:" + randomFontSize + ", c:" + color + ", rc:" + randomColor, color, 50);

  // socketio.on('message', function (chatmsg: string) {  //待ってる
  // socketio.on('message', function (message_data:string) { //jsonを受け取る
  socketio.on('message', function (author_name:string, content:string) {
    // let author_name:string = "";
    // let content:string = "";
    // try {
    //   const message = JSON.parse(message_data);
    //   if (message.author_name !== undefined) {
    //     author_name = message.author_name;
    //   }
    //   if (message.content !== undefined) {
    //     content = message.content;
    //   }
    // } catch (error) {
    //   alert("Botのメッセージ形式が違います。");
    //   return
    // }
    // console.log(chatmsg);
    //以下フォントサイズ処理
    if (randomFontSize) {
      var fontsize = Math.floor(Math.random() * 50) + 40;
    } else {
      var fontsize = Number(stored_fontsize);
    };
    //以下カラー処理
    if (authorColor) { //人ごとにカラー変更
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      settings.authors_list.forEach((auth:any) => {
        if (author_name === auth.name) {
          color = auth.color;
          // console.log("Match", auth.color);
        };
      });
      if (typeof color === 'undefined') { //jsonを参照し、データになければ追加
        var color = "#";
        for(var i = 0; i < 6; i++) {
            color += (16*Math.random() | 0).toString(16);
        };
        // const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
        settings.authors_list.push({name: author_name, color: color});
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
      };
    } else if (randomColor) { //random
      var color = "#";
      for(var i = 0; i < 6; i++) {
          color += (16*Math.random() | 0).toString(16);
      };
    } else { //指定された色
      var color = stored_color;
    };
    console.log(color);
    //以下アニメーション処理
    if (content.includes("雪") || content.includes("snow")) {
      //nico_settings.json読み込み
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      if (Number(settings.now_layer) < Number(settings.max_layer)) {
        settings.now_layer = String(Number(settings.now_layer) + 1);
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        child_process.exec('npm start --prefix precipitate_snow', {encoding: 'Shift_JIS'}, (error:any, stdout:any, stderr:any) => {
            if (error) {
                //console.log(stderr);
                //console.log("Failed");
            }
            else {
                //console.log(stdout);  // dir の出力を表示
                //console.log("OK");
            }
        });
      }
    } else if (content.includes("8888")) {
      //nico_settings.json読み込み
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      if (Number(settings.now_layer) < Number(settings.max_layer)) {
        settings.now_layer = String(Number(settings.now_layer) + 1);
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        child_process.exec('npm start --prefix precipitate_paper', {encoding: 'Shift_JIS'}, (error:any, stdout:any, stderr:any) => {
            if (error) {
                //console.log(stderr);
                //console.log("Failed");
            }
            else {
                //console.log(stdout);  // dir の出力を表示
                //console.log("OK");
            }
        });
      }
    } else {
      //pass;
    };
    var chatmsg = `${author_name}:${content}`;
    nico.send(chatmsg, color, fontsize);
    //以下読み上げ処理
  });

  return (
    <Container>
      <Typography variant="h3" component="h1" className="caption"></Typography>
    </Container>
  );
};

export default App;
