import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Endereco } from './../shared/endereco';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  form: FormGroup;
  endereco: Endereco;



  constructor(
    private route: ActivatedRoute,
    private listaService: ListaService,
    private fb: FormBuilder,
    private routes: Router,
    private toastrs: ToastrService
  ) { }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      const cadastro$ = this.listaService.loadById(id);

      cadastro$.subscribe((endereco: Endereco) => {

        this.endereco = endereco;
        this.atualizarForm(endereco);


      });

    });
    this.validacaoForm();
  }

  validacaoForm() {

    this.form = this.fb.group({
      nome: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      cep: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']

    });
  }

  atualizarForm(endereco: Endereco) {
    this.form.patchValue({
      nome: endereco.nome,
      endereco: endereco.endereco,
      numero: endereco.numero,
      complemento: endereco.complemento,
      cep: endereco.cep,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado
    });
  }

  salvar() {

    this.listaService.create(this.form.value).subscribe(success => {
      // console.log('Sucesso');
      this.toastrs.success('Salvo com Sucesso');
      this.routes.navigate(['lista']);
    }, error => {
      console.log('erro');
    },
      () => {
        console.log('Request OK');
      });


  }

  atualizar() {

    debugger

    this.listaService.atualizar(this.endereco).subscribe(success => {
      console.log('Entrou', success);
    });
  }
}
