import Relay from 'react-relay';
import ViewComponent from './ViewComponent';

const ViewContainer = Relay.createContainer(ViewComponent, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `
  }
});

export default ViewContainer;
