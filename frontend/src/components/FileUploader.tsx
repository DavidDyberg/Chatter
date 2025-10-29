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

    await new Promise((r) => setTimeout(r, 200))

    console.log('📁 File info:', {
      name: file.name,
      type: file.type,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
    })

    toast(
      `📸 File selected:
Name: ${file.name || 'unknown'}
Type: ${file.type || 'unknown'}
Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      { duration: 4000 },
    )

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
      mimeType.includes('heic') ||
      mimeType.includes('heif')

    let finalFile: File = file
    if (isHeicOrHeif) {
      try {
        toast.loading('Converting photo...')
        console.log('🧩 Detected HEIC/HEIF file — starting conversion...')
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

        toast.dismiss()
        toast.success('Converted to JPEG!')
        console.log('✅ Converted file:', {
          name: finalFile.name,
          type: finalFile.type,
          sizeMB: (finalFile.size / (1024 * 1024)).toFixed(2),
        })
      } catch (err) {
        console.error('❌ HEIC/HEIF conversion failed:', err)
        toast.dismiss()
        toast.error('Failed to convert photo. Try exporting as JPEG instead.')
        e.target.value = ''
        return
      }
    }

    if (finalFile.size > MAX_FILE_SIZE) {
      try {
        toast.loading('Compressing image...')
        console.log('🗜️ Compressing large image...')

        const compressed = await imageCompression(finalFile, {
          maxSizeMB: 1.8,
          maxWidthOrHeight: 1920,
          initialQuality: 0.8,
          useWebWorker: true,
        })

        finalFile = new File([compressed], finalFile.name, {
          type: compressed.type,
        })

        toast.dismiss()
        toast.success('Image compressed!')
        console.log('✅ Compressed file:', {
          name: finalFile.name,
          type: finalFile.type,
          sizeMB: (finalFile.size / (1024 * 1024)).toFixed(2),
        })
      } catch (err) {
        console.error('❌ Image compression failed:', err)
        toast.dismiss()
        toast.error('Failed to compress image.')
        return
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
