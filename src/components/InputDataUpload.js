import { connect } from "react-redux";
import { onDataUpload } from "../RunAnalysis";

function InputDataUpload({ onDataUpload }) {
    return (
        <div>
            <label htmlFor="dataUpload">
                (1) Select data to begin analysis:{" "}
            </label>
            <input
                type="file"
                id="dataUpload"
                name="dataUpload"
                onInput={(e) => onDataUpload(e.target.files[0])}
            />

            <ul>
                <li>
                    View log-transformed intensity distributions per sample as
                    violin plot or boxplot.
                </li>
            </ul>
        </div>
    );
}

export default connect(null, (dispatch) => {
    return {
        onDataUpload: (file) => {
            dispatch(onDataUpload(file));
        },
    };
})(InputDataUpload);
