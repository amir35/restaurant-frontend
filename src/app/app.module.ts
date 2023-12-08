import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { LoginHeaderComponent } from './components/login-header/login-header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';
import { LogoutComponent } from './components/logout/logout.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { CategoryComponent } from './components/category/category.component';
import { ItemComponent } from './components/item/item.component';
import { OrderComponent } from './components/order/order.component';
import { AddCategoryComponent } from './dialogues/add-category/add-category.component';
import { AddItemComponent } from './dialogues/add-item/add-item.component';
import { DeleteCategoryComponent } from './dialogues/delete-category/delete-category.component';
import { EditCategoryComponent } from './dialogues/edit-category/edit-category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BillsComponent } from './components/bills/bills.component';
import { ViewBillComponent } from './dialogues/view-bill/view-bill.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginHeaderComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    SideNavComponent,
    CategoryComponent,
    ItemComponent,
    OrderComponent,
    AddCategoryComponent,
    AddItemComponent,
    DeleteCategoryComponent,
    EditCategoryComponent,
    DashboardComponent,
    BillsComponent,
    ViewBillComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatDividerModule, MatProgressBarModule,
    MatSelectModule, MatSnackBarModule, MatToolbarModule, MatStepperModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,
    useClass : HttpInterceptorService,
    multi : true

  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
