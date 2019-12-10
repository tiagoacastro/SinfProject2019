import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  typography: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontColor: "#334D6E",
    h5: {
      fontWeight: 'bold',
      fontSize: '16px'
    },
    overrides,
    zIndex: {
      appBar: 1200,
      drawer: 1100
    }
  }
});

export default theme;
