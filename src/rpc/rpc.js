const config = require('../../config.js');
const version = require('../../package.json').version;
const fetch = require('node-fetch-commonjs');

let firstTimeRunningRPC = true;
let startDate;

const rpc = async function setActivity(client) {
	async function discordRPC() {
		const playerResponse = await fetch(`https://api.clashofclans.com/v1/players/%23${config.settings.user.playerTag.replace('#', '')}`, {
			headers: {
				'Authorization': `Bearer ${config.auth.clashofclans.token}`,
				'Content-Type': 'application/json',
				'User-Agent': `COCRPC v${version}`
			}
		});
	
		if (playerResponse.status !== 200) {
			const playerError = await playerResponse.json();
	
			if (playerResponse.status === 400) {
				console.error(`[CLASH OF CLANS API] The RPC Client is providing incorrect parameters for the request. Report this at https://github.com/Fastxyz/COCRPC/issues\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 403 && playerError.reason === 'accessDenied') {
				console.error(`[CLASH OF CLANS API] You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.clashofclans.com/#/new-key to create a new one.\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 403 && playerError.reason === 'accessDenied.invalidIp') {
				console.error(`[CLASH OF CLANS API] The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.clashofclans.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 404) {
				console.error(`[CLASH OF CLANS API] You provided an invalid player tag. Check if it is correct in the config file.\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 429) {
				console.error(`[CLASH OF CLANS API] The API is at its maximum capacity. Please, try again later!\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 500) {
				console.error(`[CLASH OF CLANS API] An unknown error happened when handling the request. Please, try again! If the error persists, please try again later!\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else if (playerResponse.status === 503) {
				console.error(`[CLASH OF CLANS API] Clash of Clans is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API.\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			} else {
				console.error(`[CLASH OF CLANS API] An error has occurred. Report this at https://github.com/Fastxyz/COCRPC/issues\n➜ ERROR: ${playerResponse.status} - ${playerError.message} (${playerError.reason})`);
	
				process.exit(1);
			};
		} else {
			const player = await playerResponse.json();
	
			client.request('SET_ACTIVITY', {
				pid: process.pid,
				activity: {
					details: `🏆 Trophies: ${player.trophies}/${player.bestTrophies} • ⭐ Level: ${player.expLevel}`,
					state: `🏠 Town Hall Level: ${player.townHallLevel} • 🏚️ Builder Hall Level: ${player.builderHallLevel}`,
					timestamps: {
						start: startDate
					},
					assets: {
						large_image: 'logo',
						large_text: `COCRPC v${version}`,
						small_image: 'player',
						small_text: `${player.name} (${player.tag})`
					},
					buttons: [
						{
							label: '🚀 Download',
							url: 'https://github.com/Fastxyz/COCRPC'
						}
					]
				}
			}).catch(error => {
				if (error.message === 'RPC_CONNECTION_TIMEOUT') {
					console.error(`[DISCORD] An error has occurred!\n➜ ERROR: ${error}`);
		
					process.exit(1);
				};
			});
		};
	};

	if (firstTimeRunningRPC) {
		firstTimeRunningRPC = false;
		startDate = Date.now();

		const tokenResponse = await fetch(`https://api.clashofclans.com/v1/players/%23${config.settings.user.playerTag.replace('#', '')}/verifytoken`, {
			method: 'POST',
			body: JSON.stringify({
				'token': config.settings.user.playerToken
			}),
			headers: {
				'Authorization': `Bearer ${config.auth.clashofclans.token}`,
				'Content-Type': 'application/json',
				'User-Agent': `COCRPC v${version}`
			}
		});

		if (tokenResponse.status !== 200) {
			const tokenError = await tokenResponse.json();

			if (tokenResponse.status === 400) {
				console.error(`[CLASH OF CLANS API] The RPC Client is providing incorrect parameters for the request. Report this at https://github.com/Fastxyz/COCRPC/issues\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 403 && tokenError.reason === 'accessDenied') {
				console.error(`[CLASH OF CLANS API] You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.clashofclans.com/#/new-key to create a new one.\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 403 && tokenError.reason === 'accessDenied.invalidIp') {
				console.error(`[CLASH OF CLANS API] The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.clashofclans.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 404) {
				console.error(`[CLASH OF CLANS API] You provided an invalid player tag. Check if it is correct in the config file.\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 429) {
				console.error(`[CLASH OF CLANS API] The API is at its maximum capacity. Please, try again later!\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 500) {
				console.error(`[CLASH OF CLANS API] An unknown error happened when handling the request. Please, try again! If the error persists, please try again later!\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else if (tokenResponse.status === 503) {
				console.error(`[CLASH OF CLANS API] Clash of Clans is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API.\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			} else {
				console.error(`[CLASH OF CLANS API] An error has occurred. Report this at https://github.com/Fastxyz/COCRPC/issues\n➜ ERROR: ${tokenResponse.status} - ${tokenError.message} (${tokenError.reason})`);

				process.exit(1);
			};
		} else {
			const tokenStatus = await tokenResponse.json();

			if (tokenStatus.status !== 'ok') {
				console.error('[HANDLER] The Clash of Clans player token provided is not valid. Please provide a valid Clash of Clans player token.');

				process.exit(1);
			} else {
				discordRPC();
			};
		};
	} else {
		startDate = startDate;

		discordRPC();
	};
};

module.exports = {
	rpc
};