import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Workitem } from './wokitem/workitem';
import { Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators'
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { BurndownService } from './burndown.service';
import { Burndown } from './burndown';

@Injectable({
  providedIn: 'root'
})
export class WorkitemService {


  data: object
  loading: boolean


  board = "https://board--server.herokuapp.com/board"
  insertWi = "https://board--server.herokuapp.com/board/insert"
  deleteWi = "https://board--server.herokuapp.com/board/delete_one"
  //
  pushnotification = "https://board--server.herokuapp.com/pushtoken"
  pushnotificationInsert = "https://board--server.herokuapp.com/pushtoken/insert"




  /*
    board = "http://93.49.6.246:3008/board"
    insertWi = "http://93.49.6.246:3008/board/insert"
    deleteWi = "http://93.49.6.246:3008/board/delete_one"
    //
    pushnotification = "http://93.49.6.246:3008/pushtoken"
    pushnotificationInsert = "http://93.49.6.246:3008/pushtoken/insert"
  */



  private workItemsUpdatet = new Subject<Workitem[]>()
  private workItems_Start = new Subject<Workitem[]>()
  private totaleStoryPointsUpdatet = new Subject<number>()


  private workItems: Workitem[] = []
  pushNotificationTokens: string[] = []

  constructor(public http: HttpClient, public BurndownService: BurndownService) { }



  getWorkItemsUpdateListener() {
    return this.workItemsUpdatet.asObservable()
  }

  getWorkItemsStartUpdateListener() {
    return this.workItems_Start.asObservable()
  }

  getTotaleSP() {
    return this.totaleStoryPointsUpdatet.asObservable()
  }


  getAll() {
    this.http.get<{ message: any }>(this.board)
      .pipe(map(data => {

        return data.message.map(workI => {

          return {
            wi: workI.wi,
            storyPoint: workI.storyPoint,
            sprint: workI.sprint,
            description: workI.description,
            state: workI.state,
            color: workI.color
          }
        })
      }))
      .subscribe(resultData => {
        this.workItems_Start.next([...resultData])
      })
  }



  getAllWi(sprint: string) {
    this.http.get<{ message: any }>(this.board)
      .pipe(map(data => {

        return data.message.map(workI => {

          return {
            wi: workI.wi,
            storyPoint: workI.storyPoint,
            sprint: workI.sprint,
            description: workI.description,
            state: workI.state,
            color: workI.color
          }
        })
      }))
      .subscribe(resultData => {
        //  console.log("I dati sono: " + resultData)
        this.workItems = resultData.filter(x => {
          return x.sprint === sprint
        })
        this.workItemsUpdatet.next([...this.workItems])
      })

    //   this.BurndownService.getBurndownAsArray(sprint)
  }

  getOne(wi) {
    return this.http.get<any>(this.board + "/getBoard/" + wi)
  }


  changeColorOrStateWorkItem(wi: Workitem, prevStato: string) {
    return this.http.post<boolean>(this.insertWi, wi)
      .subscribe(
        resultData => {

          if (resultData) {
            // find the WorkItem and modify it
            var foundIndexWi = this.workItems.findIndex(x => x.wi === wi.wi)
            var wi_new: Workitem = { ...this.workItems[foundIndexWi] }
            // voglio modificare lo stato
            if (wi.color == null) {
              wi_new.state = wi.state

              if (prevStato != null) {
                // inserisco un nuovo burndown

                var dt = new Date();
                var day = dt.getDate().toString().padStart(1, "0");


                var qta = 0;

                if (prevStato == "D") {
                  if (wi.state == "T")
                    qta = -(wi.storyPoint / 2)
                  else
                    qta = -(wi.storyPoint)
                }
                else if (prevStato == "T") {
                  if (wi.state == "D")
                    qta = (wi.storyPoint / 2)
                  else
                    qta = -(wi.storyPoint / 2)
                }
                else {
                  if (wi.state == "T")
                    qta = (wi.storyPoint / 2)
                  else if (wi.state == "D")
                    qta = wi.storyPoint
                }


                var bd: Burndown = {
                  sprint: wi.sprint,
                  giorni: day,
                  storyPoint: qta

                };


                this.BurndownService.insertOrUpdateStoryPoint(bd)
                this.BurndownService.getBurndownAsArray(wi.sprint)
              }
            }
            else
              // voglio modificare il colore
              if (wi.state == null) {
                wi_new.color = wi.color
              }
            this.workItems[foundIndexWi] = wi_new
            this.workItemsUpdatet.next([...this.workItems])
          }

        },
        err => console.log(err)
      )

  }




  insertWorkItem(wi: Workitem) {
    return this.http.post<{ message: boolean }>(this.insertWi, wi)
      .subscribe(
        resultData => {

          console.log(resultData)

          if (resultData.message) {
            this.workItems.push(wi)
            this.workItemsUpdatet.next([...this.workItems])
          }
          else {
            alert("Work item già esistente")
          }


        },
        err => console.log(err)
      )

  }

  CopyWorkItem(wi: Workitem) {
    return this.http.post<{ message: boolean }>(this.insertWi, wi)
      .subscribe(
        resultData => {

          console.log(resultData)

          if (resultData.message) {
            this.workItems.push(wi)
            // this.workItemsUpdatet.next([...this.workItems])
          }
          else {
            alert("Work item già esistente")
          }


        },
        err => console.log(err)
      )

  }


  insertTokenPushNotification(token: string) {
    return this.http.post<{ message: boolean }>(this.pushnotificationInsert, {
      "token": token
    })
      .subscribe(
        resultData => {

          console.log(resultData)

          if (resultData.message) {
            console.log("Token inserito correnttamente")
          }
          else {
            console.log("Token pushNotification già esistente")
          }
        },
        err => console.log(err)
      )
  }

  notifyAll(wi: Workitem) {


    if (true) {

      var state = ""


      if (wi.state === "N")
        state = "To do"
      else
        if (wi.state === "S")
          state = "Start working"
        else if (wi.state === "T")
          state = "Test"
        else if (wi.state === "D")
          state = "Done"

      this.http.get<{ message: any }>(this.pushnotification)
        .pipe(map(data => {
          return data.message.map(tokenReturned => {
            return tokenReturned.token
          })
        }))
        .subscribe(resultData => {
          this.pushNotificationTokens = resultData

          console.log("I dati token sono: " + this.pushNotificationTokens)

          // per ogni token manda un messaggio 


          this.pushNotificationTokens.forEach(token => {




            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA_tYOfNY:APA91bEL7LjhmU2jPjoQTLSI9hww7mDt7hLwcIPlyu6-c8GB_vcG39bflYUCxKOkKBz3iGgbRiWvylZ_CwUj_aWuYrzVbOkDGZcjNG6TRMiT6AN1KkQcJZKAK_n_jFc8uZDMxCR2ZNnQ'
              })
            };

            this.http.post<any>("https://fcm.googleapis.com/fcm/send", {
              "notification": {
                "title": "Dashboard",
                "icon": "",
                "image": "",
                "body": wi.description.substring(0, 40) + " ---> " + state
              },
              "to": token
            }, httpOptions)
              .subscribe(
                resultData => {

                  console.log(resultData)

                  if (resultData.message) {
                    console.log("Token inserito correnttamente")
                  }
                  else {
                    console.log("Token pushNotification già esistente")
                  }
                },
                err => console.log(err)
              )

          })


        })

    }
  }







  deleteWorkI(wi: number, sprint: string, workitem: Workitem) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        wi: wi,
        sprint: sprint
      }
    }

    this.http.delete<any>(this.deleteWi, options)
      .subscribe(
        res => {
          this.workItems.splice(this.workItems.findIndex(function (i) {
            return i.wi === wi;
          }), 1);

          this.workItemsUpdatet.next([...this.workItems])

          var dt = new Date();
          var day = dt.getDate().toString().padStart(1, "0");


          var qta = 0;
          if (workitem.state == "T") {
            qta = -(workitem.storyPoint / 2)
          }
          else
            if (workitem.state == "D")
              qta = -(workitem.storyPoint)

          var bd: Burndown = {
            sprint: sprint,
            giorni: day,
            storyPoint: qta

          };

          this.BurndownService.insertOrUpdateStoryPoint(bd)
          this.BurndownService.getBurndownAsArray(sprint)

        },
        err => alert("Problemi con la cancellazione!")
      )
  }


  copyWorkI(wi: Workitem) {
    // qui copy
    console.log("WI prima: " + wi.sprint)
    wi.sprint = "Sprint " + (parseInt(wi.sprint.slice(-2)) + 1);

    console.log("WI: " + wi.sprint)
    this.CopyWorkItem(wi)

  }


}
