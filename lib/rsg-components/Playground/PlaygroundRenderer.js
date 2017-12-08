'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.styles = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.PlaygroundRenderer = PlaygroundRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Styled = require('rsg-components/Styled');

var _Styled2 = _interopRequireDefault(_Styled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var styles = exports.styles = function styles(_ref) {
	var space = _ref.space,
	    color = _ref.color,
	    borderRadius = _ref.borderRadius;
	return {
		root: {
			marginBottom: space[4]
		},
		preview: {
			padding: space[2],
			border: [[1, color.border, 'solid']],
			borderRadius: borderRadius
		},
		controls: {
			display: 'flex',
			alignItems: 'center'
		},
		toolbar: {
			marginLeft: 'auto'
		}
	};
};

function PlaygroundRenderer(_ref2) {
	var classes = _ref2.classes,
	    name = _ref2.name,
	    preview = _ref2.preview,
	    previewProps = _ref2.previewProps,
	    tabButtons = _ref2.tabButtons,
	    tabBody = _ref2.tabBody,
	    toolbar = _ref2.toolbar;

	var className = previewProps.className,
	    props = _objectWithoutProperties(previewProps, ['className']);

	return _react2.default.createElement(
		'div',
		{ className: classes.root },
		_react2.default.createElement(
			'div',
			_extends({ className: (0, _classnames2.default)(classes.preview, className) }, props, { 'data-preview': name }),
			preview
		),
		_react2.default.createElement(
			'div',
			{ className: classes.controls },
			_react2.default.createElement(
				'div',
				{ className: classes.tabs },
				tabButtons
			),
			_react2.default.createElement(
				'div',
				{ className: classes.toolbar },
				toolbar
			)
		),
		_react2.default.createElement(
			'div',
			{ className: classes.tab },
			tabBody
		)
	);
}

PlaygroundRenderer.propTypes = {
	classes: _propTypes2.default.object.isRequired,
	name: _propTypes2.default.string.isRequired,
	preview: _propTypes2.default.node.isRequired,
	previewProps: _propTypes2.default.object.isRequired,
	tabButtons: _propTypes2.default.node.isRequired,
	tabBody: _propTypes2.default.node.isRequired,
	toolbar: _propTypes2.default.node.isRequired
};

exports.default = (0, _Styled2.default)(styles)(PlaygroundRenderer);