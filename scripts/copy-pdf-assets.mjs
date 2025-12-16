import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()

const srcRoot = path.join(repoRoot, 'docs', 'pdf')
const dstRoot = path.join(repoRoot, 'docs', 'public', 'pdf')

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
  // 只清理由该脚本生成的 public/pdf，避免误删 public 里其它资源
  await cleanDir(dstRoot)

  await copyPdfTree(srcRoot, dstRoot)

  console.log(`[copy-pdf-assets] PDFs -> ${dstRoot}`)
} catch (err) {
  console.error('[copy-pdf-assets] failed:', err)
  process.exit(1)
}