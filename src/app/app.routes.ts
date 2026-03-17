import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Toy as Toy } from './toy/toy';
import { Profile } from './profile/profile';
import { Reservation } from './reservation/reservation';

export const routes: Routes = [
    { path: '', title: 'Igračke', component: Home },
    { path: 'about', title: 'O nama', component: About },
    { path: 'login', title: 'Prijava', component: Login },
    { path: 'signup', title: 'Registracija', component: Signup },
    { path: 'toy/:path/reservation', title: 'Rezervacija igračke', component: Reservation },
    { path: 'toy/:path', title: 'Igračka', component: Toy },
    { path: 'profile', title: 'Profil korisnika', component: Profile },
    { path: '**', redirectTo: '' }
]


