import { create } from "zustand";

//Task Interface
export interface Task {
  id: number | null;
  text: string;
  done: boolean;
}

//Store Type
type todoStore = {
  mode: string;
  tasks: Task[];
  current: string;
  toggleMode: () => void;
  setTasks: (newTasks: Task[]) => void;
  setCurrent: (text: string) => void;
}

//Store
const useStore = create<todoStore>(set => ({
  mode: "light ",
  tasks: [],
  current: "",
  toggleMode: () => {
    set(state => (
      {
        ...state,
        mode:state.mode === 'light '? 'dark ' : 'light '
      }
    ))
  },
  setTasks: (newTasks) => {
    set({tasks:newTasks});
  },
  setCurrent: (text) => {
    set({current:text});
  },
}));


//Selectors
export const useMode = () => useStore(state => state.mode);
export const useToggleMode = () => useStore(state => state.toggleMode);
export const useTasks = () => useStore(state => state.tasks);
export const useSetTasks = () => useStore(state => state.setTasks);
export const useCurrent = () => useStore(state => state.current);
export const useSetCurrent = () => useStore(state => state.setCurrent);