import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Upload, Link as LinkIcon, Dices, LayoutGrid } from 'lucide-react'

const AVATAR_PRESETS = [
    'https://api.dicebear.com/6.x/identicon/svg?seed=alpha',
    'https://api.dicebear.com/6.x/identicon/svg?seed=bravo',
    'https://api.dicebear.com/6.x/identicon/svg?seed=charlie',
    'https://api.dicebear.com/6.x/identicon/svg?seed=delta',
    'https://api.dicebear.com/6.x/identicon/svg?seed=echo',
    'https://api.dicebear.com/6.x/identicon/svg?seed=foxtrot',
]

const DICEBEAR_VARIANTS = [
    'identicon',
    'adventurer',
    'bottts',
    'pixel-art',
    'gridy',
]

async function fileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.onload = () => resolve(String(reader.result))
        reader.readAsDataURL(file)
    })
}

interface AvatarSelectionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentAvatarUrl: string
    onSelect: (url: string) => void
}

export default function AvatarSelectionModal({
    open,
    onOpenChange,
    currentAvatarUrl,
    onSelect,
}: AvatarSelectionModalProps) {
    const [mode, setMode] = useState<'preset' | 'dicebear' | 'upload' | 'url'>(
        'preset',
    )
    const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl)
    const [diceVariant, setDiceVariant] = useState('identicon')
    const [diceSeed, setDiceSeed] = useState('')
    const [urlInput, setUrlInput] = useState('')

    // Initialize state when modal opens
    useEffect(() => {
        if (open) {
            setPreviewUrl(currentAvatarUrl)
            setDiceSeed(Math.random().toString(36).substring(7))
            setUrlInput('')
            setMode('preset')
        }
    }, [open, currentAvatarUrl])

    const generateDicebearUrl = (variant: string, seed: string) => {
        const v = variant || 'identicon'
        const s = seed || 'seed'
        return `https://api.dicebear.com/6.x/${v}/svg?seed=${encodeURIComponent(s)}`
    }

    const handleFile = async (file?: File) => {
        if (!file) return
        try {
            const dataUrl = await fileToDataUrl(file)
            setPreviewUrl(dataUrl)
        } catch (err) {
            console.error('Failed to read file', err)
        }
    }

    const handleSave = () => {
        onSelect(previewUrl)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose Avatar</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Preview */}
                    <div className="flex justify-center">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
                            {previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    ?
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMode('preset')}
                            className={`p-2 rounded-md transition-colors ${mode === 'preset'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground'
                                }`}
                            title="Presets"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('dicebear')}
                            className={`p-2 rounded-md transition-colors ${mode === 'dicebear'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground'
                                }`}
                            title="Generate"
                        >
                            <Dices size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('upload')}
                            className={`p-2 rounded-md transition-colors ${mode === 'upload'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground'
                                }`}
                            title="Upload"
                        >
                            <Upload size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('url')}
                            className={`p-2 rounded-md transition-colors ${mode === 'url'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground'
                                }`}
                            title="Link"
                        >
                            <LinkIcon size={20} />
                        </button>
                    </div>

                    {/* Mode Content */}
                    <div className="min-h-[150px] rounded-md border p-4">
                        {mode === 'preset' && (
                            <div className="grid grid-cols-3 gap-2">
                                {AVATAR_PRESETS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPreviewUrl(p)}
                                        className={`rounded-md p-1 transition-all ${previewUrl === p
                                                ? 'ring-2 ring-primary bg-primary/10'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        <img
                                            src={p}
                                            alt="preset"
                                            className="h-10 w-10 mx-auto object-cover rounded-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {mode === 'dicebear' && (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Style</label>
                                    <select
                                        value={diceVariant}
                                        onChange={(e) => {
                                            setDiceVariant(e.target.value)
                                            setPreviewUrl(
                                                generateDicebearUrl(e.target.value, diceSeed),
                                            )
                                        }}
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    >
                                        {DICEBEAR_VARIANTS.map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={diceSeed}
                                        onChange={(e) => {
                                            setDiceSeed(e.target.value)
                                            setPreviewUrl(
                                                generateDicebearUrl(diceVariant, e.target.value),
                                            )
                                        }}
                                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                                        placeholder="Seed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSeed = Math.random().toString(36).substring(7)
                                            setDiceSeed(newSeed)
                                            setPreviewUrl(generateDicebearUrl(diceVariant, newSeed))
                                        }}
                                        className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                    >
                                        Random
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'upload' && (
                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Upload size={32} />
                                    <span className="text-sm">Click to upload image</span>
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                            </div>
                        )}

                        {mode === 'url' && (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Image URL</label>
                                    <input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (urlInput) setPreviewUrl(urlInput)
                                    }}
                                    className="w-full rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                                >
                                    Preview
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Save Avatar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
