import d3 from 'd3';

export default {
    _transition() {
        console.log('transitionMixin:_transition');
        for (let key in this.props.transition.attributes()) {
            let attr = this.props.transition.attributes()[key];

            let interpolator = undefined;
            if (attr.tween) {
                // TODO: what to pass to the tween depends on the graph,
                // so need to think of something here.
                interpolator = attr.tween(this.props.e, this.props.arc);
            } else {
                let startVal = typeof attr.start === 'function' ?
                        attr.start.call(this,
                                        this.props.data,
                                        this.props.xScale,
                                        this.props.yScale) : attr.start;

                let endVal = typeof attr.end === 'function' ?
                        attr.end.call(this,
                                      this.props.data,
                                      this.props.xScale,
                                      this.props.yScale) : attr.end;

                interpolator = d3.interpolate(startVal !== undefined ? startVal : this.state[key], endVal);
            }

            d3.timer((elapsed) => {
                let t = elapsed / this.props.transition.duration();

                let state = {};
                state[key] = interpolator(this.props.transition.ease()(t));
                this.setState(state);

                if (t > 1) {
                    return true;
                }

                return false;
            }, this.props.transition.delay());
        }
    },

    componentDidMount() {
        console.log('transitionMixin:componentDidMount');
        if (this.props.transition) {
            this._transition();
        }
    },

    componentWillReceiveProps(nextProps) {
        console.log('transitionMixin:componentWillReceiveProps');

        let nextPropsNoChildren = removeKey(nextProps, 'children');

        let propsNoChildren = removeKey(this.props, 'children');

        if (this.props.transition && JSON.stringify(propsNoChildren) !== JSON.stringify(nextPropsNoChildren)) {
            this._transition();
        }
    }
};

function removeKey(child, key) {
    let empty = {};

    for (let k in child) {
        if (k === key) {
            continue;
        }
      //  console.log(key);
        if (!child.hasOwnProperty(k)) {
         //   console.log('fail 1');
            continue;
        }

        empty[k] = child[k];
    }

    return empty;
}
