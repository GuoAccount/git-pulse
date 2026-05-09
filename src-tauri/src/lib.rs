mod ai;
mod git;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            git::scan_git_repos,
            git::get_git_log,
            git::get_repo_authors,
            ai::generate_report,
            ai::test_ai_connection,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
