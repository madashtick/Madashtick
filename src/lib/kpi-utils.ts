import { Ticket, KpiData, MonthlyData, TicketFilters } from '@/types/ticket';

export function computeKpi(tickets: Ticket[], year: number | 'ALL', budgetObjectif = 300, month?: string): KpiData {
  let periodTickets = year === 'ALL' ? tickets : tickets.filter(t => t.date_ouverture.startsWith(String(year)));
  
  if (month && month !== 'ALL') {
    if (year !== 'ALL') {
      const mStr = `${year}-${month.padStart(2, '0')}`;
      periodTickets = periodTickets.filter(t => t.date_ouverture.startsWith(mStr));
    } else {
      periodTickets = periodTickets.filter(t => t.date_ouverture.substring(5, 7) === month.padStart(2, '0'));
    }
  }

  const totalJH = periodTickets.reduce((s, t) => s + t.charge_jh, 0);

  // Dynamic ticket objective: approx 5 J/H per ticket (standard maintenance)
  const ticketsObjectif = Math.round(budgetObjectif / 5);

  const byType = (type: string) => periodTickets.filter(t => t.type === type).reduce((s, t) => s + t.charge_jh, 0);
  const evolutif = byType('EVOLUTIF');
  const correctif = byType('CORRECTIF');
  const preventif = byType('PREVENTIF');

  // Calcul des tickets par statut
  const prodTickets = periodTickets.filter(t => t.statut === 'EN_PROD').length;
  const testTickets = periodTickets.filter(t => t.statut === 'EN_TEST').length;
  const nouveauTickets = periodTickets.filter(t => t.statut === 'NOUVEAU').length;
  const enCoursTickets = periodTickets.filter(t => t.statut === 'EN_COURS').length;

  return {
    budgetConsomme: totalJH,
    budgetObjectif,
    ticketsTraites: periodTickets.length,
    ticketsObjectif,
    jhMoyen: periodTickets.length > 0 ? Math.round((totalJH / periodTickets.length) * 100) / 100 : 0,
    repartition: {
      evolutif: { total: evolutif, pct: totalJH > 0 ? Math.round((evolutif / totalJH) * 1000) / 10 : 0 },
      correctif: { total: correctif, pct: totalJH > 0 ? Math.round((correctif / totalJH) * 1000) / 10 : 0 },
      preventif: { total: preventif, pct: totalJH > 0 ? Math.round((preventif / totalJH) * 1000) / 10 : 0 },
    },
    ticketsParStatut: {
      prod: prodTickets,
      test: testTickets,
      nouveau: nouveauTickets,
      enCours: enCoursTickets
    }
  };
}

export function computeMonthlyData(tickets: Ticket[], year: number | 'ALL', monthFilter: string = 'ALL'): MonthlyData[] {
  const monthsData: MonthlyData[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  const yearsToProcess = year === 'ALL' ? getAvailableYears(tickets).map(Number).sort((a, b) => a - b) : [year];

  for (const y of yearsToProcess) {
    for (let m = 1; m <= 12; m++) {
      // Si un filtre de mois est actif, on saute les autres mois
      if (monthFilter !== 'ALL' && m.toString() !== monthFilter) continue;

      const mStr = `${y}-${String(m).padStart(2, '0')}`;
      const monthTickets = tickets.filter(t => t.date_ouverture.startsWith(mStr));

      // On affiche le mois s'il y a des tickets (activité) OU si c'est le mois en cours de l'année sélectionnée
      const hasData = monthTickets.length > 0;
      const isCurrentMonth = (y === currentYear && m === currentMonth);

      if (hasData || isCurrentMonth || (monthFilter !== 'ALL' && year !== 'ALL')) {
        monthsData.push({
          mois: mStr,
          totalJH: monthTickets.reduce((s, t) => s + t.charge_jh, 0),
          evolutifJH: monthTickets.filter(t => t.type === 'EVOLUTIF').reduce((s, t) => s + t.charge_jh, 0),
          correctifJH: monthTickets.filter(t => t.type === 'CORRECTIF').reduce((s, t) => s + t.charge_jh, 0),
          preventifJH: monthTickets.filter(t => t.type === 'PREVENTIF').reduce((s, t) => s + t.charge_jh, 0),
          ticketsTraites: monthTickets.length,
        });
      }
    }
  }

  return monthsData;
}

export function filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  return tickets.filter(t => {
    if (filters.type !== 'ALL' && t.type !== filters.type) return false;
    if (filters.gravite !== 'ALL' && t.gravite !== filters.gravite) return false;

    const d = new Date(t.date_ouverture);
    if (filters.annee !== 'ALL' && d.getFullYear().toString() !== filters.annee) return false;
    if (filters.mois !== 'ALL' && (d.getMonth() + 1).toString() !== filters.mois) return false;

    if (filters.livraisonTest === 'YES' && !t.date_livraison) return false;
    if (filters.livraisonTest === 'NO' && t.date_livraison) return false;

    if (filters.miseEnProd === 'YES' && !t.date_mep) return false;
    if (filters.miseEnProd === 'NO' && t.date_mep) return false;

    if (filters.enCoursDev === 'YES' && t.statut !== 'EN_COURS') return false;
    if (filters.enCoursDev === 'NO' && t.statut === 'EN_COURS') return false;

    return true;
  });
}

export function getAvailableYears(tickets: Ticket[]): string[] {
  const set = new Set<string>();
  tickets.forEach(t => {
    const d = new Date(t.date_ouverture);
    set.add(d.getFullYear().toString());
  });
  // Also include current year if not present
  set.add(new Date().getFullYear().toString());
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}

export function getAvailableMonths(tickets: Ticket[]): string[] {
  // Returns unique month numbers found in tickets (1-12)
  const set = new Set<string>();
  for (let i = 1; i <= 12; i++) {
    set.add(i.toString());
  }
  return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
}

export const MONTH_NAMES: Record<string, string> = {
  '1': 'Janvier', '2': 'Février', '3': 'Mars', '4': 'Avril',
  '5': 'Mai', '6': 'Juin', '7': 'Juillet', '8': 'Août',
  '9': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre',
};
