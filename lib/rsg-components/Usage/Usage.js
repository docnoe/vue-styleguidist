'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Usage;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Props = require('rsg-components/Props');

var _Props2 = _interopRequireDefault(_Props);

var _Methods = require('rsg-components/Methods');

var _Methods2 = _interopRequireDefault(_Methods);

var _Events = require('rsg-components/Events');

var _Events2 = _interopRequireDefault(_Events);

var _SlotsTable = require('rsg-components/SlotsTable');

var _SlotsTable2 = _interopRequireDefault(_SlotsTable);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Usage(_ref) {
	var _ref$props = _ref.props,
	    props = _ref$props.props,
	    methods = _ref$props.methods,
	    events = _ref$props.events,
	    slots = _ref$props.slots;

	var slotsNode = void 0;
	slots = (0, _pickBy2.default)(slots, function (item) {
		return !!item.description;
	});
	if (slots && Object.keys(slots).length > 0) {
		slotsNode = slots && _react2.default.createElement(_SlotsTable2.default, { props: slots });
	}
	var propsNode = props && _react2.default.createElement(_Props2.default, { props: props });
	var eventsNode = void 0;
	if (events && Object.keys(events).length > 0) {
		eventsNode = events && _react2.default.createElement(_Events2.default, { props: events });
	}
	var methodsNode = methods && methods.length > 0 && _react2.default.createElement(_Methods2.default, { methods: methods });

	if (!propsNode && !methodsNode && !slotsNode && !eventsNode) {
		return null;
	}

	return _react2.default.createElement(
		'div',
		null,
		propsNode,
		methodsNode,
		eventsNode,
		slotsNode
	);
}

Usage.propTypes = {
	props: _propTypes2.default.shape({
		props: _propTypes2.default.object,
		methods: _propTypes2.default.array,
		eventsNode: _propTypes2.default.object,
		slotsNode: _propTypes2.default.object
	}).isRequired
};