import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()

const srcRoot = path.join(repoRoot, 'docs', 'healthy')
// 临时目录：只用于构建，不提交 git
const dstRoot = path.join(repoRoot, 'docs', '.vitepress', 'public', 'healthy')

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
  await copyPdfTree(srcRoot, dstRoot)
  console.log(`[copy-healthy-pdfs] PDFs -> ${dstRoot}`)
} catch (err) {
  console.error('[copy-healthy-pdfs] failed:', err)
  process.exit(1)
}