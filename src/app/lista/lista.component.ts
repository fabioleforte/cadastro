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

    this.carregar();

  }

  carregar() {
    this.listaService.getLista().subscribe(resp => {
      this.enderecos = resp;
    });

  }

  excluirLista(id: number) {
    console.log('excluir', id);

    console.log(this.enderecos);


    this.listaService.excluir(id).subscribe(_ => {
      this.enderecos.splice(id, 1);
      this.carregar();
    });

  }

}
