import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Endereco } from './../shared/endereco';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from './cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  form: FormGroup;
  endereco: Endereco;
  habilitaSalvar: boolean;
  habilitaAtualizar: boolean;
  pt = '[0-9]+$';

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaService,
    private fb: FormBuilder,
    private routes: Router,
    private toastrs: ToastrService,
    private cadastroService: CadastroService
  ) { }

  ngOnInit() {

    this.habilitaSalvar = false;
    this.habilitaAtualizar = false;
    this.route.params.subscribe((params: any) => {
      const id = params['id'];

      if (id === '' || id === undefined) {
        this.habilitaSalvar = true;
        this.habilitaAtualizar = false;
      } else {
        this.habilitaSalvar = false;
        this.habilitaAtualizar = true;
        const cadastro$ = this.listaService.loadById(id);

        cadastro$.subscribe((endereco: Endereco) => {
          this.endereco = endereco;
          this.atualizarForm(endereco);

        });
      }

    });
    this.validacaoForm(new Endereco());
  }

  validacaoForm(end: Endereco) {

    this.form = this.fb.group({
      id: [end.id],
      nome: [end.nome],
      endereco: [end.endereco],
      numero: [end.numero],
      complemento: [end.complemento],
      cep: [end.cep],
      bairro: [end.bairro],
      cidade: [end.cidade],
      estado: [end.estado]

    });
  }

  atualizarForm(end: Endereco) {
    this.form.patchValue({
      id: end.id,
      nome: end.nome,
      endereco: end.endereco,
      numero: end.numero,
      complemento: end.complemento,
      cep: end.cep,
      bairro: end.bairro,
      cidade: end.cidade,
      estado: end.estado
    });
  }

  populaCEP(dados) {
    this.form.patchValue({
      endereco: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento,
      // cep: dados.cep,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
    });
  }

  salvar() {
    this.listaService.create(this.form.value).subscribe(success => {
      this.toastrs.success('Salvo com Sucesso');
      this.routes.navigate(['lista']);
    }, error => {
      this.toastrs.error('Indiponibilidade, tente novamente mais tarde!');
    },
      () => {
        console.log('Request OK');
      });
  }

  atualizar() {
    this.listaService.atualizar(this.form.value).subscribe(success => {
      this.toastrs.success('Salvo com Sucesso');
      this.routes.navigate(['lista']);
    }, error => {
      this.toastrs.error('Indiponibilidade, tente novamente mais tarde!');
    },
      () => {
        console.log('Request OK');
      });
  }

  consultaCEP(cep) {

    this.cadastroService.pesquisarCEP(cep).subscribe(dados => {

      console.log('Dados', dados);

      this.populaCEP(dados);
    });
  }


}
