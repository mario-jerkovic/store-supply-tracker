import React, { PropTypes } from 'react';
import {
  TableRowColumn
} from 'material-ui/Table';

function ConnectionRow({ value, fetchValue, header, ...other }) { // eslint-disable-line no-unused-vars
  return (
    <TableRowColumn {...other}>{fetchValue(value)}</TableRowColumn>
  );
}

ConnectionRow.propTypes = {
  fetchValue: PropTypes.func.isRequired,
  header: PropTypes.string,
  value: PropTypes.any,
};

export default ConnectionRow;
