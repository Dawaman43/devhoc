import Editor from '@monaco-editor/react'
import { useMemo, useRef, useState } from 'react'

type CodeEditorProps = {
  initialCode?: string
  language?: string
  onSave?: (code: string) => void
  showRun?: boolean
}

export default function CodeEditor({
  initialCode = '',
  language = 'typescript',
  onSave,
  showRun = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [lang, setLang] = useState(language)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const canRun = useMemo(() => lang === 'javascript' || lang === 'html', [lang])

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              setTheme((t) => (t === 'vs-dark' ? 'light' : 'vs-dark'))
            }
          >
            Toggle Theme
          </button>
          <button
            className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={() => onSave?.(code)}
          >
            Save
          </button>
          {showRun && (
            <button
              className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={!canRun}
              onClick={() => {
                if (!iframeRef.current) return
                const srcDoc =
                  lang === 'html'
                    ? code
                    : `<!doctype html><html><body><div id="out"></div><script>try{const log=(...a)=>{const el=document.getElementById('out');el.innerText += a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')+'\n'};const consoleLog=console.log;console.log=(...a)=>{consoleLog(...a);log(...a)};${code}}catch(e){const el=document.getElementById('out');el.innerText += ('Error: '+e.message)}}<\/script></body></html>`
                iframeRef.current.srcdoc = srcDoc
              }}
            >
              Run
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-md border border-border">
        <Editor
          height="100%"
          defaultLanguage={lang}
          theme={theme}
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </div>
      {showRun && (
        <div className="mt-2 h-48 overflow-auto rounded-md border border-border">
          <iframe
            ref={iframeRef}
            title="preview"
            className="h-full w-full bg-background"
          />
        </div>
      )}
    </div>
  )
}
