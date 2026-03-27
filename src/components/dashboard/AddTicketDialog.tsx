import { useState, useEffect } from 'react';
import { Ticket, TicketType, TicketGravite, TicketStatut } from '@/types/ticket';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface AddTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: Ticket) => void;
  ticketToEdit?: Ticket | null;
}

export function AddTicketDialog({ open, onOpenChange, onSave, ticketToEdit }: AddTicketDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    numero_ticket: '',
    libelle: '',
    type: 'CORRECTIF' as TicketType,
    gravite: 'MINEUR' as TicketGravite,
    statut: 'NOUVEAU' as TicketStatut,
    charge_jh: '',
    date_ouverture: '',
    date_livraison: '',
    date_mep: '',
    commentaire: '',
  });

  useEffect(() => {
    if (ticketToEdit) {
      setForm({
        numero_ticket: ticketToEdit.numero_ticket,
        libelle: ticketToEdit.libelle,
        type: ticketToEdit.type,
        gravite: ticketToEdit.gravite,
        statut: ticketToEdit.statut,
        charge_jh: ticketToEdit.charge_jh.toString(),
        date_ouverture: ticketToEdit.date_ouverture,
        date_livraison: ticketToEdit.date_livraison || '',
        date_mep: ticketToEdit.date_mep || '',
        commentaire: ticketToEdit.commentaire || '',
      });
    } else {
      setForm({
        numero_ticket: '',
        libelle: '',
        type: 'CORRECTIF',
        gravite: 'MINEUR',
        statut: 'NOUVEAU',
        charge_jh: '',
        date_ouverture: new Date().toISOString().split('T')[0],
        date_livraison: '',
        date_mep: '',
        commentaire: '',
      });
    }
  }, [ticketToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.numero_ticket || !form.libelle || !form.charge_jh || !form.date_ouverture) {
      toast({ title: t('common.error'), description: t('tickets.fill_required'), variant: 'destructive' });
      return;
    }

    // Contraintes de dates selon statut
    if (form.statut === 'EN_TEST' && !form.date_livraison) {
      toast({ title: t('common.error'), description: t('tickets.required_delivery_date'), variant: 'destructive' });
      return;
    }
    if (form.statut === 'EN_PROD' && !form.date_mep) {
      toast({ title: t('common.error'), description: t('tickets.required_mep_date'), variant: 'destructive' });
      return;
    }

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const ticket: Ticket = {
      id: ticketToEdit ? ticketToEdit.id : crypto.randomUUID(),
      numero_ticket: form.numero_ticket,
      libelle: form.libelle,
      type: form.type,
      gravite: form.gravite,
      statut: form.statut,
      charge_jh: parseFloat(form.charge_jh),
      date_ouverture: form.date_ouverture,
      date_livraison: form.date_livraison || null,
      date_mep: form.date_mep || null,
      commentaire: form.commentaire || null,
      created_at: ticketToEdit ? ticketToEdit.created_at : new Date().toISOString().split('T')[0],
    };

    onSave(ticket);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{ticketToEdit ? t('tickets.edit_title') : t('dashboard.add_ticket')}</DialogTitle>
          <DialogDescription>
            {ticketToEdit ? t('tickets.edit_desc') : t('tickets.add_desc')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">{t('tickets.number')} *</Label>
              <Input id="numero" value={form.numero_ticket} onChange={e => setForm({ ...form, numero_ticket: e.target.value })} placeholder="SIGIF2-XXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="charge">{t('tickets.charge')} *</Label>
              <Input id="charge" type="number" min="0" step="0.5" value={form.charge_jh} onChange={e => setForm({ ...form, charge_jh: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="libelle">{t('tickets.label')} *</Label>
            <Input id="libelle" value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} placeholder={t('tickets.label_placeholder')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ouverture">{t('tickets.opening')} *</Label>
              <Input id="ouverture" type="date" value={form.date_ouverture} onChange={e => setForm({ ...form, date_ouverture: e.target.value })} />
            </div>
            <div></div> {/* Spacer */}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('tickets.status')}</Label>
              <Select value={form.statut} onValueChange={v => setForm({ ...form, statut: v as TicketStatut })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOUVEAU">{t('tickets.status_values.nouveau')}</SelectItem>
                  <SelectItem value="EN_COURS">{t('tickets.status_values.en_cours')}</SelectItem>
                  <SelectItem value="EN_TEST">{t('tickets.status_values.en_test')}</SelectItem>
                  <SelectItem value="EN_PROD">{t('tickets.status_values.en_prod')}</SelectItem>
                  <SelectItem value="ABANDONNE">{t('tickets.status_values.abandonne')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('tickets.type')}</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as TicketType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVOLUTIF">{t('tickets.type_values.evolutif')}</SelectItem>
                  <SelectItem value="CORRECTIF">{t('tickets.type_values.correctif')}</SelectItem>
                  <SelectItem value="PREVENTIF">{t('tickets.type_values.preventif')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('tickets.gravity')}</Label>
              <Select value={form.gravite} onValueChange={v => setForm({ ...form, gravite: v as TicketGravite })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINEUR">{t('tickets.gravity_values.mineur')}</SelectItem>
                  <SelectItem value="MAJEUR">{t('tickets.gravity_values.majeur')}</SelectItem>
                  <SelectItem value="BLOQUANT">{t('tickets.gravity_values.bloquant')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {ticketToEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="livraison">
                  {t('tickets.delivery_test')} {form.statut === 'EN_TEST' ? '*' : ''}
                </Label>
                <Input
                  id="livraison"
                  type="date"
                  value={form.date_livraison}
                  onChange={e => setForm({ ...form, date_livraison: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mep">
                  {t('tickets.prod_release')} {form.statut === 'EN_PROD' ? '*' : ''}
                </Label>
                <Input
                  id="mep"
                  type="date"
                  value={form.date_mep}
                  onChange={e => setForm({ ...form, date_mep: e.target.value })}
                  disabled={form.statut === 'EN_TEST'}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="commentaire">{t('tickets.comment')}</Label>
            <Input id="commentaire" value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} placeholder={t('tickets.comment_placeholder')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{ticketToEdit ? t('common.update') : t('common.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
