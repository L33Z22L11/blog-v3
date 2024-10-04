import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 指定 Typora 的完整路径
const typoraPath = 'D:\\Typora\\Typora.exe'; // 请根据实际安装路径修改

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function openWithTypora(filePath) {
  exec(`"${typoraPath}" "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`文件已在 Typora 中打开`);
  });
}

function createPost(title) {
  if (!title) {
    console.error('请提供文章标题');
    return;
  }

  const date = new Date();
  const year = date.getFullYear();
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
  
  // 创建年份文件夹
  const yearDir = path.join(__dirname, 'content', 'posts', year.toString());
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }
  
  const filePath = path.join(yearDir, fileName);

  // 读取模板文件
  const templatePath = path.join(__dirname, 'scaffolds', 'post.md');
  let template = fs.readFileSync(templatePath, 'utf-8');

  // 替换模板中的变量
  template = template.replace(/title: {{ title }}/g, `title: ${title}`)
                     .replace(/date: {{ date }}/g, `date: ${formatDate(date)}`)
                     .replace(/{{year}}/g, year)
                     .replace(/{{month}}/g, String(date.getMonth() + 1).padStart(2, '0'))
                     .replace(/{{day}}/g, String(date.getDate()).padStart(2, '0'));

  // 移除 "在这里写入您的文章内容。" 这一行
  template = template.replace(/在这里写入您的文章内容。\n*$/, '');

  try {
    fs.writeFileSync(filePath, template);
    console.log(`成功创建新文章: ${filePath}`);
    openWithTypora(filePath);
  } catch (error) {
    console.error('创建文章时发生错误:', error);
  }
}

const args = process.argv.slice(2);
const title = args.join(' ');

createPost(title);