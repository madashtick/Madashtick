import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seedTickets } from '@/data/seed-tickets';
import { Ticket, TicketFilters, TicketStatut } from '@/types/ticket';
import { Project, initialProjects } from '@/types/project';
import { computeKpi, computeMonthlyData, filterTickets, getAvailableMonths, getAvailableYears } from '@/lib/kpi-utils';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { MonthlyTable } from '@/components/dashboard/MonthlyTable';
import { TicketTable } from '@/components/dashboard/TicketTable';
import { TicketFiltersBar } from '@/components/dashboard/TicketFiltersBar';
import { AddTicketDialog } from '@/components/dashboard/AddTicketDialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Languages, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const currentLanguage = i18n.language.split('-')[0];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Get projects from Supabase
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();

    const sub = supabase.channel('dashboard_projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*');
    if (data) {
      setProjects(data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        chargeAnnuelle: p.charge_annuelle
      })));
    }
  };

  const currentProject = useMemo(() => {
    return projects.find(p => p.id === projectId) || {
      id: projectId || 'unknown',
      name: 'Nouveau Projet',
      chargeAnnuelle: 300
    };
  }, [projects, projectId]);

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!projectId) return;
    fetchTickets();

    const sub = supabase.channel(`tickets_${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [projectId]);

  const fetchTickets = async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('project_id', projectId)
      .order('date_ouverture', { ascending: false });

    if (data) {
      setTickets(data.map(t => ({
        id: t.id,
        numero_ticket: t.numero_ticket,
        libelle: t.libelle,
        type: t.type,
        gravite: t.gravite,
        statut: t.statut,
        charge_jh: t.charge_jh,
        date_ouverture: t.date_ouverture,
        date_livraison: t.date_livraison,
        date_mep: t.date_mep,
        commentaire: t.commentaire,
        created_at: t.created_at
      })));
    }
  };

  const [filters, setFilters] = useState<TicketFilters>({
    type: 'ALL',
    gravite: 'ALL',
    annee: 'ALL',
    mois: 'ALL',
    livraisonTest: 'ALL',
    miseEnProd: 'ALL',
    enCoursDev: 'ALL',
    search: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);

  // Determine the year to display based on filters or the latest ticket
  const activeYear = useMemo(() => {
    if (filters.annee !== 'ALL') {
      return parseInt(filters.annee);
    }
    return 'ALL';
  }, [filters.annee]);

  const kpi = useMemo(() => computeKpi(tickets, activeYear, currentProject.chargeAnnuelle, filters.mois), [tickets, activeYear, currentProject.chargeAnnuelle, filters.mois]);
  const monthlyData = useMemo(() => computeMonthlyData(tickets, activeYear, filters.mois), [tickets, activeYear, filters.mois]);
  const availableMonths = useMemo(() => getAvailableMonths(tickets), [tickets]);
  const availableYears = useMemo(() => getAvailableYears(tickets), [tickets]);
  const filteredTickets = useMemo(() => {
    return [...filterTickets(tickets, filters)].sort((a, b) =>
      new Date(b.date_ouverture).getTime() - new Date(a.date_ouverture).getTime()
    );
  }, [tickets, filters]);

  const handleSaveTicket = async (ticket: Ticket) => {
    const isUpdate = tickets.some(t => t.id === ticket.id);
    const payload = {
      id: ticket.id,
      project_id: projectId,
      numero_ticket: ticket.numero_ticket,
      libelle: ticket.libelle,
      type: ticket.type,
      gravite: ticket.gravite,
      statut: ticket.statut,
      charge_jh: ticket.charge_jh,
      date_ouverture: ticket.date_ouverture,
      date_livraison: ticket.date_livraison || null,
      date_mep: ticket.date_mep || null,
      commentaire: ticket.commentaire || null
    };

    const { error } = await supabase.from('tickets').upsert(payload);

    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: t('common.success'),
        description: t(isUpdate ? 'tickets.update_success' : 'tickets.add_success', { numero: ticket.numero_ticket })
      });
      // Rafraîchissement manuel immédiat pour l'utilisateur courant
      fetchTickets();
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
      if (error) {
        toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      } else {
        toast({ title: t('common.success'), description: t('tickets.delete_success') || 'Ticket supprimé' });
        // Rafraîchissement manuel immédiat
        fetchTickets();
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const handleEditTicket = (ticket: Ticket) => {
    setTicketToEdit(ticket);
    setDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setTicketToEdit(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-[#cfeadd] px-6 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[98%] mx-auto flex justify-between items-center">
          {/* Logo (Left) */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo MaDashTick"
              className="h-10 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/projects')}
            />
            <span className="text-xl font-bold text-[#004d40] hidden md:inline-block">MaDashTick</span>
          </div>

          {/* Controls (Right) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-[#004d40]" />
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[110px] h-9 border-[#cfeadd]">
                  <SelectValue placeholder={t('common.language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">{t('common.french')}</SelectItem>
                  <SelectItem value="en">{t('common.english')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-[#004d40] text-[#004d40] hover:bg-[#004d40] hover:text-white h-9"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[98%] mx-auto py-8 px-4 space-y-10">
        <div className="mb-8 flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/projects')}
            className="text-[#004d40] hover:bg-[#cfeadd]/30 mt-1 shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-[#004d40] text-3xl font-bold">
              {t('dashboard.title')} : {currentProject.name} - {activeYear === 'ALL' ? t('dashboard.all_years', { defaultValue: 'Toutes années' }) : activeYear}
            </h1>
            <p className="text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
          </div>
        </div>
        {/* KPI Cards */}
        <section>
          <div className="border-b-2 border-[#cfeadd] mb-6 pb-2">
            <h2 className="text-[#004d40] text-xl font-bold italic">
              {t('dashboard.kpi_section')}
            </h2>
          </div>
          <KpiCards kpi={kpi} />
        </section>

        {/* Monthly Table */}
        <section>
          <div className="border-b-2 border-[#cfeadd] mb-6 pb-2 flex items-center justify-between gap-4">
            <h2 className="text-[#004d40] text-xl font-bold italic">
              {t('dashboard.monthly_section')}
            </h2>
            <div className="flex items-center gap-3">
              <Select value={filters.annee} onValueChange={v => setFilters({ ...filters, annee: v })}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder={t('dashboard.available_years')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('dashboard.all_years')}</SelectItem>
                  {availableYears.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.mois} onValueChange={v => setFilters({ ...filters, mois: v })}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder={t('dashboard.available_months')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('dashboard.all_months')}</SelectItem>
                  {availableMonths.map(m => (
                    <SelectItem key={m} value={m}>{t(`common.months.${m}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <MonthlyTable
            data={monthlyData}
            cibleMoyenne={kpi.ticketsObjectif / 12}
          />
        </section>

        {/* Filters + Ticket Table */}
        <section className="space-y-0">
          <div className="sticky top-[66px] z-30 bg-[#f0f9f6] pt-6 pb-4 flex items-center gap-6 border-b-2 border-[#cfeadd]">
            <h2 className="text-[#004d40] text-xl font-bold italic whitespace-nowrap">
              {t('dashboard.tickets_section')}
            </h2>
            <div className="flex-grow flex items-center gap-3">
              <TicketFiltersBar
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
            <Button onClick={handleOpenAddDialog} className="bg-[#004d40] hover:bg-[#00332a] shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.add_ticket')}
            </Button>
          </div>
          <TicketTable
            tickets={filteredTickets}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
          />
        </section>
      </main>

      <AddTicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTicket}
        ticketToEdit={ticketToEdit}
      />
    </div>
  );
};

export default Dashboard;
