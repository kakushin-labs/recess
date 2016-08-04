// -------------------------------------------------------------
// Recess - SCSS like styling syntax in React
// A small Javascript library that allows you to use nested syntax,
// dynamic inclusion of additional styles as well as :hover and :active
// pseudo selectors with React.js inline styles.
// -------------------------------------------------------------

import React from 'react'
import extend from 'lodash.assignin'
import merge from 'lodash.merge'
import keys from 'lodash.keys'
import each from 'lodash.foreach'

const applyStyles = function (component, styles, reactInstance, parentNodeKey, childIndex = 0) {
    let styleKeys = [ component.type ];
    if (component.props.className) {
        const splitClasses = component.props.className.split(' ').map((className) => `.${className}`);
        styleKeys = styleKeys.concat(splitClasses);
        styleKeys.push(splitClasses.join(''));
    }
    // Cache the original inline style so it can have highest priority
    const inlineStyle = extend({}, component.props.style);
    let aggregateStyle = {};
    let aggregateProps = {};

    // Use a unique 'node key' to identify this node
    const nodeKey = `${parentNodeKey ? parentNodeKey + '_' : ''}${component.props.className}_${childIndex}`;

    styleKeys.map((className) => {
        if (styles[className]) {
            let style = styles[className];
            // If there is the special '@includes' key, merge in the styles from there
            if (style['@includes']) {
                each(style['@includes'], (includedStyle) => {
                    style = merge({}, includedStyle, style);
                });
                delete style['@includes'];
            }

            // If there is the special ':hover' key, bind the mouseover event for it or merge styles if applicable
            if (style[':hover']) {
                const oldMouseEnter = component.props.onMouseEnter;
                const oldMouseLeave = component.props.onMouseLeave;
                extend(aggregateProps, {
                    onMouseEnter: function () {
                        const runTimeStyles = (reactInstance.state && reactInstance.state.recessRuntimeStyles) || {};
                        runTimeStyles[`${nodeKey}_hover`] = style[':hover'];
                        reactInstance.setState({ 'recessRuntimeStyles': runTimeStyles });
                        if (oldMouseEnter) { oldMouseEnter(); }
                    },
                    onMouseLeave: function () {
                        // If the hover is applied, remove it
                        if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[`${nodeKey}_hover`]) {
                            delete reactInstance.state.recessRuntimeStyles[`${nodeKey}_hover`];
                            reactInstance.setState({ 'recessRuntimeStyles': reactInstance.state.recessRuntimeStyles });
                        }
                        if (oldMouseEnter) { oldMouseLeave(); }
                    }
                });

                if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[`${nodeKey}_hover`]) {
                    style = extend({}, style, reactInstance.state.recessRuntimeStyles[`${nodeKey}_hover`]);
                }
            }

            // If there is the special ':active' key, bind the mousedown event for it or merge styles if applicable
            if (style[':active']) {
                const oldMouseDown = component.props.onMouseDown;
                const oldMouseUp = component.props.onMouseUp;
                extend(aggregateProps, {
                    onMouseDown: function () {
                        const runTimeStyles = (reactInstance.state && reactInstance.state.recessRuntimeStyles) || {};
                        runTimeStyles[`${nodeKey}_active`] = style[':active'];
                        reactInstance.setState({ 'recessRuntimeStyles': runTimeStyles });
                        if (oldMouseDown) { oldMouseDown(); }
                    },
                    onMouseUp: function () {
                        // If the active is applied, remove it
                        if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[`${nodeKey}_active`]) {
                            delete reactInstance.state.recessRuntimeStyles[`${nodeKey}_active`];
                            reactInstance.setState({ 'recessRuntimeStyles': reactInstance.state.recessRuntimeStyles });
                        }
                        if (oldMouseUp) { oldMouseUp(); }
                    }
                });

                if (reactInstance.state && reactInstance.state.recessRuntimeStyles && reactInstance.state.recessRuntimeStyles[`${nodeKey}_active`]) {
                    style = extend({}, style, reactInstance.state.recessRuntimeStyles[`${nodeKey}_active`]);
                }
            }

            aggregateStyle = merge(aggregateStyle, style)
        }
    });

    const style = extend({}, aggregateStyle, inlineStyle || {});

    // Loop through any children and recursively apply matching styles
    const children = [];
    if (keys(style).length > 0) {
        React.Children.map(component.props.children, (childComponent, index) => {
            if (React.isValidElement(childComponent)) {
                children.push(applyStyles(childComponent, style, reactInstance, nodeKey, index));
            } else if (typeof childComponent === 'string') {
                children.push(childComponent);
            }
        });
    }

    if (children.length > 0) {
        component = React.cloneElement(component, { children: children });
    }

    component = React.cloneElement(component, extend(aggregateProps, { style: style }));

    return component;
}

export default function (component, styles, reactInstance) {
    return applyStyles(component, styles, reactInstance);
}