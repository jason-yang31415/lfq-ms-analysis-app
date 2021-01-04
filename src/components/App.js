import "./App.css";
import InputContainer from "./InputContainer";
import MainPanelContainer from "./MainPanelContainer";
import SidePanelContainer from "./SidePanelContainer";

function App() {
    return (
        <div id="app-container">
            <InputContainer id="input-container" />
            <SidePanelContainer id="sidepanel-container" />
            <MainPanelContainer id="mainpanel-container" />
        </div>
    );
}

export default App;
