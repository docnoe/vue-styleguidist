'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.slugger = undefined;
exports.setSlugs = setSlugs;
exports.globalizeComponent = globalizeComponent;
exports.processComponents = processComponents;
exports.processExamples = processExamples;
exports.processSections = processSections;
exports.getFilterRegExp = getFilterRegExp;
exports.filterComponentsByName = filterComponentsByName;
exports.filterSectionsByName = filterSectionsByName;
exports.filterComponentsByExactName = filterComponentsByExactName;
exports.filterComponentsInSectionsByExactName = filterComponentsInSectionsByExactName;
exports.findSection = findSection;
exports.getInfoFromHash = getInfoFromHash;
exports.filterComponentExamples = filterComponentExamples;
exports.processMixins = processMixins;
exports.filterSectionExamples = filterSectionExamples;
exports.getUrl = getUrl;
exports.globalizeMixin = globalizeMixin;
exports.unquote = unquote;
exports.getType = getType;
exports.showSpaces = showSpaces;

var _isNaN = require('lodash/isNaN');

var _isNaN2 = _interopRequireDefault(_isNaN);

var _githubSlugger = require('github-slugger');

var _githubSlugger2 = _interopRequireDefault(_githubSlugger);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Export the singleton instance of GithubSlugger
var slugger = exports.slugger = new _githubSlugger2.default();

function setSlugs(sections) {
	return sections.map(function (section) {
		var name = section.name,
		    components = section.components,
		    sections = section.sections;

		if (name) {
			section.slug = slugger.slug(section.name);
		}
		if (components && components.length) {
			section.components = setSlugs(components);
		}
		if (sections && sections.length) {
			section.sections = setSlugs(sections);
		}
		return section;
	});
}

/**
 * Expose component as global variables.
 *
 * @param {Object} component
 */
function globalizeComponent(component) {
	var displayName = component.props.displayName;
	if (!component.name) {
		return;
	}
	var configComponent = component.module.default || component.module;
	_vue2.default.component(displayName, configComponent);
}

/**
 * Do things that are hard or impossible to do in a loader.
 *
 * @param {Array} components
 * @param {String} vuex
 * @return {Array}
 */
function processComponents(components, vuex) {
	return components.map(function (component) {
		// Add .name shortcuts for names instead of .props.displayName.
		component.name = component.props.displayName;

		// Append @example doclet to all examples
		if (component.props.example) {
			component.props.examples = [].concat(_toConsumableArray(component.props.examples), _toConsumableArray(component.props.example));
			delete component.props.example;
		}
		component.props.examples = processExamples(component.props.examples, vuex);

		globalizeComponent(component);

		return component;
	});
}

function processExamples(examples, vuex) {
	return examples.map(function (example) {
		if (example.type === 'code') {
			example.vuex = vuex;
		}
		return example;
	});
}

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @param {String} vuex
 * @return {Array}
 */
function processSections(sections, vuex) {
	return sections.map(function (section) {
		section.components = processComponents(section.components || [], vuex);
		section.sections = processSections(section.sections || [], vuex);
		return section;
	});
}

/**
 * Fuzzy filters components list by component name.
 *
 * @param {string} query
 * @return {RegExp}
 */
function getFilterRegExp(query) {
	query = query.replace(/[^a-z0-9]/gi, '').split('').join('.*');
	return new RegExp(query, 'i');
}

/**
 * Fuzzy filters components list by component name.
 *
 * @param {array} components
 * @param {string} query
 * @return {array}
 */
function filterComponentsByName(components, query) {
	var regExp = getFilterRegExp(query);
	return components.filter(function (_ref) {
		var name = _ref.name;
		return regExp.test(name);
	});
}

/**
 * Fuzzy filters sections by section or component name.
 *
 * @param {Array} sections
 * @param {string} query
 * @return {Array}
 */
function filterSectionsByName(sections, query) {
	var regExp = getFilterRegExp(query);

	return sections.map(function (section) {
		return Object.assign({}, section, {
			sections: section.sections ? filterSectionsByName(section.sections, query) : [],
			components: section.components ? filterComponentsByName(section.components, query) : []
		});
	}).filter(function (section) {
		return section.components.length > 0 || section.sections.length > 0 || regExp.test(section.name);
	});
}

/**
 * Filters list of components by component name.
 *
 * @param {Array} components
 * @param {string} name
 * @return {Array}
 */
function filterComponentsByExactName(components, name) {
	return components.filter(function (component) {
		return component.name === name;
	});
}

/**
 * Recursively filters all components in all sections by component name.
 *
 * @param {object} sections
 * @param {string} name
 * @return {Array}
 */
function filterComponentsInSectionsByExactName(sections, name) {
	var components = [];
	sections.forEach(function (section) {
		if (section.components) {
			components.push.apply(components, _toConsumableArray(filterComponentsByExactName(section.components, name)));
		}
		if (section.sections) {
			components.push.apply(components, _toConsumableArray(filterComponentsInSectionsByExactName(section.sections, name)));
		}
	});
	return components;
}

/**
 * Recursively finds a section with a given name (exact match)
 *
 * @param  {Array}  sections
 * @param  {string} name
 * @return {object}
 */
function findSection(sections, name) {
	var found = sections.find(function (section) {
		return section.name === name;
	});
	if (found) {
		return found;
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = sections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var section = _step.value;

			if (!section.sections || section.sections.length === 0) {
				continue;
			}
			var _found = findSection(section.sections, name);
			if (_found) {
				return _found;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return undefined;
}

/**
 * Returns an object containing component/section name and, optionally, an example index
 * from hash part or page URL:
 * http://localhost:6060/#!/Button → { targetName: 'Button' }
 * http://localhost:6060/#!/Button/1 → { targetName: 'Button', targetIndex: 1 }
 *
 * @param {string} [hash]
 * @returns {object}
 */
function getInfoFromHash() {
	var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.hash;

	if (hash.substr(0, 3) === '#!/') {
		var tokens = hash.substr(3).split('/');
		var index = parseInt(tokens[1], 10);
		return {
			targetName: tokens[0],
			targetIndex: (0, _isNaN2.default)(index) ? undefined : index
		};
	}
	return {};
}

/**
 * Return a shallow copy of the given component with the examples array filtered
 * to contain only the specified index:
 * filterComponentExamples({ examples: [1,2,3], ...other }, 2) → { examples: [3], ...other }
 *
 * @param {object} component
 * @param {number} index
 * @returns {object}
 */
function filterComponentExamples(component, index) {
	var newComponent = Object.assign({}, component);
	newComponent.props.examples = [component.props.examples[index]];
	return newComponent;
}

function processMixins(mixins) {
	mixins.forEach(function (mixin) {
		if (mixin.default) {
			globalizeMixin(mixin.default);
		} else {
			globalizeMixin(mixin);
		}
	});
}

function filterSectionExamples(section, index) {
	var newComponent = Object.assign({}, section);
	newComponent.content = [section.content[index]];
	return newComponent;
}

/**
 * Get component / section URL.
 *
 * @param {string} $.name Name
 * @param {string} $.slug Slug
 * @param {number} $.example Example index
 * @param {boolean} $.anchor Anchor?
 * @param {boolean} $.isolated Isolated mode?
 * @param {boolean} $.nochrome No chrome? (Can be combined with anchor or isolated)
 * @param {boolean} $.absolute Absolute URL? (Can be combined with other flags)
 * @param {object} [location] Location object (will use current page location by default)
 * @return {string}
 */
function getUrl() {
	var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    name = _ref2.name,
	    slug = _ref2.slug,
	    example = _ref2.example,
	    anchor = _ref2.anchor,
	    isolated = _ref2.isolated,
	    nochrome = _ref2.nochrome,
	    absolute = _ref2.absolute;

	var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location,
	    origin = _ref3.origin,
	    pathname = _ref3.pathname;

	var url = pathname;

	if (nochrome) {
		url += '?nochrome';
	}

	if (anchor) {
		url += '#' + slug;
	} else if (isolated || nochrome) {
		url += '#!/' + name;
	}

	if (example) {
		url += '/' + example;
	}

	if (absolute) {
		return origin + url;
	}

	return url;
}

function globalizeMixin(mixin) {
	_vue2.default.mixin(mixin);
}

/**
 * Remove quotes around given string.
 *
 * @param {string} string
 * @returns {string}
 */
function unquote(string) {
	return string.replace(/^['"]|['"]$/g, '');
}

/**
 * Return prop type object.
 *
 * @param {object} prop
 * @returns {object}
 */
function getType(prop) {
	return prop.flowType || prop.type;
}

/**
 * Show starting and ending whitespace around given string.
 *
 * @param {string} string
 * @returns {string}
 */
function showSpaces(string) {
	return string.replace(/^\s|\s$/g, '␣');
}