import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListaService } from './../lista/lista.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Endereco } from './../shared/endereco';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      // console.log(id);
      const cadastro$ = this.listaService.loadById(id);

      // cadastro$.subscribe()

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
      cidade: [''],
      estado: ['']

    });
  }

  salvar() {
    console.log(this.form.value);

    this.listaService.create(this.form.value);

  }



}
