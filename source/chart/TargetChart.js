import * as d3 from 'd3';

import textSize from './textSize';

export default class TargetChart {

    constructor (...args) {
        if (args.length < 1) {
            console.log('TargetChart: Incorrect arguments.');
            return;
        } else if (args.length === 1) {
            this._e = args[0];
            this.options({});
        } else if (args.length > 1) {
            this._e = args[0];
            this.options(args[1]);
        }
        this.data(null);
        this._c = null;
    }

    options (options) {
        this._o = {
            barHeight: options.barHeight || 'null',
            bgColor: options.bgColor || 'transparent',
            highColor: options.highColor || 'red',
            lowColor: options.lowColor || 'blue',
            textColor: options.textColor || '#111',
            font: options.font || 'sans-serif',
            fontSize: options.fontSize || 14,
            height: options.height || 350,
            //minMaxMode: options.minMaxMode || false,
            width: this._e.clientWidth >= 320
                ? this._e.clientWidth
                : 320
        }
        console.log(this._o);
    }

    data (data) {
        this._d = data;

        this._c = {
            m: {
                label: 5,
                value: 5,
                bar: 30
            },
            t: {
                title: 50
            }
        };
    }

    reset () {
        this._e.innerHTML = '';
        this.options(this._o);
    }

    render () {
        this.reset();

        var w = this._o.width,
            h = this._o.height;

        var svg = d3.select(`#${this._e.id}`)
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .style('font-family', this._o.font)
            .style('font-size', `${this._o.fontSize}px`);

        svg.append('rect')
            .attr('width', w)
            .attr('height', h)
            .style('fill', this._o.bgColor);

        if (this._d === null) {
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', h / 2 + 14)
                .style('fill', this._o.textColor)
                .text('No data.');
            return;
        }

        var labelSize = textSize(svg, this._d.map(d => d.label));
        var valueSize = textSize(svg, this._d.map(d => d.value.toString()))

        const labelM = 5;
        const valueM = 5;

        const labelC = labelM * 2 + labelSize.w;
        const valueC = valueM * 2 + valueSize.w;

        const barC = w - (2 * labelC + 2 * valueC);

        const n = this._d.length;
        const barCMT = 50;
        const barM = 30;

        const barH = ((h - barCMT) / n) - barM;

        for (var y = barCMT, i = 0; y < h, i < n; y += (h - barCMT) / n, i++) {
            var d = this._d[i];
            var below = d.value < d.target;

            svg.append('rect')
                .attr('x', labelC + valueC) //labelC
                .attr('y', y)
                .attr('width', barC)
                .attr('height', barH)
                .style('fill', '#EEE');

            const barW = (Math.abs(d.target - d.value) / d.stdDev) * barC / 2;
            const barX = below ? w / 2 - barW : w / 2;

            svg.append('rect')
                .attr('x', barX)
                .attr('y', y)
                .attr('width', barW)
                .attr('height', barH)
                .style('fill', below ? this._o.lowColor : this._o.highColor);
                
            svg.append('circle')
                .attr('cx', below ? barX : w / 2 + barW)
                .attr('cy', y + barH / 2)
                .attr('r', barH / 2 + barM / 2)
                .style('fill', '#FFF')
                .style('stroke', below ? this._o.lowColor : this._o.highColor)
                .style('stroke-width', '1px');

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', labelC / 2)
                .attr('y', y + (barH / 2) + (this._o.fontSize / 2))
                .attr('fill', this._o.textColor)
                .text(d.label);

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w - labelC / 2)
                .attr('y', y + (barH / 2) + (this._o.fontSize / 2))
                .attr('fill', this._o.textColor)
                .text(d.label);

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', below ? labelC + valueC / 2 : w - labelC - valueC / 2)
                .attr('y', y + (barH / 2) + ((this._o.fontSize - 2) / 2))        // Tested -2 for precision?
                .attr('fill', this._o.textColor)
                .text(d.value);
        }
    }
}