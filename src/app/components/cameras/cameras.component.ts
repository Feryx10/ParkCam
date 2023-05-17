import { Component, Input, ViewChild } from '@angular/core';
import { Camera } from 'src/app/models/camera';
import * as moment from 'moment-timezone';
import { Capture } from 'src/app/models/capture';
import * as cv from "@techstark/opencv-js"
import { CameraService } from 'src/app/services/camera.service';
import { onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  @Input() cameras: Camera[] = [];
  @Input() areas: string[] = [];

  selectedLabel: string = "";
  unsubscribe: any;

  captures: Capture[] = [];
  imgSrc: string = "";
  imagee: any;
  numberOfPuppet: number = 0;

  @ViewChild('media') media: any;
  @ViewChild('image') image: any;
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

  constructor(
    private cameraService: CameraService,
  ) {
    this.current = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
  }

  public base64ToImage(base64: string): string {
    return 'data:image/png;base64,' + base64;
  }

  private refreshVideo(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
      this.detectFaces(this.imgSrc);
    };
    reader.readAsDataURL(file);
  }

  hola() {
    let canvas = document.createElement('canvas');
    let video = document.getElementsByTagName('video')[0];

    canvas.width = 600;
    canvas.height = 400;

    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ESTO ES PARA DESCARGAR UNA IMAGEN DE UN CANVAS
    let i = canvas.toDataURL('image/png');
    let src = cv.imread(canvas);
    // let link = document.createElement('a');
    // link.download = 'image.png';
    // link.href = i;
    // link.click();


    // const img = cv.imread("test");
    // to gray scale
    const imgGray = new cv.Mat();
    cv.cvtColor(src, imgGray, cv.COLOR_RGBA2RGB);
    const cars = new cv.RectVector();
    const carCascade = new cv.CascadeClassifier();
    carCascade.load('cascade.xml');
    const minSize = new cv.Size(30, 30);
    const maxSize = new cv.Size(50, 50);
    carCascade.detectMultiScale(imgGray, cars, 1.2, 750, 2, minSize, maxSize);
    this.numberOfPuppet = cars.size();
    for (let i = 0; i < cars.size(); i++) {
      const roiGray = imgGray.roi(cars.get(i));
      const roiSrc = src.roi(cars.get(i));
      const point1 = new cv.Point(cars.get(i).x, cars.get(i).y);
      const point2 = new cv.Point(
        cars.get(i).x + cars.get(i).width,
        cars.get(i).y + cars.get(i).height
      )
      cv.rectangle(imgGray, point1, point2, [255, 0, 0, 255]);
    }

    // cv.imshow(this.image, imgGray);

    let canvasOutput = document.getElementById('canvasOutput');
    cv.imshow(canvasOutput, imgGray);

    let element = document.getElementsByTagName('canvas')[0];
    let capture:Capture = {
      plate: this.numberOfPuppet + " / 60",
      date: new Date().toString(),
      image: element.toDataURL('image/png'),
    }
    // this.cameraService.updateCamera(this.cameras[0].name, capture);
    this.cameraService.addCapture(this.selectedLabel, capture);
  }

  detectFaces(imgSrc: string): void { }

  ngOnInit(): void {
    let cameraRef = this.cameraService.getDataOfCamera('Edificio Minas');
    this.unsubscribe = onSnapshot(cameraRef, (snapshot) => {
      this.captures = [];
      snapshot.forEach((doc) => {
        this.captures.push(doc.data() as Capture);
      });
    });

    this.loadDataFile();
    this.timer = setInterval(() => {
      this.refreshVideo();
    }, 5000); // recargar cada 5 segundos 
    // this.selectedLabel = this.cameras[0].name
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  
  async loadDataFile() {
    const response = await fetch('https://raw.githubusercontent.com/Feryx10/ParkCam/master/cascade.xml');
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    cv.FS_createDataFile("/", 'cascade.xml', data, true, false, false);
  }

  async onTabChanged(event: any){    
    this.selectedLabel = event.tab.textLabel;
    this.unsubscribe();
    let cameraRef = this.cameraService.getDataOfCamera(event.tab.textLabel);
    this.unsubscribe = onSnapshot(cameraRef, (snapshot) => {
      this.captures = [];
      snapshot.forEach((doc) => {
        this.captures.push(doc.data() as Capture);
      });
    });
  }
}