import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export type Client = {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
};

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly baseUrl = '/api/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    console.log('[ClientService] GET', this.baseUrl);
    return this.http.get<any>(this.baseUrl).pipe(
      tap((raw) => console.log('[ClientService] GET response (raw)', raw)),
      map((res) => {
        // Normaliza formatos comuns: array direto, objeto com `data` (paginado),
        // ou chaves alternativas como `clientes`/`results`.
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data; // alguns backends retornam array direto em `data`
        if (Array.isArray(res?.data?.data)) return res.data.data; // formato paginado: `{ data: { data: [...] } }`
        if (Array.isArray(res?.clientes)) return res.clientes;
        if (Array.isArray(res?.results)) return res.results;
        return [];
      }),
      tap((normalized) => console.log('[ClientService] GET normalized', normalized)),
      catchError((err) => {
        console.error('[ClientService] GET error', err);
        throw err;
      })
    );
  }

  add(cliente: Omit<Client, 'id'>): Observable<Client> {
    console.log('[ClientService] POST', this.baseUrl, cliente);
    return this.http.post<Client>(this.baseUrl, cliente).pipe(
      tap((created) => console.log('[ClientService] POST response', created)),
      catchError((err) => {
        console.error('[ClientService] POST error', err);
        throw err;
      })
    );
  }

  update(id: number, cliente: Partial<Omit<Client, 'id'>>): Observable<Client> {
    console.log('[ClientService] PATCH', `${this.baseUrl}/${id}`, cliente);
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, cliente).pipe(
      tap((updated) => console.log('[ClientService] PATCH response', updated)),
      catchError((err) => {
        console.error('[ClientService] PATCH error', err);
        throw err;
      })
    );
  }

  remove(id: number): Observable<void> {
    console.log('[ClientService] DELETE', `${this.baseUrl}/${id}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => console.log('[ClientService] DELETE response', id)),
      catchError((err) => {
        console.error('[ClientService] DELETE error', err);
        throw err;
      })
    );
  }
}
