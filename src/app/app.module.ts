import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Clock, NgxBootstrapIconsModule} from 'ngx-bootstrap-icons';
import {AppComponent} from './app.component';
import {AgmCoreModule} from '@agm/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapModule} from './map/map.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import {AuthComponent} from './auth/auth.component';
import {DropdownDirective} from './header/dropdown.directive';
import {HeaderComponent} from './header/header.component';
import {UserComponent} from './user/user.component';
import {AppRoutingModule} from './app.routing';
import {HomeComponent} from './home/home.component';
import {ReviewComponent} from './reviews/review/review.component';
import {AddReviewComponent} from './reviews/add-review/add-review.component';
import {LocationComponent} from './locations/location/location.component';
import {ReviewListComponent} from './reviews/review-list/review-list.component';
import {AddLocationComponent} from './locations/add-location/add-location.component';
import {LocationListComponent} from './locations/location-list/location-list.component';
import {DatePipe, DecimalPipe} from '@angular/common';
import {IvyGalleryModule} from 'angular-gallery';
import {NgxGalleryModule} from 'ngx-gallery-9';
import {EditReviewComponent} from './reviews/edit-review/edit-review.component';
import {CheckboxModule, NavbarModule, WavesModule} from 'angular-bootstrap-md';
import {ReviewTableComponent} from './reviews/review-sort/review-table';
import {NgbdSortableHeader} from './reviews/review-sort/review-sortable.directive';
import { UserReviewListComponent } from './user/user-review-list/user-review-list.component';
import {CanDeactivateGuardService} from './shared/can-component-deactivate';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { LostPasswordComponent } from './auth/lost-password/lost-password.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { UserLocationBlacklistComponent } from './user/user-location-blacklist/user-location-blacklist.component';
import { CompleteMapComponent } from './complete-map/complete-map.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import { EditLocationComponent } from './locations/edit-location/edit-location.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { LatestReviewsListComponent } from './reviews/latest-reviews-list/latest-reviews-list.component';
import { ResendTokenComponent } from './user/resend-token/resend-token.component';

const icons = {
  Clock
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    UserComponent,
    DropdownDirective,
    HomeComponent,
    ReviewComponent,
    AddReviewComponent,
    LocationComponent,
    ReviewListComponent,
    AddLocationComponent,
    LocationListComponent,
    EditReviewComponent,
    ReviewTableComponent,
    NgbdSortableHeader,
    UserReviewListComponent,
    BlacklistComponent,
    LostPasswordComponent,
    ActivateAccountComponent,
    LoadingSpinnerComponent,
    ChangePasswordComponent,
    UserLocationBlacklistComponent,
    CompleteMapComponent,
    EditLocationComponent,
    LatestReviewsListComponent,
    ResendTokenComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA7vAQFUS4gB2KrY0pg12w8nvqo7G_V0Fo',
      libraries: ['places'],
      apiVersion: 'quarterly'
    }),
    FormsModule,
    HttpClientModule,
    NgbModule,
    MapModule,
    AppRoutingModule,
    ReactiveFormsModule,
    IvyGalleryModule,
    NgxGalleryModule,
    NavbarModule,
    WavesModule,
    CheckboxModule,
    NgxBootstrapIconsModule.pick(icons),
    AgmJsMarkerClustererModule,
    NgSelectModule
  ],
  providers:
    [
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
      DatePipe,
      DecimalPipe,
      CanDeactivateGuardService
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
