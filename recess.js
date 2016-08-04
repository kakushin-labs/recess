'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (component, styles, reactInstance) {
    return applyStyles(component, styles, reactInstance);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.assignin');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.keys');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.foreach');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var applyStyles = function applyStyles(component, styles, reactInstance, parentNodeKey) {
    var childIndex = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

    var styleKeys = [component.type];
    if (component.props.className) {
        var splitClasses = component.props.className.split(' ').map(function (className) {
            return '.' + className;
        });
        styleKeys = styleKeys.concat(splitClasses);
        styleKeys.push(splitClasses.join(''));
    }
    // Cache the original inline style so it can have highest priority
    var inlineStyle = (0, _lodash2.default)({}, component.props.style);
    var aggregateStyle = {};
    var aggregateProps = {};

    styleKeys.map(function (className) {
        if (styles[className]) {
            (function () {
                var style = styles[className];
                // Use a unique 'node key' to identify this node
                var nodeKey = '' + (parentNodeKey ? parentNodeKey + '_' : '') + className + '_' + childIndex;
                // If there is the special '@includes' key, merge in the styles from there
                if (style['@includes']) {
                    (0, _lodash8.default)(style['@includes'], function (includedStyle) {
                        style = (0, _lodash4.default)({}, includedStyle, style);
                    });
                    delete style['@includes'];
                }

                // If there is the special ':hover' key, bind the mouseover event for it or merge styles if applicable
                if (style[':hover']) {
                    (function () {
                        var oldMouseEnter = component.props.onMouseEnter;
                        var oldMouseLeave = component.props.onMouseLeave;
                        (0, _lodash2.default)(aggregateProps, {
                            onMouseEnter: function onMouseEnter() {
                                var runTimeStyles = reactInstance.state && reactInstance.state.recessRuntimeStyles || {};
                                runTimeStyles[nodeKey + '_hover'] = style[':hover'];
                                reactInstance.setState({ 'recessRuntimeStyles': runTimeStyles });
                                if (oldMouseEnter) {
                                    oldMouseEnter();
                                }
                            },
                            onMouseLeave: function onMouseLeave() {
                                // If the hover is applied, remove it
                                if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[nodeKey + '_hover']) {
                                    delete reactInstance.state.recessRuntimeStyles[nodeKey + '_hover'];
                                    reactInstance.setState({ 'recessRuntimeStyles': reactInstance.state.recessRuntimeStyles });
                                }
                                if (oldMouseEnter) {
                                    oldMouseLeave();
                                }
                            }
                        });

                        if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[nodeKey + '_hover']) {
                            style = (0, _lodash2.default)({}, style, reactInstance.state.recessRuntimeStyles[nodeKey + '_hover']);
                        }
                    })();
                }

                // If there is the special ':active' key, bind the mousedown event for it or merge styles if applicable
                if (style[':active']) {
                    (function () {
                        var oldMouseDown = component.props.onMouseDown;
                        var oldMouseUp = component.props.onMouseUp;
                        (0, _lodash2.default)(aggregateProps, {
                            onMouseDown: function onMouseDown() {
                                var runTimeStyles = reactInstance.state && reactInstance.state.recessRuntimeStyles || {};
                                runTimeStyles[nodeKey + '_active'] = style[':active'];
                                reactInstance.setState({ 'recessRuntimeStyles': runTimeStyles });
                                if (oldMouseDown) {
                                    oldMouseDown();
                                }
                            },
                            onMouseUp: function onMouseUp() {
                                // If the active is applied, remove it
                                if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[nodeKey + '_active']) {
                                    delete reactInstance.state.recessRuntimeStyles[nodeKey + '_active'];
                                    reactInstance.setState({ 'recessRuntimeStyles': reactInstance.state.recessRuntimeStyles });
                                }
                                if (oldMouseUp) {
                                    oldMouseUp();
                                }
                            }
                        });

                        if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[nodeKey + '_active']) {
                            style = (0, _lodash2.default)({}, style, reactInstance.state.recessRuntimeStyles[nodeKey + '_active']);
                        }
                    })();
                }

                // Loop through any children and recursively apply matching styles
                var children = [];
                if ((0, _lodash6.default)(style).length > 0) {
                    _react2.default.Children.map(component.props.children, function (childComponent, index) {
                        if (_react2.default.isValidElement(childComponent)) {
                            children.push(applyStyles(childComponent, style, reactInstance, nodeKey, index));
                        } else if (typeof childComponent === 'string') {
                            children.push(childComponent);
                        }
                    });
                }

                if (children.length > 0) {
                    component = _react2.default.cloneElement(component, { children: children });
                }

                aggregateStyle = (0, _lodash2.default)(aggregateStyle, style);
            })();
        }
    });

    var style = (0, _lodash2.default)({}, aggregateStyle, inlineStyle || {});
    component = _react2.default.cloneElement(component, (0, _lodash2.default)(aggregateProps, { style: style }));

    return component;
}; // -------------------------------------------------------------
// Recess - SCSS like styling syntax in React
// A small Javascript library that allows you to use nested syntax,
// dynamic inclusion of additional styles as well as :hover and :active
// pseudo selectors with React.js inline styles.
// -------------------------------------------------------------
