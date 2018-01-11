import * as d3 from 'd3';

export default class TargetChart {

    constructor (element, options) {
        this._e = element;

        this._o = {
            color: {
                bg: options.color.bg || 'transparent'
            },
            height: options.height || 400
        }

        this._d = null;
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
            .attr('height', h);

        svg.append('rect')
            .attr('width', w)
            .attr('height', h)
            .style('fill', this._o.color.bg);
    }
}