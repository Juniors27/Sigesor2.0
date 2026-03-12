"use client"

import LoginForm from "@/components/forms/LoginForm"
import useLoginForm from "@/hooks/useLoginForm"

export default function LoginScreen() {
  const loginForm = useLoginForm()

  return <LoginForm {...loginForm} />
}
