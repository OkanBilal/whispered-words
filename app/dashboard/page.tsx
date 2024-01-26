import { ProfileForm } from "./profile-form"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Profile</h3>
      </div>
      <ProfileForm />
    </div>
  )
}
