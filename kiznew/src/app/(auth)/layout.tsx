export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
