export const money = (n: number) =>
  `${(n ?? 0).toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`

export const tomorrow = (): string => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

export const today = (): string => new Date().toISOString().split("T")[0]
