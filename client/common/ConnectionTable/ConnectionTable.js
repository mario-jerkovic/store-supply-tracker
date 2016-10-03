import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

import ConnectionToolbar from './ConnectionToolbar';

// TODO
// Use dot notation to get the pat in the object, if there is no fetch function defined
// use the value that from the dot notation
class ConnectionTable extends React.Component {
  
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    data: PropTypes.shape({
      pageInfo: PropTypes.shape({
        hasNextPage: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
        hasPreviousPage: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
      }),
      totalCount: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      edges: PropTypes.arrayOf(PropTypes.shape({
        cursor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
        node: PropTypes.shape({}), // eslint-disable-line react/no-unused-prop-types
      })),
    }).isRequired,
    relay: PropTypes.shape({
      setVariables: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
      variables: PropTypes.shape({}), // eslint-disable-line react/no-unused-prop-types
    }).isRequired,
  };
  
  renderTableHeader() {
    return React.Children.map(this.props.children, child => (
      <TableHeaderColumn>{child.props.header}</TableHeaderColumn>
    ));
  }
  
  renderTableBody() {
    return this.props.data.edges.map((edge, index) => (
      <TableRow key={`connectionRow_${index}_${Date.now()}`}>
        {
          React.Children.map(this.props.children, child => (
            React.cloneElement(child, { value: edge.node })
          ))
        }
      </TableRow>
    ));
  }
  
  render() {
    return (
      <Paper zDepth={1}>
        <Table>
          <TableHeader>
            <TableRow>
              {this.renderTableHeader()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.renderTableBody()}
          </TableBody>
        </Table>
        <Divider />
        <ConnectionToolbar />
      </Paper>
    );
  }
}

export default ConnectionTable;
