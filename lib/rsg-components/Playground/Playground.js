'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _Preview = require('rsg-components/Preview');

var _Preview2 = _interopRequireDefault(_Preview);

var _Para = require('rsg-components/Para');

var _Para2 = _interopRequireDefault(_Para);

var _Slot = require('rsg-components/Slot');

var _Slot2 = _interopRequireDefault(_Slot);

var _PlaygroundRenderer = require('rsg-components/Playground/PlaygroundRenderer');

var _PlaygroundRenderer2 = _interopRequireDefault(_PlaygroundRenderer);

var _slots = require('../slots');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Playground = function (_Component) {
	_inherits(Playground, _Component);

	function Playground(props, context) {
		_classCallCheck(this, Playground);

		var _this = _possibleConstructorReturn(this, (Playground.__proto__ || Object.getPrototypeOf(Playground)).call(this, props, context));

		var code = props.code;
		var config = context.config;


		_this.showCode = config.showCode;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.handleTabChange = _this.handleTabChange.bind(_this);
		_this.handleChange = (0, _debounce2.default)(_this.handleChange, config.previewDelay);

		_this.state = {
			code: code,
			activeTab: undefined
		};
		return _this;
	}

	_createClass(Playground, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			if (this.showCode) {
				setTimeout(function () {
					_this2.setState({
						activeTab: _slots.EXAMPLE_TAB_CODE_EDITOR
					});
				}, 0);
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var code = nextProps.code;

			this.setState({
				code: code
			});
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return nextState.code !== this.state.code || nextState.activeTab !== this.state.activeTab;
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// Clear pending changes
			this.handleChange.cancel();
		}
	}, {
		key: 'handleChange',
		value: function handleChange(code) {
			this.setState({
				code: code
			});
		}
	}, {
		key: 'handleTabChange',
		value: function handleTabChange(name) {
			this.setState(function (state) {
				return {
					activeTab: state.activeTab !== name ? name : undefined
				};
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    code = _state.code,
			    activeTab = _state.activeTab;
			var _props = this.props,
			    evalInContext = _props.evalInContext,
			    index = _props.index,
			    name = _props.name,
			    vuex = _props.vuex,
			    settings = _props.settings;
			var isolatedExample = this.context.isolatedExample;

			var preview = _react2.default.createElement(_Preview2.default, { code: code, vuex: vuex, evalInContext: evalInContext });
			if (settings.noeditor) {
				return _react2.default.createElement(
					_Para2.default,
					null,
					preview
				);
			}
			if (settings.classname) {
				settings.props = {
					className: settings.classname
				};
			}
			return _react2.default.createElement(_PlaygroundRenderer2.default, {
				name: name,
				preview: preview,
				previewProps: settings.props || {},
				tabButtons: _react2.default.createElement(_Slot2.default, {
					name: 'exampleTabButtons',
					active: activeTab,
					props: { onClick: this.handleTabChange }
				}),
				tabBody: _react2.default.createElement(_Slot2.default, {
					name: 'exampleTabs',
					active: activeTab,
					onlyActive: true,
					props: { code: code, onChange: this.handleChange }
				}),
				toolbar: _react2.default.createElement(_Slot2.default, { name: 'exampleToolbar', props: { name: name, isolated: isolatedExample, example: index } })
			});
		}
	}]);

	return Playground;
}(_react.Component);

Playground.propTypes = {
	code: _propTypes2.default.string.isRequired,
	evalInContext: _propTypes2.default.func.isRequired,
	vuex: _propTypes2.default.object,
	index: _propTypes2.default.number.isRequired,
	name: _propTypes2.default.string.isRequired,
	settings: _propTypes2.default.object
};
Playground.contextTypes = {
	config: _propTypes2.default.object.isRequired,
	isolatedExample: _propTypes2.default.bool
};
exports.default = Playground;