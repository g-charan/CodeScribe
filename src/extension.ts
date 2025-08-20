import * as vscode from "vscode";
import axios from "axios";
import { exec } from "child_process";

// A provider for our AI Outputs WebView, with the clean UI and loading states
class AiOutputsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codescribe.aiOutputsView";
  private _view?: vscode.WebviewView;

  // Store the last generated content and loading states
  private lastCommit: string = "";
  private lastDescription: string = "AI-generated content will appear here.";
  private isLoadingCommit: boolean = false;
  private isLoadingDescription: boolean = false;

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    // Load the initial state
    this.updateView();

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "copy") {
        if (!message.text || message.text.startsWith("AI-generated")) {
          vscode.window.showWarningMessage("Nothing to copy yet.");
          return;
        }
        vscode.env.clipboard.writeText(message.text);
        vscode.window.showInformationMessage("Copied to clipboard!");
      }
    });
  }

  // NEW: A single method to update the view based on the current state
  public updateView() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(
        this.lastCommit,
        this.lastDescription,
        this.isLoadingCommit,
        this.isLoadingDescription
      );
    }
  }

  // NEW: Methods to control loading states
  public setLoadingState(type: "commit" | "description", isLoading: boolean) {
    if (type === "commit") {
      this.isLoadingCommit = isLoading;
      if (isLoading) this.lastCommit = ""; // Clear previous content
    } else {
      this.isLoadingDescription = isLoading;
      if (isLoading) this.lastDescription = ""; // Clear previous content
    }
    this.updateView();
  }

  public setContent(type: "commit" | "description", content: string) {
    if (type === "commit") {
      this.lastCommit = content;
      this.isLoadingCommit = false;
    } else {
      this.lastDescription = content;
      this.isLoadingDescription = false;
    }
    this.updateView();
  }

  private _getHtmlForWebview(
    commit: string,
    description: string,
    isLoadingCommit: boolean,
    isLoadingDescription: boolean
  ): string {
    const nonce = getNonce();
    const isCommitPlaceholder = !commit && !isLoadingCommit;
    const isDescriptionPlaceholder =
      description.startsWith("AI-generated") && !isLoadingDescription;

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <title>AI Outputs</title>
                <style>
                    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 0 10px; font-size: 13px; line-height: 1.4; }
                    .container { margin-bottom: 20px; position: relative; }
                    .label-container { display: flex; justify-content: space-between; align-items: center; margin: 10px 0 5px 0; }
                    label { font-weight: 600; color: var(--vscode-text-separator-foreground); text-transform: uppercase; font-size: 11px; }
                    textarea { width: 100%; box-sizing: border-box; background-color: var(--vscode-text-area-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 4px; padding: 8px; font-family: var(--vscode-font-family); resize: vertical; }
                    textarea.placeholder { color: var(--vscode-input-placeholder-foreground); }
                    .copy-button { background: none; border: none; color: var(--vscode-icon-foreground); cursor: pointer; padding: 2px 5px; opacity: 0.6; transition: opacity 0.2s ease; }
                    .copy-button:hover { opacity: 1; }
                    .spinner { 
                        display: none; 
                        position: absolute; 
                        top: 50%; 
                        left: 50%; 
                        transform: translate(-50%, -50%); /* <-- FIX: Perfect centering */
                        width: 20px; 
                        height: 20px; 
                        border: 2px solid var(--vscode-input-placeholder-foreground); 
                        border-top-color: var(--vscode-button-background); 
                        border-radius: 50%; 
                        animation: spin 1s linear infinite;
                    }
                    .loading .spinner { display: block; }
                    .loading textarea { visibility: hidden; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                </style>
            </head>
            <body>
                <div class="container ${isLoadingCommit ? "loading" : ""}">
                    <div class="label-container">
                        <label for="commit-output">Commit Message</label>
                        <button class="copy-button" onclick="copy('commit-output')" title="Copy Commit Message">
                            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2h7l4 4v8H4V2zm2 1h5v3h3v7H6V3zm9-1H3v12h12V5.414L11.586 1H11z"/></svg>
                        </button>
                    </div>
                    <textarea id="commit-output" readonly rows="3" class="${
                      isCommitPlaceholder ? "placeholder" : ""
                    }">${
      isCommitPlaceholder
        ? "AI-generated commit message will appear here."
        : commit
    }</textarea>
                    <div class="spinner"></div>
                </div>
                <div class="container ${isLoadingDescription ? "loading" : ""}">
                    <div class="label-container">
                        <label for="pr-output">PR Description</label>
                        <button class="copy-button" onclick="copy('pr-output')" title="Copy PR Description">
                            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2h7l4 4v8H4V2zm2 1h5v3h3v7H6V3zm9-1H3v12h12V5.414L11.586 1H11z"/></svg>
                        </button>
                    </div>
                    <textarea id="pr-output" readonly rows="12" class="${
                      isDescriptionPlaceholder ? "placeholder" : ""
                    }">${description}</textarea>
                    <div class="spinner"></div>
                </div>
                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    function copy(elementId) {
                        const textarea = document.getElementById(elementId);
                        vscode.postMessage({ command: 'copy', text: textarea.value });
                    }
                </script>
            </body>
            </html>`;
  }
}

// A provider for our Staged Changes TreeView
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
      return []; // No nested children
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
  // Setup Providers
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

  // --- FIX: Safely get the Git Extension and attach the listener ---
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (gitExtension) {
      await gitExtension.activate();
      const api = gitExtension.exports.getAPI(1);
      if (api.repositories.length > 0) {
        api.repositories[0].state.onDidChange(() => {
          stagedChangesProvider.refresh();
        });
      }
    }
  } catch (err) {
    console.error("Failed to activate Git extension for refresh listener", err);
  }

  // Register Commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codescribe.generateCommitMessage",
      async () => {
        const diff = await getStagedDiff();
        if (diff === null) {
          // Check for null to handle no repo case
          vscode.window.showInformationMessage(
            "No staged changes found or not a Git repository."
          );
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
          vscode.window.showInformationMessage(
            "No staged changes found or not a Git repository."
          );
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

// --- HELPER FUNCTIONS ---
// Reverted to the robust `exec` method to find the repo correctly
function getStagedDiff(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) {
      vscode.window.showErrorMessage("No workspace folder open.");
      return resolve(null);
    }
    exec("git diff --staged", { cwd }, (error, stdout) => {
      if (error) {
        // Git errors (like not being a repo) are caught here but aren't fatal
        return resolve(null);
      }
      resolve(stdout);
    });
  });
}

function getStagedDiffFiles(): Promise<string[] | null> {
  return new Promise((resolve, reject) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!cwd) {
      return resolve(null);
    }
    exec("git diff --staged --name-only", { cwd }, (error, stdout) => {
      if (error) {
        return resolve(null);
      }
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
