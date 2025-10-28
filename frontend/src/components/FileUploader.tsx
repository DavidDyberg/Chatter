import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { toast } from 'react-hot-toast'
import heic2any from 'heic2any'
import imageCompression from 'browser-image-compression'

type FileUploaderProps = {
  defaultImage?: string
  onFileSelect: (file: File | null) => void
  children: (props: {
    preview: string | null
    openFileDialog: () => void
  }) => React.ReactNode
}

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function FileUploader({
  defaultImage,
  onFileSelect,
  children,
}: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    let finalFile: File = file

    // === 1️⃣ Detect HEIC / HEIF ===
    const lowerName = file.name.toLowerCase()
    const isHeic =
      lowerName.endsWith('.heic') ||
      lowerName.endsWith('.heif') ||
      file.type.includes('heic') ||
      file.type.includes('heif')

    // === 2️⃣ Convert HEIC/HEIF to JPEG if needed ===
    if (isHeic) {
      try {
        toast.loading('Converting iPhone photo...')
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85,
        })

        const blob = Array.isArray(converted) ? converted[0] : converted
        finalFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, '.jpg'),
          { type: 'image/jpeg' },
        )

        toast.dismiss()
        toast.success('Photo converted to JPEG!')
      } catch (err) {
        console.error('HEIC conversion failed:', err)
        toast.dismiss()
        toast.error(
          'Failed to convert iPhone photo. Try opening it in Photos → Save as JPEG → then retry.',
        )
        e.target.value = ''
        return
      }
    }

    // === 3️⃣ Validate type ===
    const mimeType = finalFile.type
    if (
      mimeType === 'image/svg+xml' ||
      finalFile.name.toLowerCase().endsWith('.svg')
    ) {
      toast.error('SVG files are not allowed.')
      e.target.value = ''
      return
    }

    if (!mimeType.startsWith('image/')) {
      toast.error('Only image files are allowed.')
      e.target.value = ''
      return
    }

    // === 4️⃣ Compress if too large ===
    if (finalFile.size > MAX_SIZE_BYTES) {
      try {
        toast.loading('Compressing large image...')
        const compressedBlob = await imageCompression(finalFile, {
          maxSizeMB: 4,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          initialQuality: 0.8,
        })

        finalFile = new File([compressedBlob], finalFile.name, {
          type: compressedBlob.type,
        })

        toast.dismiss()
        toast.success('Image compressed successfully!')
      } catch (err) {
        console.error('Image compression failed:', err)
        toast.dismiss()
        toast.error('Failed to compress image.')
        e.target.value = ''
        return
      }
    }

    // === 5️⃣ Create preview and propagate ===
    const previewUrl = URL.createObjectURL(finalFile)
    setPreview(previewUrl)
    onFileSelect(finalFile)
  }

  const openFileDialog = () => fileInputRef.current?.click()

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif"
        className="hidden"
        onChange={handleFileChange}
      />
      {children({ preview, openFileDialog })}
    </>
  )
}
