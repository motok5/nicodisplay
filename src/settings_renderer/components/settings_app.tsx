import React, { useCallback, useState } from 'react';
import { Container, TextField } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Dialog from '@material-ui/core/Dialog';
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
import MaterialTable, { Column } from 'material-table';

import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import ColorPicker from 'material-ui-color-picker'
import Store from 'electron-store';
const fs = require('fs');
const {app} = require('electron').remote;
const remote = require('electron').remote;
const console = require('electron').remote.require('console');

// メモ


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
var vsimplesettings = store.get("simpleSettings", false);
var vadvancedsettings = store.get("advancedSettings", false);
var vfontsize = store.get("fontSize", "50");
var vrandomfontsize = store.get("randomFontSize", false);
var vcolor = store.get("color", "#ffffff");
var vrandomcolor = store.get("randomColor", false);

//material-table用
interface Row {
  name: string;
  fontsize: number;
  color: string;
}
interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
}
const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const App: React.FC = () => {
  //格納値
  const [botUrl, setBotUrl] = useState(
    store.get('botUrl', 'http://localhost:3000') //なければ右
  );
  var [colorState, setColorState] = useState("white");
  const [switcherState, setSwitcherState] = useState({
    checked_ss: vsimplesettings,
    checked_as: vadvancedsettings,
    checked_rfs: vrandomfontsize,
    checked_rc: vrandomcolor,
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
    //Simple-Settings
    store.set("simpleSettings", vsimplesettings)
    //Advanced-Settings
    store.set("advancedSettings", vadvancedsettings)
    //font-size
    store.set('fontSize', vfontsize);
    //random-font-size
    store.set('randomFontSize', vrandomfontsize);
    //color
    store.set('color', vcolor);
    //random-color
    store.set("randomColor", vrandomcolor)
    //max_layer
    const settings_overwrite = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
    settings_overwrite.max_layer = String(vmaxlayer);
    //authors-data
    try {
      settings_overwrite.authors_list = tableState.data;
    } catch(error) {
      //pass
    }
    fs.writeFileSync('./nico_settings.json', JSON.stringify(settings_overwrite));
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
  const switchSimpleSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitcherState({ ...switcherState, [event.target.name]: event.target.checked });
    vsimplesettings = event.target.checked;
  };
  const switchAdvancedSettings = (event:any) => {
    setSwitcherState({ ...switcherState, [event.target.name]: event.target.checked });
    vadvancedsettings = event.target.checked;
  };
  const switchStyles = (event:any) => {
    if (event.target.checked) {
      document.getElementById("SimpleSettingsContainer").classList.add("blur");
      document.getElementById("AdvancedSettingsContainer").classList.remove("blur");
    } else {
      document.getElementById("AdvancedSettingsContainer").classList.add("blur");
      document.getElementById("SimpleSettingsContainer").classList.remove("blur");
    }
  };
  const changeFontSize = useCallback((event, value) => {
    vfontsize = value;
  }, []);
  const switchRandomFontSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitcherState({ ...switcherState, [event.target.name]: event.target.checked });
    vrandomfontsize = event.target.checked;
  };
  const changeColor = useCallback((color) => {
    if (color !== undefined) {
      vcolor = color;
      let changedcolor = color
      setColorState(changedcolor);
    };
  }, []);
  const switchRandomColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitcherState({ ...switcherState, [event.target.name]: event.target.checked });
    vrandomcolor = event.target.checked;
  };
  const changeMaxLayer = useCallback((value) => {
    vmaxlayer = value;
  }, []);
  const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
  });
  function createData(name:any, fontsize:any, color:any) {
  return { name, fontsize, color};
  }
  var rows:any = [];
  const settings = JSON.parse(fs.readFileSync('./nico_settings.json', 'utf8'));
  settings.authors_list.forEach((auth:any) => {
    rows.push(createData(auth.name, Number(auth.fontsize), auth.color))
  });
  const classes = useStyles();
  const [tableState, setState] = React.useState<TableState>({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'FontSize', field: 'fontsize' },
      { title: 'Color', field: 'color'},
    ],
    data: rows,
  });

  //Material-UI-Style
  const AllContainer = {
    width: "100%",
  };
  const HeaderContainer = {
    height: 100,
    width: "100%",
  };
  const BodyContainer = {
    width: "100%",
  };
  const FooterContainer = {
    marginBottom: 100,
    width: "100%",
  };
  const BotURLContainer = {
    width: "90%",
  };
  const BotURLTextField = {
    width:"100%",
    backgroundColor: "white",
    height: "50",
  };
  const SimpleSettingsTitle = {
    width:"100%",
  };
  const SimpleSettingsSwitcherContainerContainer = {
    width: "100%",
    //pass
  };
  const SimpleSettingsSwitcherContainer = {
    width: "100%",
  };
  const SimpleSettingsSwitcher = {
    //pass
  };
  const SubTitle = {
    width:"100%",
  };
  const Explain = {
    width:"100%",
  };
  const SimpleSettingsContainer = {
    width:"100%",
  };
  const FontSizeContainer = {
    width: "100%",
  };
  const FontSizeSlider = {
    width: "100%",
  };
  const RandomFontSizeSwitcherContainer = {
    width: "100%",
    //pass
  };
  const RandomFontSizeSwitcher = {
    //pass
  };
  const ColorContainer = {
    width: "100%",
  };
  const ColorPickerFixed = {
    width: "100%",
  };
  const RandomColorSwitcherContainer = {
    width: "100%",
    //pass
  };
  const RandomColorSwitcher = {
    //pass
  };
  const MaxLayerContainer = {
    width: "100%",
  };
  const MaxLayerSlider = {
    width: "100%",
  };
  const AdvancedSettingsTitle = {
    width:"100%",
  };
  const AdvancedSettingsSwitcherContainerContainer = {
    width: "100%",
  };
  const AdvancedSettingsSwitcherContainer = {
    width: "100%",
  };
  const AdvancedSettingsSwitcher = {
    //pass
  };
  const AdvancedSettingsContainer = {
    width:"100%",
  };
  const DataTable = {
  };
  const BottomNavigationFixed = {
    width: "100%",
  };
  const ChangeButton = {
    //pass
  };
  const UnchangeButton = {
    //pass
  };
  return (
    <Container style={AllContainer} id="AllContainer">
        <Container style={HeaderContainer} id="dragable">
          <Typography gutterBottom id="title">
            Settings
          </Typography>
        </Container>
        <Container style={BodyContainer} id="BodyContainer">
          <Container style={BotURLContainer}>
            <Typography gutterBottom id="Typo-Bot">
              Bot Server URL
            </Typography>
            <TextField
              required
              style={BotURLTextField}
              id="BotURLTextField"
              label="Required"
              variant="filled"
              defaultValue={botUrl}
              onChange={(event) => changeBotUrl(event)}
            />
          </Container>
          <Container style={AdvancedSettingsSwitcherContainerContainer}>
            <Container style={AdvancedSettingsSwitcherContainer} id="AdvancedSettingsSwitcherContainer">
              <FormControlLabel
                style={AdvancedSettingsSwitcher}
                id="AdvancedSettingsSwitcher"
                label="Advanced Settings"
                control=
                  {<Switch
                    checked={switcherState.checked_as}
                    onChange={event => {switchAdvancedSettings(event);switchStyles(event)}}
                    name="checked_as"
                    color="primary" />}
              />
            </Container>
          </Container>
          <Container style={SimpleSettingsTitle} id="SimpleSettingsTitle">
            <Typography id="Typo-Simple">
              Simple Settings
            </Typography>
          </Container>
          <Container style={SimpleSettingsContainer} id="SimpleSettingsContainer">
            <Container style={FontSizeContainer} id="FontSizeContainer">
              <Typography style={SubTitle} id="SubTitle" gutterBottom>
                Font Size
              </Typography>
              <Typography style={Explain} id="Explain" gutterBottom>
                文字の大きさを変更します。
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
            </Container>
            <Container style={RandomFontSizeSwitcherContainer}>
              <FormControlLabel
                style={RandomFontSizeSwitcher}
                label="Random Font-Size"
                control={
                  <Switch
                  checked={switcherState.checked_rfs}
                  onChange={switchRandomFontSize}
                  name="checked_rfs"
                  color="primary" />}
              />
            </Container>
            <Container style={ColorContainer} id="ColorContainer">
              <Typography style={SubTitle} id="SubTitle" gutterBottom>
                Color
              </Typography>
              <Typography style={Explain} id="Explain" gutterBottom>
                文字の色を変更します。
              </Typography>
              <ColorPicker style={ColorPickerFixed}
                name='color'
                defaultValue="NicoDisplay"
                onChange={color => changeColor(color)}
                value={colorState}
              />
            </Container>
            <Container style={RandomColorSwitcherContainer}>
              <FormControlLabel
                style={RandomColorSwitcher}
                label="Random Color"
                control=
                {<Switch
                  checked={switcherState.checked_rc}
                  onChange={switchRandomColor}
                  name="checked_rc"
                  color="primary" />}
              />
            </Container>
            <Container style={MaxLayerContainer} id="MaxLayerContainer">
              <Typography style={SubTitle} id="SubTitle" gutterBottom>
                Max Layer
              </Typography>
              <Typography style={Explain} id="Explain" gutterBottom>
                アニメーションレイヤーの最大同時起動数を制限します。
                数が多くなるほど負荷が増加します。
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
              onChange={(value) => changeMaxLayer(value)}
              />
            </Container>
          </Container>
          <Container style={AdvancedSettingsTitle} id="AdvancedSettingsTitle">
            <Typography id="Typo-Advanced">
              Advanced Settings
            </Typography>
          </Container>
          <Container style={AdvancedSettingsContainer} id="AdvancedSettingsContainer">
            <Container style={DataTable} id="DataTable">
            <MaterialTable
              title="User Data"
              columns={tableState.columns}
              data={tableState.data}
              icons={tableIcons}
              editable={{
                onRowAdd: (newData:any) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      setState((prevState) => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
                onRowUpdate: (newData:any, oldData:any) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData:any) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
                }}
              />
            </Container>
          </Container>
        </Container>
        <Container style={FooterContainer}>
          <BottomNavigation style={BottomNavigationFixed} id="BottomNavigationFixed">
            <Button style={ChangeButton} id="ChangeButton" variant="outlined" color="primary" onClick={restartDialogOpen}>
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
            <Button style={UnchangeButton} id="UnchangeButton" variant="outlined" color="primary" onClick={closeDialogOpen}>
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
  );
};

export default App;
