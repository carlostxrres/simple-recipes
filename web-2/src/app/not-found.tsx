import Link from "next/link";
import { IconChefHat, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-frost rounded-2xl p-8 md:p-12 text-center max-w-md">
        <IconChefHat className="w-20 h-20 mx-auto text-primary-300 mb-6" />
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Receta no encontrada
        </h1>
        <p className="text-text-secondary mb-8">
          Parece que esta receta no existe o ha sido eliminada.
        </p>
        <Button asChild size="lg">
          <Link href="/" className="gap-2">
            <IconArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </main>
  );
}
