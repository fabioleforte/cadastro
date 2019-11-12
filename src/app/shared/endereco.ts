import { Tratamento } from './tratamento';
import { Pagamento } from './pagamento';
export class Endereco {
  id: number;
  nome = '';
  endereco = '';
  numero: number;
  complemento = '';
  bairro = '';
  cep: number;
  cidade = '';
  estado = '';
  telefoneRes: number;
  telefoneCel: number;
  email = '';
  tratamentos?: Tratamento[] = [];
  pagamentos?: Pagamento[] = [];
}
