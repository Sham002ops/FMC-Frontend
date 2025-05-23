import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Processing } from './ui/icons/Processing';

const RagisterAdmin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false,
    isAdmin: false,
  });

  const handleChange = () =>{}
  const handleSubmit = () =>{}
  const handleCheckbox = () =>{}
  const handleCreateWebinar = () =>{}
  return (
    <div>
         <label className="block mb-2 font-medium"></label>
           <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={handleChange} required />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              {/* <Checkbox id="terms" checked={form.termsAgreed} onCheckedChange={() => handleCheckbox('termsAgreed')} /> */}
              <Label htmlFor="terms" className="text-sm font-normal leading-none">
                I agree to the <a href="/terms" className="text-event-primary hover:underline">Terms</a> and <a href="/privacy" className="text-event-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              {/* <Checkbox id="admin" checked={form.isAdmin} onCheckedChange={() => handleCheckbox('isAdmin')} /> */}
              <Label htmlFor="admin" className="text-sm font-normal leading-none">
                I want to register as Admin
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-event-dark">
              {isLoading ? <Processing /> : <>Create Account</>}
            </Button>
          </div>
        </form>

      <button
        onClick={handleCreateWebinar}
        className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
      >
        Create Webinar
      </button>
    </div>
  )
}

export default RagisterAdmin