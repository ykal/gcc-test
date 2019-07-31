import {Injectable} from '@angular/core';
import {Headers, Http, Response, ResponseContentType} from '@angular/http';
import {configs} from '../../app.config';
import 'rxjs/add/operator/map'
import {Observable} from '../../../../node_modules/rxjs/Observable';

@Injectable()
export class ApiService {

  public ROOT_PATH = configs.rootUrl;
  TOKEN_KEY = 'access_token';
  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(public http: Http) {
  }

  public get(path: string): Observable<any> {
    this.setHeaders(this.TOKEN_KEY);
    return this.http.get(`${this.ROOT_PATH}${path}`, {headers: this.headers})
      .map((res: Response) => res.json());

  }

  public post(path: string, body): Observable<any> {
    this.setHeaders(this.TOKEN_KEY);
    return this.http.post(`${this.ROOT_PATH}${path}`, body, {headers: this.headers})
      .map((res: Response) => res.json());
  }

  public put(path: string, body): Observable<any> {
    this.setHeaders(this.TOKEN_KEY);
    return this.http.put(`${this.ROOT_PATH}${path}`, body, {headers: this.headers})
      .map((res: Response) => res.json());
  }

  public downloadExcel(path: string, body) {
    this.setHeaders(window.localStorage.getItem(this.TOKEN_KEY));
    return this.http.post(path, body,{
        headers:this.headers,
        responseType: ResponseContentType.Blob
    }).map(res => new Blob([res.blob()],{ type: 'application/vnd.ms-excel' }));
}

  public delete(path: string): Observable<any> {
    this.setHeaders(this.TOKEN_KEY);
    return this.http.delete(`${this.ROOT_PATH}${path}`, {headers: this.headers})
      .map((res: Response) => res.json());
  }

  public patch(path: string, body: any): Observable<any> {
    this.setHeaders(this.TOKEN_KEY);
    return this.http.patch(`${this.ROOT_PATH}${path}`, body, {headers: this.headers})
      .map((res: Response) => res.json());
  }

  public setHeaders(token) {
    const temp = window.localStorage.getItem(token);
    if (temp != null) {
      try {
        const session = JSON.parse(temp);
        this.headers.set('Authorization', session.id);
      } catch (e) {
        return;
      }
    }
  }

  public download(path: string, fileName: string) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        responseType: ResponseContentType.Blob
      });
    return this.http.get(`${this.ROOT_PATH}${path}`, {
      responseType: ResponseContentType.Blob
    })
      .map(res => {
        return {data: res.blob(), fileName: fileName};
      });
  }

}
