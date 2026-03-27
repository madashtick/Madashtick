import { KpiData } from '@/types/ticket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PieChart, TrendingUp, DollarSign, Ticket, Clock, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KpiCardsProps {
  kpi: KpiData;
}

export function KpiCards({ kpi }: KpiCardsProps) {
  const { t } = useTranslation();
  const budgetPct = Math.min(Math.round((kpi.budgetConsomme / kpi.budgetObjectif) * 100), 100);
  const ticketsPct = Math.min(Math.round((kpi.ticketsTraites / kpi.ticketsObjectif) * 100), 100);

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Budget J/H */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.budget_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#004d40]">{kpi.budgetConsomme}</span>
              <span className="text-xl font-bold text-[#004d40]">{t('common.jh')}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4 font-medium italic">
              {t('dashboard.kpi.target_budget', { target: kpi.budgetObjectif })}
            </p>
            <div className="relative h-4 w-full bg-[#f1f5f9] rounded-full overflow-hidden mb-2">
              <div
                className="absolute h-full bg-[#4ade80] rounded-full"
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <p className="text-[12px] text-center font-bold text-slate-700">{t('dashboard.kpi.budget_pct', { pct: budgetPct })}</p>
          </CardContent>
        </Card>

        {/* Tickets traités */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.tickets_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#004d40]">{kpi.ticketsTraites}</span>
              <span className="text-xl font-bold text-[#004d40]">{t('dashboard.kpi.tickets_unit')}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4 font-medium italic">
              {t('dashboard.kpi.target_tickets', { target: kpi.ticketsObjectif })}
            </p>
            <div className="relative h-4 w-full bg-[#f1f5f9] rounded-full overflow-hidden mb-2">
              <div
                className="absolute h-full bg-[#4ade80] rounded-full"
                style={{ width: `${ticketsPct}%` }}
              />
            </div>
            <p className="text-[12px] text-center font-bold text-slate-700">{t('dashboard.kpi.tickets_pct', { pct: ticketsPct })}</p>
          </CardContent>
        </Card>

        {/* J/H moyen */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.avg_charge_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#004d40]">{kpi.jhMoyen}</span>
              <span className="text-xl font-bold text-[#004d40]">{t('common.jh')}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium italic">{t('dashboard.kpi.avg_charge_desc')}</p>
          </CardContent>
        </Card>

        {/* J/H Répartis par Type */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.repartition_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-bold text-[#5fa8d3]">
              {kpi.repartition.evolutif.total.toFixed(1)} {t('common.jh')} ({kpi.repartition.evolutif.pct}%)
            </div>
            <div className="text-sm font-bold text-[#f59e0b]">
              {kpi.repartition.correctif.total.toFixed(1)} {t('common.jh')} ({kpi.repartition.correctif.pct}%)
            </div>
            <div className="text-sm font-bold text-[#e11d48]">
              {kpi.repartition.preventif.total.toFixed(1)} {t('common.jh')} ({kpi.repartition.preventif.pct}%)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI par Statut (2ème ligne) */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Tickets en PROD */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none bg-green-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-green-700">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.kpi_prod')}</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-700">{kpi.ticketsParStatut.prod}</span>
              <span className="text-lg font-bold text-green-700">{t('dashboard.kpi.tickets_unit')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tickets en TEST */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none bg-blue-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-blue-700">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.kpi_test')}</CardTitle>
            <PieChart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700">{kpi.ticketsParStatut.test}</span>
              <span className="text-lg font-bold text-blue-700">{t('dashboard.kpi.tickets_unit')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tickets en DEV (Précédemment "En Cours") */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none bg-amber-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-amber-700">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.kpi_encours')}</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-700">{kpi.ticketsParStatut.enCours}</span>
              <span className="text-lg font-bold text-amber-700">{t('dashboard.kpi.tickets_unit')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Nouveaux Tickets */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none bg-indigo-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-indigo-700">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.kpi_nouveau')}</CardTitle>
            <PlusCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-700">{kpi.ticketsParStatut.nouveau}</span>
              <span className="text-lg font-bold text-indigo-700">{t('dashboard.kpi.tickets_unit')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
