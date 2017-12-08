'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ErrorRenderer = ErrorRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Styled = require('rsg-components/Styled');

var _Styled2 = _interopRequireDefault(_Styled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles(_ref) {
	var fontFamily = _ref.fontFamily,
	    fontSize = _ref.fontSize,
	    color = _ref.color,
	    space = _ref.space;
	return {
		root: {
			margin: space[2],
			lineHeight: 1.2,
			fontSize: fontSize.small,
			backgroundColor: color.error
		},
		stack: {
			color: color.errorBackground,
			whiteSpace: 'pre',
			fontFamily: fontFamily.monospace
		},
		message: {
			color: color.errorBackground,
			fontFamily: fontFamily.base
		}
	};
};

function ErrorRenderer(_ref2) {
	var classes = _ref2.classes,
	    error = _ref2.error,
	    info = _ref2.info;

	return _react2.default.createElement(
		'div',
		{ className: classes.root },
		_react2.default.createElement(
			'pre',
			{ className: classes.stack },
			error.toString(),
			info.componentStack.toString()
		),
		_react2.default.createElement(
			'div',
			{ className: classes.message },
			_react2.default.createElement(
				'p',
				null,
				'This may be due to an error in a component you are overriding, or a bug in React Styleguidist.'
			),
			_react2.default.createElement(
				'p',
				null,
				'If you believe this is a bug,\xA0',
				_react2.default.createElement(
					'a',
					{
						style: { color: 'inherit' },
						href: 'https://github.com/styleguidist/react-styleguidist/issues'
					},
					'please submit an issue'
				),
				'.'
			)
		)
	);
}

ErrorRenderer.propTypes = {
	classes: _propTypes2.default.object.isRequired,
	error: _propTypes2.default.object.isRequired,
	info: _propTypes2.default.shape({
		componentStack: _propTypes2.default.object.isRequired
	}).isRequired
};

exports.default = (0, _Styled2.default)(styles)(ErrorRenderer);