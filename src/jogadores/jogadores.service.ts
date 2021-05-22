import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
	private jogadores: Jogador[] = [];
	private readonly logger = new Logger(JogadoresService.name);

	async criarAtualizarJogador(criaJogadorDto: CriarJogadorDTO): Promise<void> {
		this.logger.log(`criaJogadorDto: ${criaJogadorDto}`);
		await this.criar(criaJogadorDto);
	}

	private criar(criaJogadorDto: CriarJogadorDTO): void {
		const { email, nome, telefoneCelular } = criaJogadorDto;
		const jogador: Jogador = {
			_id: uuidv4(),
			email,
			nome,
			telefoneCelular,
			ranking: 'A',
			posicaoRanking: 0,
			urlFotoJogador: '',
		};

		this.jogadores.push(jogador);
	}
}
