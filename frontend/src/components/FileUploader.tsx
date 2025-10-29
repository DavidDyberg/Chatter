import { useRef, useState, type ChangeEvent } from 'react'
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

const TARGET_SIZE_MB = 1.8
const SKIP_COMPRESSION_BELOW_BYTES = 200 * 1024 // 200 KB

export default function FileUploader({
  defaultImage,
  onFileSelect,
  children,
}: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (
      file.type === 'image/svg+xml' ||
      file.name.toLowerCase().endsWith('.svg')
    ) {
      toast.error('SVG files are not allowed.')
      e.target.value = ''
      return
    }

    let finalFile: File = file
    const fileName = file.name.toLowerCase()
    const mimeType = file.type.toLowerCase()

    // Convert HEIC/HEIF to JPEG
    const isHeicOrHeif =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      mimeType === 'image/heic' ||
      mimeType === 'image/heif'

    if (isHeicOrHeif) {
      try {
        toast('Converting iPhone photo...')
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        })
        const blob = Array.isArray(converted) ? converted[0] : converted
        finalFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, '.jpg'),
          {
            type: 'image/jpeg',
          },
        )
        toast.dismiss()
        toast.success('Photo converted to JPEG!')
      } catch (err) {
        console.error('HEIC/HEIF conversion failed:', err)
        toast.dismiss()
        toast.error('Failed to convert photo. Try exporting as JPEG instead.')
        e.target.value = ''
        return
      }
    }

    // Compress only if file is bigger than 200 KB
    if (finalFile.size > SKIP_COMPRESSION_BELOW_BYTES) {
      try {
        toast('Compressing image...')
        const compressedBlob = await imageCompression(finalFile, {
          maxSizeMB: TARGET_SIZE_MB,
          maxWidthOrHeight: 1920,
          initialQuality: 0.8,
          useWebWorker: true,
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
        return
      }
    }

    // Preview and callback
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
