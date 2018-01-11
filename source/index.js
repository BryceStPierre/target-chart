import $ from 'jquery';
import * as d3 from 'd3';

import TargetChart from './chart/TargetChart';

var element = document.getElementById('chart');

element.style.height = "400px";

var measurements = {
    clientW: element.clientWidth,
    clientH: element.clientHeight
};

console.log(measurements);

var chart = new TargetChart(element, {});
chart.data([]);
chart.render();