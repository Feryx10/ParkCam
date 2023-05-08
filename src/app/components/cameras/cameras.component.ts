import { Component, Input, ViewChild } from '@angular/core';
import { Camera } from 'src/app/models/camera';
import * as moment from 'moment-timezone';
import { Capture } from 'src/app/models/capture';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  @Input() cameras: Camera[] = [];
  @Input() areas: string[] = [];
  @Input() captures: Capture[] = [];

  @ViewChild('media') media: any;
  private timer: any;

  camerasByName = this.cameras.reduce((accumulator, current) => {
    if (!accumulator[current.name]) {
      accumulator[current.name] = [];
    }
    accumulator[current.name].push(current);
    return accumulator;
  }, {} as { [key: string]: Camera[] });

  showFiller = false;
  current: string;

  constructor() {
    this.current = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss'); 
  }

  public base64ToImage(base64: string): string {
    return 'data:image/png;base64,' + base64;
  }

  private refreshVideo(): void {  

  }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.refreshVideo();
    }, 5000); // recargar cada 5 segundos 
    console.log('CamerasCompongfhjgfhent');
    console.log(this.cameras);       
  }  

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}