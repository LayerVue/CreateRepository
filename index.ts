#!/usr/bin/env node
import prompts from 'prompts';
import { GradientText, ColoredText } from './utils/useColorText';
import { downloadFolder } from './utils/useDownLoadGit';
import { copySync, emptyDirSync } from './utils/useFile';
import { accessSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
console.log(
  GradientText(
    'LayerVue - Embrace Vue 3.0, Free Resize Move, and Different from Traditional Modal',
    '#ff8d1a',
    '#bc32fc'
  )
);
// GitHub 仓库信息
const owner = 'LayerVue';
const repo = 'create-templates';
const filePath = 'config.json';

type Config = {
  name: string;
  description: string;
  path: string;
}[];

async function main() {
  const source = await prompts({
    type: 'select',
    name: 'value',
    message: 'select template source',
    choices: [
      {
        title: 'gitee',
        value: 'gitee',
      },
      {
        title: 'GitHub',
        value: 'github',
      },
    ],
    initial: 0, // 初始选项的索引
  });
  const repository = `https://${source.value}.com/${owner}/${repo}.git`;
  const branch = 'main';
  const outputPath = '.LayerVue';
  await downloadFolder(repository, branch, filePath, outputPath);
  const data: Config = JSON.parse(readFileSync(`${outputPath}/${filePath}`, 'utf-8'));
  const response = await prompts({
    type: 'select',
    name: 'path',
    message: 'select a template',
    choices: data.map(item => ({
      title: item.name,
      value: item.path,
    })),
    initial: 0, // 初始选项的索引
  });

  const result = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'project name',
      initial: 'LayerVue',
    },
    {
      type: 'text',
      name: 'description',
      message: 'description',
      initial: 'Embrace Vue 3.0, Free Resize Move, and Different from Traditional Modal',
    },
    {
      type: 'text',
      name: 'author',
      message: 'author',
      initial: 'LayerVue',
    },
    {
      type: 'text',
      name: 'version',
      message: 'version',
      initial: '0.0.1',
    },
  ]);
  const folderPath = response.path;
  await downloadFolder(repository, branch, folderPath, outputPath);
  const packageJson = JSON.parse(readFileSync(`${outputPath}/${folderPath}/package.json`, 'utf-8'));
  packageJson.name = result.projectName;
  packageJson.description = result.description;
  packageJson.author = result.author;
  packageJson.version = result.version;
  delete packageJson.license;
  writeFileSync(`${outputPath}/${folderPath}/package.json`, JSON.stringify(packageJson, null, 2));
  try {
    accessSync(result.projectName);
    console.log(ColoredText.red('The folder already exists'));
    emptyDirSync(outputPath);
    return;
  } catch (error) {}
  mkdirSync(result.projectName);
  copySync(`${outputPath}/${folderPath}`, result.projectName, ['pnpm-lock.yaml']);
  emptyDirSync(outputPath);
  console.log(ColoredText.cyan(`Done. Now run:`));
  console.log(ColoredText.green(`cd ${result.projectName}`));
  console.log(ColoredText.green(`pnpm install`));
  console.log(ColoredText.green(`pnpm run dev`));
}

main();

//复制文件夹
