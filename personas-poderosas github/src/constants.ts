import { Dimension } from './types';

export const DEFAULT_DIMENSIONS: Dimension[] = [
  {
    id: 'personal',
    name: 'Personal',
    areas: [
      {
        id: 'salud',
        name: 'SALUD',
        activities: [
          { id: '1', name: 'Revisión médica', goal: 1 },
          { id: '2', name: 'Análisis de laboratorio', goal: 1 },
          { id: '3', name: 'Revisión dental', goal: 1 },
        ],
      },
      {
        id: 'ejercicio',
        name: 'EJERCICIO',
        activities: [
          { id: '1', name: 'Caminata', goal: 30 },
          { id: '2', name: 'Gimnasio', goal: 20 },
          { id: '3', name: 'Dormir 8 horas', goal: 30 },
        ],
      },
      {
        id: 'alimentacion',
        name: 'ALIMENTACIÓN',
        activities: [
          { id: '1', name: 'Comida saludable', goal: 30 },
          { id: '2', name: 'Reducir refresco', goal: 30 },
          { id: '3', name: 'Comer en casa', goal: 25 },
        ],
      },
      {
        id: 'lectura',
        name: 'LECTURA',
        activities: [
          { id: '1', name: 'Desarrollo personal', goal: 1 },
          { id: '2', name: 'Desarrollo profesional', goal: 1 },
          { id: '3', name: 'Desarrollo de habilidades', goal: 1 },
        ],
      },
    ],
  },
  {
    id: 'familiar',
    name: 'Familiar',
    areas: [
      {
        id: 'convivencia',
        name: 'CONVIVENCIA',
        activities: [
          { id: '1', name: 'Con la familia', goal: 4 },
          { id: '2', name: 'Con la pareja', goal: 4 },
          { id: '3', name: 'Con los hijos', goal: 10 },
        ],
      },
      {
        id: 'escucha',
        name: 'ESCUCHA',
        activities: [
          { id: '1', name: 'Con la pareja', goal: 4 },
          { id: '2', name: 'Con los hijos', goal: 4 },
          { id: '3', name: 'Con amigos', goal: 4 },
        ],
      },
      {
        id: 'pareja',
        name: 'PAREJA',
        activities: [
          { id: '1', name: 'Salidas solos', goal: 2 },
          { id: '2', name: 'Salidas con amigos', goal: 1 },
          { id: '3', name: 'Escucha activa', goal: 10 },
        ],
      },
      {
        id: 'elogios',
        name: 'ELOGIOS',
        activities: [
          { id: '1', name: 'Pareja', goal: 10 },
          { id: '2', name: 'Familia', goal: 10 },
          { id: '3', name: 'Amigos', goal: 5 },
        ],
      },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    areas: [
      {
        id: 'convivencia',
        name: 'CONVIVENCIA',
        activities: [
          { id: '1', name: 'Salidas grupales', goal: 2 },
          { id: '2', name: 'Clubes o agrupaciones', goal: 1 },
          { id: '3', name: 'Actividades recreativas', goal: 2 },
        ],
      },
      {
        id: 'filantropia',
        name: 'FILANTROPÍA',
        activities: [
          { id: '1', name: 'Buscar grupo', goal: 1 },
          { id: '2', name: 'Participación activa', goal: 1 },
          { id: '3', name: 'Donaciones', goal: 1 },
        ],
      },
      {
        id: 'relaciones',
        name: 'RELACIONES',
        activities: [
          { id: '1', name: 'Seleccionar amistades', goal: 1 },
          { id: '2', name: 'Frecuentar gente nutricia', goal: 2 },
          { id: '3', name: 'Buscar mentor', goal: 1 },
        ],
      },
      {
        id: 'otro',
        name: 'OTRO',
        activities: [
          { id: '1', name: 'Actividad 1', goal: 1 },
          { id: '2', name: 'Actividad 2', goal: 1 },
          { id: '3', name: 'Actividad 3', goal: 1 },
        ],
      },
    ],
  },
  {
    id: 'laboral',
    name: 'Laboral',
    areas: [
      {
        id: 'capacitacion',
        name: 'CAPACITACIÓN',
        activities: [
          { id: '1', name: 'Cursos', goal: 1 },
          { id: '2', name: 'Conferencias', goal: 1 },
          { id: '3', name: 'Autoaprendizaje', goal: 2 },
        ],
      },
      {
        id: 'proyectos',
        name: 'PROYECTOS',
        activities: [
          { id: '1', name: 'Desarrollo', goal: 1 },
          { id: '2', name: 'Implementación', goal: 1 },
          { id: '3', name: 'Impacto', goal: 1 },
        ],
      },
      {
        id: 'productividad',
        name: 'PRODUCTIVIDAD',
        activities: [
          { id: '1', name: 'Puntualidad', goal: 20 },
          { id: '2', name: 'Eficacia', goal: 20 },
          { id: '3', name: 'Trabajo enfocado', goal: 20 },
        ],
      },
      {
        id: 'tiempos',
        name: 'TIEMPOS',
        activities: [
          { id: '1', name: 'Eficiencia', goal: 20 },
          { id: '2', name: 'Entregas a tiempo', goal: 20 },
          { id: '3', name: 'Agenda diaria', goal: 20 },
        ],
      },
    ],
  },
  {
    id: 'economica',
    name: 'Económica',
    areas: [
      {
        id: 'control-de-gastos',
        name: 'CONTROL DE GASTOS',
        activities: [
          { id: '1', name: 'Listado de gastos', goal: 1 },
          { id: '2', name: 'Programacion de pagos', goal: 1 },
          { id: '3', name: 'Disminución de deuda', goal: 1 },
        ],
      },
      {
        id: 'ahorro',
        name: 'AHORRO',
        activities: [
          { id: '1', name: 'Dinero mensual', goal: 1 },
          { id: '2', name: 'Inversion', goal: 1 },
          { id: '3', name: 'Otro', goal: 1 },
        ],
      },
      {
        id: 'prevision',
        name: 'PREVISIÓN',
        activities: [
          { id: '1', name: 'Pensión', goal: 1 },
          { id: '2', name: 'Seguro de vida', goal: 1 },
          { id: '3', name: 'Seguro de gastos médicos', goal: 1 },
        ],
      },
      {
        id: 'ingreso',
        name: 'INGRESO',
        activities: [
          { id: '1', name: 'Ventas', goal: 1 },
          { id: '2', name: 'Horas extra', goal: 1 },
          { id: '3', name: 'Trabajos extraordinarios', goal: 1 },
        ],
      },
    ],
  },
  {
    id: 'espiritual',
    name: 'Espiritual',
    areas: [
      {
        id: 'evangelio',
        name: 'EVANGELIO',
        activities: [
          { id: '1', name: 'Lectura diaria', goal: 30 },
          { id: '2', name: 'Curso de biblia', goal: 4 },
          { id: '3', name: 'Otro', goal: 1 },
        ],
      },
      {
        id: 'misa',
        name: 'MISA',
        activities: [
          { id: '1', name: 'Conocer sobre la Misa', goal: 1 },
          { id: '2', name: 'Misa dominical', goal: 4 },
          { id: '3', name: 'Confesión y comunión', goal: 1 },
        ],
      },
      {
        id: 'grupo',
        name: 'GRUPO',
        activities: [
          { id: '1', name: 'Sumarse', goal: 1 },
          { id: '2', name: 'Apoyar', goal: 1 },
          { id: '3', name: 'Otro', goal: 1 },
        ],
      },
      {
        id: 'apostolado',
        name: 'APOSTOLADO',
        activities: [
          { id: '1', name: 'Sumarse', goal: 1 },
          { id: '2', name: 'Apoyar', goal: 1 },
          { id: '3', name: 'Otro', goal: 1 },
        ],
      },
    ],
  },
];
