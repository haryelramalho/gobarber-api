/**
 * Substituição de Tipos (OVER RIDE)
 * Adicionando uma informação nova ao Request, a biblioteca do Request
 * Informando que agora temos um atributo usuário que tem um id do tipo string
 * Não sobrescreve os tipos definidos no Request, apenas adiciona
 */

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
