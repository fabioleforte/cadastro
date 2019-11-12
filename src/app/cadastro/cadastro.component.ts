import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Endereco } from './../shared/endereco';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from './cadastro.service';
import { from } from 'rxjs';
import { Tratamento } from './../shared/tratamento';

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
  ends = [];

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
          this.ends.push(endereco);
          this.atualizarForm(endereco);
        });
      }

    });
    this.validacaoForm();
  }

  validacaoForm() {
    this.form = this.fb.group({
      id: [''],
      nome: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      cep: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      telefoneRes: [''],
      telefoneCel: [''],
      email: [''],
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
      // tratamentos: this.fb.array(end.tratamentos.map(item => this.atualizaTratamento(item)))
      tratamentos: this.fb.array([end.tratamentos.map(x => console.log(x))])
    });


  }


  atualizaTratamento(item) {

    console.log('Item', item);


    // const t = this.fb.group({
    //   data: [item.data],
    //   quantidade: [item.quantidade],
    //   tratamento: [item.tratamento],
    //   valor: [item.valor],
    //   soma: [item.soma]
    // });

    // return t;


    // const ctrl = this.form.controls.tratamentos as FormArray;
    // this.ends.forEach(trat => {

    //   console.log('trat', trat.tratamentos);

    //   ctrl.push(this.fb.group({
    //     data: [trat.tratamentos.data],
    //     quantidade: [trat.tratamentos.quantidade],
    //     tratamento: [trat.tratamentos.tratamento],
    //     valor: [trat.tratamentos.valor],
    //     soma: [trat.tratamentos.soma]
    //   }));
    // });


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
