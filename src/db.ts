import { invoke } from "@tauri-apps/api";
import { Task } from "./store";

export const addTask = async (task: Task) : Promise<Task[]> => {
  return await invoke("add_task", {task});
};

export const editDone = async (id: number | null, done: boolean) : Promise<Task[]> => {
  return await invoke("edit_done", {id, done});
};

export const removeTask = async (id: number | null) : Promise<Task[]> => {
  return await invoke("remove_task", {id});
};

export const getTasks = async () : Promise<Task[]> => {
  return await invoke("get_tasks", {});
};

export const clearTasks = async () => {
  await invoke("clear_tasks", {});
};