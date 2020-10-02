import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Workitem } from './workitem';
import { WorkitemService } from '../workitem.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-wokitem',
  templateUrl: './wokitem.component.html',
  styleUrls: ['./wokitem.component.css']
})
export class WokitemComponent implements OnInit {

  @Input() workitem: Workitem

  workitem_: Workitem

  color: string = "Lavender"

  constructor(private WIService: WorkitemService) {

  }

  ngOnInit() {


    this.colors = [
      { name: 'Lavender' },
      { name: 'yellow' },
      { name: 'GreenYellow' },
      { name: 'Lavender' },
      { name: "LightSkyBlue" },
      { name: "DarkOrange" },
      { name: "Orange" }
    ]

    this.states = [
      { name: 'N' },
      { name: 'S' },
      { name: 'T' },
      { name: 'D' }

    ]

    this.selectedState = this.workitem.state
    this.selectedColor = this.workitem.color
  }


  colors = [
    { name: 'Lavender' },
    { name: 'yellow' },
    { name: 'GreenYellow' },
    { name: 'Lavender' },
    { name: "LightSkyBlue" },
    { name: "DarkOrange" },
    { name: "Orange" }

  ]

  selectedColor: string = ""

  selectOptionColors(colore) {

    this.selectedColor = this.workitem.color

    const workItem = {
      wi: this.workitem.wi,
      storyPoint: this.workitem.storyPoint,
      sprint: this.workitem.sprint,
      description: this.workitem.description,
      state: null,
      color: colore
    }
    this.WIService.changeColorOrStateWorkItem(workItem)



  }



  states = [
    { name: 'N' },
    { name: 'S' },
    { name: 'T' },
    { name: 'D' }

  ]

  selectedState: string = ""

  selectOptionState(sel) {
    this.selectedState = this.workitem.state

    const workItem = {
      wi: this.workitem.wi,
      storyPoint: this.workitem.storyPoint,
      sprint: this.workitem.sprint,
      description: this.workitem.description,
      state: sel,
      color: null
    }

    this.WIService.changeColorOrStateWorkItem(workItem)
    //
    this.WIService.notifyAll(workItem)

  }





  deleteWorkItem() {
    if (confirm("Stai per cancellare il WI, proseguire?")) {
      this.WIService.deleteWorkI(this.workitem.wi, this.workitem.sprint)
    }
  }


  copy(storyPoints) {

    var wi= {
      wi: parseInt(this.getCookie("wi")),
      storyPoint: parseFloat(storyPoints),
      sprint: this.getCookie("sprint"),
      description: this.getCookie("description"),
      state: this.getCookie("state"),
      color: this.getCookie("color")
    }




    this.WIService.copyWorkI(wi)

  }




  getValue() {
    var e = (document.getElementById("sel1") as HTMLInputElement).value;
    return e
  }



  chiama(workitem){
    document.cookie = "wi=" + workitem.wi;
    document.cookie = "storyPoint=" + workitem.storyPoint;
    document.cookie = "sprint=" + workitem.sprint;
    document.cookie = "description=" + workitem.description;
    document.cookie = "state=" + workitem.state;
    document.cookie = "color=" + workitem.color;
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



}
