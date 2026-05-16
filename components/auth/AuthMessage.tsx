export function AuthMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-primarySoft px-4 py-3 text-sm font-medium text-primary">
      {message}
    </div>
  );
}
