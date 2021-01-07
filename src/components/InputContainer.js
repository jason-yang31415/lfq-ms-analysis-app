import "./InputContainer.css";
import InputDataUpload from "./InputDataUpload";
import InputReplicateSelection from "./InputReplicateSelection";

function InputContainer({ id }) {
    return (
        <div id={id} className="input-container">
            <InputDataUpload />
            <InputReplicateSelection />
        </div>
    );
}

export default InputContainer;
