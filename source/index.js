import $ from 'jquery';

import TargetChart from './chart/TargetChart';

var element = document.getElementById('chart');
var chart = new TargetChart(element, { 
    title: 'Chart Title',
    barHeight: 20
});
chart.data([
    { stdDev: 33, target: 50, value: 17, label: 'Metric1'},
    { stdDev: 5.4, target: 16, value: 20, label: 'Metric2' },
    { stdDev: 27, target: 60, value: 83, label: 'Metric3' },
    { stdDev: 15, target: 55, value: 17, label: 'Metric4'},
    { stdDev: 20, target: 45, value: 45, label: 'Metric5' }
]);
chart.render();

$(window).resize(function () {
    chart.render();
});