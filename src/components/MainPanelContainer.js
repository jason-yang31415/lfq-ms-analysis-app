import React from "react";
import Plot from "react-plotly.js";
import { connect } from "react-redux";
import { makePlotlyDataLayout } from "../Figures";

import { ready, py } from "../PyAnalysis";
import initFigure from "../python/init_figure.py";

class MainPanelContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            content: "Loading...",
        };
    }

    componentDidMount() {
        ready
            .then(() => fetch(initFigure))
            .then((res) => res.text())
            .then((src) => py().runPythonAsync(src))
            .then(() => {
                this.setState({
                    content: null,
                });
            });
    }

    render() {
        // TODO
        // const { id, figureOptions } = this.props;

        return (
            <>
                {this.state.content}
                <div id="figure-div"></div>
            </>
        );
    }
}

export default connect((state) => {
    return {
        // figureOptions: state.view.figureOptions,
    };
}, null)(MainPanelContainer);
