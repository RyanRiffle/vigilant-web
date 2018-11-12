const config = require('./config')[process.env.NODE_ENV];

const helpers =
{
	fetch: function(url, opts) {
		opts = opts || {};
		if (!opts.credentials) {
			opts.credentials = 'include';
		}

		if (!opts.mode) {
			opts.mode = 'cors';
		}

		return fetch(config.apiBaseURL + url, opts);
	},

	post: function(url, json) {
		return window.vigilant.helpers.fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(json)
		});
	},

	delete: function(url, opts) {
		return window.vigilant.helpers.fetch(url, {
			method: 'DELETE'
		});
	}
};

module.exports = helpers;