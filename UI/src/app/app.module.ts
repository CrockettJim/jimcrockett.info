import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsoleComponent } from './components/console/console.component';
import { ResizableBackgroundComponent } from './components/resizable-background/resizable-background.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypedLineComponent } from './components/typed-line/typed-line.component';
import { SavedUserInputComponent } from './components/saved-user-input/saved-user-input.component';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    ResizableBackgroundComponent,
    TypedLineComponent,
    SavedUserInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
