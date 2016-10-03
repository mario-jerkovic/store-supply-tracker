import Relay from 'react-relay';
import ArticleListComponent from './ArticleListComponent';

const ArticleListContainer = Relay.createContainer(ArticleListComponent, {
  initialVariables: {
    first: 100
  },
  fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
			  id,
				articleConnection(first: $first) {
				  totalCount,
          edges {
            node {
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

export default ArticleListContainer;