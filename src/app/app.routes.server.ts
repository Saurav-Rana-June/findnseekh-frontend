import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'teachers/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'teachers/:id/courses',
    renderMode: RenderMode.Server,
  },
  {
    path: 'teachers/:id/reviews',
    renderMode: RenderMode.Server,
  },
  {
    path: 'listings/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
