import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {ReviewComponent} from './reviews/review/review.component';
import {AddReviewComponent} from './reviews/add-review/add-review.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {ReviewListComponent} from './reviews/review-list/review-list.component';
import {AddLocationComponent} from './locations/add-location/add-location.component';
import {LocationComponent} from './locations/location/location.component';
import {LocationListComponent} from './locations/location-list/location-list.component';
import {HomeComponent} from './home/home.component';
import {EditReviewComponent} from './reviews/edit-review/edit-review.component';
import {UserReviewListComponent} from './user/user-review-list/user-review-list.component';
import {CanDeactivateGuardService} from './shared/can-component-deactivate';
import {BlacklistComponent} from './blacklist/blacklist.component';
import {ActivateAccountComponent} from './auth/activate-account/activate-account.component';
import {LostPasswordComponent} from './auth/lost-password/lost-password.component';
import {ChangePasswordComponent} from './user/change-password/change-password.component';
import {UserLocationBlacklistComponent} from './user/user-location-blacklist/user-location-blacklist.component';
import {CompleteMapComponent} from './complete-map/complete-map.component';
import {EditLocationComponent} from './locations/edit-location/edit-location.component';
import {LatestReviewsListComponent} from './reviews/latest-reviews-list/latest-reviews-list.component';
import {ResendTokenComponent} from './user/resend-token/resend-token.component';
import {UserLocationListComponent} from "./user/user-location-list/user-location-list.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'map', component: CompleteMapComponent},
  {path: 'reviews', component: ReviewListComponent},
  {path: 'reviews/latest', component: LatestReviewsListComponent},
  {path: 'reviews/add', component: AddReviewComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuardService]},
  {path: 'reviews/edit/:id', component: EditReviewComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuardService]},
  {path: 'reviews/:id', component: ReviewComponent},
  {path: 'locations', component: LocationListComponent},
  {path: 'locations/add', component: AddLocationComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuardService]},
  {path: 'locations/edit/:id', component: EditLocationComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuardService]},
  {path: 'locations/:id', component: LocationComponent},
  {path: 'user/reviews', component: UserReviewListComponent, canActivate: [AuthGuardService]},
  {path: 'user/locations', component: UserLocationListComponent, canActivate: [AuthGuardService]},
  {path: 'user/blacklist', component: UserLocationBlacklistComponent, canActivate: [AuthGuardService]},
  {path: 'blacklist', component: BlacklistComponent, pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: 'confirmAccount', component: ActivateAccountComponent},
  {path: 'retrievePassword', component: LostPasswordComponent},
  {path: 'changePassword', component: ChangePasswordComponent},
  {path: 'resendToken', component: ResendTokenComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
