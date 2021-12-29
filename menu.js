const { app } = require('electron');

const isMac = process.platform === 'darwin';

const menuTemplate = [
	// { role: 'appMenu' }
	...(isMac
		? [
				{
					label: 'Znarf',
					submenu: [
						{ role: 'about' },
						{ type: 'separator' },
						{ role: 'services' },
						{ type: 'separator' },
						{ role: 'hide' },
						{ role: 'hideothers' },
						{ role: 'unhide' },
						{ type: 'separator' },
						{ role: 'quit' },
					],
				},
		  ]
		: []),
	// { role: 'fileMenu' }
	{
		label: 'Menu',
		submenu: [
			{ role: 'minimize' },
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			isMac ? { role: 'close' } : { role: 'quit' },
		],
	},
	{
		role: 'help',
		submenu: [
			{
				label: `Znarf Vers: ${app.getVersion()}`,
			},
			{
				label: 'About',
				click: async () => {
					const { shell } = require('electron');
					await shell.openExternal('https://github.com/emaglic');
				},
			},
		],
	},
];

module.exports = menuTemplate;
