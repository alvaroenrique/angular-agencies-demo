import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agency } from '../models/agencies';
import { AgenciesService } from '../services/agencies.service';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss'],
})
export class AgenciesComponent implements OnInit {
  agenciesList: Agency[] = [];

  constructor(
    private agenciesService: AgenciesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agenciesService.currentAgencies.subscribe({
      next: (agencies) => {
        this.agenciesList = agencies;
      },
    });

    this.agenciesService.setAgencies();
  }

  getRandomImg(index: number): string {
    return `https://picsum.photos/id/${index + 10}/100`;
  }

  goToDetail(id: string | undefined): void {
    this.router.navigate([`detail/${id}`]);
  }

  add(): void {
    this.router.navigate(['detail/new']);
  }
}
