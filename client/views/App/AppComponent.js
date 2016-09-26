import React, { PropTypes } from 'react';
import {
  customTheme,
  getMuiTheme,
  MuiThemeProvider,
} from '../../common';

const theme = getMuiTheme(customTheme);

const App = props => (
  <MuiThemeProvider muiTheme={theme}>
    {props.children}
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.element,
};

export default App;
