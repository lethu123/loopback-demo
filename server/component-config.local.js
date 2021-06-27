/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2018-04-24 09:13:50
*------------------------------------------------------- */

module.exports = { // eslint-disable-line
	'loopback-component-explorer': {
		'mountPath': '/explorer',
		'uiDirs': 'server/explorer',
		'apiInfo': {
			'title': process.env.BRAND + ' API',
			'description': `Copyright © ${process.env.BRAND} <br /> <a href="/explorer/docs.html">Document</a>`,
		},
	},
};
