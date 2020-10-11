import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Burndown } from './burndown';

@Injectable({
  providedIn: 'root'
})
export class BurndownService {

  board = "https://board--server.herokuapp.com/board"
  insertWi = "https://board--server.herokuapp.com/board/insert"
  deleteWi = "https://board--server.herokuapp.com/board/delete_one"
  //
  burndownUrl = "https://board--server.herokuapp.com/burndown"
  getOneburndownUrl = "https://board--server.herokuapp.com/burndown/getOneBurndown"
  burndownInsertUrl = "https://board--server.herokuapp.com/burndown/insert"

private burndown: Burndown
burndownAsArray = []
private burndownUpdated = new Subject<Burndown>()
private burndownAsArrayUpdated = new Subject<[]>()
private storyPointsAsArrayUpdated = new Subject<boolean>()






constructor(public http: HttpClient) { }



getBurndownUpdateListener() {
  return this.burndownUpdated.asObservable()
}


getBurndownAsArrayUpdateListener() {
  return this.burndownAsArrayUpdated.asObservable()
}

getStoryPointsAsArrayUpdateListener() {
  return this.storyPointsAsArrayUpdated.asObservable()
}


insertOrUpdateStoryPoint(burndown: Burndown) {
  return this.http.post<boolean>(this.burndownInsertUrl, burndown)
    .subscribe(
      resultData => {
        if (resultData) {
          this.storyPointsAsArrayUpdated.next(resultData)
        }

      },
      err => console.log(err)
    )

}



getBurndownCorrente() {
  this.http.get<{ message: any }>(this.burndownUrl)
  .pipe(map(data => {
    return data.message.map(burndown => {
      return {
        storyPoint: burndown.storyPointTot,
        sprint: burndown.sprint,
        giorni: burndown.giorni

      }
    })
  }))
  .subscribe(resultData => {
    
    this.burndown = resultData
    this.burndownUpdated.next(resultData)
  })
}


// chiamare quando non si sposta da start a test, oppure da test a done
getBurndownAsArray(sprint) {
  this.http.get<{ message: [] }>(this.getOneburndownUrl + "/" + sprint)
  .subscribe(resultData => {
    this.burndownAsArray = resultData.message
    this.burndownAsArrayUpdated.next(resultData.message)
  })
}

}
