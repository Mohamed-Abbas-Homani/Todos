import { useEffect, useState } from "react";
import "../Styles/Tasks.css"
import { useMode, useSetTasks, useTasks } from "../store"
import { getTasks } from "../db";
import Task from "./Task";

//List Tasks.
const Tasks = () => {
  const mode = useMode();
  const tasks = useTasks();
  const setTasks = useSetTasks();
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  const alongWithFilter = (
    first:string | boolean,
    second:string | boolean,
    third:string | boolean
  ) => (
    filter==="all"?
    first:
    filter==="just complete"?
    second:
    third
  )

  return (
    <div className={"tasks-container tasks-container-" +  mode}>
      <div>
        {tasks
        .filter((task) => alongWithFilter(true, task.done, !task.done))
        .map((task, key) => (
          <Task
            key={task.id!}
            {...task}
            index={key + 1}
          />
          )
        )
        }
      </div>
      <div className="info-bar">
        <span className="total">
          {!!tasks.length?`Total ${tasks.length} tasks` : "Empty !"}
        </span>
        {!!tasks.length && 
        <button
          className="filter-btn"
          title={"show " + String(alongWithFilter("just complete", "just uncomplete", "all"))}
          style={{
            backgroundColor: String(alongWithFilter("#565656", "#56c956", "#c95656"))
          }}
          onClick={() => {
            setFilter(String(alongWithFilter("just complete", "just uncomplete", "all")))
          }}
        >
        </button>}
      </div>
    </div>
  )
}

export default Tasks
