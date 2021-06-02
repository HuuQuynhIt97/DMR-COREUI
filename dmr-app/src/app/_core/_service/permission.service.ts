import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { INavData } from '@coreui/angular';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl = environment.apiUrlEC;
  ModalNameSource = new BehaviorSubject<number>(0);
  currentModalName = this.ModalNameSource.asObservable();

  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(
    private http: HttpClient, private utilitiesService: UtilitiesService
  ) { }
// #region Permisison
  getAllPermission() {
    return this.http.get(this.baseUrl + 'Permission/GetAll', {});
  }
  create(model) {
    return this.http.post(this.baseUrl + 'Permission/Create', model);
  }
  update(model) {
    return this.http.put(this.baseUrl + 'Permission/Update', model);
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/Delete/' + id);
  }
// #endregion

  // #region Module
  getAllModule() {
    return this.http.get(this.baseUrl + 'Permission/GetAllModule', {});
  }
  createModule(model) {
    return this.http.post(this.baseUrl + 'Permission/CreateModule', model);
  }
  updateModule(model) {
    return this.http.put(this.baseUrl + 'Permission/UpdateModule', model);
  }
  deleteModule(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/DeleteModule/' + id);
  }
  deleteModuleTranslation(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/DeleteModuleTranslation/' + id);
  }
// #endregion

  // #region Function
  getAllFunction() {
    return this.http.get(this.baseUrl + 'Permission/GetAllFunction', {});
  }
  getFunctionsAsTreeView() {
    return this.http.get(this.baseUrl + 'Permission/GetFunctionsAsTreeView', {});
  }
  createFunction(model) {
    return this.http.post(this.baseUrl + 'Permission/CreateFunction', model);
  }
  updateFunction(model) {
    return this.http.put(this.baseUrl + 'Permission/UpdateFunction', model);
  }
  deleteFunction(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/DeleteFunction/' + id);
  }
  deleteFunctionTranslation(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/DeleteFunctionTranslation/' + id);
  }
  getActionInFunctionByRoleID(id: number) {
    return this.http.get(this.baseUrl + 'Permission/GetActionInFunctionByRoleID/' + id);
  }
// #endregion


  // #region Action
  getAllAction() {
    return this.http.get(this.baseUrl + 'Permission/GetAllAction', {});
  }
  createAction(model) {
    return this.http.post(this.baseUrl + 'Permission/CreateAction', model);
  }
  updateAction(model) {
    return this.http.put(this.baseUrl + 'Permission/UpdateAction', model);
  }
  deleteAction(id: number) {
    return this.http.delete(this.baseUrl + 'Permission/DeleteAction/' + id);
  }
  // #endregion

  getMenuByUserPermission(userId) {
    return this.http.get<[]>(this.baseUrl + 'Permission/GetMenuByUserPermission/' + userId, {})
    .pipe(map(response => {
      const menus = response as any[];
      const navs: INavData[] = [
        {
          name: 'Home',
          url: '/',
          icon: 'icon-home',
          badge: {
            variant: 'info',
            text: ''
          }
        },
        {
          title: true,
          name: 'Mixing Room'
        },
      ];
      for (const item of menus) {
        const children = [];
        const node = {
          name: item.module,
          url: item.url,
          icon: item.icon || "icon-star",
          children: []
        };
        for (const child of item?.children) {
          const itemChild = {
            name: child.name,
            url: child.url,
            icon: "far fa-circle"
            // icon: item.icon || 'fa fa-circle'
          };
          children.push(itemChild);
        }
        node.children = children;
        navs.push(node);
      }
      console.log(navs);
      localStorage.setItem('navs', JSON.stringify(navs));
      return navs;
    }));
  }

  putPermissionByRoleId(roleID, request) {
    return this.http.put(this.baseUrl + 'Permission/putPermissionByRoleId/' + roleID, request);
  }
  postActionToFunction(functionID, request) {
    return this.http.post(this.baseUrl + 'Permission/PostActionToFunction/' + functionID, request);
  }
  deleteActionToFunction(functionID, request) {
    return this.http.delete(`${this.baseUrl}Permission/deleteActionToFunction/${functionID}?actionIds=${request.actionIds}`);
  }
  getScreenAction(functionID) {
    return this.http.get<[]>(this.baseUrl + 'Permission/GetScreenAction/' + functionID, {});
  }
  getScreenFunctionAndAction(roleID) {
    return this.http.get<[]>(this.baseUrl + 'Permission/GetScreenFunctionAndAction/' + roleID, { });
  }

  // language
  getAllLanguage() {
    return this.http.get<[]>(this.baseUrl + 'Permission/getAllLanguage', {});
  }

  getModulesAsTreeView() {
    return this.http.get<[]>(this.baseUrl + 'Permission/GetModulesAsTreeView', {});
  }

  getMenuByLangID(userID, langID) {
    return this.http.get<[]>(`${this.baseUrl}Permission/GetMenuByLangID?userID=${userID}&langID=${langID}` , {})
      .pipe(map(response => {
        const menus = response as any[];
        const navs: INavData[] = [
          {
            name: 'Home',
            url: '/',
            icon: 'icon-home',
            badge: {
              variant: 'info',
              text: ''
            }
          },
          {
            title: true,
            name: 'Mixing Room'
          },
        ];
        for (const item of menus) {
          const children = [];
          const node = {
            name: item.module,
            url: item.url,
            icon: item.icon || "icon-star",
            children: []
          };
          for (const child of item?.children) {
            const itemChild = {
              name: child.name,
              url: child.url,
              icon: "far fa-circle"
              // icon: item.icon || 'fa fa-circle'
            };
            children.push(itemChild);
          }
          node.children = children;
          navs.push(node);
        }
        console.log(navs);
        localStorage.setItem('navs', JSON.stringify(navs));
        return navs;
      }));
  }

}
