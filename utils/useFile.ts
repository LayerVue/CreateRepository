import { readdirSync, statSync, mkdirSync, copyFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

function copySync(source: string, target: string, exclude?: string[]) {
  const files = readdirSync(source);
  files.forEach((file: any) => {
    const sourcePath = join(source, file);
    const targetPath = join(target, file);
    if (statSync(sourcePath).isDirectory()) {
      mkdirSync(targetPath);
      copySync(sourcePath, targetPath);
    } else {
      if (exclude) {
        if (exclude.includes(file)) return;
      }
      copyFileSync(sourcePath, targetPath);
    }
  });
}

/**
 * 清空文件夹
 * @param path 文件夹路径
 */
function emptyDirSync(path: string) {
  const files = readdirSync(path);
  files.forEach((file: any) => {
    const curPath = join(path, file);
    if (statSync(curPath).isDirectory()) {
      emptyDirSync(curPath);
    } else {
      unlinkSync(curPath);
    }
  });
  rmdirSync(path)
}
export { copySync, emptyDirSync };
