import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  src?: string
  alt?: string
  name?: string
}

function getInitials(name?: string) {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ className, src, alt, name, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative inline-flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt || name}
          data-slot="avatar-image"
          className={cn('aspect-square size-full object-cover')}
        />
      ) : (
        <AvatarPrimitive.Fallback
          data-slot="avatar-fallback"
          className={cn(
            'bg-muted flex size-full items-center justify-center rounded-full',
          )}
        >
          <span className="text-xs font-medium text-foreground">
            {getInitials(name || alt)}
          </span>
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
