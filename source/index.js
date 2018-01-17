import $ from 'jquery';

import TargetChart from './chart/TargetChart';

var element = document.getElementById('chart');
var chart = new TargetChart(element, { 
    title: 'Sample Chart'
});
chart.data([
    { std: 33, target: 50, value: 17, label: 'Metric1' },
    { std: 15, target: 16, value: 20, label: 'Metric2' },
    { std: 27, target: 60, value: 83, label: 'Metric3' },
    { std: 45, target: 55, value: 30, label: 'Metric4' },
    { std: 20, target: 45, value: 45, label: 'Metric5' }
]);
chart.render();

$(window).resize(function () {
    chart.render();
});