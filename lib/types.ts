// Shared types — mirror the ERP catalogue contract (/api/ext/catalogue)

export interface Product {
  id: string
  nom: string
  nomAr?: string
  famille?: string
  unite: string
  prix: number
  prixVente?: number
  prixCHR?: number
  prixMarchand?: number
  prixParticulier?: number
  stockDisponible: number
  marketplaceActif?: boolean
  conditionnement?: string | null
  image?: string
  imageUrl?: string
  description?: string
  tags?: string[]
  ordre?: number
}

export interface CartLine {
  productId: string
  nom: string
  unite: string
  prix: number
  quantite: number
}

export interface AccountSession {
  token: string
  user: {
    id: string
    name: string
    email?: string
    telephone?: string
    role: "client" | "fournisseur" | string
  }
  client?: {
    id: string
    nom: string
    telephone?: string
    adresse?: string
    categorie?: "chr" | "marchand" | "particulier"
    creditAutorise?: boolean
    remisePct?: number
  } | null
}

export interface OrderPayload {
  telephone: string
  email?: string
  nomClient: string
  adresse: string
  dateLivraison: string
  notes?: string
  lignes: { articleId: string; articleNom: string; unite: string; quantite: number; prixUnitaire: number }[]
  source: "boutique"
}
