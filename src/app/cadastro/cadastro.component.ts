import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  habilitaSalvar: boolean;
  habilitaAtualizar: boolean;
  pt = '[0-9]+$';

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaService,
    private fb: FormBuilder,
    private routes: Router,
    private toastrs: ToastrService
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
      }
      const cadastro$ = this.listaService.loadById(id);

      cadastro$.subscribe((endereco: Endereco) => {
        this.endereco = endereco;
        this.atualizarForm(endereco);
      });

    });
    this.validacaoForm(new Endereco());
  }

  validacaoForm(end: Endereco) {

    this.form = this.fb.group({
      id: [end.id],
      nome: [end.nome, Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: [end.endereco, Validators.compose([Validators.minLength(3)])],
      numero: [end.numero],
      complemento: [end.complemento, Validators.compose([Validators.pattern('[a-zA-Z ]*')])],
      cep: [end.cep, [Validators.required, Validators.maxLength(3)]],
      bairro: [end.bairro],
      cidade: [end.cidade],
      estado: [end.estado]

    });
  }

  atualizarForm(end) {
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

  salvar() {

    this.listaService.create(this.form.value).subscribe(success => {
      // console.log('Sucesso');
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
}
