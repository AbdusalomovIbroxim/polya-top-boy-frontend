#!/usr/bin/env node

import { execSync } from 'child_process';

// Простые правила для автоматической генерации коммитов
const commitRules = [
  { pattern: /component|Component/, type: 'feat', message: 'add new component' },
  { pattern: /test|spec/, type: 'test', message: 'add tests' },
  { pattern: /api|service/, type: 'feat', message: 'add API functionality' },
  { pattern: /css|style/, type: 'style', message: 'update styles' },
  { pattern: /readme|docs/, type: 'docs', message: 'update documentation' },
  { pattern: /package\.json|dependencies/, type: 'chore', message: 'update dependencies' },
  { pattern: /config|setup/, type: 'chore', message: 'update configuration' },
  { pattern: /auth|login/, type: 'feat', message: 'improve authentication' },
  { pattern: /error|bug/, type: 'fix', message: 'fix errors' },
  { pattern: /performance|optimize/, type: 'perf', message: 'improve performance' }
];

function generateCommitMessage() {
  try {
    // Получаем список измененных файлов
    const diffOutput = execSync('git diff --cached --name-status', { encoding: 'utf8' });
    const files = diffOutput.trim().split('\n').filter(line => line);
    
    if (files.length === 0) {
      console.log('❌ No staged files found. Please add files first with: git add .');
      process.exit(1);
    }
    
    // Получаем имена файлов
    const fileNames = files.map(file => file.split('\t')[1]);
    
    // Определяем тип изменений
    const hasNewFiles = files.some(file => file.startsWith('A'));
    const hasModifiedFiles = files.some(file => file.startsWith('M'));
    const hasDeletedFiles = files.some(file => file.startsWith('D'));
    
    // Ищем подходящее правило
    for (const rule of commitRules) {
      if (fileNames.some(file => rule.pattern.test(file))) {
        return { type: rule.type, message: rule.message };
      }
    }
    
    // Правила по умолчанию
    if (hasNewFiles) {
      return { type: 'feat', message: 'add new files' };
    } else if (hasModifiedFiles) {
      return { type: 'fix', message: 'fix issues' };
    } else if (hasDeletedFiles) {
      return { type: 'refactor', message: 'remove unused files' };
    } else {
      return { type: 'chore', message: 'update project' };
    }
  } catch (error) {
    console.error('Error analyzing changes:', error);
    return { type: 'chore', message: 'update project' };
  }
}

function createCommit() {
  try {
    const { type, message } = generateCommitMessage();
    const commitMessage = `${type}: ${message}`;
    
    console.log(`🤖 Auto-generating commit: ${commitMessage}`);
    
    // Создаем коммит без проверок husky
    execSync(`git commit --no-verify -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ Commit created successfully!');
  } catch (error) {
    console.error('❌ Error creating commit:', error.message);
    process.exit(1);
  }
}

createCommit(); 