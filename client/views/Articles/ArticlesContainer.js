import Relay from 'react-relay';
import ArticlesComponent from './ArticlesComponent';

const ArticlesContainer = Relay.createContainer(ArticlesComponent, {
  initialVariables: {
    first: 10,
    last: null,
    before: null,
    after: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        articleConnection(first: $first, last: $last, before: $before, after: $after) {
          pageInfo{
            hasNextPage
            hasPreviousPage
          }
          totalCount
          edges{
            cursor
            node{
              id
              name
              quantity
              created
              updated
            }
          }
        }
      }
    `
  }
});

export default ArticlesContainer;
