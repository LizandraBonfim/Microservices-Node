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
import { AtualizarJogadorDTO } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
@Controller('api/v1/jogadores')
export class JogadoresController {
	constructor(private readonly jogadoresService: JogadoresService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async criarJogador(
		@Body() criaJogadorDto: CriarJogadorDTO,
	): Promise<Jogador> {
		return await this.jogadoresService.criarJogador(criaJogadorDto);
	}

	@Put('/:_id')
	@UsePipes(ValidationPipe)
	async atualizarJogador(
		@Body() atualizarJogadorDto: AtualizarJogadorDTO,
		@Param('_id', ValidacaoParametrosPipe) _id: string,
	): Promise<Jogador> {
		const jogador = await this.jogadoresService.atualizarJogador(
			_id,
			atualizarJogadorDto,
		);

		return jogador;
	}

	@Get('/:_id')
	async consultarJogadorPorEmail(@Param('_id') _id: string): Promise<Jogador> {
		return await this.jogadoresService.consultarJogadoresPorId(_id);
	}

	@Get()
	async consultarJogadores(): Promise<Jogador[]> {
		return this.jogadoresService.consultarTodosJogadores();
	}

	@Delete('/:_id')
	async deletarJogador(
		@Param('_id', ValidacaoParametrosPipe) _id: string,
	) {
		await this.jogadoresService.deletarJogador(_id);
		return JSON.stringify('Jogador deletado com sucesso!');
	}
}
