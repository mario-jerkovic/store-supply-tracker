import Relay from 'react-relay';
import AppComponent from './AppComponent';

const AppContainer = Relay.createContainer(AppComponent, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
				id
			}`
	}
});

export default AppContainer;