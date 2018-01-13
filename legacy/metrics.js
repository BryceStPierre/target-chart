import $ from 'jquery';
import * as d3 from 'd3';

export default function metricsChart () {
    
    $.getJSON('/api/metrics', function (metrics) {

        var width = $('#metrics').width(),
            height = $('#metrics').height();

        var svg = d3.select('#metrics')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        var barHeight = 4;
        var margin = 120;

        var q1 = (margin + (width / 2)) / 2;            // One quarter of the view width.
        var q2 = width / 2;                             // Half of the view width.
        var q3 = ((width / 2) + (width - margin)) / 2;  // Three quarters of the view width.

        svg.append('text')                              // Append TARGET text.
            .attr('class', 'white')
            .attr('text-anchor', 'middle')
            .attr('x', q2)
            .attr('y', 10)
            .text('TARGET');

        svg.append('text')                              // Append BELOW text.
            .attr('class', 'red')
            .attr('text-anchor', 'middle')
            .attr('x', q1)
            .attr('y', 25)
            .text(width > 400 ? 'BELOW' : 'B');

        svg.append('circle')                            // Append red circle for BELOW count.
            .attr('class', 'red')
            .attr('cx', 90)
            .attr('cy', 10)
            .attr('r', 8);

        var belowLabel = svg.append('text')             // Append text for BELOW count.
            .attr('class', 'metric-label white')
            .attr('text-anchor', 'middle')
            .attr('x', 90)
            .attr('y', 13)
            .text(metrics.filter(r => r.above === false).length);

        svg.append('text')                              // Append ABOVE text.
            .attr('class', 'blue')
            .attr('text-anchor', 'middle')
            .attr('x', q3)
            .attr('y', 25)
            .text(width > 400 ? 'ABOVE' : 'A');

        svg.append('circle')                            // Append blue circle for ABOVE count.
            .attr('class', 'blue')
            .attr('cx', width - 90)
            .attr('cy', 10)
            .attr('r', 8);

        var aboveLabel = svg.append('text')             // Append text for ABOVE count.
            .attr('class', 'metric-label white')
            .attr('text-anchor', 'middle')
            .attr('x', width - 90)
            .attr('y', 13)
            .text(metrics.filter(r => r.above === true).length);

        svg.append('line')                              // Append vertical line in middle.
            .attr('x1', q2)
            .attr('y1', 25)
            .attr('x2', q2)
            .attr('y2', 30 + (17 * 13) + 3)
            .style('stroke', '#AAA');

        var spacing = 13;                               // Spacing between bars.

        metrics.forEach(function (m, i) {
            var y = 25 + (i * spacing) + 11;            // The y-value of current bar.

            svg.append('text')                          // Append title of current metric.
                .attr('class', 'white metric-title')
                .attr('text-anchor', 'middle')
                .attr('x', 30)
                .attr('y', y)
                .text(m.label);

            if (m.above === false) {                    // Append value of current metric.
                svg.append('text')
                    .attr('class', 'white metric-title')
                    .attr('text-anchor', 'middle')
                    .attr('x', 90)
                    .attr('y', y)
                    .text(m.value);
            }

            svg.append('rect')                          // Append background bar.
                .attr('x', margin)
                .attr('y', 30 + (i * spacing))
                .attr('width', width - margin - margin)
                .attr('height', barHeight)
                .style('fill', '#AAA');

            var barW = m.amount * ((width - margin - margin) / 2);

            if (m.above) { 
                var barX = q2;
                var circleX = q2 + barW;
            } else {
                var barX = q2 - barW;
                var circleX = q2 - barW;
            }

            if (m.value != 0) {                         // Append colored bar for metric value.
                svg.append('rect')
                    .attr('class', m.above ? 'blue' : 'red')
                    .attr('x', q2)
                    .attr('y', 30 + (i * spacing))
                    .attr('width', 0)
                    .attr('height', barHeight)
                    .transition()
                    .duration(1500)
                    .attr('x', barX)
                    .attr('width', barW);

                svg.append('circle')                    // Append colored circle for metric value.
                    .attr('class', m.above ? 'blue-circle' : 'red-circle')
                    .attr('cx', q2)
                    .attr('cy', 30 + (i * spacing) + (barHeight / 2))
                    .attr('r', barHeight + 1)
                    .transition()
                    .duration(1500)
                    .attr('cx', circleX);
            }

            if (m.above === true) {                     // Append value for current metric.
                svg.append('text')
                    .attr('class', 'white metric-title')
                    .attr('text-anchor', 'middle')
                    .attr('x', width - 90)
                    .attr('y', y)
                    .text(m.value);
            }

            svg.append('text')                          // Append title for current metric.
                .attr('class', 'white metric-title')
                .attr('text-anchor', 'middle')
                .attr('x', width - 30)
                .attr('y', y)
                .text(m.label);
        });
    });
}
