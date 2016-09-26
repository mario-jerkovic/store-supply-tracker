import React, { PropTypes } from 'react';
import DrawerMUI from 'material-ui/Drawer';
import {
  List,
  ListItem,
  MakeSelectable as makeSelectable,
} from 'material-ui/List';

const SelectableList = makeSelectable(List);

const fixStyle = { WebkitAppearance: 'none' };

const Drawer = props => (
  <DrawerMUI
    open={props.open}
    docked={props.docked}
    onRequestChange={props.onRequestChange}
  >
    <SelectableList
      value={props.location}
      onChange={props.onRequestChangeList}
    >
      <ListItem style={fixStyle} primaryText="Articles" value="/" />
      <ListItem style={fixStyle} primaryText="Receipts" value="/receipts" />
      <ListItem style={fixStyle} primaryText="Settings" value="/settings" />
    </SelectableList>
  </DrawerMUI>
);

Drawer.defaultProps = {
  toggleNested: true,
};

Drawer.propTypes = {
  ...Drawer.propTypes,
  open: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  toggleNested: PropTypes.bool.isRequired,
  onRequestChange: PropTypes.func.isRequired,
  onRequestChangeList: PropTypes.func.isRequired,
};

export default Drawer;
