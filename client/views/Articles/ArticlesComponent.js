import React, { PropTypes } from 'react';
import { Paper, ConnectionTable, ConnectionRow } from '../../common';

const Articles = props => (
  <Paper zDepth={2}>
    <ConnectionTable relay={props.relay} data={props.viewer.articleConnection}>
      <ConnectionRow
        header="Name"
        fetchValue={node => node.name}
      />
      <ConnectionRow
        header="Quantity"
        fetchValue={node => `${node.quantity} kg`}
      />
      <ConnectionRow
        header="Created"
        fetchValue={node => node.created}
      />
      <ConnectionRow
        header="Updated"
        fetchValue={node => node.updated}
      />
    </ConnectionTable>
  </Paper>
);

Articles.propTypes = {
  relay: PropTypes.shape({}).isRequired,
  viewer: PropTypes.shape({
    articleConnection: PropTypes.shape({
      ...ConnectionTable.propTypes.data,
    })
  }).isRequired,
};

export default Articles;
