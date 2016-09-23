import Relay from 'react-relay';
import {
	urlMiddleware,
	authMiddleware,
	retryMiddleware,
	RelayNetworkLayer,
} from 'react-relay-network-layer';

let relayEnvironment = null;

function initEnvironment() {
	relayEnvironment = new Relay.Environment();

	return relayEnvironment;
}

export function setNetworkLayer(callback = () => null) {
	initEnvironment().injectNetworkLayer(new RelayNetworkLayer([
		urlMiddleware({
			url: 'http://localhost:8000/graphql',
			batchUrl: 'http://localhost:8000/batch'
		}),
		retryMiddleware({ statusCodes: [400, 500, 503, 504] }),
		authMiddleware({
			token: null,
			tokenRefreshPromise: () => null
		})
	], { disableBatchQuery: false }));

	callback();
}