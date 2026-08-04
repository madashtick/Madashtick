import { KpiData, StatutDetail } from '@/types/ticket';
import { formatJH } from '@/lib/kpi-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PieChart, TrendingUp, DollarSign, Ticket, Clock, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KpiCardsProps {
  kpi: KpiData;
}

// Ventilation Évolutif / Correctif / Préventif affichée au pied des cartes de statut
function TypeBreakdown({ detail, className }: { detail: StatutDetail; className: string }) {
  const { t } = useTranslation();
  const rows = [
    { label: t('tickets.type_values.evolutif'), value: detail.evolutif },
    { label: t('tickets.type_values.correctif'), value: detail.correctif },
    { label: t('tickets.type_values.preventif'), value: detail.preventif },
  ];

  return (
    <div className={`mt-2 space-y-0.5 text-[11px] ${className}`}>
      {rows.map(row => (
        <div key={row.label} className="flex items-baseline justify-between gap-2">
          <span className="font-medium uppercase tracking-wide">{row.label}</span>
          <span className="font-bold whitespace-nowrap">
            {row.value.count} · {formatJH(row.value.jh)} {t('common.jh')}
          </span>
        </div>
      ))}
    </div>
  );
}

export function KpiCards({ kpi }: KpiCardsProps) {
  const { t } = useTranslation();
  const budgetRatio = (kpi.budgetConsomme / kpi.budgetObjectif) * 100;
  const ticketsRatio = (kpi.ticketsTraites / kpi.ticketsObjectif) * 100;
  const budgetPct = Math.min(Math.round(budgetRatio), 100);
  const ticketsPct = Math.min(Math.round(ticketsRatio), 100);
  const budgetDisplayPct = Math.round(budgetRatio);
  const ticketsDisplayPct = Math.round(ticketsRatio);
  const budgetOver = budgetRatio > 100;
  const ticketsOver = ticketsRatio > 100;

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Budget J/H */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-1">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.budget_title')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-[#004d40]">{kpi.budgetConsomme}</span>
                <span className="text-2xl font-bold text-[#004d40]">{t('common.jh')}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Cible annuelle</p>
                <p className="text-xl font-bold text-[#004d40]">{kpi.budgetObjectif} <span className="text-sm">{t('common.jh')}</span></p>
              </div>
            </div>
            <div className="relative h-5 w-full bg-[#f1f5f9] rounded-full overflow-hidden mb-4">
              <div
                className={`absolute h-full rounded-full ${budgetOver ? 'bg-red-500' : 'bg-[#4ade80]'}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <p className="text-xl text-center font-bold text-slate-700 mt-4">{t('dashboard.kpi.budget_pct', { pct: budgetDisplayPct })}</p>
          </CardContent>
        </Card>

        {/* Tickets traités */}
        <Card className="border-[1.5px] border-[#e2e8f0] shadow-sm rounded-none">
          <CardHeader className="pb-1">
            <CardTitle className="text-[#004d40] text-sm font-bold uppercase tracking-wider">{t('dashboard.kpi.tickets_title')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-[#004d40]">{kpi.ticketsTraites}</span>
                <span className="text-2xl font-bold text-[#004d40]">{t('dashboard.kpi.tickets_unit')}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Cible annuelle</p>
                <p className="text-xl font-bold text-[#004d40]">{kpi.ticketsObjectif} <span className="text-sm">{t('dashboard.kpi.tickets_unit')}</span></p>
              </div>
            </div>
            <div className="relative h-5 w-full bg-[#f1f5f9] rounded-full overflow-hidden mb-4">
              <div
                className={`absolute h-full rounded-full ${ticketsOver ? 'bg-red-500' : 'bg-[#4ade80]'}`}
                style={{ width: `${ticketsPct}%` }}
              />
            </div>
            <p className="text-xl text-center font-bold text-slate-700 mt-4">{t('dashboard.kpi.tickets_pct', { pct: ticketsDisplayPct })}</p>
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
          <CardContent className="space-y-3 pt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5fa8d3]">{t('tickets.type_values.evolutif')}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#5fa8d3]">{kpi.repartition.evolutif.total.toFixed(1)}</span>
                <span className="text-sm font-bold text-[#5fa8d3]">{t('common.jh')}</span>
                <span className="text-sm font-semibold text-[#5fa8d3] ml-auto">({kpi.repartition.evolutif.pct}%)</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f59e0b]">{t('tickets.type_values.correctif')}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#f59e0b]">{kpi.repartition.correctif.total.toFixed(1)}</span>
                <span className="text-sm font-bold text-[#f59e0b]">{t('common.jh')}</span>
                <span className="text-sm font-semibold text-[#f59e0b] ml-auto">({kpi.repartition.correctif.pct}%)</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e11d48]">{t('tickets.type_values.preventif')}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#e11d48]">{kpi.repartition.preventif.total.toFixed(1)}</span>
                <span className="text-sm font-bold text-[#e11d48]">{t('common.jh')}</span>
                <span className="text-sm font-semibold text-[#e11d48] ml-auto">({kpi.repartition.preventif.pct}%)</span>
              </div>
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
            <p className="mt-1 text-sm font-semibold text-green-700/80">
              {t('dashboard.kpi.charge_label')} : {formatJH(kpi.chargeParStatut.prod)} {t('common.jh')}
            </p>
            <TypeBreakdown detail={kpi.detailParStatut.prod} className="text-green-700/80" />
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
            <p className="mt-1 text-sm font-semibold text-blue-700/80">
              {t('dashboard.kpi.charge_label')} : {formatJH(kpi.chargeParStatut.test)} {t('common.jh')}
            </p>
            <TypeBreakdown detail={kpi.detailParStatut.test} className="text-blue-700/80" />
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
            <p className="mt-1 text-sm font-semibold text-amber-700/80">
              {t('dashboard.kpi.charge_label')} : {formatJH(kpi.chargeParStatut.enCours)} {t('common.jh')}
            </p>
            <TypeBreakdown detail={kpi.detailParStatut.enCours} className="text-amber-700/80" />
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
            <p className="mt-1 text-sm font-semibold text-indigo-700/80">
              {t('dashboard.kpi.charge_label')} : {formatJH(kpi.chargeParStatut.nouveau)} {t('common.jh')}
            </p>
            <TypeBreakdown detail={kpi.detailParStatut.nouveau} className="text-indigo-700/80" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
