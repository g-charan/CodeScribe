import * as vscode from "vscode";
import axios from "axios";
import { exec } from "child_process";

// A provider for our AI Outputs WebView, with the clean UI and loading states
class AiOutputsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codescribe.aiOutputsView";
  private _view?: vscode.WebviewView;

  // Store the last generated content and loading states
  private state = {
    commit: "",
    description: "AI-generated content will appear here.",
    utilityOutput: "",
    isLoadingCommit: false,
    isLoadingDescription: false,
    isLoadingUtility: false,
  };

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.updateView(); // Initial render

    // Listener for messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "copy":
          this.handleCopy(message.text);
          return;
        case "generateBranchFromText":
          this.handleGeneration("branch", { text: message.text });
          return;
        case "generateBranchFromChanges":
          this.handleGeneration("branch", { useChanges: true });
          return;
        case "generateIssueName":
          this.handleGeneration("issue", { text: message.text });
          return;
      }
    });
  }

  // --- Message and State Handlers ---

  private handleCopy(text: string) {
    if (!text || text.startsWith("AI-generated")) {
      vscode.window.showWarningMessage("Nothing to copy yet.");
      return;
    }
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage("Copied to clipboard!");
  }

  private async handleGeneration(
    type: "branch" | "issue",
    options: { text?: string; useChanges?: boolean }
  ) {
    this.state.isLoadingUtility = true;
    this.updateView();

    let payload = {};
    let endpoint = "";

    if (options.useChanges) {
      const diff = await getStagedDiff();
      if (!diff) {
        vscode.window.showInformationMessage("No staged changes found.");
        this.state.isLoadingUtility = false;
        this.updateView();
        return;
      }
      payload = { diff };
    } else {
      if (!options.text || !options.text.trim()) {
        vscode.window.showWarningMessage("Please provide a description first.");
        this.state.isLoadingUtility = false;
        this.updateView();
        return;
      }
      payload = { text: options.text };
    }

    if (type === "branch") {
      endpoint =
        "https://codescribe-backend-hihi33wfs-charanguttis-projects.vercel.app/api/generate-branch-name";
    } else {
      // issue
      endpoint =
        "https://codescribe-backend-hihi33wfs-charanguttis-projects.vercel.app/api/generate-issue-name";
    }

    try {
      const response = await axios.post(endpoint, payload);
      this.state.utilityOutput =
        response.data.branchName || response.data.issueName;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate ${type} name.`);
      this.state.utilityOutput = `Error generating ${type} name.`;
    } finally {
      this.state.isLoadingUtility = false;
      this.updateView();
    }
  }

  public updateView() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this.state);
    }
  }

  public setLoadingState(type: "commit" | "description", isLoading: boolean) {
    if (type === "commit") this.state.isLoadingCommit = isLoading;
    else this.state.isLoadingDescription = isLoading;
    if (isLoading) this.setContent(type, ""); // Clear content on load
    this.updateView();
  }

  public setContent(type: "commit" | "description", content: string) {
    if (type === "commit") {
      this.state.commit = content;
      this.state.isLoadingCommit = false;
    } else {
      this.state.description = content;
      this.state.isLoadingDescription = false;
    }
    this.updateView();
  }

  private _getHtmlForWebview(state: any): string {
    const nonce = getNonce();
    const isCommitPlaceholder = !state.commit && !state.isLoadingCommit;
    const isDescriptionPlaceholder =
      state.description.startsWith("AI-generated") &&
      !state.isLoadingDescription;

    const icons = {
      copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4H4V20H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 8H8V24H20V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      commit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      pr: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16V14M18 10V8M6 8V16M12 12H18M12 12C10.3431 12 9 13.3431 9 15C9 16.6569 10.3431 18 12 18C13.6569 18 15 16.6569 15 15C15 13.3431 13.6569 12 12 12ZM12 12V6M12 6C10.3431 6 9 4.65685 9 3C9 1.34315 10.3431 0 12 0C13.6569 0 15 1.34315 15 3C15 4.65685 13.6569 6 12 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      tools: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      output: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI Outputs</title>
                <style>
                    :root {
                        --font-family: var(--vscode-font-family);
                        --bg-color: var(--vscode-sideBar-background);
                        --panel-bg-color: var(--vscode-editorWidget-background);
                        --panel-border-color: var(--vscode-editorWidget-border);
                        --text-color: var(--vscode-foreground);
                        --text-color-secondary: var(--vscode-descriptionForeground);
                        --input-bg: var(--vscode-input-background);
                        --input-border: var(--vscode-input-border);
                        --focus-border: var(--vscode-focusBorder);
                        --button-bg: var(--vscode-button-background);
                        --button-hover-bg: var(--vscode-button-hoverBackground);
                        --button-text: var(--vscode-button-foreground);
                        
                        --spacing-xs: 4px;
                        --spacing-sm: 8px;
                        --spacing-md: 12px;
                        --spacing-lg: 16px;
                        --spacing-xl: 24px;
                        --radius: 4px;
                        --transition: all 0.2s ease-in-out;
                    }

                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        font-family: var(--font-family);
                        color: var(--text-color);
                        background-color: var(--bg-color);
                        padding: var(--spacing-lg);
                        font-size: 13px;
                        line-height: 1.5;
                    }

                    .container {
                        background-color: var(--panel-bg-color);
                        border: 1px solid var(--panel-border-color);
                        border-radius: var(--radius);
                        padding: var(--spacing-lg);
                        margin-bottom: var(--spacing-lg);
                        position: relative;
                        transition: var(--transition);
                    }

                    .label-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: var(--spacing-md);
                    }

                    .label {
                        display: flex;
                        align-items: center;
                        gap: var(--spacing-sm);
                        font-weight: 600;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        color: var(--text-color-secondary);
                    }

                    .label-icon {
                        width: 16px;
                        height: 16px;
                    }

                    textarea,
                    input[type="text"] {
                        width: 100%;
                        background-color: var(--input-bg);
                        color: var(--text-color);
                        border: 1px solid var(--input-border);
                        border-radius: var(--radius);
                        padding: var(--spacing-sm) var(--spacing-md);
                        font-family: var(--font-family);
                        font-size: 13px;
                        transition: var(--transition);
                    }

                    textarea:focus,
                    input[type="text"]:focus {
                        outline: none;
                        border-color: var(--focus-border);
                    }

                    textarea {
                        resize: none;
                        overflow-y: auto;
                    }

                    #commit-output { height: 80px; }
                    #pr-output { height: 200px; }
                    #utility-input { height: 80px; }

                    textarea.placeholder,
                    input.placeholder {
                        opacity: 0.5;
                        font-style: italic;
                    }
                    
                    textarea::placeholder {
                       opacity: 0.5;
                    }

                    .copy-button {
                        background: none;
                        border: none;
                        color: var(--text-color-secondary);
                        cursor: pointer;
                        padding: var(--spacing-xs);
                        border-radius: var(--radius);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: var(--transition);
                    }

                    .copy-button:hover {
                        background-color: var(--input-bg);
                        color: var(--text-color);
                    }
                    
                    .button-group {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                        gap: var(--spacing-sm);
                        margin-top: var(--spacing-md);
                    }

                    .button {
                        background-color: var(--button-bg);
                        color: var(--button-text);
                        border: none;
                        border-radius: var(--radius);
                        padding: var(--spacing-sm) var(--spacing-md);
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                        text-align: center;
                        transition: var(--transition);
                    }

                    .button:hover {
                        background-color: var(--button-hover-bg);
                    }
                    
                    hr {
                        border: none;
                        border-top: 1px solid var(--panel-border-color);
                        margin: var(--spacing-xl) 0;
                    }
                    
                    .spinner {
                        display: none;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 20px;
                        height: 20px;
                        border: 2px solid var(--text-color-secondary);
                        border-top-color: var(--focus-border);
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                        transform: translate(-50%, -50%);
                    }

                    .loading {
                        opacity: 0.6;
                    }
                    .loading .spinner {
                        display: block;
                    }

                    @keyframes spin {
                        to { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                </style>
            </head>
            <body>

                <div class="container ${
                  state.isLoadingCommit ? "loading" : ""
                }">
                    <div class="label-container">
                        <div class="label">
                            ${icons.commit}
                            <span>Commit Message</span>
                        </div>
                        <button class="copy-button" onclick="copy('commit-output', this)" title="Copy to clipboard">
                             ${icons.copy}
                        </button>
                    </div>
                    <textarea id="commit-output" readonly class="${
                      isCommitPlaceholder ? "placeholder" : ""
                    }">${
      isCommitPlaceholder
        ? "AI-generated commit message will appear here."
        : state.commit
    }</textarea>
                    <div class="spinner"></div>
                </div>

                <div class="container ${
                  state.isLoadingDescription ? "loading" : ""
                }">
                    <div class="label-container">
                        <div class="label">
                            ${icons.pr}
                            <span>PR Description</span>
                        </div>
                        <button class="copy-button" onclick="copy('pr-output', this)" title="Copy to clipboard">
                            ${icons.copy}
                        </button>
                    </div>
                    <textarea id="pr-output" readonly class="${
                      isDescriptionPlaceholder ? "placeholder" : ""
                    }">${state.description}</textarea>
                    <div class="spinner"></div>
                </div>

                <hr />

                <div class="container">
                    <div class="label-container">
                        <div class="label">
                            ${icons.tools}
                            <span>Utilities</span>
                        </div>
                    </div>
                    <textarea id="utility-input" placeholder="Describe a task, feature, or issue..."></textarea>
                    <div class="button-group">
                        <button class="button" onclick="generateBranchFromText()">Branch (from Text)</button>
                        <button class="button" onclick="generateBranchFromChanges()">Branch (from Changes)</button>
                    </div>
                    <div class="button-group">
                        <button class="button" onclick="generateIssueName()">Generate Issue Name</button>
                    </div>
                </div>

                <div class="container ${
                  state.isLoadingUtility ? "loading" : ""
                }">
                    <div class="label-container">
                        <div class="label">
                            ${icons.output}
                            <span>Generated Name</span>
                        </div>
                        <button class="copy-button" onclick="copy('utility-output', this)" title="Copy to clipboard">
                             ${icons.copy}
                        </button>
                    </div>
                    <input type="text" id="utility-output" readonly value="${
                      state.utilityOutput
                    }" class="${
      !state.utilityOutput ? "placeholder" : ""
    }" placeholder="Generated name will appear here...">
                    <div class="spinner"></div>
                </div>

                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    
                    const icons = {
                        copy: \`${icons.copy}\`,
                        check: \`${icons.check}\`
                    };

                    function copy(elementId, buttonElement) {
                        const element = document.getElementById(elementId);
                        const text = element.value || element.textContent;
                        vscode.postMessage({ command: 'copy', text: text });

                        // Visual feedback
                        buttonElement.innerHTML = icons.check;
                        setTimeout(() => {
                            buttonElement.innerHTML = icons.copy;
                        }, 1500);
                    }
                    
                    function showInputError(elementId) {
                        const input = document.getElementById(elementId);
                        input.style.borderColor = 'var(--vscode-inputValidation-errorBorder)';
                        setTimeout(() => { input.style.borderColor = ''; }, 2000);
                    }

                    function generateBranchFromText() {
                        const text = document.getElementById('utility-input').value;
                        if (!text.trim()) {
                            showInputError('utility-input');
                            return;
                        }
                        vscode.postMessage({ command: 'generateBranchFromText', text: text });
                    }

                    function generateBranchFromChanges() {
                        vscode.postMessage({ command: 'generateBranchFromChanges' });
                    }

                    function generateIssueName() {
                        const text = document.getElementById('utility-input').value;
                        if (!text.trim()) {
                           showInputError('utility-input');
                           return;
                        }
                        vscode.postMessage({ command: 'generateIssueName', text: text });
                    }
                </script>
            </body>
            </html>`;
  }
}

class StagedChangesProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (element) {
      return [];
    }

    try {
      const diffFiles = await getStagedDiffFiles();
      if (!diffFiles || diffFiles.length === 0) {
        return [new vscode.TreeItem("No staged changes found.")];
      }
      return diffFiles.map(
        (file) =>
          new vscode.TreeItem(file, vscode.TreeItemCollapsibleState.None)
      );
    } catch (e) {
      return [new vscode.TreeItem("Error loading staged changes.")];
    }
  }
}

// Main activation function
export async function activate(context: vscode.ExtensionContext) {
  const stagedChangesProvider = new StagedChangesProvider();
  vscode.window.registerTreeDataProvider(
    "codescribe.stagedChangesView",
    stagedChangesProvider
  );

  const aiOutputsProvider = new AiOutputsViewProvider();
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AiOutputsViewProvider.viewType,
      aiOutputsProvider
    )
  );

  const refreshStagedChanges = () => stagedChangesProvider.refresh();

  // Refresh when the Git extension state changes
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (gitExtension) {
      await gitExtension.activate();
      const api = gitExtension.exports.getAPI(1);
      if (api.repositories.length > 0) {
        const repo = api.repositories[0];
        repo.state.onDidChange(refreshStagedChanges);
      } else {
        // Handle case where git repo is initialized after VS Code opens
        api.onDidOpenRepository(() => {
          if (api.repositories.length > 0) {
            api.repositories[0].state.onDidChange(refreshStagedChanges);
          }
        });
      }
    }
  } catch (err) {
    console.error("Failed to activate Git extension", err);
  }

  // Refresh when the .git/index file changes as a robust fallback
  if (vscode.workspace.workspaceFolders) {
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri;
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, ".git/index")
    );
    watcher.onDidChange(refreshStagedChanges);
    watcher.onDidCreate(refreshStagedChanges);
    watcher.onDidDelete(refreshStagedChanges);
    context.subscriptions.push(watcher);
  }

  // Register Commands for generating content
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codescribe.generateCommitMessage",
      async () => {
        const diff = await getStagedDiff();
        if (diff === null) {
          vscode.window.showInformationMessage("No staged changes found.");
          return;
        }
        aiOutputsProvider.setLoadingState("commit", true);
        try {
          const backendUrl =
            "https://codescribe-backend-hihi33wfs-charanguttis-projects.vercel.app/api/generate-commit";
          const response = await axios.post(backendUrl, { diff });
          aiOutputsProvider.setContent("commit", response.data.commitMessage);
        } catch (error) {
          vscode.window.showErrorMessage("Failed to generate commit message.");
          aiOutputsProvider.setContent("commit", "Error generating content.");
        }
      }
    ),
    vscode.commands.registerCommand(
      "codescribe.generatePRDescription",
      async () => {
        const diff = await getStagedDiff();
        if (diff === null) {
          vscode.window.showInformationMessage("No staged changes found.");
          return;
        }
        aiOutputsProvider.setLoadingState("description", true);
        try {
          const backendUrl =
            "https://codescribe-backend-hihi33wfs-charanguttis-projects.vercel.app/api/generate-description";
          const response = await axios.post(backendUrl, { diff });
          aiOutputsProvider.setContent(
            "description",
            response.data.prDescription
          );
        } catch (error) {
          vscode.window.showErrorMessage("Failed to generate PR description.");
          aiOutputsProvider.setContent(
            "description",
            "Error generating content."
          );
        }
      }
    )
  );
}

// --- Helper Functions ---

function getStagedDiff(): Promise<string | null> {
  return new Promise((resolve) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) {
      return resolve(null);
    }
    // Execute git diff command
    exec("git diff --staged", { cwd }, (error, stdout) => {
      if (error || !stdout) {
        return resolve(null);
      }
      resolve(stdout);
    });
  });
}

function getStagedDiffFiles(): Promise<string[] | null> {
  return new Promise((resolve) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) {
      return resolve(null);
    }
    // Execute git diff command for file names only
    exec("git diff --staged --name-only", { cwd }, (error, stdout) => {
      if (error) {
        return resolve(null);
      }
      resolve(stdout.split("\n").filter((line) => line.length > 0));
    });
  });
}

function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() {}
