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
    }

    options (options) {
        this._o = {
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

        /*var boxes = this._d.map((d, i) => {
            var e = svg.append('text').text(d.label || i);
            var box = e.node().getBBox();
            e.remove();
            return { w: box.width, h: box.height };
        });*/
        //var labelW = labelSize.w; //Math.max.apply(null, boxes.map(b => b.w));
        //var labelH = labelSize.h; //Math.max.apply(null, boxes.map(b => b.h));
        /*console.log({
            labelWidth: labelW,
            labelHeight: labelH
        });*/

        var valueSize = textSize(svg, this._d.map(d => d.value.toString()))

        const labelM = 5;
        const valueM = 5;

        const labelC = labelM * 2 + labelSize.w;
        const valueC = valueM * 2 + valueSize.w;

        const barC = w - (2 * labelC + 2 * valueC);
        //const barC = w - 2 * labelC;

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
                .style('fill', '#DDD');

            const percentage = Math.abs(d.target - d.value) / d.stdDev;
            //const barW = percentage * 
            //var 

            svg.append('rect')
                .attr('x')
                .attr('y')
                .attr('width')
                .attr('height')
                .style('fill', )
                
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
                .attr('y', y + (barH / 2) + (this._o.fontSize / 2))
                .attr('fill', this._o.textColor)
                .text(d.value);
        }
    }
}