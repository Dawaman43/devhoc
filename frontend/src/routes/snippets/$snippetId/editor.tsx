import { createFileRoute, useParams } from '@tanstack/react-router'
import CodeEditor from '@/components/ide/CodeEditor'

export const Route = createFileRoute('/snippets/$snippetId/editor')({
  component: () => {
    const { snippetId } = useParams({ from: '/snippets/$snippetId/editor' })
    return (
      <div className="h-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Editing: {snippetId}</h1>
        <div className="flex-1 min-h-[50vh]">
          <CodeEditor
            initialCode={`// Editing ${snippetId}\nconsole.log('Edit me!')`}
            language="javascript"
            onSave={(code) => {
              console.log('Saved snippet', snippetId, code)
              alert(`Saved ${snippetId} (mock)!`)
            }}
          />
        </div>
      </div>
    )
  },
})

export default Route
