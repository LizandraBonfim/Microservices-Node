import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
	private jogadores: Jogador[] = [];
	private readonly logger = new Logger(JogadoresService.name);

	async criarAtualizarJogador(criaJogadorDto: CriarJogadorDTO): Promise<void> {
		const { email } = criaJogadorDto;
		const jogadorEncontrado = await this.jogadores.find(
			(jogador) => jogador.email === email,
		);

		if (jogadorEncontrado) {
			this.atualizar(jogadorEncontrado, criaJogadorDto);
		} else {
			this.logger.log(`criaJogadorDto: ${JSON.stringify(criaJogadorDto)}`);
			this.criar(criaJogadorDto);
		}
	}

	async consultarTodosJogadores(): Promise<Jogador[]> {
		this.logger.log(`consultar: ${JSON.stringify(this.jogadores)}`);
		return await this.consultar();
	}

	async consultarJogadoresPorEmail(email: string): Promise<Jogador> {
		this.logger.log(`consultar: ${JSON.stringify(this.jogadores)}`);
		const jogadorEncontrado = this.jogadores.find(
			(jogador) => jogador.email === email,
		);

		if (!jogadorEncontrado) {
			throw new NotFoundException('Jogador com email não cadastrado');
		}
		return jogadorEncontrado;
	}

	async deletarJogador(email: string): Promise<void> {
		const jogadorEncontrado = this.jogadores.find(
			(jogador) => jogador.email === email,
		);

		if (!jogadorEncontrado) {
			throw new NotFoundException('Jogador com email não cadastrado');
		}

		this.jogadores = this.jogadores.filter(
			(jogador) => jogador.email !== email,
		);
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

	private consultar(): Jogador[] {
		return this.jogadores;
	}

	private atualizar(
		jogadorEncontrado: Jogador,
		criarJogadorDto: CriarJogadorDTO,
	): void {
		const { nome } = criarJogadorDto;
		jogadorEncontrado.nome = nome;
	}
}
