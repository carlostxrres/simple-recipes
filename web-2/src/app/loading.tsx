import { IconChefHat } from "@tabler/icons-react";

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary-100 animate-pulse" />
          <IconChefHat className="w-8 h-8 text-primary-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-text-secondary">Cargando...</p>
      </div>
    </main>
  );
}
