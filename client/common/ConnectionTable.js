import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

export function ConnectionRow({ value, fetchValue, header, ...other }) {
  return (
    <TableRowColumn {...other}>{fetchValue(value)}</TableRowColumn>
  );
}

ConnectionRow.propTypes = {
  fetchValue: PropTypes.func.isRequired,
  header: PropTypes.string,
  value: PropTypes.any,
};

// TODO
// Use dot notation to get the pat in the object, if there is no fetch function defined
// use the value that from the dot notation
export class ConnectionTable extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      pageInfo: PropTypes.shape({
        hasNextPage: PropTypes.bool,
        hasPreviousPage: PropTypes.bool,
      }),
      totalCount: PropTypes.number,
      edges: PropTypes.arrayOf(PropTypes.shape({
        cursor: PropTypes.string,
        node: PropTypes.any,
      })),
    }).isRequired,
    relay: PropTypes.shape({
      setVariables: PropTypes.func,
      variables: PropTypes.any,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderTableHeader() {
    return React.Children.map(this.props.children, (child) => {
      return <TableHeaderColumn>{child.props.header}</TableHeaderColumn>
    });
  }

  renderTableBody() {
    return this.props.data.edges.map(({ node }, index) => {
      return (
        <TableRow key={`connectionRow_${index}_${Date.now()}`}>
          {
            React.Children.map(this.props.children, (child) => {
              return React.cloneElement(child, { value: node });
            })
          }
        </TableRow>
      );
    });
  }

  render() {
    return (
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
    )
  }
}
