import AuthForm from "@/components/auth-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthForm mode="signin" />
    </div>
  )
}
