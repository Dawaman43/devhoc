export function Button({ type }: { type: 'Add' | 'Remove' }) {
  return (
    <div>
      <button type="button" onClick={() => {}}>
        {type}
      </button>
    </div>
  )
}
