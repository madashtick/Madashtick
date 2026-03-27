import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, initialProjects } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, LogOut, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

const ProjectSelection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [form, setForm] = useState({ name: '', description: '', chargeAnnuelle: '' });

    const { logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language.split('-')[0]; // Handle cases like 'fr-FR'

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        fetchProjects();

        const subscription = supabase
            .channel('projects_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchProjects();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching projects:', error);
            // Fallback to initial if table not ready or error
            setProjects(initialProjects);
        } else {
            // Map snake_case from DB to camelCase for app
            setProjects(data.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                chargeAnnuelle: p.charge_annuelle
            })));
        }
        setLoading(false);
    };

    const handleOpenDialog = (project?: Project) => {
        if (project) {
            setProjectToEdit(project);
            setForm({
                name: project.name,
                description: project.description || '',
                chargeAnnuelle: (project.chargeAnnuelle ?? 300).toString()
            });
        } else {
            setProjectToEdit(null);
            setForm({ name: '', description: '', chargeAnnuelle: '300' });
        }
        setIsDialogOpen(true);
    };

    const handleSaveProject = () => {
        if (!form.name) {
            toast({ title: t('common.error'), description: t('project.name_required'), variant: "destructive" });
            return;
        }

        if (projectToEdit) {
            supabase.from('projects')
                .update({
                    name: form.name,
                    description: form.description,
                    charge_annuelle: parseFloat(form.chargeAnnuelle) || 0
                })
                .eq('id', projectToEdit.id)
                .then(({ error }) => {
                    if (error) toast({ title: t('common.error'), description: error.message, variant: "destructive" });
                    else toast({ title: t('common.success'), description: t('project.updated_success', { name: form.name }) });
                });
        } else {
            supabase.from('projects')
                .insert({
                    name: form.name,
                    description: form.description,
                    charge_annuelle: parseFloat(form.chargeAnnuelle) || 0
                })
                .then(({ error }) => {
                    if (error) toast({ title: t('common.error'), description: error.message, variant: "destructive" });
                    else toast({ title: t('common.success'), description: t('project.created_success', { name: form.name }) });
                });
        }

        setIsDialogOpen(false);
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: string, projectName: string) => {
        e.stopPropagation();
        if (confirm(t('common.confirm_delete', { name: projectName }))) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) {
                toast({ title: t('common.error'), description: error.message, variant: "destructive" });
            } else {
                toast({ title: t('common.success'), description: t('project.deleted_success', { name: projectName }) });
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f0f9f6]">
            {/* Navbar */}
            <nav className="bg-white border-b-2 border-[#cfeadd] px-6 py-3 sticky top-0 z-10 shadow-sm">
                <div className="max-w-[98%] mx-auto flex justify-between items-center">
                    {/* Logo (Left) */}
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo MaDashTick" className="h-10 w-auto object-contain" />
                        <span className="text-xl font-bold text-[#004d40] hidden sm:inline-block">MaDashTick</span>
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

            <div className="p-6">
                <div className="max-w-[98%] mx-auto space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#004d40] p-2 rounded-lg">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#004d40]">{t('common.my_projects')}</h1>
                            <p className="text-slate-500">{t('common.select_project')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className="group hover:border-[#004d40] transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
                                onClick={() => navigate(`/dashboard/${project.id}`)}
                            >
                                <CardHeader className="bg-white border-b group-hover:bg-[#f0f9f6] transition-colors flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-xl text-[#004d40] flex items-center gap-2">
                                        <LayoutDashboard className="h-5 w-5 opacity-50" />
                                        {project.name}
                                    </CardTitle>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-[#004d40]"
                                            onClick={(e) => { e.stopPropagation(); handleOpenDialog(project); }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-destructive"
                                            onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <CardDescription className="text-slate-600 line-clamp-2">
                                        {t('common.project_card_desc', { name: project.name })}
                                    </CardDescription>
                                    {project.description && (
                                        <p className="mt-2 text-xs text-slate-400 italic">{project.description}</p>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-0 justify-end">
                                    <Button variant="ghost" className="text-[#004d40] p-0 group-hover:translate-x-1 transition-transform">
                                        {t('common.access')} →
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}

                        <Card
                            className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-white/50 hover:bg-white transition-colors cursor-pointer min-h-[180px]"
                            onClick={() => handleOpenDialog()}
                        >
                            <div className="bg-slate-100 p-3 rounded-full mb-3">
                                <Plus className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-[#004d40] font-semibold">{t('common.add_project')}</p>
                            <p className="text-xs text-slate-400">{t('common.manage_new_dashboard')}</p>
                        </Card>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{projectToEdit ? t('project.edit_title') : t('common.add_project')}</DialogTitle>
                            <DialogDescription>
                                {projectToEdit ? t('project.edit_desc') : t('project.add_desc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('project.name_label')} *</Label>
                                <Input
                                    id="name"
                                    placeholder={t('project.name_placeholder')}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('project.desc_label')} (opt)</Label>
                                <Input
                                    id="description"
                                    placeholder={t('project.desc_placeholder')}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="charge">{t('project.charge_label')} *</Label>
                                <Input
                                    id="charge"
                                    type="number"
                                    placeholder={t('project.charge_placeholder')}
                                    value={form.chargeAnnuelle}
                                    onChange={(e) => setForm({ ...form, chargeAnnuelle: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={handleSaveProject} className="bg-[#004d40] hover:bg-[#00332a]">
                                {projectToEdit ? t('common.update') : t('project.create_submit')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProjectSelection;
