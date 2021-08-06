import React from "react";
import { connect } from "react-redux";
import "./ReplOutput.css";

function ReplOutput({ index, context, code, results, error }) {
    return (
        <div>
            <pre>{code}</pre>
            <pre>{results}</pre>
        </div>
    );
}

export default connect(null, null)(ReplOutput);
