mod backup;
mod chat;
mod commands;
mod db;
mod dblocation;
mod draft;
mod llm;
mod reminder;
mod review;
mod final_review;
mod revise;
mod secret;
mod providers;
mod service;
mod stats;
mod templates;
mod weather;
mod sse;

use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 单实例：必须最先注册；再次启动时聚焦已有窗口
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            commands::show_main(app);
        }))
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, Some(vec!["--autostart"])))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(commands::Streams::default())
        .manage(commands::PendingOpen::default())
        .on_window_event(|w, ev| match ev {
            WindowEvent::CloseRequested { api, .. } if w.label() == "main" => {
                match commands::on_close(w.app_handle()).as_str() {
                    "exit" => w.app_handle().exit(0),
                    "tray" => {
                        api.prevent_close();
                        commands::hide_to_tray(w.app_handle());
                    }
                    _ => {
                        // 每次询问：交给前端弹窗
                        api.prevent_close();
                        let _ = w.emit("close-requested", ());
                    }
                }
            }
            WindowEvent::Focused(true) if w.label() == "main" => {
                if let Some(gid) = commands::take_pending(w.app_handle()) {
                    let _ = w.emit("open-goal", gid);
                }
            }
            _ => {}
        })
        .setup(|app| {
            match app.path().app_data_dir() {
                Ok(dir) => {
                    // 自定义位置找不到时不新建空库，由前端提示用户选择
                    if let Err(e) = dblocation::open_current(&dir) {
                        eprintln!("[db] startup open: {e}");
                    }
                }
                Err(e) => eprintln!("[db] no app data dir: {e}"),
            }
            // 托盘
            let open_i = MenuItem::with_id(app, "open", "打开", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open_i, &quit_i])?;
            let mut tray = TrayIconBuilder::with_id("main-tray")
                .tooltip("目标计划助手")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, ev| match ev.id.as_ref() {
                    "open" => commands::show_main(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, ev| {
                    if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = ev {
                        commands::show_main(tray.app_handle());
                    }
                });
            if let Some(icon) = app.default_window_icon() {
                tray = tray.icon(icon.clone());
            }
            tray.build(app)?;
            // 开机自启：静默到托盘；否则正常显示窗口
            let silent = std::env::args().any(|a| a == "--autostart");
            if !silent {
                commands::show_main(app.handle());
            }
            // 提醒：每 30 秒检查
            let h = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                loop {
                    commands::reminder_tick(&h);
                    tokio::time::sleep(std::time::Duration::from_secs(30)).await;
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::get_app_info,
            commands::list_goals,
            commands::get_goal_detail,
            commands::check_in,
            commands::make_up_check_in,
            commands::undo_check_in,
            commands::save_day_note,
            commands::create_goal_with_plan,
            commands::archive_goal,
            commands::import_sample_goal,
            commands::get_settings,
            commands::save_settings,
            commands::delete_api_key,
            commands::test_connection,
            commands::chat_get_session,
            commands::chat_new_session,
            commands::chat_send,
            commands::confirm_draft,
            commands::factory_reset,
            commands::chat_goal_session,
            commands::list_versions,
            commands::version_days,
            commands::week_view,
            commands::save_review,
            commands::list_reviews,
            commands::review_ai,
            commands::final_view,
            commands::get_final_review,
            commands::save_final_review,
            commands::generate_final_review,
            commands::export_backup,
            commands::inspect_backup,
            commands::import_backup,
            commands::chat_stop,
            commands::chat_list_sessions,
            commands::chat_rename_session,
            commands::chat_delete_session,
            commands::chat_undo_delete_session,
            commands::goal_today_checked,
            commands::get_stats,
            commands::list_templates,
            commands::apply_template,
            commands::save_goal_as_template,
            commands::delete_template,
            commands::weather_get_settings,
            commands::weather_save_settings,
            commands::weather_search_city,
            commands::weather_get,
            commands::fetch_models,
            commands::model_status,
            commands::get_close_action,
            commands::set_close_action,
            commands::get_ui_theme,
            commands::get_reduce_motion,
            commands::set_reduce_motion,
            commands::celebrate_once,
            commands::db_location,
            commands::db_change_location,
            commands::db_restore_default,
            commands::db_relink,
            commands::db_use_default,
            commands::db_open_folder,
            commands::set_ui_theme,
            commands::close_window_choice,
            commands::restore_goal,
            commands::get_goal_reminders,
            commands::save_goal_reminders,
            commands::get_reminder_settings,
            commands::save_reminder_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
