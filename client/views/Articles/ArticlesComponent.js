import React, { PropTypes } from 'react';
import { Paper, ConnectionTable, ConnectionRow } from '../../common';

const Articles = (props) => (
  <Paper zDepth={2}>
    <ConnectionTable relay={props.relay} data={props.viewer.articleConnection}>
      <ConnectionRow
        header="Name"
        fetchValue={(node) => node.name}
      />
      <ConnectionRow
        header="Quantity"
        fetchValue={(node) => node.quantity}
      />
      <ConnectionRow
        header="Created"
        fetchValue={(node) => node.created}
      />
      <ConnectionRow
        header="Updated"
        fetchValue={(node) => node.updated}
      />
    </ConnectionTable>
  </Paper>
);

Articles.propTypes = {
  viewer: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default Articles;
