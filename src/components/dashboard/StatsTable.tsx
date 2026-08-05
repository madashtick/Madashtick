import { Fragment } from 'react';
import { KpiData, StatutDetail } from '@/types/ticket';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatJH } from '@/lib/kpi-utils';
import { useTranslation } from 'react-i18next';

interface StatsTableProps {
  kpi: KpiData;
}

// Taux d'une valeur au sein de son ensemble, en pourcentage à une décimale
function rate(value: number, total: number): string {
  if (total <= 0) return '0%';
  return `${Math.round((value / total) * 1000) / 10}%`;
}

const TYPE_COLORS = {
  evolutif: 'text-[#5fa8d3]',
  correctif: 'text-[#f59e0b]',
  preventif: 'text-[#e11d48]',
  horsContrat: 'text-[#7c3aed]',
} as const;

const TYPES = ['evolutif', 'correctif', 'preventif', 'horsContrat'] as const;

// Clés i18n des types, indexées par la clé camelCase utilisée dans StatutDetail
const TYPE_LABEL_KEYS = {
  evolutif: 'tickets.type_values.evolutif',
  correctif: 'tickets.type_values.correctif',
  preventif: 'tickets.type_values.preventif',
  horsContrat: 'tickets.type_values.hors_contrat',
} as const;

// tabular-nums fige la largeur des chiffres : les colonnes s'alignent au chiffre près
const NUM_CELL = 'whitespace-nowrap text-right tabular-nums font-bold';

export function StatsTable({ kpi }: StatsTableProps) {
  const { t } = useTranslation();

  const rows: { key: string; label: string; detail: StatutDetail }[] = [
    { key: 'prod', label: t('dashboard.kpi.kpi_prod'), detail: kpi.detailParStatut.prod },
    { key: 'test', label: t('dashboard.kpi.kpi_test'), detail: kpi.detailParStatut.test },
    { key: 'enCours', label: t('dashboard.kpi.kpi_encours'), detail: kpi.detailParStatut.enCours },
    { key: 'nouveau', label: t('dashboard.kpi.kpi_nouveau'), detail: kpi.detailParStatut.nouveau },
  ];

  // Ligne de total : somme des 4 statuts, type par type
  const totalRow = TYPES.reduce(
    (acc, type) => {
      acc[type] = {
        count: rows.reduce((s, r) => s + r.detail[type].count, 0),
        jh: Math.round(rows.reduce((s, r) => s + r.detail[type].jh, 0) * 100) / 100,
      };
      return acc;
    },
    {} as StatutDetail
  );

  // Totaux généraux, base des taux affichés dans les colonnes Total
  const grandCount = TYPES.reduce((s, type) => s + totalRow[type].count, 0);
  const grandJh = Math.round(TYPES.reduce((s, type) => s + totalRow[type].jh, 0) * 100) / 100;

  // `mode` choisit ce qu'on affiche : la valeur brute ou son taux
  const renderCells = (detail: StatutDetail, mode: 'value' | 'rate', bold: boolean) => {
    const totalCount = TYPES.reduce((s, type) => s + detail[type].count, 0);
    const totalJh = Math.round(TYPES.reduce((s, type) => s + detail[type].jh, 0) * 100) / 100;
    // La ligne de total ressort d'un cran au-dessus des lignes de statut
    const size = bold ? 'text-lg' : 'text-base';

    return (
      <>
        {TYPES.map(type => (
          <TableCell key={`c-${type}`} className={`${TYPE_COLORS[type]} ${size} ${NUM_CELL}`}>
            {mode === 'value' ? detail[type].count : rate(detail[type].count, totalCount)}
          </TableCell>
        ))}
        <TableCell className={`text-[#004d40] ${size} ${NUM_CELL}`}>
          {mode === 'value' ? totalCount : rate(totalCount, grandCount)}
        </TableCell>
        {TYPES.map(type => (
          <TableCell key={`j-${type}`} className={`${TYPE_COLORS[type]} ${size} ${NUM_CELL}`}>
            {mode === 'value' ? formatJH(detail[type].jh) : rate(detail[type].jh, totalJh)}
          </TableCell>
        ))}
        <TableCell className={`text-[#004d40] ${size} ${NUM_CELL}`}>
          {mode === 'value' ? formatJH(totalJh) : rate(totalJh, grandJh)}
        </TableCell>
      </>
    );
  };

  const renderTable = (mode: 'value' | 'rate', caption: string) => (
    <div>
      <h3 className="text-[#004d40] text-sm font-bold uppercase tracking-wider mb-2">{caption}</h3>
      <div className="border-[1.5px] border-[#e2e8f0] bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f9f6] hover:bg-[#f0f9f6] border-b border-[#cfeadd]">
              <TableHead rowSpan={2} className="text-[#004d40] font-bold align-bottom">
                {t('dashboard.stats.status_column')}
              </TableHead>
              <TableHead colSpan={5} className="text-[#004d40] font-bold text-center border-l border-[#cfeadd]">
                {t('dashboard.stats.tickets_group')}
              </TableHead>
              <TableHead colSpan={5} className="text-[#004d40] font-bold text-center border-l border-[#cfeadd]">
                {t('dashboard.stats.charge_group')}{mode === 'value' ? ` (${t('common.jh')})` : ''}
              </TableHead>
            </TableRow>
            <TableRow className="bg-[#f0f9f6] hover:bg-[#f0f9f6] border-b border-[#cfeadd]">
              {/* Deux groupes identiques (tickets puis charges), générés depuis TYPES
                  pour rester alignés sur les colonnes rendues par renderCells */}
              {(['count', 'jh'] as const).map(group => (
                <Fragment key={group}>
                  {TYPES.map((type, i) => (
                    <TableHead
                      key={`${group}-${type}`}
                      className={`${TYPE_COLORS[type]} font-bold text-right ${i === 0 ? 'border-l border-[#cfeadd]' : ''}`}
                    >
                      {t(TYPE_LABEL_KEYS[type])}
                    </TableHead>
                  ))}
                  <TableHead className="text-[#004d40] font-bold text-right">{t('dashboard.stats.total')}</TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.key} className="border-b border-[#f1f5f9]">
                <TableCell className="font-medium text-slate-600 whitespace-nowrap">{row.label}</TableCell>
                {renderCells(row.detail, mode, false)}
              </TableRow>
            ))}
            <TableRow className="bg-[#f8fafc] border-t-2 border-[#cfeadd]">
              <TableCell className="text-[#004d40] font-bold">{t('dashboard.stats.total')}</TableCell>
              {renderCells(totalRow, mode, true)}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderTable('value', t('dashboard.stats.values_caption'))}
      {renderTable('rate', t('dashboard.stats.rates_caption'))}
    </div>
  );
}
