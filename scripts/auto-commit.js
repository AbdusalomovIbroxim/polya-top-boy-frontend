#!/usr/bin/env node

import { execSync } from 'child_process';

// Функция для определения типа изменений
function analyzeChanges() {
  try {
    // Получаем список измененных файлов
    const diffOutput = execSync('git diff --cached --name-status', { encoding: 'utf8' });
    const files = diffOutput.trim().split('\n').filter(line => line);
    
    if (files.length === 0) {
      console.log('❌ No staged files found. Please add files first with: git add .');
      process.exit(1);
    }
    
    let type = 'chore';
    let description = 'update files';
    
    // Анализируем изменения
    const hasNewFiles = files.some(file => file.startsWith('A'));
    const hasModifiedFiles = files.some(file => file.startsWith('M'));
    const hasDeletedFiles = files.some(file => file.startsWith('D'));
    
    // Получаем имена файлов
    const allFiles = files.map(file => file.split('\t')[1]);
    const newFiles = files.filter(file => file.startsWith('A')).map(file => file.split('\t')[1]);
    const modifiedFiles = files.filter(file => file.startsWith('M')).map(file => file.split('\t')[1]);
    
    // Определяем тип на основе изменений
    if (hasNewFiles) {
      if (newFiles.some(file => file.includes('component') || file.includes('Component'))) {
        type = 'feat';
        description = 'add new components';
      } else if (newFiles.some(file => file.includes('test') || file.includes('spec'))) {
        type = 'test';
        description = 'add tests';
      } else if (newFiles.some(file => file.includes('api') || file.includes('service'))) {
        type = 'feat';
        description = 'add new API functionality';
      } else {
        type = 'feat';
        description = 'add new files';
      }
    } else if (hasModifiedFiles) {
      if (modifiedFiles.some(file => file.includes('css') || file.includes('style'))) {
        type = 'style';
        description = 'update styles';
      } else if (modifiedFiles.some(file => file.includes('test') || file.includes('spec'))) {
        type = 'test';
        description = 'update tests';
      } else if (modifiedFiles.some(file => file.includes('readme') || file.includes('docs'))) {
        type = 'docs';
        description = 'update documentation';
      } else if (modifiedFiles.some(file => file.includes('package.json') || file.includes('dependencies'))) {
        type = 'chore';
        description = 'update dependencies';
      } else if (modifiedFiles.some(file => file.includes('config') || file.includes('setup'))) {
        type = 'chore';
        description = 'update configuration';
      } else {
        type = 'fix';
        description = 'fix issues';
      }
    } else if (hasDeletedFiles) {
      type = 'refactor';
      description = 'remove unused files';
    }
    
    // Дополнительные проверки
    if (allFiles.some(file => file.includes('auth') || file.includes('login'))) {
      type = 'feat';
      description = 'improve authentication';
    } else if (allFiles.some(file => file.includes('error') || file.includes('bug'))) {
      type = 'fix';
      description = 'fix errors';
    } else if (allFiles.some(file => file.includes('performance') || file.includes('optimize'))) {
      type = 'perf';
      description = 'improve performance';
    }
    
    return { type, description };
  } catch (error) {
    console.error('Error analyzing changes:', error);
    return { type: 'chore', description: 'update project' };
  }
}

// Функция для создания коммита
function createCommit() {
  try {
    const { type, description } = analyzeChanges();
    const commitMessage = `${type}: ${description}`;
    
    console.log(`🤖 Auto-generating commit: ${commitMessage}`);
    
    // Создаем коммит
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ Commit created successfully!');
  } catch (error) {
    console.error('❌ Error creating commit:', error.message);
    process.exit(1);
  }
}

// Запускаем скрипт
createCommit(); 