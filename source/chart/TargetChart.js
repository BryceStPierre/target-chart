import * as d3 from 'd3';

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
        const minWidth = this._e.clientWidth >= 320 
            ? this._e.clientWidth 
            : 320;
        this._o = {
            bgColor: options.bgColor || 'transparent',
            highColor: options.highColor || 'red',
            lowColor: options.lowColor || 'blue',
            textColor: options.textColor || '#111',
            font: options.font || 'sans-serif',
            fontSize: options.fontSize || 14,
            height: options.height || 350,
            //minMaxMode: options.minMaxMode || false,
            width: options.width || minWidth
        }
        console.log(this._o);
    }

    data (data) {
        this._d = data;
    }

    render () {
        var w = this._o.width,
            h = this._o.height;

        document.getElementById(this._e.id).innerHTML = '';
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

        var boxes = this._d.map((d, i) => {
            var e = svg.append('text').text(d.label || i);
            var box = e.node().getBBox();
            e.remove();
            return { w: box.width, h: box.height };
        });
        var labelW = Math.max.apply(null, boxes.map(b => b.w));
        var labelH = Math.max.apply(null, boxes.map(b => b.h));
        /*console.log({
            labelWidth: labelW,
            labelHeight: labelH
        });*/
        const labelM = 5;

        const labelC = labelM * 2 + labelW;
        const barC = w - 2 * labelC;

        var n = this._d.length;
        const barCMT = 50;
        const barM = 30;

        const barH = ((h - barCMT) / n) - barM;

        for (var y = barCMT, i = 0; y < h, i < n; y += (h - barCMT) / n, i++) {
            svg.append('rect')
                .attr('x', labelC)
                .attr('y', y)
                .attr('width', barC)
                .attr('height', barH)
                .style('fill', '#DDD');
                
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', labelC / 2)
                .attr('y', y + (barH / 2) + (this._o.fontSize / 2))
                .attr('fill', this._o.textColor)
                .text(this._d[i].label);
        }
    }
}