import { useState } from 'react'
import { ButtonComponent } from './Button'
import { useMutation } from '@tanstack/react-query'
import { editUser } from '@/api-routes/user'
import type { User } from '@/types/types'
import { toast } from 'react-hot-toast'

type EditProfileProps = {
  id: string
  userName: string
  bio: string
  profileImage: string
  profileBanner?: string
  onClose: () => void
  onSave: () => void
}

export const EditProfile: React.FC<EditProfileProps> = ({
  id,
  userName,
  bio,
  profileImage,
  profileBanner,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(userName)
  const [biography, setBiography] = useState(bio)
  // const [imageProfile, setImageProfile] = useState(profileImage)
  // const [imageBanner, setImageBanner] = useState(profileBanner)
  const [usernameError, setUsernameError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (updatedData: Partial<User>) => {
      return editUser(id, updatedData)
    },
    onSuccess: () => {
      onSave()
      toast.success('Profile updated successfully')
    },
    onError: () => {
      toast.error('Something went wrong, please try again later')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setUsernameError('UserName is required')
      return
    }
    setUsernameError('')
    mutate({ userName: name, bio: biography })
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative group/banner cursor-pointer">
        <img
          className="max-h-[200px] w-full object-cover transition-opacity"
          src={profileBanner}
          alt="Profile banner"
        />
        <div className="absolute inset-0 bg-black/60 md:opacity-0 md:group-hover/banner:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <p className=" font-semibold">Change banner</p>
        </div>
      </div>

      <div className="relative group/profile">
        <img
          className="absolute left-5 md:-bottom-[60px] -bottom-[50px] md:w-[120px] w-[100px] rounded-full object-cover cursor-pointer transition-opacity"
          src={profileImage}
          alt="Profile picture"
        />

        <div className="absolute md:h-6 h-10 md:left-1 left-5 md:-bottom-[60px] -bottom-[66px] md:w-[160px] w-[100px] rounded-full bg-black/60 md:opacity-0 md:group-hover/profile:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <p className="text-xs tracking-wide text-center px-2">
            Change profile image
          </p>
        </div>
        <ButtonComponent
          className="p-2 pl-4 pr-4 absolute right-5 top-5 md:hidden"
          label="Cancel"
          variant="Delete"
          onClick={onClose}
        />
      </div>

      <div className="pb-[70px]" />

      <div className="flex justify-between px-5 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-purple-light" htmlFor="userName">
            Username:
          </label>
          <input
            className={`font-bold text-xl rounded-lg p-2 border focus:outline-none ${usernameError ? 'border-primary-red focus:border-primary-red' : 'border-gray-600 focus:border-purple-light'}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (usernameError) {
                setUsernameError('')
              }
            }}
            id="userName"
          />
          {usernameError && (
            <p className="text-red-600">Username is required</p>
          )}
        </div>
        <ButtonComponent
          className="p-2 pl-4 pr-4 hidden md:block"
          label="Cancel"
          variant="Delete"
          onClick={onClose}
        />
      </div>

      <div className="pt-4 px-5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-purple-light" htmlFor="bio">
            Biography:
          </label>
          <p>{biography.length} / 800</p>
        </div>
        <textarea
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          maxLength={800}
          className="bg-transparent border border-gray-600 rounded-lg p-4 focus:border-purple-light focus:outline-none field-sizing-content min-h-48"
          id="bio"
        />
      </div>

      <div className="flex justify-center pt-5 w-full px-5">
        <ButtonComponent
          className="md:w-2/4 w-full"
          label={isPending ? 'Saving...' : 'Save'}
          variant="Primary"
          disabled={isPending}
          isLoading={isPending}
          type="submit"
        />
      </div>
    </form>
  )
}
