/**
 * Valores del filtro de proyectos. Viven fuera de `project-filter.tsx` porque
 * ese módulo es `'use client'`: importar una constante suya desde un
 * componente de servidor la convertiría en una referencia de cliente.
 */
export type FilterValue = 'destacados' | 'seguridad' | 'desarrollo' | 'pruebas'

export const FILTER_VALUES: readonly FilterValue[] = ['destacados', 'seguridad', 'desarrollo', 'pruebas']

/** Parámetro de la URL que refleja el filtro, para poder compartirlo. */
export const FILTER_PARAM = 'categoria'
