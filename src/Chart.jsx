import React from 'react';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import AccessorMixin from './AccessorMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';

export default React.createClass({
    displayName: "Chart",

    mixins: [HeightWidthMixin,
             AccessorMixin,
             ArrayifyMixin,
             DefaultScalesMixin,
             DefaultPropsMixin],

    propTypes: {
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        margin: React.PropTypes.shape({
            top: React.PropTypes.number,
            bottom: React.PropTypes.number,
            left: React.PropTypes.number,
            right: React.PropTypes.number
        }).isRequired
    },

    render() {
        let {height,
             width,
             margin,
             colorScale,
             rScale,
             shape,
             label,
             values,
             x,
             y,
             y0,
             xAxis,
             yAxis,
             tooltipHtml,
             transition} = this.props;

        let [data,
             innerWidth,
             innerHeight,
             xScale,
             yScale,
             xIntercept,
             yIntercept] = [this._data,
                            this._innerWidth,
                            this._innerHeight,
                            this._xScale,
                            this._yScale,
                            this._xIntercept,
                            this._yIntercept];

        // dont send the same stuff to all components,
        // maybe use propTypes, iterate over and only use the ones needed.
        // dont replace props if already set.
        console.log("redraw graph");

        let children = React.Children.map(this.props.children, function (child) {

            let props = { data: data,
                          height: height,
                          width: width,
                          margin: margin,
                          xScale: xScale,
                          yScale: yScale,
                          xIntercept: xIntercept,
                          yIntercept: yIntercept,
                          values: values,
                          label: label,
                          x: x,
                          y: y,
                          y0: y0,
                          colorScale: colorScale,
                          tooltipHtml: tooltipHtml,
                          transition: transition
                        };

            if (child.type.displayName === 'Axis') {
                let scale = child.props.scale === "x" ? xScale : child.props.scale === "y" ? yScale : child.props.scale;

                return React.cloneElement(child, {
                    height: innerHeight,
                    width: innerWidth,
                    scale: scale
                });
            }

            return React.cloneElement(child, removePresentKeys(child, props));
        }, this);

        return (
                <svg ref="svg" width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
                </svg>
        );
    }
});

function removePresentKeys(child, config) {
    let empty = {};

    for (let key in config) {
      //  console.log(key);

        if (!config.hasOwnProperty(key)) {
         //   console.log('fail 1');
            continue;
        }

        if (child.props.hasOwnProperty(key)) {
            //console.log('fail 2', key);
            //console.log(child.props[key]);
            continue;
        }

        empty[key] = config[key];
    }

    return empty;
}
