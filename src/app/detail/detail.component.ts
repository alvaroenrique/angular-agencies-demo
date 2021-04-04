import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from '../models/agencies';
import { AgenciesService } from '../services/agencies.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  detailForm = this.formBuilder.group({
    agencia: '',
    distrito: '',
    provincia: '',
    departamento: '',
    direccion: '',
  });

  agenciesList: Agency[] = [];
  agencyIndex = 0;
  agencyId = '';

  center: google.maps.LatLngLiteral = { lat: -11.98, lng: -76.88 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [this.center];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private agenciesService: AgenciesService
  ) {
    this.agencyId = this.activatedRouter.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.agenciesService.currentAgencies.subscribe({
      next: (agencies) => {
        this.agenciesList = agencies;
        this.agencyIndex = this.agenciesList.findIndex(
          (item) => item.id === this.agencyId
        );

        const agency: Agency = this.agenciesList[this.agencyIndex] || {};

        this.detailForm.setValue({
          agencia: agency.agencia || '',
          distrito: agency.distrito || '',
          provincia: agency.provincia || '',
          departamento: agency.departamento || '',
          direccion: agency.direccion || '',
        });
        if (this.agencyId !== 'new') {
          this.center = { lat: agency.lat, lng: agency.lon };
          this.markerPositions = [{ lat: agency.lat, lng: agency.lon }];
        }
      },
    });

    this.agenciesService.setAgencies();
  }

  addMarker(event: google.maps.MapMouseEvent): void {
    this.markerPositions = [event.latLng.toJSON()];
  }

  return(): void {
    this.router.navigate(['']);
  }

  onSubmit(): void {
    if (this.agencyId === 'new') {
      this.agenciesList.unshift({
        ...this.detailForm.value,
        id: uuidv4(),
        lat: this.markerPositions[0].lat,
        lon: this.markerPositions[0].lng,
      });
      this.agenciesService.setAgenciesToStorage(this.agenciesList);
    } else {
      const currentAgency: Agency = {
        ...this.detailForm.value,
        id: this.agencyId,
        lat: this.markerPositions[0].lat,
        lon: this.markerPositions[0].lng,
      };
      this.agenciesList[this.agencyIndex] = currentAgency;
      this.agenciesService.setAgenciesToStorage(this.agenciesList);
    }

    this.return();
  }

  remove(): void {
    this.agenciesList.splice(this.agencyIndex, 1);
    this.agenciesService.setAgenciesToStorage(this.agenciesList);

    this.return();
  }
}
