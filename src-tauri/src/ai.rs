use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIConfig {
    pub api_url: String,
    pub model_id: String,
    pub api_key: String,
    pub system_prompt: String,
}

impl Default for AIConfig {
    fn default() -> Self {
        Self {
            api_url: "https://api.openai.com/v1".to_string(),
            model_id: "gpt-3.5-turbo".to_string(),
            api_key: String::new(),
            system_prompt: DEFAULT_SYSTEM_PROMPT.to_string(),
        }
    }
}

pub const DEFAULT_SYSTEM_PROMPT: &str = r#"你是一个专业的周报生成助手。请根据提供的 Git 提交记录，生成一份结构清晰、内容详实的周报。

## 周报格式要求

1. **时间范围**：标注周报覆盖的日期范围
2. **按日期分组**：将工作内容按天整理，每天一个章节
3. **工作分类**：将每天的工作分为以下类别：
   - 🚀 新功能开发
   - 🐛 问题修复
   - 🔧 优化改进
   - 📝 文档更新
   - 🧪 测试相关
   - 🔨 其他工作
4. **简洁描述**：每个提交用一句话概括主要工作内容
5. **总结**：在最后添加一周工作总结，包括主要成果和下周计划建议

## 注意事项

- 使用中文输出
- 保持专业但易读的风格
- 如果某个提交信息不清晰，根据上下文合理推测
- 合并相似的提交，避免重复
- 突出重要功能和关键修复"#;

#[derive(Debug, Serialize, Deserialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Debug, Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
}

#[derive(Debug, Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Debug, Deserialize)]
struct ChatChoice {
    message: ChatMessage,
}

/// Generate weekly report using AI
#[tauri::command]
pub async fn generate_report(
    config: AIConfig,
    git_log: String,
) -> Result<String, String> {
    let client = reqwest::Client::new();

    let user_prompt = format!(
        "请根据以下 Git 提交记录生成周报：\n\n{}",
        git_log
    );

    let request = ChatRequest {
        model: config.model_id.clone(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: config.system_prompt.clone(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: user_prompt,
            },
        ],
        temperature: 0.7,
    };

    let url = format!("{}/chat/completions", config.api_url.trim_end_matches('/'));

    let response = client
        .post(&url)
        .header("Authorization", format!("Bearer {}", config.api_key))
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("API request failed ({}): {}", status, body));
    }

    let chat_response: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let content = chat_response
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .unwrap_or_else(|| "No response from AI".to_string());

    Ok(content)
}

/// Test AI connection
#[tauri::command]
pub async fn test_ai_connection(config: AIConfig) -> Result<String, String> {
    let client = reqwest::Client::new();

    let request = ChatRequest {
        model: config.model_id.clone(),
        messages: vec![
            ChatMessage {
                role: "user".to_string(),
                content: "Hello, please respond with 'Connection successful'".to_string(),
            },
        ],
        temperature: 0.0,
    };

    let url = format!("{}/chat/completions", config.api_url.trim_end_matches('/'));

    let response = client
        .post(&url)
        .header("Authorization", format!("Bearer {}", config.api_key))
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("API request failed ({}): {}", status, body));
    }

    Ok("Connection successful".to_string())
}
