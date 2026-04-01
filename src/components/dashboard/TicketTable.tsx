import { useState } from 'react';
import { Ticket, TicketStatut } from '@/types/ticket';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TicketTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticketId: string) => void;
}

export function TicketTable({ tickets, onEdit, onDelete }: TicketTableProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (ticketToDelete) onDelete(ticketToDelete);
    setTicketToDelete(null);
  };

  const statusStyles: Record<TicketStatut, string> = {
    'NOUVEAU': 'bg-blue-50 text-blue-700 border-blue-200',
    'EN_COURS': 'bg-amber-50 text-amber-700 border-amber-200',
    'EN_TEST': 'bg-purple-50 text-purple-700 border-purple-200',
    'EN_PROD': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'ABANDONNE': 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const getStatusLabel = (status: TicketStatut) => {
    return t(`tickets.status_values.${status.toLowerCase()}`);
  };

  const getTypeLabel = (type: string) => {
    return t(`tickets.type_values.${type.toLowerCase()}`);
  };

  const getGravityLabel = (gravity: string) => {
    return t(`tickets.gravity_values.${gravity.toLowerCase()}`);
  };
  return (
    <>
      {isMobile ? (
        <Drawer open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirmer la suppression</DrawerTitle>
              <DrawerDescription>
                Cette action est irréversible. Le ticket sera définitivement supprimé.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="destructive" onClick={handleConfirmDelete}>Supprimer</Button>
              <DrawerClose asChild>
                <Button variant="outline">Annuler</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le ticket sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleConfirmDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="border-[1.5px] border-[#e2e8f0] bg-white text-xs shadow-sm">
      <div className="w-full">
        <Table>
          <TableHeader className="sticky top-[138px] z-20 bg-[#f0f9f6] shadow-md ring-1 ring-[#cfeadd]">
            <TableRow className="border-b-0 hover:bg-[#f0f9f6]">
              <TableHead className="text-[#004d40] font-bold py-3 whitespace-nowrap px-2">{t('tickets.number')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 px-1">{t('tickets.label')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 whitespace-nowrap px-1">{t('tickets.status')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 whitespace-nowrap px-1">{t('tickets.type')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 whitespace-nowrap px-1">{t('tickets.gravity')}</TableHead>
              <TableHead className="text-[#004d40] font-bold text-center py-2 px-1">{t('tickets.charge')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 whitespace-nowrap px-1">{t('tickets.opening')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 px-1">{t('tickets.delivery_test')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 px-1">{t('tickets.prod_release')}</TableHead>
              <TableHead className="text-[#004d40] font-bold py-2 px-1">{t('tickets.comment')}</TableHead>
              <TableHead className="text-[#004d40] font-bold text-right py-2 px-1">{t('tickets.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t, idx) => (
              <TableRow key={t.id} className={cn(
                "border-b border-[#f1f5f9] transition-colors",
                idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
              )}>
                <TableCell className="font-medium text-[#007b8b] whitespace-nowrap py-1 px-1">{t.numero_ticket}</TableCell>
                <TableCell className="text-slate-700 font-medium py-1 px-1 min-w-[120px] max-w-[200px] leading-tight">
                  {t.libelle}
                </TableCell>
                <TableCell className="py-1 px-1 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                    statusStyles[t.statut]
                  )}>
                    {getStatusLabel(t.statut)}
                  </span>
                </TableCell>
                <TableCell className="py-1 px-1">
                  <span className={cn(
                    "font-bold",
                    t.type === 'CORRECTIF' ? "text-[#f59e0b]" :
                      t.type === 'EVOLUTIF' ? "text-[#5fa8d3]" : "text-[#e11d48]"
                  )}>
                    {getTypeLabel(t.type)}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 font-medium py-1 px-1">
                  {getGravityLabel(t.gravite)}
                </TableCell>
                <TableCell className="text-center font-bold text-slate-700 py-1 px-1">{t.charge_jh.toFixed(1)}</TableCell>
                <TableCell className="text-slate-500 py-1 px-1 whitespace-nowrap">{t.date_ouverture}</TableCell>
                <TableCell className="text-slate-500 py-1 px-1 whitespace-nowrap">{t.date_livraison || 'N/A'}</TableCell>
                <TableCell className="text-slate-500 py-1 px-1 whitespace-nowrap">{t.date_mep || 'N/A'}</TableCell>
                <TableCell className="text-slate-500 py-1 px-1 min-w-[100px] max-w-[150px] truncate">{t.commentaire || '-'}</TableCell>
                <TableCell className="text-right py-1 px-1 whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-primary"
                      onClick={() => onEdit(t)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-destructive"
                      onClick={() => setTicketToDelete(t.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground py-12 italic">
                  {t('tickets.no_data')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </>
  );
}
