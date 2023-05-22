const config = require('../../config.js');

module.exports = {
	init: () => {
		function containsNumber(string) {
			return /\d/.test(string);
		};

		if (!config.auth.discord.clientID) {
			console.error('[HANDLER] No client ID provided. Please provide a client ID.');

			process.exit(1);
		};

		if (config.auth.discord.clientID && !containsNumber(config.auth.discord.clientID)) {
			console.error('[HANDLER] The client ID provided is not valid. Please provide a valid client ID.');

			process.exit(1);
		};

		if (config.auth.discord.clientID !== '848194055619215360') {
			console.error('[HANDLER] The client ID provided is not the COCRPC one. Please provide the COCRPC client ID by going to the config file and changing the clientID value to 848194055619215360');

			process.exit(1);
		};

		if (!config.auth.clashofclans.token || config.auth.clashofclans.token === 'YOUR API KEY') {
			console.error('[HANDLER] No Clash of Clans API key provided. Please provide a Clash of Clans API key.');

			process.exit(1);
		};

		if (!config.settings.user.playerTag || config.settings.user.playerTag === 'YOUR PLAYER TAG') {
			console.error('[HANDLER] No Clash of Clans Player tag provided. Please provide a Clash of Clans Player tag.');

			process.exit(1);
		};

		if (!config.settings.user.playerToken || config.settings.user.playerToken === 'YOUR PLAYER TOKEN') {
			console.error('[HANDLER] No Clash of Clans player token provided. Please provide a Clash of Clans player token.');

			process.exit(1);
		};
	}
};