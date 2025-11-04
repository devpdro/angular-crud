import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export type Client = {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
};

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly baseUrl = 'http://pessoal.local/api/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  add(cliente: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, cliente);
  }

  update(id: number, cliente: Partial<Omit<Client, 'id'>>): Observable<Client> {
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, cliente);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
