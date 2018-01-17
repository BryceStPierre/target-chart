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
    }

    options (options) {
        this._o = {
            barHeight: options.barHeight || 20,
            bgColor: options.bgColor || 'none',
            height: options.height || 350,
            highColor: options.highColor || '#FF4C3B',
            font: options.font || 'sans-serif',
            fontSize: options.fontSize || 12,
            lowColor: options.lowColor || '#0072BB',
            showLabels: options.showLabels === undefined ? true : options.showLabels,
            textColor: options.textColor || '#111111',
            title: options.title || null,
            width: this._e.clientWidth >= 320 ? this._e.clientWidth : 320
        }
    }

    data (data) {
        this._d = data;

        this._c = {
            m: {
                label: 5,
                value: 5,
                title: this._o.title ? this._o.barHeight * 4.5 : this._o.barHeight * 3,
                bar: 3 * this._o.barHeight / 4
            }
        };

        if (!this._o.title && !this._o.showLabels)
            this._c.m.title = this._o.barHeight * 2;

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
        console.log(this._o);

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

        var labelSize = this.textSize(svg, this._d.map(d => d.label));
        var valueSize = this.textSize(svg, this._d.map(d => d.value.toString()))

        const labelC = this._c.m.label * 2 + labelSize.w;
        const valueC = this._c.m.value * 2 + valueSize.w;
        
        const barH = this._o.barHeight;
        const barC = w - (2 * labelC + 2 * valueC) - 2 * barH;

        if (this._o.title) {
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', this._c.m.title - 10 * barH / 3)
                .style('font-size', '16px')
                .style('fill', this._o.textColor)
                .text(this._o.title);
        }

        svg.append('line')
            .attr('x1', w / 2)
            .attr('y1', this._c.m.title - this._c.m.bar)
            .attr('x2', w / 2)
            .attr('y2', h - this._c.m.bar)
            .style('stroke', '#EEE')
            .style('stroke-width', '3px')

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', labelC + valueC + barH)
            .attr('y', this._c.m.title - 3 * barH / 4)
            .style('fill', this._o.textColor)
            .text('-1 STD');

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', labelC + valueC + barH + barC)
            .attr('y', this._c.m.title - 3 * barH / 4)
            .style('fill', this._o.textColor)
            .text('+1 STD');

        if (this._o.showLabels) {
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', labelC + valueC + barH)
                .attr('y', this._c.m.title - 2 * barH)
                .style('fill', this._o.lowColor)
                .style('font-size', '14px')
                .text('BELOW');

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', this._c.m.title - 2 * barH)
                .style('fill', this._o.textColor)
                .style('font-size', '14px')
                .text('TARGET');

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', labelC + valueC + barH + barC)
                .attr('y', this._c.m.title - 2 * barH)
                .style('fill', this._o.highColor)
                .style('font-size', '14px')
                .text('ABOVE');
        }

        const n = this._d.length;

        for (var y = this._c.m.title, i = 0; y < h, i < n; y += barH + this._c.m.bar, i++) {

            const d = this._d[i];
            const below = d.value < d.target;

            var barP = Math.abs(d.target - d.value) / d.stdDev;
            barP = barP > 1 ? 1 : barP;

            const barW = barP * barC / 2;
            const barX = below ? w / 2 - barW : w / 2;

            svg.append('rect')
                .attr('x', labelC + valueC + barH)
                .attr('y', y)
                .attr('width', barC)
                .attr('height', barH)
                .style('fill', '#EEE');

            svg.append('rect')
                .attr('x', w / 2)
                .attr('y', y)
                .attr('width', 0)
                .attr('height', barH)
                .style('fill', below ? this._o.lowColor : this._o.highColor)
                .transition()
                .duration(1500)
                .attr('x', barX)
                .attr('width', barW);
                
            svg.append('circle')
                .attr('cx', w / 2)
                .attr('cy', y + barH / 2)
                .attr('r', barH / 2 + this._o.fontSize / 2)
                .style('fill', '#FFF')
                .style('stroke', below ? this._o.lowColor : this._o.highColor)
                .style('stroke-width', '1px')
                .transition()
                .duration(1500)
                .attr('cx', below ? barX : w / 2 + barW);

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', labelC / 2)
                .attr('y', y + (barH / 2) + ((this._o.fontSize - 2) / 2))
                .attr('fill', this._o.textColor)
                .text(d.label);

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', w - labelC / 2)
                .attr('y', y + (barH / 2) + ((this._o.fontSize - 2) / 2))
                .attr('fill', this._o.textColor)
                .text(d.label);

            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', below ? labelC + valueC / 2 : w - labelC - valueC / 2)
                .attr('y', y + (barH / 2) + ((this._o.fontSize - 2) / 2))
                .attr('fill', this._o.textColor)
                .text(d.value);
        }
    }
    
    textSize (selection, array) {
        var boxes = array.map(d => {
            var e = selection.append('text').text(d);
            var box = e.node().getBBox();
            e.remove();
            return {
                w: box.width,
                h: box.height
            };
        });
        return {
            w: Math.max.apply(null, boxes.map(b => b.w)),
            h: Math.max.apply(null, boxes.map(b => b.h))
        };
    }
}