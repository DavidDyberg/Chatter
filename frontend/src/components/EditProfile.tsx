import { ButtonComponent } from './Button'

type EditProfileProps = {
  userName: string
  bio: string
  profileImage: string
  profileBanner?: string
  onClose: () => void
  onSave: () => void
}

export const EditProfile: React.FC<EditProfileProps> = ({
  userName,
  bio,
  profileImage,
  profileBanner,
  onClose,
  onSave,
}) => {
  return (
    <form className="relative">
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
          variant="Seacondary"
          OnClick={onClose}
        />
      </div>

      <div className="pb-[70px]" />

      <div className="flex justify-between px-5 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-purple-light" htmlFor="userName">
            Username:
          </label>
          <input
            className="font-bold text-xl border border-gray-600 rounded-lg p-2 focus:border-purple-light focus:outline-none"
            value={userName}
            id="userName"
          />
        </div>
        <ButtonComponent
          className="p-2 pl-4 pr-4 hidden md:block"
          label="Cancel"
          variant="Seacondary"
          OnClick={onClose}
        />
      </div>

      <div className="pt-4 px-5 flex flex-col gap-2">
        <label className="text-purple-light" htmlFor="bio">
          Biography:
        </label>
        <textarea
          className="bg-transparent border border-gray-600 rounded-lg p-4 focus:border-purple-light focus:outline-none"
          id="bio"
          value={bio}
        />
      </div>

      <div className="flex justify-center pt-5 w-full">
        <ButtonComponent
          className="w-2/4"
          OnClick={onSave}
          label="Save"
          variant="Primary"
        />
      </div>
    </form>
  )
}
