import * as d3 from 'd3';

export default class TargetChart {

    constructor (element, options) {
        this._id = element.id;

        this._o = {
            height: options.height || 400
        }

        this._data = null;
    }

    data (data) {

    }
}