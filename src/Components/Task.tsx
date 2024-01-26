import { useEffect, useState } from "react";
import "../Styles/Task.css";
import "../Styles/Animation.css";
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
  const [animation, setAnimation] = useState("");
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    setTimeout(() => {
      editDone(id, e.target.checked).then(setTasks)
      setAnimation("");
    }, 500);
    setAnimation("task-check");
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimation("");
    }, 400);
    setAnimation("fade-in");
  }, [])

  return (
    <div
    className={"task task-" + mode + animation}
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
        onClick={() => {
          setTimeout(() => {
            removeTask(id).then(setTasks);
            setAnimation("");
          }, 400);
          setAnimation("fade-out");
        }}
      >
        <FaTrash/>
      </button>
    </div>
  )
}

export default Task;