import "./App.css";
import InputContainer from "./InputContainer";
import MainPanelContainer from "./MainPanelContainer";
import SidePanelContainer from "./SidePanelContainer";
import ViewContainer from "./ViewContainer.js";

function App() {
    return (
        <div id="app-container">
            <InputContainer id="input-container" />
            <ViewContainer id="view-container" />
            <SidePanelContainer id="sidepanel-container" />
            <MainPanelContainer id="mainpanel-container" />
        </div>
    );
}

export default App;
