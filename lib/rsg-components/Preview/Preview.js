'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _buble = require('buble');

var _PlaygroundError = require('rsg-components/PlaygroundError');

var _PlaygroundError2 = _interopRequireDefault(_PlaygroundError);

var _esprima = require('esprima');

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable react/no-multi-comp */
var nameVarComponent = '__component__';

/*
 * Reads the code in string and separates the javascript part and the html part
 * @param {string} code
 */
var separateScript = function separateScript(code) {
	var index = void 0;
	var lines = code.split('\n');

	if (code.indexOf('new Vue') > -1) {
		lines.unshift([]);
		lines = lines.reduce(function (total, next) {
			function getId(str) {
				var arrSemi = str.split(';');
				if (arrSemi.length > 0) {
					return arrSemi;
				}
				return [str];
			}
			return total.concat(getId(next));
		});
		var indexVueBegin = void 0;
		lines.some(function (line, index) {
			if (line.indexOf('new Vue') > -1) {
				indexVueBegin = index;
			}
			return false;
		});
		// Valid
		var lineVueBegin = lines[indexVueBegin];
		var parseLine = lineVueBegin.split(' ').filter(function (v) {
			return v !== '';
		});
		if (parseLine[0] === 'new' && parseLine[1].indexOf('Vue') === 0) {
			var componentLines = lines.slice(indexVueBegin);
			var setVue = '\n\n\t// Extract the configuration of the example component\n\tfunction Vue(params){ ' + nameVarComponent + ' = params }';
			return {
				js: lines.slice(0, indexVueBegin).join('\n'),
				vueComponent: componentLines.join('\n') + setVue
			};
		}
		throw new Error('Error');
	}
	for (var id = 0; id < lines.length; id++) {
		if (lines[id].trim().charAt(0) === '<') {
			index = id;
			break;
		}
	}
	return {
		js: lines.slice(0, index).join('\n'),
		html: lines.slice(index).join('\n')
	};
};

var getVars = function getVars(syntaxTree) {
	var arr = [];
	arr = syntaxTree.body.filter(function (syntax) {
		return syntax.type === 'VariableDeclaration' || syntax.type === 'FunctionDeclaration';
	});
	arr.unshift([]);
	return arr.reduce(function (total, next) {
		function getId(syntax) {
			if (syntax.declarations) {
				return Array.prototype.concat.apply([], syntax.declarations.map(function (declaration) {
					return declaration.id.name;
				}));
			}
			return [syntax.id.name];
		}
		total = total.concat(getId(next));
		return total;
	});
};
var _compileCode = function _compileCode(code, config) {
	return (0, _buble.transform)(code, config).code;
};

var Preview = function (_Component) {
	_inherits(Preview, _Component);

	function Preview() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, Preview);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Preview.__proto__ || Object.getPrototypeOf(Preview)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			error: null
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Preview, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			console.clear(); // eslint-disable-line no-console
			this.executeCode();
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.error !== nextState.error || this.props.code !== nextProps.code;
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps) {
			if (this.props.code !== prevProps.code) {
				this.executeCode();
			}
		}
	}, {
		key: 'executeCode',
		value: function executeCode() {
			this.setState({
				error: null
			});

			var _props = this.props,
			    code = _props.code,
			    vuex = _props.vuex;

			var compuse = void 0;
			var compiledCode = void 0;
			var configComponent = void 0;
			var syntaxTree = void 0;
			var listVars = [];
			var exampleComponent = void 0;
			if (!code) {
				return;
			}

			try {
				compuse = separateScript(code);
				compiledCode = this.compileCode(compuse.js);

				if (compuse.vueComponent) {
					configComponent = this.compileCode(compuse.vueComponent);
				}
				syntaxTree = (0, _esprima.parse)(compuse.js);
				listVars = getVars(syntaxTree);
				exampleComponent = this.evalInContext(compiledCode, listVars, configComponent);
			} catch (err) {
				this.handleError(err);
				compuse.html = '';
			}

			var el = this.mountNode.children[0];
			if (!el) {
				this.mountNode.innerHTML = ' ';
				this.mountNode.append(document.createElement('div'));
				el = this.mountNode.children[0];
			}
			var extendsComponent = {};
			var component = {};
			if (configComponent) {
				component = exampleComponent();

				Object.keys(component).forEach(function (key) {
					if (key === 'el') {
						delete component.el;
					}
				});
			} else {
				var data = exampleComponent();
				var template = compuse.html;
				component = {
					data: data,
					template: template
				};
			}

			if (vuex) {
				extendsComponent = { store: vuex.default };
			}
			component = Object.assign({ el: el }, extendsComponent, component);
			new _vue2.default(component);
		}
	}, {
		key: 'compileCode',
		value: function compileCode(code) {
			try {
				return _compileCode(code, this.context.config.compilerConfig);
			} catch (err) {
				this.handleError(err);
			}
			return false;
		}
	}, {
		key: 'evalInContext',
		value: function evalInContext(compiledCode, listVars, configComponent) {
			var exampleComponentCode = '';
			if (configComponent) {
				exampleComponentCode = '\n\t\t\t\tfunction getConfig() {\n\t\t\t\t\teval(\n\t\t\t\t\t\t' + JSON.stringify(compiledCode) + '\n\t\t\t\t\t\t + ";" +\n\t\t\t\t\t\t' + JSON.stringify(configComponent) + '\n\t\t\t\t\t);\n\t\t\t\t\treturn ' + nameVarComponent + ';\n\t\t\t\t}\n\t\t\t\treturn getConfig();\n\t\t\t';
			} else {
				listVars = listVars.map(function (value) {
					return value + ' : ' + value;
				});
				exampleComponentCode = '\n\t\t\t\tfunction getData() {\n\t\t\t\t\teval(' + JSON.stringify(compiledCode) + ')\n\t\t\t\t\treturn {\n\t\t\t\t\t\t' + listVars.join(',') + '\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn getData();\n\t\t\t';
			}

			return this.props.evalInContext(exampleComponentCode);
		}
	}, {
		key: 'handleError',
		value: function handleError(err) {
			if (this.mountNode) {
				var el = this.mountNode.children[0];
				if (!el) {
					this.mountNode.innerHTML = ' ';
					this.mountNode.append(document.createElement('div'));
					el = this.mountNode.children[0];
				}
				el = new _vue2.default({
					el: el,
					data: {},
					template: '<div></div> '
				});
			}

			this.setState({
				error: err.toString()
			});

			console.error(err); // eslint-disable-line no-console
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var error = this.state.error;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ ref: function ref(_ref2) {
							return _this2.mountNode = _ref2;
						} },
					_react2.default.createElement('div', null)
				),
				error && _react2.default.createElement(_PlaygroundError2.default, { message: error })
			);
		}
	}]);

	return Preview;
}(_react.Component);

Preview.propTypes = {
	code: _propTypes2.default.string.isRequired,
	evalInContext: _propTypes2.default.func.isRequired,
	vuex: _propTypes2.default.object
};
Preview.contextTypes = {
	config: _propTypes2.default.object.isRequired
};
exports.default = Preview;