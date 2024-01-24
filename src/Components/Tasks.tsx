import { ReactNode, useEffect } from "react";
import "../Styles/Tasks.css"
import { useMode, useSetTasks, useTasks } from "../store"
import { getTasks } from "../db";
import Task from "./Task";

//Generic Lister!
function List<ListItem>({
  items,
  render,
  filter,
} : {
  items: ListItem[];
  render: (item: ListItem, index?:number) => ReactNode;
  filter?: (item: ListItem) => Boolean;
}) {
  return (
    <div>
      {items
      .filter((item) => filter? filter(item):true)
      .map((item, key) => (
        <div key={key}>
          {render(item, key)}
        </div>
      ))}
    </div>
  )
}

//List Tasks.
const Tasks = () => {
  const mode = useMode();
  const tasks = useTasks();
  const setTasks = useSetTasks();

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])



  return (
    <div className={"tasks-container tasks-container-" +  mode}>
      <List
        items={tasks}
        render={(task, index) => <Task {...task} index={index! + 1}/>}
      />
      <span className="total">
        {!!tasks.length?`Total ${tasks.length} tasks` : "Empty !"}
      </span>
    </div>
  )
}

export default Tasks
