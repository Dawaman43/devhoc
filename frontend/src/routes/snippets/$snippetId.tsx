import React, { Suspense } from 'react'
import { createFileRoute, useParams, Link } from '@tanstack/react-router'
const CodeEditor = React.lazy(() => import('@/components/ide/CodeEditor'))

export const Route = createFileRoute('/snippets/$snippetId')({
  component: () => {
    const { snippetId } = useParams({ from: '/snippets/$snippetId' })
    const presets: Record<string, { language: string; code: string }> = {
      'hello-js': {
        language: 'javascript',
        code: `// A runnable JavaScript demo\nconsole.log('Hello from JS snippet!')\nfunction sum(a,b){return a+b}\nconsole.log('2+3=', sum(2,3))`,
      },
      'md-notes': {
        language: 'markdown',
        code: `# Notes\n\n- Quick markdown snippet\n- Supports headings, lists, etc.`,
      },
      'html-preview': {
        language: 'html',
        code: `<!doctype html>\n<html>\n  <body>\n    <h1>Hello HTML</h1>\n    <p>This renders in the preview below.</p>\n  </body>\n</html>`,
      },
    }

    const preset = presets[snippetId] || {
      language: 'javascript',
      code: `console.log('Unknown snippet: ${snippetId}')`,
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Snippet: {snippetId}</h1>
          <Link
            to="/snippets/$snippetId/editor"
            params={{ snippetId }}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Edit
          </Link>
        </div>
        <div className="flex-1 min-h-[50vh]">
          <Suspense
            fallback={
              <div className="p-4 text-sm text-muted-foreground">
                Loading editor…
              </div>
            }
          >
            <CodeEditor
              initialCode={preset.code}
              language={preset.language}
              showRun
              onSave={(code) => {
                console.log('Save (mock):', snippetId, code)
                alert('Saved (mock)!')
              }}
            />
          </Suspense>
        </div>
      </div>
    )
  },
})

export default Route
