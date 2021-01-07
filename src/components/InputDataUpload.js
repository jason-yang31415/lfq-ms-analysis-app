import { connect } from "react-redux";
import { onDataUpload } from "../RunAnalysis";

function InputDataUpload({ onDataUpload }) {
    return (
        <div>
            <label htmlFor="dataUpload">Upload data: </label>
            <input
                type="file"
                id="dataUpload"
                name="dataUpload"
                onInput={(e) => onDataUpload(e.target.files[0])}
            />
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
