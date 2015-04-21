import d3 from 'd3';

export default class {
	constructor() {
		this._attributes = {};
		this._styles = {};

		this._delay = 0;
		this._duration = 250;
		this._ease = d3.ease('linear');
	}

	delay(delay) {
		if (!delay) {
			return this._delay;
		}

		this._delay = delay;
		return this;
	}

	duration(duration) {
		if (!duration) {
			return this._duration;
		}

		this._duration = duration;
		return this;
	}

	ease(value, args) {
		if (!value) {
			return this._ease;
		}

		if (typeof(value) === 'function') {
			this._ease = value;
		} else {
			this._ease = d3.ease(value, args);
		}
		return this;
	}

	attr(name, end, start) {
		this._attributes[name] = {end: end, start: start};
		return this;
	}

	attrTween(name, tween) {
		this._attributes[name] = {tween: tween};
		return this;
	}

	style(name, value) {
		this._styles[name] = value;
		return this;
	}

	attributes() {
		return this._attributes;
	}

	// let styleTween

	// each for events? start/stop?
	// what about enter/leave?
}
