import React, { Suspense } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
const CodeEditor = React.lazy(() => import('@/components/ide/CodeEditor'))

export const Route = createFileRoute('/snippets/$snippetId/editor')({
  component: () => {
    const { snippetId } = useParams({ from: '/snippets/$snippetId/editor' })
    return (
      <div className="h-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Editing: {snippetId}</h1>
        <div className="flex-1 min-h-[50vh]">
          <Suspense
            fallback={
              <div className="p-4 text-sm text-muted-foreground">
                Loading editor…
              </div>
            }
          >
            <CodeEditor
              initialCode={`// Editing ${snippetId}\nconsole.log('Edit me!')`}
              language="javascript"
              onSave={(code) => {
                console.log('Saved snippet', snippetId, code)
                alert(`Saved ${snippetId} (mock)!`)
              }}
            />
          </Suspense>
        </div>
      </div>
    )
  },
})

export default Route
