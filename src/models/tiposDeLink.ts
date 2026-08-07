import type { TipoLink } from './Usuario'

export const ROTULO_DO_LINK: Record<TipoLink, string> = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  PORTFOLIO: 'Portfólio',
  SITE: 'Site',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  X: 'X',
}

export const TIPOS_DE_LINK = Object.keys(ROTULO_DO_LINK) as TipoLink[]
