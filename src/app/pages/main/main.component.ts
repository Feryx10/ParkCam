import { Component } from '@angular/core';
import { Camera } from 'src/app/models/camera';
import { CameraService } from 'src/app/services/camera.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent  {
  cameras: Camera[] = [];
  cameraNames: string[] = [];
  constructor(private cameraService: CameraService) { } 

  ngOnInit(): void {
    console.log('MainComponent');
    this.loadCameras();   
    this.h();
  } 

  async loadCameras() {
    const cameras = this.cameraService.getCameras().then(cameras => {
      for (const camera of cameras) {
        this.cameras.push(camera);
      }
    });
  }

  h(): void{
    this.cameraNames = this.cameras
      .map(camera => camera.name) 
      .filter((name, index, self) => self.indexOf(name) === index);
  }

  addNewCamera(){
    //this.cameraService.addCamera(this.hola); 
  }

}
