import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agency } from '../models/agencies';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AgenciesService {
  private agenciesJsonUrl = 'assets/agencias.json';
  private localStorage: Storage;
  private agenciesStorageKey = 'agencies';

  private agenciesSource = new BehaviorSubject<Agency[]>([]);
  currentAgencies = this.agenciesSource.asObservable();

  constructor(private http: HttpClient) {
    this.localStorage = window.localStorage;
  }

  getAllAgenciesFromJson(): Observable<Agency[]> {
    return this.http.get<Agency[]>(this.agenciesJsonUrl);
  }

  getAllAgenciesFromStorage(): Agency[] | null {
    const agenciesJsonString =
      this.localStorage.getItem(this.agenciesStorageKey) || '';
    if (agenciesJsonString) {
      return JSON.parse(agenciesJsonString);
    }
    return null;
  }

  setAgenciesToStorage(agencies: Agency[]): void {
    this.localStorage.setItem(
      this.agenciesStorageKey,
      JSON.stringify(agencies)
    );
  }

  getAgenciesWithId(agencies: Agency[]): Agency[] {
    return agencies.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
    }));
  }

  setAgencies(): void {
    const agenciesLocal = this.getAllAgenciesFromStorage();
    if (agenciesLocal) {
      this.agenciesSource.next(agenciesLocal);
    } else {
      this.getAllAgenciesFromJson().subscribe({
        next: (res) => {
          const formatedAgencies = this.getAgenciesWithId(res);
          this.setAgenciesToStorage(formatedAgencies);
          this.agenciesSource.next(formatedAgencies);
        },
      });
    }
  }
}
