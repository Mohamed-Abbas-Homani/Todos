import { useEffect, useState } from "react"
import "../Styles/Pomodoro.css"
import { FaPlay } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

type PomodoroState = {
  constWT: number,
  constBT: number,
  workTime:number;
  breakTime:number;
  status:number;
}

//Pomodoro technic!
const Pomodoro = () => {
  const [state, setState] = useState<PomodoroState>(
    {
      constWT: 60,
      constBT: 15,
      workTime: 60,
      breakTime: 15,
      status: 0,
    }
  )
  
  const convertInput = (text : string, initial: number) => Math.floor(Math.abs(Number(text))) || initial

  useEffect(() => {
    if(state.status === 1){
      const interval = setInterval(() => {

        setState(last => {
          if(last.workTime > 1)
            return {...last, workTime: last.workTime - 1}
          else {
            clearInterval(interval)
            return {...last, workTime: 0, status:2, breakTime:last.constBT}
          }
          })
      }, 60000);

      return () => clearInterval(interval)
    } else if(state.status === 2) {
      const interval = setInterval(() => {

        setState(last => {
          if(last.breakTime > 1)
            return {...last, breakTime: last.breakTime - 1}
          else {
            clearInterval(interval)
            return {...last, breakTime: 0, status:1, workTime:last.constWT}
          }
          })
      }, 60000);

      return () => clearInterval(interval)
    }
  }, [state])

  return (
    <div className="pomodoro">
      <input
        title="Work duration in minutes"
        disabled={state.status !== 0}
        type="text"
        value={state.workTime}
        maxLength={3}
        onChange={(e) => setState(
          {
            ...state,
            workTime:convertInput(e.target.value, 60),
            constWT:convertInput(e.target.value, 60)
          }
        )}
      />
      <span>{state.status == 0?"|":state.status==1?"work":"break"}</span>
      <input
        title="Break duration in minutes"
        disabled={state.status !== 0}
        type="text"
        value={state.breakTime}
        maxLength={3}
        onChange={(e) => setState(
          {
            ...state,
            breakTime:convertInput(e.target.value, 15),
            constBT:convertInput(e.target.value, 15)
          }
        )}
      />
      <button
      title="reset pomodoro"
      className="repeat-btn"
      onClick={() => setState(
        {
          ...state,
          status:0,
          workTime:state.constWT,
          breakTime:state.constBT
        }
      )}
      >
        <FaRepeat />
      </button>
      <button
      title="start pomodoro"
      disabled={state.status !== 0}
      className="play-btn"
      onClick={() => setState({...state, status:1})}
      >
        <FaPlay />
      </button>
    </div>
  )
}

export default Pomodoro