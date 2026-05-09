use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitRepo {
    pub name: String,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitCommit {
    pub hash: String,
    pub author: String,
    pub date: String,
    pub message: String,
    pub repo_name: String,
    pub refs: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitLogParams {
    pub repo_paths: Vec<String>,
    pub since: String,
    pub until: String,
    pub authors: Vec<String>,
}

/// Scan a directory for git repositories
#[tauri::command]
pub async fn scan_git_repos(workspace_path: String) -> Result<Vec<GitRepo>, String> {
    let path = Path::new(&workspace_path);
    if !path.exists() {
        return Err("Workspace path does not exist".to_string());
    }

    let mut repos = Vec::new();
    scan_directory(path, &mut repos);
    Ok(repos)
}

fn scan_directory(dir: &Path, repos: &mut Vec<GitRepo>) {
    // Check if current directory is a git repo
    if dir.join(".git").exists() {
        let name = dir
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "unknown".to_string());

        repos.push(GitRepo {
            name,
            path: dir.to_string_lossy().to_string(),
        });
        return; // Don't scan subdirectories of git repos
    }

    // Scan subdirectories
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() && !path.file_name().unwrap_or_default().to_string_lossy().starts_with('.') {
                scan_directory(&path, repos);
            }
        }
    }
}

/// Get git log for multiple repositories
#[tauri::command]
pub async fn get_git_log(params: GitLogParams) -> Result<Vec<GitCommit>, String> {
    let mut all_commits = Vec::new();

    for repo_path in &params.repo_paths {
        let commits = get_repo_log(repo_path, &params.since, &params.until, &params.authors)?;
        all_commits.extend(commits);
    }

    // Sort by date descending
    all_commits.sort_by(|a, b| b.date.cmp(&a.date));

    Ok(all_commits)
}

fn get_repo_log(
    repo_path: &str,
    since: &str,
    until: &str,
    authors: &[String],
) -> Result<Vec<GitCommit>, String> {
    let path = Path::new(repo_path);
    let repo_name = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "unknown".to_string());

    let mut cmd = Command::new("git");
    cmd.arg("log")
        .arg("--format=%H|%an|%aI|%s|%D")
        .arg(format!("--since={}", since))
        .arg(format!("--until={}", until))
        .current_dir(path);

    // Add author filter if specified
    if !authors.is_empty() {
        for author in authors {
            cmd.arg(format!("--author={}", author));
        }
    }

    let output = cmd.output().map_err(|e| format!("Failed to run git: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Git command failed: {}", stderr));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut commits = Vec::new();

    for line in stdout.lines() {
        if line.is_empty() {
            continue;
        }

        let parts: Vec<&str> = line.splitn(5, '|').collect();
        if parts.len() >= 4 {
            let refs = if parts.len() >= 5 {
                parts[4].to_string()
            } else {
                String::new()
            };
            
            commits.push(GitCommit {
                hash: parts[0].to_string(),
                author: parts[1].to_string(),
                date: parts[2].to_string(),
                message: parts[3].to_string(),
                repo_name: repo_name.clone(),
                refs,
            });
        }
    }

    Ok(commits)
}

/// Get unique authors from repositories
#[tauri::command]
pub async fn get_repo_authors(repo_paths: Vec<String>, since: String, until: String) -> Result<Vec<String>, String> {
    let mut authors = std::collections::HashSet::new();

    for repo_path in &repo_paths {
        let path = Path::new(repo_path);

        let output = Command::new("git")
            .arg("log")
            .arg("--format=%an")
            .arg(format!("--since={}", since))
            .arg(format!("--until={}", until))
            .current_dir(path)
            .output()
            .map_err(|e| format!("Failed to run git: {}", e))?;

        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if !line.is_empty() {
                    authors.insert(line.to_string());
                }
            }
        }
    }

    let mut authors_vec: Vec<String> = authors.into_iter().collect();
    authors_vec.sort();
    Ok(authors_vec)
}
