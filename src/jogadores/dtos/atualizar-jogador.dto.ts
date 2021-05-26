import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class AtualizarJogadorDTO {
	@IsNotEmpty()
	readonly telefoneCelular: string;

	@IsNotEmpty()
	readonly nome: string;
}
