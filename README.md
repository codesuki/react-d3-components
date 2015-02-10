# react-d3-components

> D3 Components for React

Let React have complete control over the DOM even when using D3. This way we can benefit from Reacts Virtual DOM.

Installation
============
```
npm install react-d3-components
```

Description
===========
Ideally the library should be usable with minimum configuration. Just put the data in and see the charts.
I try to provide sensible defaults, but since for most use-cases we need to customize D3's parameters they will be made accessible to the user. Most Charts will turn into their stacked variant when given an array as input.

If you like the project please consider a pull request. I am open for any additions.

Features
--------
* Bar Chart
* Stacked Bar Chart
* Scatter Plot
* Line Chart
* Area Chart
* Stacked Area Chart
* Pie Plot

ToDo (in no particular order)
-----------------------------
* More Charts
* Custom data accessors to support any data format
* Negative Axes
* CSS Classes for all elements
* Animations
* Tooltip
* Legend
* Documentation
* Tests

Example
=======
Check out example/index.html found [here](http://codesuki.github.io/react-d3-components/example.html).

BarChart
--------
```javascript
var BarChart = ReactD3.BarChart;

var data = [{
    label: 'somethingA',
    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
}];

React.render(
    <BarChart data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>,
    document.getElementById('location')
);
```

StackedBarChart
--------
```javascript
var BarChart = ReactD3.BarChart;

data = [
    {
    label: 'somethingA',
    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
    },
    {
    label: 'somethingB',
    values: [{x: 'SomethingA', y: 6}, {x: 'SomethingB', y: 8}, {x: 'SomethingC', y: 5}]
    },
    {
    label: 'somethingC',
    values: [{x: 'SomethingA', y: 6}, {x: 'SomethingB', y: 8}, {x: 'SomethingC', y: 5}]
    }
];

React.render(
    <BarChart data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>,
    document.getElementById('location')
);
```

ScatterPlot & LineChart & AreaChart
-----------------------------------
```javascript
var ScatterPlot = ReactD3.ScatterPlot;
var LineChart = ReactD3.LineChart;
var AreaChart = ReactD3.AreaChart;

data = [
    {
    label: 'somethingA',
    values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
    },
    {
    label: 'somethingB',
    values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
    }
];
   
React.render(<ScatterPlot data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>,
    document.getElementById('location')
);

React.render(<LineChart data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>,
    document.getElementById('location')
);

React.render(<AreaChart data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>,
    document.getElementById('location')
);
```

PieChart
--------
```javascript
var PieChart = ReactD3.PieChart;

data = {
    label: 'somethingA',
    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
};
    
React.render(<PieChart data={data} width={600} height={400} margin={{top: 10, bottom: 10, left: 100, right: 100}}/>,
    document.getElementById('location')
);
```

Overriding default parameters / Customization
---------------------------------------------
All Charts provide defaults for scales, colors, etc...
If you want to use your own scale just pass it to the charts constructor.

The scales are normal D3 objects, their documentation can be found [here](https://github.com/mbostock/d3/wiki/Ordinal-Scales) and [here](https://github.com/mbostock/d3/wiki/Quantitative-Scales).

There are more parameters like barPadding, strokeWidth, fill, opacity...
They will be documented soon.

```javascript
var xScale = d3.scale.ordinal(); //... + set it up appropriately
var yScale = d3.scale.linear();
var colorScale = d3.scale.category20();

<BarChart xScale={xScale}
	  yScale={yScale}
	  colorScale={colorScale}
	  barPadding={0.3}
          data={data} width={400} height={400} margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
```
   
