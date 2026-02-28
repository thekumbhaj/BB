export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-6 text-center">
          <span className="text-3xl font-extrabold text-blue-800 tracking-tight">
            Bug<span className="text-blue-500">baar</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
