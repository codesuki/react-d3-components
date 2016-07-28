"use strict";

var components = {};

// d3 itself
components.d3 = require("d3");

// Charts
components.AreaChart = require("./AreaChart");
components.BarChart = require("./BarChart");
components.LineChart = require("./LineChart");
components.PieChart = require("./PieChart");
components.ScatterPlot = require("./ScatterPlot");
components.Waveform = require("./Waveform");

// Components
components.Brush = require("./Brush");
components.Axis = require("./Axis");
components.Bar = require("./Bar");
components.Chart = require("./Chart");
components.Path = require("./Path");
components.Tooltip = require("./Tooltip");

// Mixins
components.AccessorMixin = require("./AccessorMixin");
components.ArrayifyMixin = require("./ArrayifyMixin");
components.DefaultPropsMixin = require("./DefaultPropsMixin");
components.DefaultScalesMixin = require("./DefaultScalesMixin");
components.HeightWidthMixin = require("./HeightWidthMixin");
components.StackAccessorMixin = require("./StackAccessorMixin");
components.StackDataMixin = require("./StackDataMixin");
components.TooltipMixin = require("./TooltipMixin");

module.exports = components;