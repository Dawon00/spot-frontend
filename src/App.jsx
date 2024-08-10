import { Outlet } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Outlet />
      </div>
    </RecoilRoot>
  );
}

export default App;
