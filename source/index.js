import $ from 'jquery';
import * as d3 from 'd3';

var chart = document.getElementById('chart');

chart.style.height = "400px";

var measurements = {
    clientW: chart.clientWidth,
    clientH: chart.clientHeight
};

console.log(measurements);