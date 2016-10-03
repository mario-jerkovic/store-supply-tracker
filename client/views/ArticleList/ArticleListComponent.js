import React, { PropTypes } from 'react';
import { ConnectionTable } from '../../common';

class ArticleList extends React.Component {
  
  static propTypes = {
    
  }
  
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <ConnectionTable />
    );
  }
  
}

export default ArticleList;