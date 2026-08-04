import { KpiData, StatutDetail } from '@/types/ticket';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatJH } from '@/lib/kpi-utils';
import { useTranslation } from 'react-i18next';

interface StatsTableProps {
  kpi: KpiData;
}

// Taux d'une valeur au sein de sa ligne, en pourcentage à une décimale
function rate(value: number, total: number): string {
  if (total <= 0) return '0%';
  return `${Math.round((value / total) * 1000) / 10}%`;
}

const TYPE_COLORS = {
  evolutif: 'text-[#5fa8d3]',
  correctif: 'text-[#f59e0b]',
  preventif: 'text-[#e11d48]',
} as const;

export function StatsTable({ kpi }: StatsTableProps) {
  const { t } = useTranslation();

  const rows: { key: string; label: string; detail: StatutDetail }[] = [
    { key: 'prod', label: t('dashboard.kpi.kpi_prod'), detail: kpi.detailParStatut.prod },
    { key: 'test', label: t('dashboard.kpi.kpi_test'), detail: kpi.detailParStatut.test },
    { key: 'enCours', label: t('dashboard.kpi.kpi_encours'), detail: kpi.detailParStatut.enCours },
    { key: 'nouveau', label: t('dashboard.kpi.kpi_nouveau'), detail: kpi.detailParStatut.nouveau },
  ];

  const types = ['evolutif', 'correctif', 'preventif'] as const;

  // Ligne de total : somme des 4 statuts, type par type
  const totalRow = types.reduce(
    (acc, type) => {
      acc[type] = {
        count: rows.reduce((s, r) => s + r.detail[type].count, 0),
        jh: Math.round(rows.reduce((s, r) => s + r.detail[type].jh, 0) * 100) / 100,
      };
      return acc;
    },
    {} as StatutDetail
  );

  // Totaux généraux, servant de base au taux affiché dans les colonnes Total
  const grandCount = types.reduce((s, type) => s + totalRow[type].count, 0);
  const grandJh = Math.round(types.reduce((s, type) => s + totalRow[type].jh, 0) * 100) / 100;

  const renderCells = (detail: StatutDetail, bold: boolean) => {
    const totalCount = types.reduce((s, type) => s + detail[type].count, 0);
    const totalJh = Math.round(types.reduce((s, type) => s + detail[type].jh, 0) * 100) / 100;
    const weight = bold ? 'font-bold' : 'font-medium';

    return (
      <>
        {types.map(type => (
          <TableCell key={`c-${type}`} className={`${TYPE_COLORS[type]} ${weight} whitespace-nowrap text-right`}>
            {detail[type].count}
            <span className="ml-1.5 text-xs opacity-70">({rate(detail[type].count, totalCount)})</span>
          </TableCell>
        ))}
        <TableCell className="text-[#004d40] font-bold whitespace-nowrap text-right">
          {totalCount}
          <span className="ml-1.5 text-xs opacity-70">({rate(totalCount, grandCount)})</span>
        </TableCell>
        {types.map(type => (
          <TableCell key={`j-${type}`} className={`${TYPE_COLORS[type]} ${weight} whitespace-nowrap text-right`}>
            {formatJH(detail[type].jh)}
            <span className="ml-1.5 text-xs opacity-70">({rate(detail[type].jh, totalJh)})</span>
          </TableCell>
        ))}
        <TableCell className="text-[#004d40] font-bold whitespace-nowrap text-right">
          {formatJH(totalJh)}
          <span className="ml-1.5 text-xs opacity-70">({rate(totalJh, grandJh)})</span>
        </TableCell>
      </>
    );
  };

  return (
    <div className="border-[1.5px] border-[#e2e8f0] bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f0f9f6] hover:bg-[#f0f9f6] border-b border-[#cfeadd]">
            <TableHead rowSpan={2} className="text-[#004d40] font-bold align-bottom">
              {t('dashboard.stats.status_column')}
            </TableHead>
            <TableHead colSpan={4} className="text-[#004d40] font-bold text-center border-l border-[#cfeadd]">
              {t('dashboard.stats.tickets_group')}
            </TableHead>
            <TableHead colSpan={4} className="text-[#004d40] font-bold text-center border-l border-[#cfeadd]">
              {t('dashboard.stats.charge_group')} ({t('common.jh')})
            </TableHead>
          </TableRow>
          <TableRow className="bg-[#f0f9f6] hover:bg-[#f0f9f6] border-b border-[#cfeadd]">
            <TableHead className="text-[#5fa8d3] font-bold text-right border-l border-[#cfeadd]">{t('tickets.type_values.evolutif')}</TableHead>
            <TableHead className="text-[#f59e0b] font-bold text-right">{t('tickets.type_values.correctif')}</TableHead>
            <TableHead className="text-[#e11d48] font-bold text-right">{t('tickets.type_values.preventif')}</TableHead>
            <TableHead className="text-[#004d40] font-bold text-right">{t('dashboard.stats.total')}</TableHead>
            <TableHead className="text-[#5fa8d3] font-bold text-right border-l border-[#cfeadd]">{t('tickets.type_values.evolutif')}</TableHead>
            <TableHead className="text-[#f59e0b] font-bold text-right">{t('tickets.type_values.correctif')}</TableHead>
            <TableHead className="text-[#e11d48] font-bold text-right">{t('tickets.type_values.preventif')}</TableHead>
            <TableHead className="text-[#004d40] font-bold text-right">{t('dashboard.stats.total')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.key} className="border-b border-[#f1f5f9]">
              <TableCell className="font-medium text-slate-600 whitespace-nowrap">{row.label}</TableCell>
              {renderCells(row.detail, false)}
            </TableRow>
          ))}
          <TableRow className="bg-[#f8fafc] border-t-2 border-[#cfeadd]">
            <TableCell className="text-[#004d40] font-bold">{t('dashboard.stats.total')}</TableCell>
            {renderCells(totalRow, true)}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
