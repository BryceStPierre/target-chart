# Target Chart

<!--<a href="https://d3js.org"><img src="#" align="left" hspace="10" vspace="6"></a>-->

**Target Chart** is a customizable target chart based upon D3.js that resembles a comparative histogram, with options such as comparison to +/- standard deviations, and more.

## Installing

Download the [latest release](#latest).

```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="#"></script>
```

## Example Usage:

```js
var element = document.getElementById('chart');
var chart = new TargetChart(element, { 
    title: 'Chart Title'
});
chart.data([
    { std: 33, target: 50, value: 17, label: 'Metric1' },
    { std: 15, target: 16, value: 20, label: 'Metric2' },
    { std: 27, target: 60, value: 83, label: 'Metric3' },
    { std: 45, target: 55, value: 30, label: 'Metric4' },
    { std: 20, target: 45, value: 45, label: 'Metric5' }
]);
chart.render();
```
