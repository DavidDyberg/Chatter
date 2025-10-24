import { ButtonComponent } from './Button'

type EditProfileProps = {
  userName: string
  bio: string
  profileImage: string
  profileBanner?: string
  onClose?: () => void
}

export const EditProfile: React.FC<EditProfileProps> = ({
  userName,
  bio,
  profileImage,
  profileBanner,
  onClose,
}) => {
  return (
    <form className="relative">
      <div className="relative">
        <img
          className="max-h-[200px] w-full object-cover"
          src={profileBanner}
        />

        <img
          className="absolute left-5 md:-bottom-[60px] -bottom-[50px] md:w-[120px] w-[100px] rounded-full object-cover"
          src={profileImage}
        />
      </div>
      <div className="pb-[70px]" />
      <div className="flex justify-between px-5 items-center">
        <div className="flex flex-col">
          <label htmlFor="userName">Username:</label>
          <input className="font-bold text-xl" value={userName} id="userName" />
        </div>
        <ButtonComponent
          className="p-2 pl-4 pr-4"
          label="Cancel"
          variant="Seacondary"
          OnClick={onClose}
        />
      </div>

      <div className="pt-4 px-5 flex flex-col">
        <label htmlFor="bio">Biogrophy:</label>
        <textarea
          className="bg-transparent border border-gray-600 rounded-lg p-4"
          id="bio"
          value={bio}
        />
      </div>
    </form>
  )
}
