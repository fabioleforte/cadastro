import { Component, OnInit } from '@angular/core';
import { ListaService } from './lista.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  public enderecos = [];

  constructor(private listaService: ListaService, private toastrService: ToastrService) { }

  ngOnInit() {

    this.carregar();


  }

  carregar() {
    this.listaService.getLista().subscribe(resp => {
      this.enderecos = resp;
    });

  }


  excluirLista(id: number) {
    this.listaService.excluir(id).subscribe(_ => {
      this.enderecos.splice(id, 1);
      this.carregar();;
      this.toastrService.success('Excluído com Sucesso!');
    });
  }
}
