import Relay from 'react-relay';
import HomeComponent from './HomeComponent';

const HomeContainer = Relay.createContainer(HomeComponent, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
				id
			}
		`
	}
});

export default HomeContainer;