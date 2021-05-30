import { IsOptional } from 'class-validator';
import { DesafioStatus } from '../interfaces/desafio.interface';

export class AtualizarDesafioDTO {
	@IsOptional()
	//@IsDate()
	dataHoraDesafio: Date;

	@IsOptional()
	status: DesafioStatus;
}
