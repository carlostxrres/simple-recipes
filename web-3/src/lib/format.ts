export function getDifficultyLabel(difficulty: "1" | "2" | "3"): string {
  const labels: Record<string, string> = {
    "1": "Fácil",
    "2": "Media",
    "3": "Difícil",
  };
  return labels[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: "1" | "2" | "3"): string {
  const colors: Record<string, string> = {
    "1": "bg-green-100 text-green-700",
    "2": "bg-yellow-100 text-yellow-700",
    "3": "bg-red-100 text-red-700",
  };
  return colors[difficulty] || "bg-gray-100 text-gray-700";
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${mins} min`;
}

export function formatQuantity(
  amount: number | null,
  unit: string | null,
  servings: number = 2
): string {
  if (amount === null) {
    return "Al gusto";
  }

  const adjustedAmount = (amount * servings) / 2;
  const formatted =
    adjustedAmount % 1 === 0
      ? adjustedAmount.toString()
      : adjustedAmount.toFixed(1).replace(/\.0$/, "");

  if (!unit) {
    return formatted;
  }

  return `${formatted} ${unit}`;
}
