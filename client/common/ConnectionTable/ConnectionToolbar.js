import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import {
  Toolbar,
  ToolbarGroup,
} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

const styles = {
  toolbar: {
    backgroundColor: 'white'
  },
  toolbarGroup: {
    alignItems: 'center'
  }
};

function ConnectionToolbar(props) { // eslint-disable-line no-unused-vars
  return (
    <Toolbar style={styles.toolbar}>
      <ToolbarGroup />
      <ToolbarGroup style={styles.toolbarGroup}>
        <IconButton>
          <ArrowLeft />
        </IconButton>
        <IconButton>
          <ArrowRight />
        </IconButton>
      </ToolbarGroup>
    </Toolbar>
  );
}


ConnectionToolbar.propTypes = {};


export default ConnectionToolbar;
