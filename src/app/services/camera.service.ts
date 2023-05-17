import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { doc, setDoc, collection, getDocs, getDoc, getFirestore, updateDoc, onSnapshot, query, where, addDoc  } from '@angular/fire/firestore';
import { Camera } from '../models/camera';
import { Capture } from '../models/capture';

@Injectable({
  providedIn: 'root'
})

export class CameraService {
  private db = getFirestore();

  constructor(private afapp: FirebaseApp) {
    this.db = getFirestore(afapp);
  }

  async addCamera(camera: Camera){
    const docRef = doc(this.db, "cameras", camera.name);
    const res = await setDoc(docRef, camera);   
  }

  async getCameras(): Promise<Camera[]> {
    const cameras: Camera[] = [];
    const querySnapshot = await getDocs(collection(this.db, "cameras"));
    querySnapshot.forEach((doc) => {
      cameras.push(doc.data() as Camera);
    });
    return cameras;
  }

  getDataOfCamera(camera: string) {
    return query(collection(this.db, "captures"), where("camera", "==", camera));
  }

  async updateCamera(name: string, cap: Capture) {    
    const cameraRef = doc(this.db, "cameras", name);
    const cameraDoc = await getDoc(cameraRef); 
    if (cameraDoc.exists()) {
      const cameraData = cameraDoc.data() as Camera;
      cameraData.data.push(cap);
      await updateDoc(cameraRef, { data: cameraData.data , merge: true});
    } else {
      console.log('El documento "Camera" con nombre "' + name + '" no existe.');
    }
  }

  async addCapture(name: string, cap: Capture) {
    addDoc(collection(this.db, "captures"), {
      date: cap.date,
      image: cap.image,
      camera: name,
      plate: cap.plate
    });
  }
  
}
