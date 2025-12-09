import React from 'react'

type Msg = { type: string; url?: string }

export default function SyncStatus() {
  const [queued, setQueued] = React.useState(0)
  const [online, setOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  React.useEffect(() => {
    const onMsg = (event: MessageEvent<Msg>) => {
      const data = event.data
      if (data && data.type === 'mutation-queued') {
        setQueued((q) => q + 1)
      }
    }
    navigator.serviceWorker?.addEventListener('message', onMsg as EventListener)
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      navigator.serviceWorker?.removeEventListener(
        'message',
        onMsg as EventListener,
      )
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 9999 }}>
      <div
        style={{
          background: online ? '#0f766e' : '#b91c1c',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span>{online ? 'Online' : 'Offline'}</span>
        <span>•</span>
        <span>Queued: {queued}</span>
      </div>
    </div>
  )
}
