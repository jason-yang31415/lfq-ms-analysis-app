import "./InputContainer.css";
import InputDataUpload from "./InputDataUpload";
import InputReplicateSelection from "./InputReplicateSelection";
import InputComparisonSelection from "./InputComparisonSelection";

function InputContainer({ id }) {
    return (
        <div id={id} className="input-container">
            <InputDataUpload />
            <InputReplicateSelection />
            <InputComparisonSelection />
        </div>
    );
}

export default InputContainer;
