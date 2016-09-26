import Relay from 'react-relay';
import ReceiptsComponent from './ReceiptsComponent';

const ArticlesContainer = Relay.createContainer(ReceiptsComponent, {
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
        receiptConnection(first: $first, last: $last, before: $before, after: $after) {
          pageInfo{
            hasNextPage,
            hasPreviousPage
          },
          totalCount,
          edges{
            cursor
            node{
              id
              number
              total
              date
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
