import React, { useCallback, useState } from 'react';
import { Container, TextField } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Dialog from '@material-ui/core/Dialog';
import Restore from '@material-ui/icons/Restore';
import LocationOn from '@material-ui/icons/LocationOn';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ColorPicker from 'material-ui-color-picker'
import Store from 'electron-store';
const fs = require('fs');
const {app} = require('electron').remote;
const remote = require('electron').remote;
const console = require('electron').remote.require('console');

// メモ
// <TableContainer component={Paper}>
//   <Table className={classes.table} aria-label="simple table">
//     <TableHead>
//       <TableRow>
//         <TableCell>Dessert (100g serving)</TableCell>
//         <TableCell align="right">Calories</TableCell>
//         <TableCell align="right">Fat&nbsp;(g)</TableCell>
//         <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//         <TableCell align="right">Protein&nbsp;(g)</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {rows.map((row) => (
//         <TableRow key={row.name}>
//           <TableCell component="th" scope="row">
//             {row.name}
//           </TableCell>
//           <TableCell align="right">{row.calories}</TableCell>
//           <TableCell align="right">{row.fat}</TableCell>
//           <TableCell align="right">{row.carbs}</TableCell>
//           <TableCell align="right">{row.protein}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

type StoreType = {
  botUrl: string;
};
function valuetext_fontsize(value: number) {
  return `${value}`;
};
function valuetext_maxlayer(value: number) {
  return `${value}`;
};
const store = new Store<StoreType>();
//nico_settingsから回収
const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
var vmaxlayer = Number(settings.max_layer);
//storeから回収
var vboturl = store.get('botUrl', 'http://localhost:3000');
var vfontsize = store.get("fontSize", "50");
var vrandomfontsize = store.get("randomFontSize", false);
var vcolor = store.get("color", "#ffffff");
var vrandomcolor = store.get("randomColor", false);
var vauthorcolor = store.get("authorColor", false);

const App: React.FC = () => {
  //格納値
  const [botUrl, setBotUrl] = useState(
    store.get('botUrl', 'http://localhost:3000') //なければ右
  );
  const [fontSize, setFontSize] = useState(
    store.get('fontSize', '50') //なければ右
  );
  const [randomFontSize, setRandomFontSize] = useState(
    store.get('randomFontSize', false) //なければ右
  );
  // const [color, setColor] = useState(
  //   store.get('color', '#ffffff') //なければ右
  // );
  const [randomColor, setRandomColor] = useState(
    store.get('randomColor', false) //なければ右
  );
  const [authorColor, setAuthorColor] = useState(
    store.get('authorColor', false) //なければ右
  );
  const [state, setState] = useState({
    checked_rfs: vrandomfontsize,
    checked_rc: vrandomcolor,
    checked_ac: vauthorcolor,
  });

  //dialog設定
  const [openRestartDialog, setRestartDialogOpen] = React.useState(false);
  const [openCloseDialog, setCloseDialogOpen] = React.useState(false);
  const restartDialogOpen = () => {
    setRestartDialogOpen(true);
  };

  const restartDialogYes = () => {
    setRestartDialogOpen(false);
    //electron-storeに保存
    //bot-url
    setBotUrl(vboturl);
    store.set('botUrl', vboturl);
    //font-size
    setFontSize(vfontsize);
    store.set('fontSize', vfontsize);
    //random-font-size
    setRandomFontSize(vrandomfontsize);
    store.set('randomFontSize', vrandomfontsize);
    //color
    // setColor(vcolor);
    store.set('color', vcolor);
    //random-color
    setRandomColor(vrandomcolor);
    store.set("randomColor", vrandomcolor)
    //author-color
    setAuthorColor(vauthorcolor);
    store.set("authorColor", vauthorcolor)
    //max_layer
    const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
    settings.max_layer = String(vmaxlayer);
    fs.writeFileSync('./nico_settings.json', JSON.stringify(settings));
    //restart
    app.relaunch();
    app.exit();

  };

  const restartDialogNo = () => {
    setRestartDialogOpen(false);
  };

  const closeDialogOpen = () => {
    setCloseDialogOpen(true);
  };

  const closeDialogYes = () => {
    setCloseDialogOpen(false);
    let w = remote.getCurrentWindow();
    w.close();
  };

  const closeDialogNo = () => {
    setCloseDialogOpen(false);
  };
  //変数変更
  const changeBotUrl = useCallback((event) => {
    vboturl = event.target.value
  }, []);
  const changeFontSize = useCallback((event, value) => {
    vfontsize = value;
  }, []);
  const switchRandomFontSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log(event.target.checked);
    vrandomfontsize = event.target.checked;
  };
  const changeColor = useCallback((color) => {
    if (color !== undefined) {
      vcolor = color;
    }
  }, []);
  const switchRandomColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log(event.target.checked);
    vrandomcolor = event.target.checked;
  };
  const switchAuthorColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log(event.target.checked);
    vauthorcolor = event.target.checked;
  };
  const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  });
  function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
  }
  const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  const classes = useStyles();

  const changeMaxLayer = useCallback((event, value) => {
    vmaxlayer = value;
  }, []);

  //50 350 100
  //Material-UI-Style
  const AllContainer = {
    //backgroundColor: "gray",
    width: "100%",
  };
  const HeaderContainer = {
    height: 50,
    width: "100%",
    // margin: "auto",
    // align: "center",
    //backgroundColor: "gray",
  };
  const BodyContainer = {
    height: 700,
    width: "100%",
    //backgroundColor: "gray",
  };
  const FooterContainer = {
    marginBottom: 100,
    width: "100%",
    //backgroundColor: "gray",
  };
  const Typo_Title = {
    align: "center",
  }
  const BotURLContainer = {
    width: "100%",
    //backgroundColor: "gray",
  };
  const BotURLTextField = {
    width:"100%",
  };
  const FontSizeContainer = {
    width: "100%",
    //backgroundColor: "gray",
  };
  const FontSizeSlider = {
    width: "100%",
    //width: "75%",
  };
  const RandomFontSizeSwitcher = {
    width: "100%",
    //pass
  };
  const ColorContainer = {
    width: "100%",
    //backgroundColor: "gray",
  };
  const ColorPickerFixed = {
    width: "100%",
  };
  const RandomColorSwitcher = {
    width: "100%",
    //pass
  };
  const AuthorColorSwitcher = {
    width: "100%",
    //pass
  };
  const MaxLayerContainer = {
    width: "100%",
    //backgroundColor: "gray",
  };
  const MaxLayerSlider = {
    width: "100%",
    //width: "75%",
  };
  const BottomNavigationFixed = {
    width: "100%",
    //backgroundColor: "gray",
  };
  return (
    <Container style={AllContainer}>
        <Container style={HeaderContainer} class="dragable">
          <Typography gutterBottom>
            Settings
          </Typography>
        </Container>
        <Container style={BodyContainer}>
          <Container style={BotURLContainer}>
            <TextField style={BotURLTextField}
              id="bot-url"
              label="Bot Server URL"
              variant="filled"
              defaultValue={botUrl}
              onChange={(event) => changeBotUrl(event)}
            ></TextField>
          </Container>
          <Container style={FontSizeContainer}>
            <Typography id="discrete-slider" gutterBottom>
              Font Size
            </Typography>
            <Slider style={FontSizeSlider}
            defaultValue={parseInt(vfontsize)}
            getAriaValueText={valuetext_fontsize}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={100}
            onChange={(event, value) => changeFontSize(event, value)}
            />
            <FormControlLabel style={RandomFontSizeSwitcher}
            control={<Switch checked={state.checked_rfs} onChange={switchRandomFontSize} name="checked_rfs" />}
            label="Random Font-Size"
            />
          </Container>
          <Container style={ColorContainer}>
            <Typography id="color-picker" gutterBottom>
              Color
            </Typography>
            <ColorPicker style={ColorPickerFixed}
              name='color'
              defaultValue={vcolor}
              // value={this.state.color} - for controlled component
              onChange={color => changeColor(color)}
            />
            <FormControlLabel style={RandomColorSwitcher}
            control={<Switch checked={state.checked_rc} onChange={switchRandomColor} name="checked_rc" />}
            label="Random Color"
            />
            <FormControlLabel style={AuthorColorSwitcher}
            control={<Switch checked={state.checked_ac} onChange={switchAuthorColor} name="checked_ac" />}
            label="Author Color"
            />
          </Container>
          <Container style={MaxLayerContainer}>
            <Typography id="discrete-slider" gutterBottom>
              Max Layer
            </Typography>
            <Slider style={MaxLayerSlider}
            defaultValue={vmaxlayer}
            getAriaValueText={valuetext_maxlayer}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            onChange={(event, value) => changeMaxLayer(event, value)}
            />
          </Container>
        </Container>
        <Container style={FooterContainer}>
          <BottomNavigation style={BottomNavigationFixed}>
            <Button variant="outlined" color="primary" onClick={restartDialogOpen}>
              変更を反映する
            </Button>
            <Dialog
              open={openRestartDialog}
              onClose={restartDialogNo}
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
                <Button onClick={restartDialogYes} color="primary">
                  はい！
                </Button>
                <Button onClick={restartDialogNo} color="primary" autoFocus>
                  いいえ！
                </Button>
              </DialogActions>
            </Dialog>
            <Button variant="outlined" color="primary" onClick={closeDialogOpen}>
              変更せず閉じる
            </Button>
            <Dialog
              open={openCloseDialog}
              onClose={restartDialogNo}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"設定を終了しますか？"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  変更は反映されません
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialogYes} color="primary">
                  はい！
                </Button>
                <Button onClick={closeDialogNo} color="primary" autoFocus>
                  いいえ！
                </Button>
              </DialogActions>
            </Dialog>
          </BottomNavigation>
        </Container>
    </Container>
    // <Container style={AllContainer}>
    //   <form noValidate autoComplete="off">
    //     <Container style={HeaderContainer} class="dragable">
    //       <Typography gutterBottom>
    //         Settings
    //       </Typography>
    //     </Container>
    //     <Container style={BodyContainer}>
    //       <Container style={BotURLContainer}>
    //         <TextField
    //           id="bot-url"
    //           label="Bot Server URL"
    //           variant="filled"
    //           defaultValue={botUrl}
    //           onChange={(event) => changeBotUrl(event)}
    //         ></TextField>
    //       </Container>
    //       <Container style={FontSizeContainer}>
    //         <Typography id="discrete-slider" gutterBottom>
    //           Font Size
    //         </Typography>
    //         <Slider style={FontSizeSlider}
    //         defaultValue={parseInt(vfontsize)}
    //         getAriaValueText={valuetext_fontsize}
    //         aria-labelledby="discrete-slider"
    //         valueLabelDisplay="auto"
    //         step={10}
    //         marks
    //         min={10}
    //         max={100}
    //         onChange={(event, value) => changeFontSize(event, value)}
    //         />
    //         <FormControlLabel style={RandomFontSizeSwitcher}
    //         control={<Switch checked={state.checked_rfs} onChange={switchRandomFontSize} name="checked_rfs" />}
    //         label="Random Font-Size"
    //         />
    //       </Container>
    //       <Container style={ColorContainer}>
    //         <Typography id="color-picker" gutterBottom>
    //           Color
    //         </Typography>
    //         <ColorPicker style={ColorPickerFixed}
    //           name='color'
    //           defaultValue={vcolor}
    //           // value={this.state.color} - for controlled component
    //           onChange={color => changeColor(color)}
    //         />
    //         <FormControlLabel style={RandomColorSwitcher}
    //         control={<Switch checked={state.checked_rc} onChange={switchRandomColor} name="checked_rc" />}
    //         label="Random Color"
    //         />
    //         <FormControlLabel style={AuthorColorSwitcher}
    //         control={<Switch checked={state.checked_ac} onChange={switchAuthorColor} name="checked_ac" />}
    //         label="Author Color"
    //         />
    //         <TableContainer component={Paper}>
    //           <Table className={classes.table} aria-label="simple table">
    //             <TableHead>
    //               <TableRow>
    //                 <TableCell>Dessert (100g serving)</TableCell>
    //                 <TableCell align="right">Calories</TableCell>
    //                 <TableCell align="right">Fat&nbsp;(g)</TableCell>
    //                 <TableCell align="right">Carbs&nbsp;(g)</TableCell>
    //                 <TableCell align="right">Protein&nbsp;(g)</TableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {rows.map((row) => (
    //                 <TableRow key={row.name}>
    //                   <TableCell component="th" scope="row">
    //                     {row.name}
    //                   </TableCell>
    //                   <TableCell align="right">{row.calories}</TableCell>
    //                   <TableCell align="right">{row.fat}</TableCell>
    //                   <TableCell align="right">{row.carbs}</TableCell>
    //                   <TableCell align="right">{row.protein}</TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </TableContainer>
    //       </Container>
    //       <Container style={MaxLayerContainer}>
    //         <Typography id="discrete-slider" gutterBottom>
    //           Max Layer
    //         </Typography>
    //         <Slider style={MaxLayerSlider}
    //         defaultValue={vmaxlayer}
    //         getAriaValueText={valuetext_maxlayer}
    //         aria-labelledby="discrete-slider"
    //         valueLabelDisplay="auto"
    //         step={1}
    //         marks
    //         min={1}
    //         max={10}
    //         onChange={(event, value) => changeMaxLayer(event, value)}
    //         />
    //       </Container>
    //     </Container>
    //     <Container style={FooterContainer}>
    //       <BottomNavigation style={BottomNavigationFixed}>
    //         <Button variant="outlined" color="primary" onClick={restartDialogOpen}>
    //           変更を反映する
    //         </Button>
    //         <Dialog
    //           open={openRestartDialog}
    //           onClose={restartDialogNo}
    //           aria-labelledby="alert-dialog-title"
    //           aria-describedby="alert-dialog-description"
    //         >
    //           <DialogTitle id="alert-dialog-title">{"変更を反映しますか？"}</DialogTitle>
    //           <DialogContent>
    //             <DialogContentText id="alert-dialog-description">
    //               nicodisplayは再起動されます。
    //             </DialogContentText>
    //           </DialogContent>
    //           <DialogActions>
    //             <Button onClick={restartDialogYes} color="primary">
    //               はい！
    //             </Button>
    //             <Button onClick={restartDialogNo} color="primary" autoFocus>
    //               いいえ！
    //             </Button>
    //           </DialogActions>
    //         </Dialog>
    //         <Button variant="outlined" color="primary" onClick={closeDialogOpen}>
    //           変更せず閉じる
    //         </Button>
    //         <Dialog
    //           open={openCloseDialog}
    //           onClose={restartDialogNo}
    //           aria-labelledby="alert-dialog-title"
    //           aria-describedby="alert-dialog-description"
    //         >
    //           <DialogTitle id="alert-dialog-title">{"設定を終了しますか？"}</DialogTitle>
    //           <DialogContent>
    //             <DialogContentText id="alert-dialog-description">
    //               変更は反映されません
    //             </DialogContentText>
    //           </DialogContent>
    //           <DialogActions>
    //             <Button onClick={closeDialogYes} color="primary">
    //               はい！
    //             </Button>
    //             <Button onClick={closeDialogNo} color="primary" autoFocus>
    //               いいえ！
    //             </Button>
    //           </DialogActions>
    //         </Dialog>
    //       </BottomNavigation>
    //     </Container>
    //   </form>
    // </Container>

  );
};

export default App;
