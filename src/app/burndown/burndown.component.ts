import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
//import * as Highcharts from 'highcharts';
import { Workitem } from '../wokitem/workitem';
import { Subscription } from 'rxjs';
import { WorkitemService } from '../workitem.service';
import { BurndownService } from '../burndown.service';
import { Burndown } from '../burndown';




import * as Highcharts from 'highcharts/highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';


@Component({
  selector: 'app-burndown',
  templateUrl: './burndown.component.html',
  styleUrls: ['./burndown.component.css']
})
export class BurndownComponent implements OnInit, OnDestroy, OnChanges {

  workItems: Workitem[] = [];
  private workItemSUb: Subscription

  burndown: Burndown
  private burndownSub: Subscription
  private burndownAsArraySub: Subscription
  private storyPointsAsArraySub: Subscription

  burnDownAsArray = []

  highcharts = Highcharts;
  chartOptions = {}
  totaleSP = 0

  @Input() selectedSprintNumber: string

  constructor(public WIService: WorkitemService, public BurndownService: BurndownService) { }


  ngOnChanges(changes: SimpleChanges): void {






  }





  ngOnInit() {

    this.WIService.getAllWi(this.selectedSprintNumber)

    this.workItemSUb = this.WIService.getWorkItemsUpdateListener()
      .subscribe((workItems_: Workitem[]) => {
        this.workItems = workItems_
        // aggiorno il totale
        this.totaleSP = 0
        workItems_.filter(x => {
          return x.sprint == this.selectedSprintNumber
        }).forEach(x => {
          this.totaleSP += x.storyPoint
        })
        document.cookie = "totale=" + this.totaleSP.toString();
        console.log(this.totaleSP)

        this.chartOptions = {
          chart: {
            type: "spline"
          },
          title: {
            text: "Andamento " + this.selectedSprintNumber
          },
          subtitle: {
            text: "Source: https://board.tomasmali08.now.sh/"
          },
          xAxis: {
            categories: this.getGiorni()
          },
          yAxis: {
            title: {
              text: "Story points "
            }
          },
          tooltip: {
            valueSuffix: " "
          },
          series: [
            {
              name: 'Ideal Train',
              data: this.getIdeal(this.totaleSP.toString())
            },
            {
              name: 'Effort Remaining',
              data: this.burnDownAsArray
            }
          ]
        };
      })








    this.BurndownService.getBurndownAsArray(this.selectedSprintNumber)

    this.burndownAsArraySub = this.BurndownService.getBurndownAsArrayUpdateListener()
      .subscribe(burdownAsArray_ => {

        var arr = []
        arr[0] = this.totaleSP

        for (var i = 0; i < burdownAsArray_.length; i++) {
          var tot_gg = 0;

          for (var j = 0; j < i; j++)
            tot_gg += burdownAsArray_[j]

          arr[i + 1] = this.totaleSP - (tot_gg + burdownAsArray_[i])
        }


        this.burnDownAsArray = arr



        this.chartOptions = {
          chart: {
            type: "spline"
          },
          title: {
            text: "Andamento " + this.selectedSprintNumber
          },
          subtitle: {
            text: "Source: https://board.tomasmali08.now.sh/"
          },
          xAxis: {
            categories: this.getGiorni()
          },
          yAxis: {
            title: {
              text: "Story points "
            }
          },
          tooltip: {
            valueSuffix: " "
          },
          series: [
            {
              name: 'Ideal Train',
              data: this.getIdeal(this.totaleSP.toString())
            },
            {
              name: 'Effort Remaining',
              data: this.burnDownAsArray
            }
          ]
        };
      })

    this.chartOptions = {
      chart: {
        type: "spline"
      },
      title: {
        text: "Andamento " + this.selectedSprintNumber
      },
      subtitle: {
        text: "Source: https://board.tomasmali08.now.sh/"
      },
      xAxis: {
        categories: this.getGiorni()
      },
      yAxis: {
        title: {
          text: "Story points "
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          name: 'Ideal Train',
          data: this.getIdeal(this.totaleSP.toString())
        },
        {
          name: 'Effort Remaining',
          data: this.burnDownAsArray
        }
      ]
    };


  }





  ngOnDestroy() {
    this.workItemSUb.unsubscribe()
    this.burndownSub.unsubscribe()
    this.burndownAsArraySub.unsubscribe()
  }


  getEffort() {

  }


  getGiorni() {
    var giorno = this.selectedSprintNumber

    var map = new Map();
    map.set('Sprint 13', ["0", "29", "30", "1", "2", "5", "6", "7", "8", "9", "12", "13", "14", "15", "16", "19"]);
    map.set('Sprint 14', ["0", "10", "21", "22", "23", "26", "27", "28", "29", "30", "2", "3", "4", "5", "6", "9"]);
    map.set('Sprint 15', ["0", "10", "11", "12", "13", "16", "17", "18", "19", "20", "23", "24", "25", "26", "27", "30"]);
    map.set('Sprint 16', ["0", "1", "2", "3", "4", "7", "9", "10", "11", "14", "15", "16", "17", "18", "21"]);
    map.set('Sprint 17', ["0", "22", "23", "24", "25", "28", "29", "30", "31", "1", "4", "5", "6", "7", "8", "11"]);

    return map.get(giorno)
  }


  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }








  getIdeal(tot) {

  
var tot_giorni = 15;

if (this.selectedSprintNumber == "Sprint 16")
   tot_giorni = 14;

    let calc = tot / tot_giorni
    var ideal = []
    ideal[0] = tot
    ideal[tot_giorni] = 0
    for (var i = 1; i < (tot_giorni + 1); i++) {
      ideal[tot_giorni - i] = (i * calc)
    }

    return ideal

  }

}
