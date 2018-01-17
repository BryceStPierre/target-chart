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
    }

    options (options) {
        this._o = {
            barHeight: options.barHeight || 50,
            bgColor: options.bgColor || 'transparent',
            highColor: options.highColor || '#FF4C3B',
            lowColor: options.lowColor || '#0072BB',
            title: options.title || null,
            textColor: options.textColor || '#111',
            font: options.font || 'sans-serif',
            fontSize: options.fontSize || 14,
            height: options.height || 350,
            width: this._e.clientWidth >= 320 ? this._e.clientWidth : 320
        }
        console.log(this._o);
    }

    data (data) {
        this._d = data;

        this._c = {
            m: {
                label: 5,
                value: 5,
                title: 100,
                bar: 3 * this._o.barHeight / 4
            }
        };

        if (this._o.barHeight === null)
            this._o.barHeight = (this._o.height - this._c.m.title) / this._d.length - this._c.m.bar;
        else
            this._o.height = this._c.m.title + this._d.length * (this._o.barHeight + this._c.m.bar);
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

        if (!this._d || !this._c) {
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', h / 2 + this._o.fontSize)
                .style('fill', this._o.textColor)
                .text('No data.');
            return;
        }

        if (this._o.title) {
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', 26)
                .style('font-size', '20px')
                .style('fill', this._o.textColor)
                .text(this._o.title);
        }

        svg.append('line')
            .attr('x1', w / 2)
            .attr('y1', this._c.m.title - this._c.m.bar / 2)
            .attr('x2', w / 2)
            .attr('y2', h - this._c.m.bar)
            .style('stroke', '#EEE')
            .style('stroke-width', '4px')

        var labelSize = textSize(svg, this._d.map(d => d.label));
        var valueSize = textSize(svg, this._d.map(d => d.value.toString()))

        const labelC = this._c.m.label * 2 + labelSize.w;
        const valueC = this._c.m.value * 2 + valueSize.w;
        
        const barH = this._o.barHeight;
        const barC = w - (2 * labelC + 2 * valueC) - 2 * barH;

        const n = this._d.length;

        for (var y = this._c.m.title, i = 0; y < h, i < n; y += barH + this._c.m.bar, i++) {
            const d = this._d[i];
            const below = d.value < d.target;
            const barW = (Math.abs(d.target - d.value) / d.stdDev) * barC / 2;
            const barX = below ? w / 2 - barW : w / 2;

            svg.append('rect')
                .attr('x', labelC + valueC + barH)
                .attr('y', y)
                .attr('width', barC)
                .attr('height', barH)
                .style('fill', '#EEE');

            svg.append('rect')
                .attr('x', barX)
                .attr('y', y)
                .attr('width', barW)
                .attr('height', barH)
                .style('fill', below ? this._o.lowColor : this._o.highColor);
                
            svg.append('circle')
                .attr('cx', below ? barX : w / 2 + barW)
                .attr('cy', y + barH / 2)
                .attr('r', barH / 2 + this._o.fontSize / 2)
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