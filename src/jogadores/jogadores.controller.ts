import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
	@Post()
	async criarAtualizarJogador(@Body() criaJogadorDto: CriarJogadorDTO) {
		const { email, nome, telefoneCelular } = criaJogadorDto;
		return JSON.stringify({
			email,
			nome,
			telefoneCelular,
		});
	}
}
