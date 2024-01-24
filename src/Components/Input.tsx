import React, { useState } from "react";
import { useCurrent, useMode, useSetCurrent, useSetTasks, useToggleMode } from "../store"
import { addTask } from "../db";
import "../Styles/Input.css"
import { MdDarkMode, MdLightMode } from "react-icons/md";

//Adding & Editing Tasks.
const Input = () => {
  const mode = useMode();
  const setMode = useToggleMode();
  const current = useCurrent();
  const setCurrent = useSetCurrent();
  const setTasks = useSetTasks();
  const [message, setMessage] = useState<string>("Add a Task...");

  const showMessage = (msg: string) => {
    setTimeout(() => {
      setMessage("Add a Task...");
    }, 2000);
    setMessage(msg);
  }
  const isValid = () => current.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrent(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isValid()) {
        addTask(
          { id: null, text: current.trim(), done: false }
        ).then(setTasks);
        setCurrent("");
        showMessage("Task Added!");
      } else {
        showMessage("Input is not valid!")
      }
    }
  };


  return (
    <div className="input-container">
      <input
        type="text"
        className={"input-field input-field-" + mode }
        placeholder={message}
        value={current}
        maxLength={31}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
      <button
      onClick={() => setMode()}
      className="mode-btn">
        {mode === "light"?
          <MdDarkMode />
          :
          <MdLightMode />
        }
        
      </button>
      </div>
  )
}

export default Input;