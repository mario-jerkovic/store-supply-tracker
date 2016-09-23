import chalk from 'chalk';
import config from './config/environment';
import { startGraphQLServer } from './graphQLServer';
import { startRelayServer } from './relayServer';

startGraphQLServer().listen(config.apiPort, () => {
	console.log(chalk.green(`[graphQLServer] listening on port: ${config.apiPort}`));
});

startRelayServer().listen(config.appPort, () => {
	console.log(chalk.green(`[relayServer]   listening on port: ${config.appPort}`));
});