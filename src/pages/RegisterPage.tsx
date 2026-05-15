import AuthPage from "./AuthPage";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-[#0d0d11] flex flex-col justify-center items-center px-4">
      <AuthPage initialMode="register" />
    </div>
  );
}
