export type TicketStatut = 'NOUVEAU' | 'EN_COURS' | 'EN_TEST' | 'EN_PROD' | 'ABANDONNE';
export type TicketType = 'EVOLUTIF' | 'CORRECTIF' | 'PREVENTIF';
export type TicketGravite = 'MINEUR' | 'MAJEUR' | 'BLOQUANT';

export interface Ticket {
  id: string;
  numero_ticket: string;
  libelle: string;
  type: TicketType;
  gravite: TicketGravite;
  statut: TicketStatut;
  charge_jh: number;
  date_ouverture: string;
  date_livraison: string | null;
  date_mep: string | null;
  commentaire: string | null;
  created_at: string;
}

export interface KpiData {
  budgetConsomme: number;
  budgetObjectif: number;
  ticketsTraites: number;
  ticketsObjectif: number;
  jhMoyen: number;
  repartition: {
    evolutif: { total: number; pct: number };
    correctif: { total: number; pct: number };
    preventif: { total: number; pct: number };
  };
  ticketsParStatut: {
    prod: number;
    test: number;
    nouveau: number;
    enCours: number;
  };
}

export interface MonthlyData {
  mois: string;
  totalJH: number;
  evolutifJH: number;
  correctifJH: number;
  preventifJH: number;
  ticketsTraites: number;
}

export interface TicketFilters {
  type: TicketType | 'ALL';
  gravite: TicketGravite | 'ALL';
  annee: string | 'ALL';
  mois: string | 'ALL';
  livraisonTest: 'ALL' | 'YES' | 'NO';
  miseEnProd: 'ALL' | 'YES' | 'NO';
  enCoursDev: 'ALL' | 'YES' | 'NO';
  search: string;
}
