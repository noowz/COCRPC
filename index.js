const config = require('./config.json');
const logger = require('./src/utils/logger.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('discord-rpc');

const client = new Client({
	transport: 'ipc'
});

function configVerificator() {
	function containsNumber(string) {
		return /\d/.test(string);
	};

	if (!config.auth.discord.clientID) {
		console.error(logger.error + 'No client ID provided. Please provide a client ID.');

		process.exit(1);
	};

	if (config.auth.discord.clientID && !containsNumber(config.auth.discord.clientID)) {
		console.error(logger.error + 'The client ID provided is not valid. Please provide a valid client ID.');

		process.exit(1);
	};

	if (config.auth.discord.clientID !== '848194055619215360') {
		console.error(logger.error + 'The client ID provided is not the COCRPC one. Please provide the COCRPC client ID by going to the config file and changing the clientID value to 848194055619215360');

		process.exit(1);
	};

	if (!config.auth.clashofclans.token || config.auth.clashofclans.token === 'YOUR API KEY') {
		console.error(logger.error + 'No Clash of Clans API key provided. Please provide a Clash of Clans API key.');

		process.exit(1);
	};

	if (!config.settings.user.playerTag || config.settings.user.playerTag === 'YOUR PLAYER TAG') {
		console.error(logger.error + 'No Clash of Clans Player tag provided. Please provide a Clash of Clans Player tag.');

		process.exit(1);
	};
};

function loadEvents() {
	const eventsPath = path.join(__dirname, 'src/events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		};

		console.log(logger.info + `Loaded event ${file}!`);
	};
};

configVerificator();
loadEvents();

client.login({
	clientId: config.auth.discord.clientID
}).catch(error => {
	console.error(logger.error + error);
});