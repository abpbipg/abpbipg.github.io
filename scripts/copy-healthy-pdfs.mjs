import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()

const srcRoot = path.join(repoRoot, 'docs', 'healthy')
// 临时目录：只用于构建，不提交 git
const publicRoot = path.join(repoRoot, 'docs', '.vitepress', 'public')
const dstRoot = path.join(publicRoot, 'healthy')

// 递归删除（Node 14+ 可用；GitHub Actions 的 Node 版本一般够）
async function cleanDir(p) {
  await fs.rm(p, { recursive: true, force: true })
  await fs.mkdir(p, { recursive: true })
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function copyPdfTree(srcDir, dstDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true })
  await ensureDir(dstDir)

  for (const e of entries) {
    const src = path.join(srcDir, e.name)
    const dst = path.join(dstDir, e.name)

    if (e.isDirectory()) {
      await copyPdfTree(src, dst)
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.pdf')) {
      await ensureDir(path.dirname(dst))
      await fs.copyFile(src, dst)
    }
  }
}

try {
  // 清空临时 public，避免上次构建残留导致重复发布
  await cleanDir(publicRoot)

  // 只复制到 /healthy/... 这一份路径
  await copyPdfTree(srcRoot, dstRoot)

  console.log(`[copy-healthy-pdfs] PDFs -> ${dstRoot}`)
} catch (err) {
  console.error('[copy-healthy-pdfs] failed:', err)
  process.exit(1)
}