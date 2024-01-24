use rusqlite::{Connection, named_params};
use tauri::AppHandle;
use std::fs;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Task {
    pub id: Option<u64>,
    pub text: String,
    pub done: bool, 
}

const CURRENT_DB_VERSION: u32 = 1;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("todo.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| { Ok(row.get(0)?) })?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

pub fn upgrade_database_if_needed(db: &mut Connection, existing_version: u32) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
            CREATE TABLE tasks (
                id INTEGER PRIMARY KEY,
                text TEXT,
                done INTEGER DEFAULT 0
            );
            "
        )?;

        tx.commit()?;
    }

    Ok(())
}

pub fn insert_task(task: &Task, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("INSERT INTO tasks (text, done) VALUES (@text, @done)")?;
    statement.execute(named_params! {
        "@text": &task.text,
        "@done": task.done,
    })?;

    Ok(())
}

pub fn set_done(id: u64, done: bool, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("
    UPDATE tasks
    SET done = @done
    WHERE id = @id;
")?;
    statement.execute(named_params! {
        "@id": id,
        "@done": done,
    })?;

    Ok(())
}

pub fn delete_task(id : u64, db: &Connection) ->Result<(), rusqlite::Error> {
    let mut statement = db.prepare("
        DELETE FROM tasks
        WHERE id = @id;
    ")?;
    statement.execute(named_params! {"@id": id})?;

    Ok(())
}

pub fn delete_all_tasks(db: &Connection) ->Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM tasks")?;
    statement.execute(named_params! {})?;
    Ok(())
}



pub fn get_all_tasks(db: &Connection) -> Result<Vec<Task>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM tasks")?;
    let mut rows = statement.query([])?;
    let mut tasks = Vec::new();

    while let Some(row) = rows.next()? {
        let id: Option<u64> = row.get("id")?;
        let text: String = row.get("text")?;
        let done: bool = row.get("done")?;

        let task = Task {
            id,
            text,
            done,
        };

        tasks.push(task);
    }

    Ok(tasks)
}