"use client";

import { useEffect } from "react";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-frost rounded-2xl p-8 md:p-12 text-center max-w-md">
        <IconAlertTriangle className="w-20 h-20 mx-auto text-red-400 mb-6" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Algo salió mal
        </h1>
        <p className="text-text-secondary mb-8">
          Ha ocurrido un error al cargar esta página. Por favor, inténtalo de
          nuevo.
        </p>
        <Button onClick={reset} size="lg" className="gap-2">
          <IconRefresh className="w-5 h-5" />
          Intentar de nuevo
        </Button>
      </div>
    </main>
  );
}
