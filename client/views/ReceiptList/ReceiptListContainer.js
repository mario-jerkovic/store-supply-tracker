import Relay from 'react-relay';
import ReceiptListComponent from './ReceiptListComponent';

const ReceiptListContainer = Relay.createContainer(ReceiptListComponent, {
  initialVariables: {
    first: 100
  },
  fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
			  id,
				receiptConnection(first: $first) {
				  totalCount,
          edges {
            node {
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

export default ReceiptListContainer;