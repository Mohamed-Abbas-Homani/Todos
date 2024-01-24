// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;

use state::{AppState, ServiceAccess};
use tauri::{State, Manager, AppHandle};
use database::Task;

#[tauri::command]
fn get_tasks(app_handle: AppHandle) -> Vec<Task> {
    let tasks = app_handle.db(|db| database::get_all_tasks(db)).unwrap();
    tasks
}

#[tauri::command]
fn add_task(app_handle: AppHandle, task: Task) -> Vec<Task> {
    app_handle.db(|db| database::insert_task(&task, db)).unwrap();
    let tasks = app_handle.db(|db| database::get_all_tasks(db)).unwrap();
    tasks
}

#[tauri::command]
fn edit_done(app_handle: AppHandle, id: u64, done: bool) -> Vec<Task> {
    app_handle.db(|db| database::set_done(id, done, db)).unwrap();
    let tasks = app_handle.db(|db| database::get_all_tasks(db)).unwrap();
    tasks
}

#[tauri::command]
fn remove_task(app_handle: AppHandle, id: u64) -> Vec<Task> {
    app_handle.db(|db| database::delete_task(id, db)).unwrap();
    let tasks = app_handle.db(|db| database::get_all_tasks(db)).unwrap();
    tasks
}

#[tauri::command]
fn clear_tasks(app_handle: AppHandle) {
    app_handle.db(|db| database::delete_all_tasks(db)).unwrap();
}

fn main() {
    tauri::Builder::default()
        .manage(AppState { db: Default::default() })
        .invoke_handler(tauri::generate_handler![get_tasks, add_task, edit_done,remove_task, clear_tasks])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db = database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}