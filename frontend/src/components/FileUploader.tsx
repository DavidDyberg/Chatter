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

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

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

    // === 1️⃣ Handle HEIC conversion ===
    const fileName = file.name.toLowerCase()
    const isHeic =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif'

    let finalFile: File = file

    if (isHeic) {
      try {
        toast('Converting iPhone photo...')
        const convertedBlob: any = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        })

        const blob = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob

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
        console.error('HEIC conversion failed:', err)
        toast.error(
          'Failed to convert photo. Try saving as JPEG in Photos app.',
        )
        e.target.value = ''
        return
      }
    }

    // === 2️⃣ Check and compress large files ===
    if (finalFile.size > MAX_SIZE_BYTES) {
      try {
        toast('Compressing large image...')
        const compressedBlob = await imageCompression(finalFile, {
          maxSizeMB: 4, // target ~4MB
          maxWidthOrHeight: 2000, // optional: resize very large images
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
        return
      }
    }

    // === 3️⃣ Validate file type ===
    if (
      finalFile.type === 'image/svg+xml' ||
      finalFile.name.toLowerCase().endsWith('.svg')
    ) {
      toast.error('SVG files are not allowed.')
      e.target.value = ''
      return
    }

    if (
      !finalFile.type.startsWith('image/') &&
      !finalFile.name.match(/\.(jpe?g|png|webp|gif)$/i)
    ) {
      toast.error('Only image files are allowed.')
      e.target.value = ''
      return
    }

    // === 4️⃣ Create preview & send ===
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
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
        className="hidden"
        onChange={handleFileChange}
      />
      {children({ preview, openFileDialog })}
    </>
  )
}
