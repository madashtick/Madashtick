import { TicketFilters, TicketType, TicketGravite } from '@/types/ticket';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/kpi-utils';
import { useTranslation } from 'react-i18next';

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
}

export function TicketFiltersBar({ filters, onFiltersChange }: TicketFiltersBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-8 w-[200px] h-9"
        />
      </div>
      <Select value={filters.type} onValueChange={v => onFiltersChange({ ...filters, type: v as TicketType | 'ALL' })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('tickets.type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('tickets.all_types')}</SelectItem>
          <SelectItem value="EVOLUTIF">{t('tickets.type_values.evolutif')}</SelectItem>
          <SelectItem value="CORRECTIF">{t('tickets.type_values.correctif')}</SelectItem>
          <SelectItem value="PREVENTIF">{t('tickets.type_values.preventif')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.gravite} onValueChange={v => onFiltersChange({ ...filters, gravite: v as TicketGravite | 'ALL' })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('tickets.gravity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('tickets.all_gravities')}</SelectItem>
          <SelectItem value="MINEUR">{t('tickets.gravity_values.mineur')}</SelectItem>
          <SelectItem value="MAJEUR">{t('tickets.gravity_values.majeur')}</SelectItem>
          <SelectItem value="BLOQUANT">{t('tickets.gravity_values.bloquant')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.livraisonTest} onValueChange={v => onFiltersChange({ ...filters, livraisonTest: v as 'ALL' | 'YES' | 'NO' })}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder={t('tickets.delivery_test')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('tickets.filter_all', { label: t('tickets.delivery_test') })}</SelectItem>
          <SelectItem value="YES">{t('tickets.filter_livraison_yes')}</SelectItem>
          <SelectItem value="NO">{t('tickets.filter_livraison_no')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.miseEnProd} onValueChange={v => onFiltersChange({ ...filters, miseEnProd: v as 'ALL' | 'YES' | 'NO' })}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder={t('tickets.prod_release')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('tickets.filter_all', { label: t('tickets.prod_release') })}</SelectItem>
          <SelectItem value="YES">{t('tickets.filter_prod_yes')}</SelectItem>
          <SelectItem value="NO">{t('tickets.filter_prod_no')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.enCoursDev} onValueChange={v => onFiltersChange({ ...filters, enCoursDev: v as 'ALL' | 'YES' | 'NO' })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('tickets.filter_dev_title')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('tickets.filter_all', { label: t('tickets.filter_dev_title') })}</SelectItem>
          <SelectItem value="YES">{t('tickets.filter_dev_yes')}</SelectItem>
          <SelectItem value="NO">{t('tickets.filter_dev_no')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
