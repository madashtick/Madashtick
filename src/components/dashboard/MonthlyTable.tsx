import { MonthlyData } from '@/types/ticket';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface MonthlyTableProps {
  data: MonthlyData[];
  cibleMoyenne?: number;
}

export function MonthlyTable({ data, cibleMoyenne = 5 }: MonthlyTableProps) {
  const { t } = useTranslation();

  return (
    <div className="border-[1.5px] border-[#e2e8f0] bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f0f9f6] hover:bg-[#f0f9f6] border-b border-[#cfeadd]">
            <TableHead className="text-[#004d40] font-bold py-4">{t('dashboard.monthly.month_column')}</TableHead>
            <TableHead className="text-[#007b8b] font-bold">{t('dashboard.monthly.total_jh')} ({t('common.jh')})</TableHead>
            <TableHead className="text-[#5fa8d3] font-bold">{t('tickets.type_values.evolutif')} ({t('common.jh')})</TableHead>
            <TableHead className="text-[#f59e0b] font-bold">{t('tickets.type_values.correctif')} ({t('common.jh')})</TableHead>
            <TableHead className="text-[#e11d48] font-bold">{t('tickets.type_values.preventif')} ({t('common.jh')})</TableHead>
            <TableHead className="text-black font-bold">{t('dashboard.monthly.tickets_count')}</TableHead>
            <TableHead className="text-black font-bold">{t('dashboard.monthly.target_column')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(row => {
            const isAlert = row.ticketsTraites > cibleMoyenne;
            return (
              <TableRow key={row.mois} className="border-b border-[#f1f5f9]">
                <TableCell className="font-medium text-slate-600">
                  {(() => {
                    const [y, m] = row.mois.split('-');
                    return `${t(`common.months.${parseInt(m)}`)} ${y}`;
                  })()}
                </TableCell>
                <TableCell className="font-bold text-[#007b8b]">{row.totalJH.toFixed(1)}</TableCell>
                <TableCell className="text-[#5fa8d3] font-medium">{row.evolutifJH.toFixed(1)}</TableCell>
                <TableCell className="text-[#f59e0b] font-medium">{row.correctifJH.toFixed(1)}</TableCell>
                <TableCell className="text-[#e11d48] font-medium">{row.preventifJH.toFixed(1)}</TableCell>
                <TableCell className="font-medium">{row.ticketsTraites}</TableCell>
                <TableCell className={cn(
                  "font-medium",
                  isAlert ? "bg-[#ef4444] text-white" : "text-slate-500"
                )}>
                  {cibleMoyenne.toFixed(1)}
                </TableCell>
              </TableRow>
            );
          })}
          {/* Total Row */}
          <TableRow className="bg-[#f8fafc] font-bold border-t-2 border-[#cfeadd]">
            <TableCell className="text-[#004d40]">{t('dashboard.monthly.annual_total')}</TableCell>
            <TableCell className="text-[#007b8b]">{data.reduce((s, r) => s + r.totalJH, 0).toFixed(1)}</TableCell>
            <TableCell className="text-[#5fa8d3]">{data.reduce((s, r) => s + r.evolutifJH, 0).toFixed(1)}</TableCell>
            <TableCell className="text-[#f59e0b]">{data.reduce((s, r) => s + r.correctifJH, 0).toFixed(1)}</TableCell>
            <TableCell className="text-[#e11d48]">{data.reduce((s, r) => s + r.preventifJH, 0).toFixed(1)}</TableCell>
            <TableCell>{data.reduce((s, r) => s + r.ticketsTraites, 0)}</TableCell>
            <TableCell className="text-slate-400">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
