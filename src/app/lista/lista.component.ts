import { Component, OnInit } from '@angular/core';
import { ListaService } from './lista.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  public enderecos = [];

  constructor(private listaService: ListaService) { }

  ngOnInit() {

    this.listaService.getLista().subscribe(resp => {
      this.enderecos = resp;
    });

  }

 }
