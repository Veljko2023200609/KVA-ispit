import { Component, signal } from '@angular/core';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { TypeModel } from '../../models/toyType.model';
import { AgeGroupModel } from '../../models/toyAge.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected toys = signal<ToyModel[]>([])
  protected previousSearch = 'N/A'
  protected search = ''

  protected category: string | null = null
  protected ageGroup: string | null = null
  protected descriptionFilter: string | null = null
  protected targetGroup: string | null = null
  protected productionDate: string | null = null
  protected price: string | null = null

  protected showFilters = false;

  protected categories = signal<TypeModel[]>([]);
  protected ageGroups = signal<AgeGroupModel[]>([]);

  constructor() {
    this.loadToys()

    ToyService.getToyCategories().then(res => this.categories.set(res));
    ToyService.getAgeGroups().then(res => this.ageGroups.set(res));
  }

  protected loadToys() {
    //if (this.previousSearch == '' && this.search == '') return
    this.previousSearch = this.search

    ToyService.getToys(
      this.search,
      this.category,
      this.ageGroup,
      this.descriptionFilter,
      this.targetGroup,
      this.productionDate,
      this.price
    )
      .then(rsp => this.toys.set(rsp))
  }
}
