import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Endereco } from './../shared/endereco';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from './cadastro.service';
import { from } from 'rxjs';

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
  data: [] = [];

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
      estado: [end.estado],
      telefoneRes: [end.telefoneRes],
      telefoneCel: [end.telefoneCel],
      email: [end.email],
      tratamentos: this.fb.array([
        this.addTratamentosGroup()
      ])
    });
  }

  get tratamentos() {
    return this.form.get('tratamentos') as FormArray;
  }

  addTratamentosGroup(): FormGroup {
    return this.fb.group({
      data: [''],
      quantidade: [''],
      tratamento: [''],
      valor: [''],
      soma: ['']
    });
  }

  addTratamentos() {
    this.tratamentos.push(this.addTratamentosGroup());
  }

  excluir(i: number) {
    this.tratamentos.removeAt(i);
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
      estado: end.estado,
      telefoneRes: end.telefoneRes,
      telefoneCel: end.telefoneCel,
      email: end.email,
      // tratamentos: this.fb.group([
      //   this.atualizaTratamento()
      // ])
    });
  }


  atualizaTratamento() {
    let end: Endereco;
    this.form.patchValue({
      data: end.tratamento.data,
      quantidade: end.tratamento.quantidade,
      tratamento: end.tratamento.tratamento,
      valor: end.tratamento.valor,
      soma: end.tratamento.soma
    });
  }
  populaCEP(dados: any) {
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
    });
  }

  atualizar() {
    this.listaService.atualizar(this.form.value).subscribe(success => {
      this.toastrs.success('Salvo com Sucesso');
      this.routes.navigate(['lista']);
    }, error => {
      this.toastrs.error('Indiponibilidade, tente novamente mais tarde!');
    });
  }

  consultaCEP(cep) {

    this.cadastroService.pesquisarCEP(cep).subscribe((dados: any) => {

      if (!dados.erro) {
        this.populaCEP(dados);
      } else {
        this.toastrs.error('CEP Obrigatório!');
      }
    });
  }
}
