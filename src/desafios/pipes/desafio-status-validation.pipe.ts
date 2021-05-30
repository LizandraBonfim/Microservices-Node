import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DesafioStatus } from 'src/desafios/interfaces/desafio.interface';

export class DesafioStatusValidacaoPipe implements PipeTransform {
	readonly statusPermitidos = [
		DesafioStatus.ACEITO,
		DesafioStatus.NEGADO,
		DesafioStatus.CANCELADO,
	];

	transform(value: any) {
		const status = value.status.toUppercase();

		if (!this.ehStatusValido(status)) {
			throw new BadRequestException(
				`O valor do parametro ${status} está inválido.`,
			);
		}
		return value;
	}
	private ehStatusValido(status: any) {
		const idx = this.statusPermitidos.indexOf(status);
		return idx !== -1;
	}
}
