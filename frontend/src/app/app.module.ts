import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FilePondModule } from 'ngx-filepond';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AddServiceComponent } from './services/add-service/add-service.component';
import { ServicesComponent } from './services/services.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import * as filePond from 'filepond';
import * as FilePondPlugingFileEncode from 'filepond-plugin-file-encode';
import * as FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilePondPlugingImageValidateSize from 'filepond-plugin-image-validate-size';

filePond.registerPlugin(FilePondPluginFileValidateType);
filePond.registerPlugin(FilePondPluginFileValidateSize);
filePond.registerPlugin(FilePondPlugingImageValidateSize);
filePond.registerPlugin(FilePondPlugingFileEncode);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ServicesComponent,
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    AddServiceComponent,
    StarRatingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FilePondModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
