import $ from 'jquery';
import * as d3 from 'd3';

import TargetChart from './chart/TargetChart';

/*element.style.height = "400px";
var measurements = {
    clientW: element.clientWidth,
    clientH: element.clientHeight
};
console.log(measurements);*/

var element = document.getElementById('chart');
var chart = new TargetChart(element, {});
chart.data([
    { stdDev: 33, target: 50, value: 30, label: 'YYYYYYYY'},
    { stdDev: 5.4, target: 16, value: 20, label: 'YYYYY' },
    { stdDev: 23, target: 60, value: 49, label: 'YYYYYY' }
]);
//chart.render();
$(window).resize(function () {
    chart.render();
});
$(window).resize();