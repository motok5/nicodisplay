import React, { useCallback, useState } from 'react';
import { Container, TextField } from '@material-ui/core';
import Store from 'electron-store';
type StoreType = {
  botUrl: string;
};

const store = new Store<StoreType>();

const App: React.FC = () => {
  const [botUrl, setBotUrl] = useState(
    store.get('botUrl', 'http://localhost:3000')
  );

  const handleChangeForm = useCallback((event) => {
    console.log(event.target.value);
    setBotUrl(event.target.value);
    store.set('botUrl', event.target.value);
  }, []);

  return (
    <Container>
      <form noValidate autoComplete="off">
        <TextField
          id="bot-url"
          label="Bot Server URL"
          variant="filled"
          defaultValue={botUrl}
          onChange={(event) => handleChangeForm(event)}
        ></TextField>
      </form>
    </Container>
  );
};

export default App;
