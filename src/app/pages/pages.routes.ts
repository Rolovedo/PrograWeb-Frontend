import { Route } from '@angular/router';
import { UsersComponent } from './users/users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsDetailComponent } from './projects-detail/projects-detail.component';
import { AdminGuard } from '@core/guard/admin.guard';

export const PAGES_ROUTE: Route[] = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/detail/:id',
    component: ProjectsDetailComponent
  }
];
