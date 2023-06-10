import { execSync } from 'child_process';
import { accessSync, mkdirSync, writeFileSync } from 'node:fs';
import { emptyDirSync } from './useFile';

export async function downloadFolder(
  repository: string,
  branch: string,
  folderPath: string,
  outputPath: string
): Promise<void> {
  //检查目标文件夹是否存在
  try {
    accessSync(outputPath);
    emptyDirSync(outputPath);
  } catch (error) {}
  mkdirSync(outputPath, { recursive: true });
  execSync('git init', { cwd: outputPath });
  // 设置稀疏检出
  execSync(`git config core.sparsecheckout true`, { cwd: outputPath });

  // 创建稀疏检出配置文件
  const sparseCheckoutPath = `${outputPath}/.git/info/sparse-checkout`;
  mkdirSync(`${outputPath}/.git/info`, { recursive: true });
  writeFileSync(sparseCheckoutPath, folderPath);
  //设置远程仓库地址
  execSync(`git remote add origin ${repository}`, { cwd: outputPath });
  execSync(`git pull origin ${branch}`, { cwd: outputPath });
}

// 使用示例
// const repository = 'https://github.com/用户名/仓库名.git';
// const branch = '分支名';
// const folderPath = '要下载的文件夹路径';
// const outputPath = '本地保存的文件夹路径';

// downloadFolder(repository, branch, folderPath, outputPath)
//   .catch(error => {
//     console.error('文件夹下载失败', error);
//   });
