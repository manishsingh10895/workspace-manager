import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesComponent } from './components/workspaces/workspaces.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'workspaces'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {
            name: 'home'
        }
    },
    {
        path: 'workspaces',
        component: WorkspacesComponent,
        data: {
            name: 'workspaces'
        }
    },
    {
        path: 'workspace/:name',
        component: WorkspaceComponent,
        data: {
            name: 'workspace'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
