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
        const minWidth = this._e.clientWidth < 200 ? 200 : this._e.clientWidth;
        this._o = {
            bgColor: options.bgColor || 'transparent',
            hiColor: options.hiColor || 'red',
            loColor: options.loColor || 'blue',
            textColor: options.textColor || '#111',
            font: options.font || 'sans-serif',
            fontSize: options.fontSize || 14,
            height: options.height || 400,
            minMaxMode: options.minMaxMode || false,
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
                .attr('y', h / 2 - 20)
                .style('fill', this._o.textColor)
                .text('No data.');
            return;
        }
    }
}