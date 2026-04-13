import AuthCard from "@/src/components/auth/AuthCard";
import LoginFrom from "@/src/components/auth/LoginFrom";

export default function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      description="Welcome back! Please enter your details."
      footerText="Don't have an account?"
      footerHref="/register"
      footerLabel="Create one"
    >
      <LoginFrom />
    </AuthCard>
  );
}