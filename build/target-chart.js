'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TargetChart = function () {
    function TargetChart() {
        _classCallCheck(this, TargetChart);

        if (arguments.length < 1) {
            console.error('TargetChart: Incorrect arguments.');
            return;
        } else if (arguments.length === 1) {
            this._e = arguments.length <= 0 ? undefined : arguments[0];
            this.options({});
        } else if (arguments.length > 1) {
            this._e = arguments.length <= 0 ? undefined : arguments[0];
            this.options(arguments.length <= 1 ? undefined : arguments[1]);
        }
    }

    _createClass(TargetChart, [{
        key: 'options',
        value: function options(_options) {
            this._o = {
                barHeight: _options.barHeight || 20,
                bgColor: _options.bgColor || 'none',
                height: _options.height || 350,
                highColor: _options.highColor || '#FF4C3B',
                font: _options.font || 'sans-serif',
                fontSize: _options.fontSize || 12,
                lowColor: _options.lowColor || '#0072BB',
                showLabels: _options.showLabels === undefined ? true : _options.showLabels,
                textColor: _options.textColor || '#111111',
                title: _options.title || null,
                width: this._e.clientWidth >= 320 ? this._e.clientWidth : 320
            };
        }
    }, {
        key: 'data',
        value: function data(_data) {
            this._d = _data;

            this._m = {
                label: 5,
                value: 5,
                title: this._o.title ? this._o.barHeight * 4.5 : this._o.barHeight * 3,
                bar: 3 * this._o.barHeight / 4
            };

            if (!this._o.title && !this._o.showLabels) this._m.title = this._o.barHeight * 2;

            this._o.height = this._m.title + this._d.length * (this._o.barHeight + this._m.bar);
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._e.innerHTML = '';
            this.options(this._o);
        }
    }, {
        key: 'render',
        value: function render() {
            this.reset();
            //console.log(this._o);

            var w = this._o.width,
                h = this._o.height;

            var svg = d3.select('#' + this._e.id).append('svg').attr('width', w).attr('height', h).style('font-family', this._o.font).style('font-size', this._o.fontSize + 'px');

            svg.append('rect').attr('width', w).attr('height', h).style('fill', this._o.bgColor);

            if (!this._d || !this._m) {
                svg.append('text').attr('text-anchor', 'middle').attr('x', w / 2).attr('y', h / 2 + this._o.fontSize).style('fill', this._o.textColor).text('No data.');
                return;
            }

            var labelSize = this.textSize(svg, this._d.map(function (d) {
                return d.label;
            }));
            var valueSize = this.textSize(svg, this._d.map(function (d) {
                return d.value.toString();
            }));

            var labelC = this._m.label * 2 + labelSize.w;
            var valueC = this._m.value * 2 + valueSize.w;

            var barH = this._o.barHeight;
            var barC = w - (2 * labelC + 2 * valueC) - 2 * barH;

            if (this._o.title) {
                svg.append('text').attr('text-anchor', 'middle').attr('x', w / 2).attr('y', this._m.title - 10 * barH / 3).style('font-size', '16px').style('fill', this._o.textColor).text(this._o.title);
            }

            svg.append('line').attr('x1', w / 2).attr('y1', this._m.title - this._m.bar).attr('x2', w / 2).attr('y2', h - this._m.bar).style('stroke', '#EEE').style('stroke-width', '3px');

            svg.append('text').attr('text-anchor', 'middle').attr('x', labelC + valueC + barH).attr('y', this._m.title - 3 * barH / 4).style('fill', this._o.textColor).text('-1 STD');

            svg.append('text').attr('text-anchor', 'middle').attr('x', labelC + valueC + barH + barC).attr('y', this._m.title - 3 * barH / 4).style('fill', this._o.textColor).text('+1 STD');

            if (this._o.showLabels) {
                svg.append('text').attr('text-anchor', 'middle').attr('x', labelC + valueC + barH).attr('y', this._m.title - 2 * barH).style('fill', this._o.lowColor).style('font-size', '14px').text('BELOW');

                svg.append('text').attr('text-anchor', 'middle').attr('x', w / 2).attr('y', this._m.title - 2 * barH).style('fill', this._o.textColor).style('font-size', '14px').text('TARGET');

                svg.append('text').attr('text-anchor', 'middle').attr('x', labelC + valueC + barH + barC).attr('y', this._m.title - 2 * barH).style('fill', this._o.highColor).style('font-size', '14px').text('ABOVE');
            }

            var n = this._d.length;

            for (var y = this._m.title, i = 0; y < h, i < n; y += barH + this._m.bar, i++) {

                var d = this._d[i];
                var below = d.value < d.target;

                var barP = Math.abs(d.target - d.value) / d.std;
                barP = barP > 1 ? 1 : barP;

                var barW = barP * (barC / 2);
                var barX = below ? w / 2 - barW : w / 2;

                svg.append('rect').attr('x', labelC + valueC + barH).attr('y', y).attr('width', barC).attr('height', barH).style('fill', '#EEE');

                svg.append('rect').attr('x', w / 2).attr('y', y).attr('width', 0).attr('height', barH).style('fill', below ? this._o.lowColor : this._o.highColor).transition().duration(1500).attr('x', barX).attr('width', barW);

                svg.append('circle').attr('cx', w / 2).attr('cy', y + barH / 2).attr('r', barH / 2 + this._o.fontSize / 2).style('fill', '#FFF').style('stroke', below ? this._o.lowColor : this._o.highColor).style('stroke-width', '1px').transition().duration(1500).attr('cx', below ? barX : w / 2 + barW);

                svg.append('text').attr('text-anchor', 'middle').attr('x', labelC / 2).attr('y', y + barH / 2 + (this._o.fontSize - 2) / 2).attr('fill', this._o.textColor).text(d.label);

                svg.append('text').attr('text-anchor', 'middle').attr('x', w - labelC / 2).attr('y', y + barH / 2 + (this._o.fontSize - 2) / 2).attr('fill', this._o.textColor).text(d.label);

                svg.append('text').attr('text-anchor', 'middle').attr('x', below ? labelC + valueC / 2 : w - labelC - valueC / 2).attr('y', y + barH / 2 + (this._o.fontSize - 2) / 2).attr('fill', this._o.textColor).text(d.value);
            }
        }
    }, {
        key: 'textSize',
        value: function textSize(selection, array) {
            var boxes = array.map(function (d) {
                var e = selection.append('text').text(d);
                var box = e.node().getBBox();
                e.remove();
                return {
                    w: box.width,
                    h: box.height
                };
            });
            return {
                w: Math.max.apply(null, boxes.map(function (b) {
                    return b.w;
                })),
                h: Math.max.apply(null, boxes.map(function (b) {
                    return b.h;
                }))
            };
        }
    }]);

    return TargetChart;
}();