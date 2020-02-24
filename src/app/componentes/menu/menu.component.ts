import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';

// Providers
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  url: any = 'www.google.com';
  componentes: Observable<Componente[]>;

  constructor(private dataService: DataService,
              private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();

  }

  compartir(icon: string) {
    if (icon == "share") {
      this.socialSharing.share(
        'Rural APP',
        this.url,
        '',
        this.url
      )
    }
  }


}
