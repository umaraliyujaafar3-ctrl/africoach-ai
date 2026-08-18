import { useId, useState } from 'react'
import {
  Bell,
  Lock,
  Save,
  Shield,
  Trash2,
  UserRound,
} from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  TabPanel,
} from '@/components/ui'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/auth'
import { useOnboardingStore } from '@/store/onboarding'
import { useSettingsStore } from '@/store/settings'
import { toast } from '@/store/toast'
import { CAREER_FIELDS, DIFFICULTY_LEVELS, EXPERIENCE_LEVELS, LANGUAGES } from '@/types'

export default function Settings() {
  const id = useId()
  const [activeTab, setActiveTab] = useState('profile')

  const flashSaved = () => toast('Settings saved')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Avatar name="A" className="h-12 w-12 rounded-2xl" size="lg" />
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">Account settings</h2>
          <p className="text-sm text-ink-500">Manage your profile and preferences.</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'profile', label: 'Profile', icon: <UserRound className="h-4 w-4" aria-hidden="true" /> },
          { id: 'preferences', label: 'Preferences', icon: <Bell className="h-4 w-4" aria-hidden="true" /> },
          { id: 'account', label: 'Account', icon: <Shield className="h-4 w-4" aria-hidden="true" /> },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel="Settings sections"
      />

      <TabPanel id={id} tabId="profile" activeTab={activeTab}>
        <ProfileTab onSaved={flashSaved} />
      </TabPanel>
      <TabPanel id={id} tabId="preferences" activeTab={activeTab}>
        <PreferencesTab onSaved={flashSaved} />
      </TabPanel>
      <TabPanel id={id} tabId="account" activeTab={activeTab}>
        <AccountTab />
      </TabPanel>
    </div>
  )
}

function ProfileTab({ onSaved }: { onSaved: () => void }) {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const onboarding = useOnboardingStore()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [bio, setBio] = useState('')
  const [careerField, setCareerField] = useState(onboarding.careerField ?? 'Software Engineering')
  const [experience, setExperience] = useState(onboarding.experienceLevel ?? 'Entry-Level')

  return (
    <Card>
      <div className="flex flex-col gap-6 border-b border-ink-100 px-5 py-5 sm:flex-row sm:items-center">
        <Avatar name={user?.name ?? 'A'} src={user?.avatar} size="lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <p className="text-sm font-semibold text-ink-900">Profile photo</p>
          <p className="text-xs text-ink-500">JPG or PNG, up to 2MB.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Upload
          </Button>
          <Button variant="ghost" size="sm">
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-ink-700">
              Full name
            </label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Johnson" />
          </div>
          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-ink-700">
              Email address
            </label>
            <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-ink-700">
            Short bio
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Aspiring product manager passionate about fintech in Africa…"
            className="w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-field" className="mb-1.5 block text-sm font-medium text-ink-700">
              Career field
            </label>
            <Select
              id="profile-field"
              value={careerField}
              onChange={(e) => setCareerField(e.target.value as (typeof CAREER_FIELDS)[number])}
            >
              {CAREER_FIELDS.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="profile-exp" className="mb-1.5 block text-sm font-medium text-ink-700">
              Experience level
            </label>
            <Select
              id="profile-exp"
              value={experience}
              onChange={(e) => setExperience(e.target.value as (typeof EXPERIENCE_LEVELS)[number])}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              updateProfile({ name, email })
              onSaved()
            }}
          >
            <Save className="mr-2 h-4 w-4" aria-hidden="true" /> Save changes
          </Button>
        </div>
      </div>
    </Card>
  )
}

function PreferencesTab({ onSaved }: { onSaved: () => void }) {
  const settings = useSettingsStore()
  const onboarding = useOnboardingStore()
  const notifKeys: { key: keyof typeof settings.notifications; title: string; desc: string }[] = [
    { key: 'email', title: 'Email notifications', desc: 'Interview reminders and result summaries by email.' },
    { key: 'push', title: 'Push notifications', desc: 'Real-time nudges when your feedback report is ready.' },
    { key: 'tips', title: 'Career tips', desc: 'Weekly bite-sized interview and career advice.' },
    { key: 'weeklyReport', title: 'Weekly progress report', desc: 'A Monday summary of your practice streak and scores.' },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <p className="px-5 pt-5 font-semibold text-ink-900">Interview defaults</p>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-3">
          <div>
            <label htmlFor="pref-mode" className="mb-1.5 block text-sm font-medium text-ink-700">
              Default mode
            </label>
            <Select
              id="pref-mode"
              value={settings.defaultMode}
              onChange={(e) => {
                const mode = e.target.value as 'text' | 'voice'
                settings.setDefaultMode(mode)
                onboarding.setDefaultMode(mode)
              }}
            >
              <option value="text">Text</option>
              <option value="voice">Voice</option>
            </Select>
          </div>
          <div>
            <label htmlFor="pref-language" className="mb-1.5 block text-sm font-medium text-ink-700">
              Language
            </label>
            <Select
              id="pref-language"
              value={settings.language}
              onChange={(e) => {
                const lang = e.target.value as (typeof LANGUAGES)[number]
                settings.setLanguage(lang)
                onboarding.setLanguage(lang)
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="pref-difficulty" className="mb-1.5 block text-sm font-medium text-ink-700">
              Default difficulty
            </label>
            <Select
              id="pref-difficulty"
              value={settings.difficulty}
              onChange={(e) => settings.setDifficulty(e.target.value as (typeof DIFFICULTY_LEVELS)[number])}
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <p className="px-5 pt-5 font-semibold text-ink-900">Notifications</p>
        <div className="divide-y divide-ink-100 px-5 pb-3 pt-2">
          {notifKeys.map((n) => (
            <label
              key={n.key}
              className="flex cursor-pointer items-start justify-between gap-4 py-4"
            >
              <span>
                <span className="block text-sm font-medium text-ink-800">{n.title}</span>
                <span className="block text-xs text-ink-500">{n.desc}</span>
              </span>
              <input
                type="checkbox"
                checked={settings.notifications[n.key]}
                onChange={(e) => settings.setNotification(n.key, e.target.checked)}
                aria-label={n.title}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-sunrise-500 accent-sunrise-500"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end px-5 pb-5">
          <Button onClick={onSaved}>
            <Save className="mr-2 h-4 w-4" aria-hidden="true" /> Save preferences
          </Button>
        </div>
      </Card>
    </div>
  )
}

function AccountTab() {
  const logout = useAuthStore((s) => s.logout)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="space-y-5">
      <Card>
        <p className="px-5 pt-5 font-semibold text-ink-900">Change password</p>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-ink-700">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-ink-700">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="flex justify-end px-5 pb-5">
          <Button
            disabled={!password || password !== confirm}
            onClick={() => {
              setPassword('')
              setConfirm('')
              toast('Password updated')
            }}
          >
            <Lock className="mr-2 h-4 w-4" aria-hidden="true" /> Update password
          </Button>
        </div>
      </Card>

      <Card className={cn('border-red-100')}>
        <p className="px-5 pt-5 font-semibold text-red-600">Danger zone</p>
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink-800">Delete account</p>
            <p className="text-xs text-ink-500">
              This permanently removes your profile, history and reports.
            </p>
          </div>
          <Button
            variant="ghost"
            className="border border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Delete account
          </Button>
        </div>
      </Card>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete your account?" size="sm">
        <p className="text-sm text-ink-600">
          This action can't be undone. All your interview history and progress will be lost forever.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              setDeleteOpen(false)
              logout()
            }}
          >
            Yes, delete everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
