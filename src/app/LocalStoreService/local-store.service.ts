import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private ls = window.localStorage;
  userPermissions: any = [];
  private storage = new Map();

  constructor() {}

  public setItem(key: any, value: any) {
    value = JSON.stringify(value);
    this.ls.setItem(key, value);
    return true;
  }

  public getItem(key: any) {
    let value = this.ls.getItem(key);
    try {
      return JSON.parse(value || '{}');
    } catch (e) {
      return null;
    }
  }

  public clear() {
    this.ls.clear();
  }

  public getPermissaoBotao(menuNome: any, botaoNome: any) {
    const userIdStr = this.ls.getItem('user_id') ?? '0';
    const userId = parseInt(userIdStr, 10);
    if (userId === 1) {
      return true;
    }
    if (botaoNome === 'listar') {
      return true;
    }

    let admin = (this.ls.getItem('perfil') ?? '').replace(/^"(.*)"$/, '$1');
    if (admin === 'admin') {
      return true;
    }
    let menu = this.findMenu(menuNome);
    if (menu == null) {
      return false;
    }
    let botao = this.findBotao(menu, botaoNome);
    if (botao == null) {
      return false;
    }
    return true;
  }

  public findMenu(menuNome: string) {
    let admin = (this.ls.getItem('perfil') ?? '').replace(/^"(.*)"$/, '$1');
    if (admin == 'admin') {
      return true;
    }
    let userPermissions = this.getItem('permissoes');
    return _.find(userPermissions, { menu: menuNome });
  }

  public findBotao(menu: any, botaoNome: string) {
    return _.find(menu.operacoes, { botao: botaoNome });
  }

  public getPermissaoMenu() {}

  public getMenuNome(menuNome: string): string {
    let userPermissions = this.getItem('permissoes');
    const menu = _.find(userPermissions, { menu: menuNome });
    return menu ? menu.nome : '';
  }

  hasMenus(): boolean {
    return this.storage.has('menus');
  }
}
