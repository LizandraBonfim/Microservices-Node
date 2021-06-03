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
import { AtribuirPartidaDTO } from './dtos/atribuir-partida-dto';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio-dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';

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

	@Post('/:_id')
	async atribuirPartida(
		@Body(ValidationPipe) atribuirPartidaDTO: AtribuirPartidaDTO,
		@Param('_id') _id: string,
	) {
		await this.desafioService.atribuirPartida(_id, atribuirPartidaDTO);
	}

	@Delete('/:_id')
	async deletarDesafio(@Param('_id', ValidacaoParametrosPipe) _id: string) {
		await this.desafioService.deletarDesafio(_id);

		return 'Jogador deletado com sucesso!';
	}
}
