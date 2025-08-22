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
      if (!options.text) {
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

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI Outputs</title>
                <style>
                    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 0 10px; font-size: 13px; line-height: 1.4; }
                    .container { margin-bottom: 20px; position: relative; }
                    .label-container { display: flex; justify-content: space-between; align-items: center; margin: 10px 0 5px 0; }
                    label { font-weight: 600; color: var(--vscode-text-separator-foreground); text-transform: uppercase; font-size: 11px; }
                    textarea, input[type="text"] { width: 100%; box-sizing: border-box; background-color: var(--vscode-text-area-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 4px; padding: 8px; font-family: var(--vscode-font-family); }
                    textarea { resize: vertical; }
                    textarea.placeholder, input.placeholder { color: var(--vscode-input-placeholder-foreground); }
                    .copy-button { background: none; border: none; color: var(--vscode-icon-foreground); cursor: pointer; padding: 2px 5px; opacity: 0.6; transition: opacity 0.2s ease; }
                    .copy-button:hover { opacity: 1; }
                    .button-group { display: flex; gap: 5px; margin-top: 5px; }
                    button { width: 100%; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; }
                    button:hover { background-color: var(--vscode-button-hover-background); }
                    .spinner { display: none; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border: 2px solid var(--vscode-input-placeholder-foreground); border-top-color: var(--vscode-button-background); border-radius: 50%; animation: spin 1s linear infinite; transform: translate(-50%, -50%); }
                    .loading .spinner { display: block; }
                    .loading textarea, .loading input { visibility: hidden; }
                    hr { border: none; border-top: 1px solid var(--vscode-divider-background); margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container ${
                  state.isLoadingCommit ? "loading" : ""
                }">
                    <div class="label-container"><label>Commit Message</label><button class="copy-button" onclick="copy('commit-output')" title="Copy"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2h7l4 4v8H4V2zm2 1h5v3h3v7H6V3zm9-1H3v12h12V5.414L11.586 1H11z"/></svg></button></div>
                    <textarea id="commit-output" readonly rows="3" class="${
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
                    <div class="label-container"><label>PR Description</label><button class="copy-button" onclick="copy('pr-output')" title="Copy"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2h7l4 4v8H4V2zm2 1h5v3h3v7H6V3zm9-1H3v12h12V5.414L11.586 1H11z"/></svg></button></div>
                    <textarea id="pr-output" readonly rows="12" class="${
                      isDescriptionPlaceholder ? "placeholder" : ""
                    }">${state.description}</textarea>
                    <div class="spinner"></div>
                </div>
                <hr>
                <div class="container">
                    <div class="label-container"><label>Utilities</label></div>
                    <textarea id="utility-input" rows="3" placeholder="Describe a task or issue..."></textarea>
                    <div class="button-group">
                        <button onclick="generateBranchFromText()">Branch Name (from text)</button>
                        <button onclick="generateBranchFromChanges()">Branch Name (from changes)</button>
                    </div>
                    <div class="button-group">
                        <button onclick="generateIssueName()">Issue Name (from text)</button>
                    </div>
                </div>
                <div class="container ${
                  state.isLoadingUtility ? "loading" : ""
                }">
                    <div class="label-container"><label>Generated Name</label><button class="copy-button" onclick="copy('utility-output')" title="Copy"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2h7l4 4v8H4V2zm2 1h5v3h3v7H6V3zm9-1H3v12h12V5.414L11.586 1H11z"/></svg></button></div>
                    <input type="text" id="utility-output" readonly value="${
                      state.utilityOutput
                    }" class="${
      !state.utilityOutput ? "placeholder" : ""
    }" placeholder="Generated name will appear here.">
                    <div class="spinner"></div>
                </div>

                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    function copy(elementId) { vscode.postMessage({ command: 'copy', text: document.getElementById(elementId).value }); }
                    function generateBranchFromText() { vscode.postMessage({ command: 'generateBranchFromText', text: document.getElementById('utility-input').value }); }
                    function generateBranchFromChanges() { vscode.postMessage({ command: 'generateBranchFromChanges' }); }
                    function generateIssueName() { vscode.postMessage({ command: 'generateIssueName', text: document.getElementById('utility-input').value }); }
                </script>
            </body>
            </html>`;
  }
}

// StagedChangesProvider remains the same...
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
    if (element) return [];
    try {
      const diffFiles = await getStagedDiffFiles();
      if (!diffFiles || diffFiles.length === 0)
        return [new vscode.TreeItem("No staged changes found.")];
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

  // This function will handle refreshing the view
  const refreshStagedChanges = () => stagedChangesProvider.refresh();

  // 1. Refresh when the Git extension reports a change (official way)
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (gitExtension) {
      await gitExtension.activate();
      const api = gitExtension.exports.getAPI(1);
      if (api.repositories.length > 0) {
        api.repositories[0].state.onDidChange(refreshStagedChanges);
      }
    }
  } catch (err) {
    console.error("Failed to activate Git extension", err);
  }

  // 2. Refresh when the staging file itself changes (more direct and robust)
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

  // Register Commands for the main features
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

// Helper functions remain the same...
function getStagedDiff(): Promise<string | null> {
  return new Promise((resolve) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) {
      vscode.window.showErrorMessage("No workspace folder open.");
      return resolve(null);
    }
    exec("git diff --staged", { cwd }, (error, stdout) => {
      if (error) return resolve(null);
      resolve(stdout);
    });
  });
}
function getStagedDiffFiles(): Promise<string[] | null> {
  return new Promise((resolve) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) return resolve(null);
    exec("git diff --staged --name-only", { cwd }, (error, stdout) => {
      if (error) return resolve(null);
      resolve(stdout.split("\n").filter((line) => line.length > 0));
    });
  });
}
function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export function deactivate() {}
