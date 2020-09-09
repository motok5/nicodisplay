import React from 'react';
import { Typography, Container } from '@material-ui/core';
import io from 'socket.io-client';
import Store from 'electron-store';
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { remote } = require('electron');
const { screen } = remote;
const size = screen.getPrimaryDisplay().size;
const fs = require('fs');
const console = require('electron').remote.require('console');
const child_process = require("child_process");
const nicoJS = require('nicoJS');
const dir = remote.app.getAppPath();
const snowURL = `${dir}/assets/precipitate_snow/index.html`;
const paperURL = `${dir}/assets/precipitate_paper/index.html`;

// eslint-disable-next-line @typescript-eslint/no-var-requires

try {
  const json_exist = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
  json_exist.now_layer = "0";
} catch(error) {
  const make_json = {"color":"yellow","speed":"1","font_size":"50","speak":"false","show_image":"false","bot_url":"http://localhost:3000","max_layer":"5","now_layer":"0","authors_list":[{"name":"mr.bot","fontsize":50,"color":"#000000","tableData":{"id":0}}]}
  fs.writeFileSync('./nico_settings.json', JSON.stringify(make_json));
}

const defaultBotUrl = 'http://localhost:3000';
// storeからプロパティ呼び出し
type StoreType = {
  botUrl: string;
};

const store = new Store<StoreType>();
var botUrl = store.get('botUrl', defaultBotUrl);
var simple_settings = store.get("simpleSettings", false);
var advanced_settings = store.get("advancedSettings", false);
var stored_fontsize = store.get("stored_fontsize", "50");
var randomFontSize = store.get("randomFontSize", false);
var stored_color = store.get("color", "#ffffff");
var randomColor = store.get("randomColor", false);

const nico = new nicoJS({
  app: document.getElementById('contents'),
  width: size.width,
  height: Math.round(size.height*0.85),
  color: "white",
  font_size: 100, //はみだし回避のためフォントサイズを100で開始
  speed: 10,
});

nico.listen(); //入力待ちかな

const socketio = io(botUrl); //connectionを呼び出す

const App: React.FC = () => {
  nico.send('This is NicoDisplay APP!(Bot URL: ' + botUrl + ')', "white", 50);
  socketio.on('message', function (message_data:string) { //jsonを受け取る
    // 初期化
    let author_name:string = "";
    let content:string = "";
    let fontsize:number = 0;
    let color:string = "";
    // message_dataが正しいか判断
    try {
      const message = JSON.parse(message_data);
      if (message.author_name !== undefined) {
        author_name = message.author_name;
      }
      if (message.content !== undefined) {
        content = message.content;
      }
    } catch (error) {
      alert("Botのメッセージ形式が違います。");
      return
    }
    // author_nameがあり、jsonファイルに無ければ追加
    if (author_name !== "") {
      let author_exist:boolean = false;
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      settings.authors_list.forEach((auth:any) => {
        if (author_name === auth.name) {
          author_exist = true;
        };
      });
      if (!author_exist) {
        settings.authors_list.push({name: author_name, color: "white", fontsize: "50"});
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
      }
      if (advanced_settings) {
        const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
        settings.authors_list.forEach((auth:any) => {
          if (author_name === auth.name) {
            fontsize = Number(auth.fontsize);
            if (fontsize === 0) {
              fontsize = 50;
            }
            color = auth.color;
          };
        });
      } else {
        if (randomFontSize) {
          fontsize = Math.floor(Math.random() * 50) + 40;
        } else {
          fontsize = Number(stored_fontsize);
        };
        if (randomColor) { //random
          color = "#";
          for(var i = 0; i < 6; i++) {
            color += (16*Math.random() | 0).toString(16);
          };
        } else { //指定された色
          color = stored_color;
        };
      }
    } else {
      if (randomFontSize) {
        fontsize = Math.floor(Math.random() * 50) + 40;
      } else {
        fontsize = Number(stored_fontsize);
      };
      if (randomColor) { //random
        color = "#";
        for(var i = 0; i < 6; i++) {
          color += (16*Math.random() | 0).toString(16);
        };
      } else { //指定された色
        color = stored_color;
      };
    }
    //以下アニメーション処理
    if (content.includes("雪") || content.includes("snow")) {
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      if (Number(settings.now_layer) < Number(settings.max_layer)) {
        settings.now_layer = String(Number(settings.now_layer) + 1);
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        var snowWindow:any = new BrowserWindow({
          x: 0,
          y: 0,
          width: size.width,
          height: Math.round(size.height*0.95),
          frame: false,
          transparent: true,
          alwaysOnTop: true,
          resizable: true,
          hasShadow: false,
          skipTaskbar: true,
          show: true,
          webPreferences: {
            nodeIntegration: true,
          }
        });
        snowWindow.setIgnoreMouseEvents(true);
        snowWindow.loadURL(snowURL);
        snowWindow.on('closed', function () {
            snowWindow = null;
            const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
            settings.now_layer = String(Number(settings.now_layer) - 1);
            fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        });
      }
    } else if (content.includes("8888")) {
      const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
      if (Number(settings.now_layer) < Number(settings.max_layer)) {
        settings.now_layer = String(Number(settings.now_layer) + 1);
        fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        var paperWindow:any = new BrowserWindow({
          x: 0,
          y: 0,
          width: size.width,
          height: size.height,
          frame: false,
          transparent: true,
          alwaysOnTop: true,
          resizable: true,
          hasShadow: false,
          skipTaskbar: true,
          show: true,
          webPreferences: {
            nodeIntegration: true,
          }
        });
        paperWindow.setIgnoreMouseEvents(true);
        paperWindow.loadURL(paperURL);
        paperWindow.on('closed', function () {
            paperWindow = null;
            const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
            settings.now_layer = String(Number(settings.now_layer) - 1);
            fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
        });
      }
    } else {
      //pass
    }
    // if (content.includes("雪") || content.includes("snow")) {
    //   //nico_settings.json読み込み
    //   const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
    //   if (Number(settings.now_layer) < Number(settings.max_layer)) {
    //     settings.now_layer = String(Number(settings.now_layer) + 1);
    //     fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
    //     child_process.exec('npm start --prefix precipitate_snow', {encoding: 'Shift_JIS'}, (error:any) => {
    //         if (error) {
    //             //console.log(stderr);
    //             //console.log("Failed");
    //             // pass;
    //         }
    //         else {
    //             //console.log(stdout);  // dir の出力を表示
    //             //console.log("OK");
    //         }
    //     });
    //   }
    // } else if (content.includes("8888")) {
    //   //nico_settings.json読み込み
    //   const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
    //   if (Number(settings.now_layer) < Number(settings.max_layer)) {
    //     settings.now_layer = String(Number(settings.now_layer) + 1);
    //     fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
    //     child_process.exec('npm start --prefix precipitate_paper', {encoding: 'Shift_JIS'}, (error:any) => {
    //         if (error) {
    //             //console.log(stderr);
    //             //console.log("Failed");
    //         }
    //         else {
    //             //console.log(stdout);  // dir の出力を表示
    //             //console.log("OK");
    //         }
    //     });
    //   }
    // } else {
    //   //pass;
    // };
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
