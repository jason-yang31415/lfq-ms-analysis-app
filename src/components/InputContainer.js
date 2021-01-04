import { connect } from "react-redux";
import { onDataUpload } from "../RunAnalysis";

import "./InputContainer.css";

function InputContainer({ id, onDataUpload }) {
    return (
        <div id={id} className="input-container">
            <div>
                <label htmlFor="dataUpload">Upload data: </label>
                <input
                    type="file"
                    id="dataUpload"
                    name="dataUpload"
                    onInput={(e) => onDataUpload(e.target.files[0])}
                />
            </div>
        </div>
    );
}

export default connect(null, (dispatch) => {
    return {
        onDataUpload: (file) => {
            dispatch(onDataUpload(file));
        },
    };
})(InputContainer);
