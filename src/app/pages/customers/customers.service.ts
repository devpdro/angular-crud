import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Client {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
}
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly apiUrl = 'http://pessoal.local/api/clientes';

  constructor(private http: HttpClient) {}

  createItem(item: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}`, item);
  }

  getItems(
    page: number,
    limit: number,
    orderby: any,
    direction: any,
    filterby: any,
    content: any
  ): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.apiUrl}?page=${page}&limit=${limit}&orderby=${orderby}&direction=${direction}&filterby=${filterby}&content=${content}`,
      { withCredentials: true }
    );
  }

  getItem(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  updateItem(id: number, item: Omit<Client, 'id'>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
