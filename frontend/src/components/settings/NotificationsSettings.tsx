import React, { useEffect, useState } from 'react'

export default function NotificationsSettings() {
  const [emailNotifications, setEmailNotifications] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('devhoc.notifications.email') !== 'false'
  })
  const [desktopNotifications, setDesktopNotifications] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('devhoc.notifications.desktop') === 'true'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      'devhoc.notifications.email',
      String(emailNotifications),
    )
  }, [emailNotifications])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      'devhoc.notifications.desktop',
      String(desktopNotifications),
    )
  }, [desktopNotifications])

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Email Notifications</div>
            <div className="text-xs text-muted-foreground">
              Receive emails for mentions and replies
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Desktop Notifications</div>
            <div className="text-xs text-muted-foreground">
              Show browser notifications when active
            </div>
          </div>
          <input
            type="checkbox"
            checked={desktopNotifications}
            onChange={(e) => setDesktopNotifications(e.target.checked)}
          />
        </div>
      </div>
    </div>
  )
}
