import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { postReply } from '@/lib/api/comments'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/comments/replies')({
  component: RouteComponent,
})

function RouteComponent() {
  const [commentId, setCommentId] = React.useState('c1')
  const [parentId, setParentId] = React.useState('')
  const [author, setAuthor] = React.useState('You')
  const [text, setText] = React.useState('Nice reply!')
  const [result, setResult] = React.useState<any>(null)

  const submit = async () => {
    const res = await postReply({
      commentId,
      parentReplyId: parentId || undefined,
      author,
      text,
    })
    setResult(res)
    alert('Reply posted (mock).')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Post a Reply (mock API)</h1>
      <div className="flex flex-col gap-2 max-w-xl">
        <input
          className="rounded border p-2"
          value={commentId}
          onChange={(e) => setCommentId(e.target.value)}
          placeholder="commentId"
        />
        <input
          className="rounded border p-2"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          placeholder="parentReplyId (optional)"
        />
        <input
          className="rounded border p-2"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="author"
        />
        <textarea
          className="rounded border p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={submit}>Post Reply</Button>
      </div>
      {result && (
        <pre className="mt-4 rounded bg-muted p-2 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
