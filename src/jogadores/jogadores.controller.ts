import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
	constructor(private readonly jogadoresService: JogadoresService) {}

	@Post()
	async criarAtualizarJogador(@Body() criaJogadorDto: CriarJogadorDTO) {
		const { email, nome, telefoneCelular } = criaJogadorDto;
		await this.jogadoresService.criarAtualizarJogador(criaJogadorDto);
		return JSON.stringify({
			email,
			nome,
			telefoneCelular,
		});
	}

	@Get()
	async consultarJogadores(
		@Query('email') email: string,
	): Promise<Jogador[] | Jogador> {
		if (email) {
			return await this.jogadoresService.consultarJogadoresPorEmail(email);
		}
		return this.jogadoresService.consultarTodosJogadores();
	}

	@Delete()
	async deletarJogador(@Query('email') email: string) {

        await this.jogadoresService.deletarJogador(email)
		return JSON.stringify('Jogador deletado com sucesso!');
	}
}
