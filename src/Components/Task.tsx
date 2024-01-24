import { useState } from "react";
import "../Styles/Task.css"
import { useMode, useSetTasks } from "../store";
import { FaTrash } from "react-icons/fa6";
import { editDone, removeTask } from "../db";

//Simple Task.
const Task = ({
    id,
    text,
    done,
    index,
  } : {
    id:number | null;
    text:string;
    done:boolean;
    index:number;
  }
) => {
  const mode = useMode();
  const setTasks = useSetTasks();
  const [checked, setChecked] = useState(done);
  const [showNum, setShowNum] = useState(false);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    editDone(id, e.target.checked).then(setTasks)
  };

  return (
    <div
    className={"task task-" + mode}
    onMouseOver={() => setShowNum(true)}
    onMouseLeave={() => setShowNum(false)}
    >
      <p>{text}</p>
      <input
        title={"Mark as " + (checked? "undone":"done")}
        className="check-done"
        type="checkbox"
        checked={checked}
        onChange={handleCheck}
      />
      
      {showNum &&
        <span className="task-number">{index}</span>
      }
      <button
        title="Delete Task!"
        className="delete-btn"
        onClick={() => removeTask(id).then(setTasks)}
      >
        <FaTrash/>
      </button>
    </div>
  )
}

export default Task;