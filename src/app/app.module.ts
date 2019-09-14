import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspacesComponent } from './components/workspaces/workspaces.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { ProgramsModalComponent } from './modals/programs-modal/programs-modal.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { EditableDirective } from './directives/editable.directive';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkspacesComponent,
    WorkspaceComponent,
    LoaderComponent,
    AlertComponent,
    ProgramsModalComponent,
    PageTitleComponent,
    EditableDirective
  ],
  entryComponents: [
    ProgramsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    {
      provide: 'DOCUMENT',
      useFactory: getDocument
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function getDocument() {
  return (typeof document !== 'undefined') ? document : null;
}