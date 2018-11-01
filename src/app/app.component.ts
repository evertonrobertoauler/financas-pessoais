import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private splashScreen: SplashScreen) {}

  async ngOnInit() {
    if (this.platform.is('cordova')) {
      await this.platform.ready();
      await this.splashScreen.hide();
    }
  }
}
