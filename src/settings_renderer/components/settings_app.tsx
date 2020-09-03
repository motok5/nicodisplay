import React, { useCallback, useState } from 'react';
import { Container, TextField } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Dialog from '@material-ui/core/Dialog';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Restore from '@material-ui/icons/Restore';
import LocationOn from '@material-ui/icons/LocationOn';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Store from 'electron-store';
const {app} = require('electron').remote;
const console = require('electron').remote.require('console');

type StoreType = {
  botUrl: string;
};
function valuetext(value: number) {
  return `${value}`;
}
const store = new Store<StoreType>();
//変更しないとき用に定義
var vboturl = store.get('botUrl', 'http://localhost:3000');
var vfontsize = store.get("fontSize", "50");

const App: React.FC = () => {
  const [botUrl, setBotUrl] = useState(
    store.get('botUrl', 'http://localhost:3000') //なければ右
  );
  const [fontSize, setFontSize] = useState(
    store.get('fontSize', '50') //なければ右
  );

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseYes = () => {
    setOpen(false);
    //electron-storeに保存
    //bot-url
    setBotUrl(vboturl);
    store.set('botUrl', vboturl);
    //font-size
    setFontSize(vfontsize);
    store.set('fontSize', vfontsize);
    //restart
    app.relaunch();
    app.exit();

  };

  const handleCloseNo = () => {
    setOpen(false);
  };

  const changeBotUrl = useCallback((event) => {
    vboturl = event.target.value
  }, []);
  const changeFontSize = useCallback((event, value) => {
    vfontsize = value;
  }, []);

  return (
    <Container>
      <form noValidate autoComplete="off">
        <TextField
          id="bot-url"
          label="Bot Server URL"
          variant="filled"
          defaultValue={botUrl}
          onChange={(event) => changeBotUrl(event)}
        ></TextField>
        <Typography id="discrete-slider" gutterBottom>
          Font Size
        </Typography>
        <Slider
        defaultValue={parseInt(vfontsize)}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
        onChange={(event, value) => changeFontSize(event, value)}
        />
        <BottomNavigation>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            変更を反映する
          </Button>
          <Dialog
            open={open}
            onClose={handleCloseNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"変更を反映しますか？"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                nicodisplayは再起動されます。
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseYes} color="primary">
                はい！
              </Button>
              <Button onClick={handleCloseNo} color="primary" autoFocus>
                いいえ！
              </Button>
            </DialogActions>
          </Dialog>
        </BottomNavigation>
      </form>
    </Container>

  );
};

export default App;
