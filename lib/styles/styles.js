'use strict';

var _setupjss = require('./setupjss');

var _setupjss2 = _interopRequireDefault(_setupjss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
	// Global styles
	body: {
		isolate: false,
		margin: 0,
		padding: 0,
		border: 0
	}
};

// Attach styles to body

var body = _setupjss2.default.createStyleSheet(styles).attach().classes.body;

document.body.classList.add(body);