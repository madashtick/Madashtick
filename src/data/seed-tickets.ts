import { Ticket } from '@/types/ticket';

export const seedTickets: Ticket[] = [
  // 2025-09 (8 tickets, total 49.5 J/H)
  {
    id: '1', numero_ticket: '0000127', ligne_contrat: null, libelle: 'Correction exemple',
    type: 'CORRECTIF', gravite: 'MINEUR', statut: 'ABANDONNE', charge_jh: 3.5,
    date_ouverture: '2025-09-01', date_livraison: '2025-09-05', date_mep: '2025-09-06', commentaire: '2025-09-10', created_at: '2025-09-01',
  },
  {
    id: '2', numero_ticket: '0000126', ligne_contrat: null, libelle: 'Evolution REB',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'EN_COURS', charge_jh: 6.5,
    date_ouverture: '2025-09-15', date_livraison: '2025-09-21', date_mep: null, commentaire: null, created_at: '2025-09-15',
  },
  {
    id: '3', numero_ticket: '0000135', ligne_contrat: null, libelle: 'Evolution Rejet',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'NOUVEAU', charge_jh: 6.5,
    date_ouverture: '2025-09-15', date_livraison: '2025-09-29', date_mep: null, commentaire: null, created_at: '2025-09-15',
  },
  {
    id: '4', numero_ticket: '0000134', ligne_contrat: null, libelle: 'Evolution Tracking',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'EN_TEST', charge_jh: 6.5,
    date_ouverture: '2025-09-15', date_livraison: '2025-10-12', date_mep: null, commentaire: null, created_at: '2025-09-15',
  },
  {
    id: '5', numero_ticket: '0000136', ligne_contrat: null, libelle: 'Evolution FEB',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'EN_PROD', charge_jh: 6.5,
    date_ouverture: '2025-09-15', date_livraison: null, date_mep: null, commentaire: null, created_at: '2025-09-15',
  },
  {
    id: '6', numero_ticket: '0000145', ligne_contrat: null, libelle: 'Evolution DF10',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'NOUVEAU', charge_jh: 6.5,
    date_ouverture: '2025-09-21', date_livraison: null, date_mep: null, commentaire: null, created_at: '2025-09-21',
  },
  {
    id: '7', numero_ticket: '0000146', ligne_contrat: null, libelle: 'Evolution Tracking 2',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'EN_COURS', charge_jh: 7.0,
    date_ouverture: '2025-09-21', date_livraison: '2025-10-12', date_mep: null, commentaire: null, created_at: '2025-09-21',
  },
  {
    id: '8', numero_ticket: '0000138', ligne_contrat: null, libelle: 'Evolution Rejet DF10',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'NOUVEAU', charge_jh: 6.5,
    date_ouverture: '2025-09-21', date_livraison: '2025-10-05', date_mep: null, commentaire: null, created_at: '2025-09-21',
  },

  // 2025-10 (2 tickets, total 10.0 J/H)
  {
    id: '9', numero_ticket: '0000144', ligne_contrat: null, libelle: 'Correction Mails',
    type: 'CORRECTIF', gravite: 'MAJEUR', statut: 'NOUVEAU', charge_jh: 3.0,
    date_ouverture: '2025-10-03', date_livraison: null, date_mep: null, commentaire: null, created_at: '2025-10-03',
  },
  {
    id: '10', numero_ticket: '0000148', ligne_contrat: null, libelle: 'Evolution Catalogue',
    type: 'EVOLUTIF', gravite: 'MAJEUR', statut: 'NOUVEAU', charge_jh: 7.0,
    date_ouverture: '2025-10-03', date_livraison: '2025-10-17', date_mep: null, commentaire: null, created_at: '2025-10-03',
  },
];
