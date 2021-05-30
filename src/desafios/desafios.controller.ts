import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio-dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
	constructor(private readonly desafioService: DesafiosService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async criarDesafio(
		@Body() criarDesafioDto: CriarDesafioDto,
	): Promise<Desafio> {
		console.log({ criarDesafioDto });
		return await this.desafioService.criarDesafio(criarDesafioDto);
	}

	@Get()
	async consultarDesafios(): Promise<Desafio[]> {
		return await this.desafioService.consultarDesafios();
	}

	@Get('/:_id')
	async consultarDesafioDoJogador(
		@Param('_id', ValidacaoParametrosPipe) _id: string,
	): Promise<Desafio | Desafio[]> {
		return await this.desafioService.consultarDesafioDoJogador(_id);
	}

	@Put('/:_id')
	async atualizarDesafioPartida(
		@Body() atualizarDesafioDto: AtualizarDesafioDTO,
		@Param('_id', ValidacaoParametrosPipe) _id: string,
	) {
		console.log({ atualizarDesafioDto });
		await this.desafioService.atualizarDesafioPartida(_id, atualizarDesafioDto);
		return 'Jogador atualizado com sucesso!';
	}

	@Delete('/:_id')
	async deletarDesafio(@Param('_id', ValidacaoParametrosPipe) _id: string) {
		await this.desafioService.deletarDesafio(_id);

		return 'Jogador deletado com sucesso!';
	}
}
