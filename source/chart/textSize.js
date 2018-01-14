import * as d3 from 'd3';

export default function textSize (selection, array) {
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