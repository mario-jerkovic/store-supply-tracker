// Global
const config = {
	env: process.env.NODE_ENV || 'development',
	appPort: parseInt(process.env.PORT) || 8080,
	apiPort: parseInt(process.env.PORT) + 1 || 8081
};

// Environment specific
export default Object.assign(config, require(`./${config.env}`).default);
