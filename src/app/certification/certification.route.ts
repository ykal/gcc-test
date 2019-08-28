import { Routes } from '@angular/router';
import { RequestCertificationComponent } from './requestCertification/requestCertification.component';

export const CertificationRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: RequestCertificationComponent}
    ]
  }
];
