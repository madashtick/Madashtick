export interface Project {
    id: string;
    name: string;
    description?: string;
    chargeAnnuelle: number;
}

export const initialProjects: Project[] = [
    {
        id: 'sigif-minfof',
        name: 'SIGIF (MINFOF)',
        description: 'Système Informatique de Gestion des Informations Forestières',
        chargeAnnuelle: 300,
    },
];
