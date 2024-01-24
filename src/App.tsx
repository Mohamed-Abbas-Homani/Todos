import "./App.css";
import Bottom from "./Components/Bottom";
import Input from "./Components/Input";
import Tasks from "./Components/Tasks";
import { useMode } from "./store";

//Global App.
function App() {
  const mode = useMode()
  return (
    <div className={"container container-" + mode}>
      <Input />
      <Tasks />
      <Bottom />
    </div>
  );
}

export default App;
