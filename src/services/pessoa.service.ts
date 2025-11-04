import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export type Pessoa = {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
};

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private readonly baseUrl = 'http://pessoal.local/api/clientes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.baseUrl);
  }

  add(pessoa: Omit<Pessoa, 'id'>): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.baseUrl, pessoa);
  }

  update(id: number, pessoa: Partial<Omit<Pessoa, 'id'>>): Observable<Pessoa> {
    return this.http.patch<Pessoa>(`${this.baseUrl}/${id}`, pessoa);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}