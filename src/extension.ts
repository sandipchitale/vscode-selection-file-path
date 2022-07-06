'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window, commands } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('selection-file-path.slashifyBackslashify', slashifyBackslashify);
    context.subscriptions.push(disposable);
}

function slashifyBackslashify() {
  const activeEditor = window.activeTextEditor;
  const selection = activeEditor.selection;
  if (!selection.isEmpty) {
    let selectionText = activeEditor.document.getText(selection);
    if (selectionText.includes('/')) {
      backslashify();
    } else {
      slashify()
    }
  }
}

function slashify() {
  replaceInSelection('\\', '/');
}

function backslashify() {
  replaceInSelection('/', '\\');
}

function replaceInSelection(fromChar, to) {
  const activeEditor = window.activeTextEditor;
  const selection = activeEditor.selection;
  if (!selection.isEmpty && selection.active.line === selection.anchor.line) {
    const lineText = activeEditor.document.lineAt(selection.active.line).text;
    const singleQuoteCount = (lineText.match(/\'/g) || []).length;
    const doubleQuoteCount = (lineText.match(/\"/g) || []).length ;
    const backQuoteCount = (lineText.match(/\`/g) || []).length ;
    let inString = (singleQuoteCount > 0 && singleQuoteCount % 2 === 0) ||
      (doubleQuoteCount > 0 && doubleQuoteCount % 2 === 0) ||
      (backQuoteCount > 0 && backQuoteCount % 2 === 0);
    if (inString) {
      if (to === '\\') {
        to = '\\\\';
        fromChar = /\//g;
      } else if (to === '/') {
        fromChar = /\\+/g;
      }
    } else {
      if (to === '\\') {
        fromChar = /\//g;
      } else if (to === '/') {
        fromChar =  /\\/g;
      }
    }

    let selectionText = activeEditor.document.getText(selection);
    let replaceWithText = selectionText.replace(fromChar, to);
    if (selectionText !== replaceWithText) {
      activeEditor.edit(function (editor) {
        editor.replace(activeEditor.selection, replaceWithText);
      })
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
