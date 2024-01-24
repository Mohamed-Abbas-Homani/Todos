import "../Styles/Bottom.css"
import { FaTrash } from "react-icons/fa6";
import { useSetTasks } from "../store";
import { clearTasks } from "../db";
import Pomodoro from "./Pomodoro";

//Usefull Buttons and Pomodoro.
const Bottom = () => {
  const setTasks = useSetTasks();
  return (
    <div className="bottom-container">
      <button
        title="Delete All Task!"
        className="clear-btn"
        onClick={() => clearTasks().then(() => setTasks([]))}
      >
        <FaTrash />
      </button>
      <Pomodoro />
    </div>
  )
}

export default Bottom;