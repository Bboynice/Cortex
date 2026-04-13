import AuthCard from "@/src/components/auth/AuthCard";
import RegisterForm from "@/src/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create account"
      description="Create an account to get started."
      footerText="Already have an account?"
      footerHref="/login"
      footerLabel="Log in"
    >
      <RegisterForm />
    </AuthCard>
  );
}
