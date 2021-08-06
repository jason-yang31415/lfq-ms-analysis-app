import React from "react";
import { connect } from "react-redux";
import "./ReplOutput.css";

function ReplOutput({ index, context, code, results, error }) {
    return (
        <div className="repl-block">
            <span>
                [{index}]: {context}
            </span>
            <pre className="repl-code">{code}</pre>
            {results ? <pre className="repl-results">{results}</pre> : null}
            {error ? <pre className="repl-error">{error}</pre> : null}
        </div>
    );
}

export default connect(null, null)(ReplOutput);
