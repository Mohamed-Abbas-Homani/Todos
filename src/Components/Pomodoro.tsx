import { useEffect, useState } from "react"
import "../Styles/Pomodoro.css"
import { FaPlay } from "react-icons/fa";
import { FaRepeat, FaStop } from "react-icons/fa6";

type PomodoroState = {
  constWT: number | string,
  constBT: number | string,
  workTime:number | string;
  breakTime:number | string;
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
          if(Number(last.workTime) > 1)
            return {...last, workTime: Number(last.workTime) - 1}
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
          if(Number(last.breakTime) > 1)
            return {...last, breakTime: Number(last.breakTime) - 1}
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
            workTime:e.target.value,
          }
        )}
      />
      <span>
        {[1, 2].includes(state.status) &&  <sup className="its">it's </sup>}
        {state.status == 0?"|":state.status==1?"work":state.status==2?"break":"pause"}
        {[1, 2].includes(state.status) && <sup className="time"> time</sup>}
      </span>
      <input
        title="Break duration in minutes"
        disabled={state.status !== 0}
        type="text"
        value={state.breakTime}
        maxLength={3}
        onChange={(e) => setState(
          {
            ...state,
            breakTime:e.target.value,
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
      title={
        state.status==0?
        'Play Pomodoro':
        state.status<3?
        "Stop Pomodoro":
        "Continue Pomodoro"
      }
      className="play-btn"
      onClick={() => {
        if(![1,2].includes(state.status))
        setState(
        {
          ...state,
          status: state.status == 4? 2 : 1,
          workTime: !state.status ? convertInput(String(state.workTime), Number(state.constWT)): state.workTime,
          constWT: !state.status ? convertInput(String(state.workTime), Number(state.constWT)):state.constWT,
          breakTime: !state.status ? convertInput(String(state.breakTime), Number(state.constBT)): state.breakTime,
          constBT: !state.status ? convertInput(String(state.breakTime), Number(state.constBT)):state.constBT,
        }
        )
        else {
          setState(
            {
              ...state,
              status:state.status == 1? 3 : 4
            }
          )
        }
      }
      }
      >
        {![1,2].includes(state.status) ? <FaPlay /> : <FaStop />}
      </button>
    </div>
  )
}

export default Pomodoro;