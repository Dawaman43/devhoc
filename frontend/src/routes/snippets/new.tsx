import { createFileRoute } from '@tanstack/react-router'
import CodeEditor from '@/components/ide/CodeEditor'

export const Route = createFileRoute('/snippets/new')({
  component: () => (
    <div className="h-full flex flex-col gap-3">
      <h1 className="text-lg font-semibold">New Snippet</h1>
      <div className="flex-1 min-h-[50vh]">
        <CodeEditor
          initialCode={`// Start typing your snippet\nfunction hello(name: string) {\n  return 'Hello ' + name\n}`}
          language="typescript"
          onSave={(code) => {
            // For now, just log. Could persist to backend later.
            console.log('Saved snippet:', code)
            alert('Snippet saved (mock)!')
          }}
        />
      </div>
    </div>
  ),
})

export default Route
