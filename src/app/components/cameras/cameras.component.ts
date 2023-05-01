import { Component, Input } from '@angular/core';
import { Camera } from 'src/app/models/camera';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  @Input() cameras: Camera[] = [];
  
}
