'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.columns = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getRowKey = getRowKey;
exports.propsToArray = propsToArray;
exports.default = SlotsTableRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Markdown = require('rsg-components/Markdown');

var _Markdown2 = _interopRequireDefault(_Markdown);

var _Name = require('rsg-components/Name');

var _Name2 = _interopRequireDefault(_Name);

var _Table = require('rsg-components/Table');

var _Table2 = _interopRequireDefault(_Table);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderDescription(prop) {
	var description = prop.description;

	return _react2.default.createElement(
		'div',
		null,
		description && _react2.default.createElement(_Markdown2.default, { text: description })
	);
}

function renderName(prop) {
	var name = prop.name,
	    _prop$tags = prop.tags,
	    tags = _prop$tags === undefined ? {} : _prop$tags;

	return _react2.default.createElement(
		_Name2.default,
		{ deprecated: !!tags.deprecated },
		name
	);
}

function getRowKey(row) {
	return row.name;
}

function propsToArray(props) {
	return (0, _map2.default)(props, function (prop, name) {
		return _extends({}, prop, { name: name });
	});
}

var columns = exports.columns = [{
	caption: 'Slot',
	render: renderName
}, {
	caption: 'Description',
	render: renderDescription
}];

function SlotsTableRenderer(_ref) {
	var props = _ref.props;

	return _react2.default.createElement(_Table2.default, { columns: columns, rows: propsToArray(props), getRowKey: getRowKey });
}

SlotsTableRenderer.propTypes = {
	props: _propTypes2.default.object.isRequired
};