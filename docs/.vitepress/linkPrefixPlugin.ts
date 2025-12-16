import type MarkdownIt from 'markdown-it'

export interface HealthyLinkPrefixOptions {
  prefix?: string
  exclude?: string[]
}

export function healthyLinkPrefixPlugin(
  md: MarkdownIt,
  options: HealthyLinkPrefixOptions = {},
) {
  const prefix = options.prefix ?? '/healthy'
  const exclude = options.exclude ?? [
    '/healthy/',
    '/img/',
    '/pdf/',
    '/etc/',
    '/pics/', // 关键：你的图片现在走站点根 /pics
  ]

  const shouldRewrite = (url: string) => {
    if (!url.startsWith('/')) return false
    return !exclude.some((p) => url.startsWith(p))
  }

  const rewriteUrl = (url: string) => (shouldRewrite(url) ? `${prefix}${url}` : url)

  /**
   * 尽可能从 env 中拿到“源文件路径信息”，判断是否属于 docs/healthy/**
   * 在 v2 alpha 下，不同阶段 env 字段可能不同，所以做多字段兜底。
   */
  const isHealthyDoc = (env: any) => {
    const candidates: Array<unknown> = [
      env?.filePathRelative,       // 常见： "healthy/xxx.md"
      env?.relativePath,           // 有些版本/插件提供
      env?.filePath,               // 绝对路径
      env?.path,                   // 有时是路由："/healthy/xxx.html"
      env?.page?.relativePath,     // VitePress page info
    ]

    const s = candidates.find((v) => typeof v === 'string') as string | undefined
    if (!s) return false

    // 统一处理分隔符
    const normalized = s.replace(/\\/g, '/')

    // 源文件路径（healthy/xxx.md）或路由（/healthy/xxx.html）都算
    return normalized.startsWith('healthy/')
      || normalized.includes('/healthy/')
      || normalized.startsWith('/healthy/')
  }

  // 1) 重写 markdown-it token（link/image）
  md.core.ruler.after('inline', 'healthy-link-prefix', (state) => {
    if (!isHealthyDoc(state.env)) return

    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue

      for (const child of token.children) {
        if (child.type === 'link_open') {
          const href = child.attrGet('href')
          if (href) child.attrSet('href', rewriteUrl(href))
        } else if (child.type === 'image') {
          const src = child.attrGet('src')
          if (src) child.attrSet('src', rewriteUrl(src))
        }
      }
    }
  })

  // 2) 兜底：重写 html_block 内的 href/src
  const defaultHtmlBlock =
    md.renderer.rules.html_block ??
    ((tokens: any[], idx: number) => tokens[idx].content as string)

  md.renderer.rules.html_block = (tokens: any[], idx: number, opts: any, env: any, self: any) => {
    const raw = defaultHtmlBlock(tokens, idx, opts, env, self)
    if (!isHealthyDoc(env)) return raw

    return raw
      .replace(/\bhref="\/([^"]+)"/g, (_m: string, p1: string) => `href="${rewriteUrl(`/${p1}`)}"`)
      .replace(/\bsrc="\/([^"]+)"/g, (_m: string, p1: string) => `src="${rewriteUrl(`/${p1}`)}"`)
  }
}