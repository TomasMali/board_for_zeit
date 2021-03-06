import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { WorkitemService } from '../workitem.service';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, private workItemService: WorkitemService) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
       console.log(token);
        this.workItemService.insertTokenPushNotification(token)
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.showWithClick(payload)
      })
  }

showWithClick(payload: any){
  let notify_data = payload['notification']
  let title = notify_data['title']

let option = {
  body: notify_data['title']
}

let notify: Notification = new Notification(title,option)

notify.onclick = event => {     
  event.preventDefault();
  
  window.location.href = "https://board.tomasmali08.now.sh/"


  // "https://board-ivs97i8m4.now.sh/"   "https://board-3sxgucy4u.vercel.app/"

}

}




}