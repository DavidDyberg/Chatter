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

const MAX_FILE_SIZE = 2 * 1024 * 1024

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

    const fileName = file.name.toLowerCase()
    const mimeType = file.type.toLowerCase()

    const isHeicOrHeif =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      mimeType === 'image/heic' ||
      mimeType === 'image/heif'

    let finalFile: File = file

    if (isHeicOrHeif) {
      try {
        toast.loading('Converting photo...')

        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        })

        const blob = Array.isArray(converted) ? converted[0] : converted

        finalFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, '.jpg'),
          { type: 'image/jpeg' },
        )

        toast.success('Converted to JPEG!')
      } catch (err) {
        console.error('HEIC/HEIF conversion failed:', err)
        toast.dismiss('heic')
        toast.error('Failed to convert photo. Try exporting as JPEG instead.')
        e.target.value = ''
        return
      } finally {
        toast.dismiss('heic')
      }
    }

    if (finalFile.size > MAX_FILE_SIZE) {
      try {
        toast.loading('Compressing image...')

        const compressed = await imageCompression(finalFile, {
          maxSizeMB: 1.8,
          maxWidthOrHeight: 1920,
          initialQuality: 0.8,
        })

        finalFile = new File([compressed], finalFile.name, {
          type: compressed.type,
        })

        toast.success('Image compressed!')
      } catch (err) {
        console.error('Image compression failed:', err)
        toast.dismiss('compress')
        toast.error('Failed to compress image.')
      } finally {
        toast.dismiss('compress')
      }
    }

    if (
      !finalFile.type.startsWith('image/') ||
      !/\.(jpe?g|png|webp|gif)$/i.test(finalFile.name)
    ) {
      toast.error('Only image files are allowed.')
      e.target.value = ''
      return
    }

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
