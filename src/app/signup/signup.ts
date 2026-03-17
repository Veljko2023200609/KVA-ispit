import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../utils';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  protected form: FormGroup

  constructor(private formBuilder: FormBuilder, private router: Router, private utils: Utils) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.showAlert('Greška u unosu podataka!');
      return;
    }

    try {
      UserService.register(this.form.value);
      
      UserService.login(this.form.value.email, this.form.value.password);
      
      this.utils.showAlert('Uspešna registracija!');
      this.router.navigateByUrl('/');
    } catch (error: any) {
      if (error.message === 'USER_ALREADY_EXISTS') {
        this.utils.showAlert('Korisnik sa ovim emailom već postoji!');
      } else {
        this.utils.showAlert('Došlo je do greške!');
      }
    }
  }
}
