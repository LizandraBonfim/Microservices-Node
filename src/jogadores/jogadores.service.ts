import { Model } from 'mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
	constructor(
		@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
	) {}
	private readonly logger = new Logger(JogadoresService.name);

	async criarAtualizarJogador(criaJogadorDto: CriarJogadorDTO): Promise<void> {
		const { email } = criaJogadorDto;

		const jogadorEncontrado = await this.jogadorModel
			.findOne({
				email,
			})
			.exec();

		if (jogadorEncontrado) {
			await this.atualizar(criaJogadorDto);
		} else {
			this.logger.log(`criaJogadorDto: ${JSON.stringify(criaJogadorDto)}`);
			await this.criar(criaJogadorDto);
		}
	}

	async consultarTodosJogadores(): Promise<Jogador[]> {
		return await this.consultar();
	}

	async consultarJogadoresPorEmail(email: string): Promise<Jogador> {
		const jogadorEncontrado = await this.jogadorModel
			.findOne({
				email,
			})
			.exec();
		if (!jogadorEncontrado) {
			throw new NotFoundException('Jogador com email não cadastrado');
		}
		this.logger.log(`consultar: ${JSON.stringify(jogadorEncontrado)}`);
		return jogadorEncontrado;
	}

	async deletarJogador(email: string): Promise<void> {
		await this.jogadorModel.findOneAndDelete({ email }).exec();
	}

	private async criar(criaJogadorDto: CriarJogadorDTO): Promise<Jogador> {
		const jogadorCriado = new this.jogadorModel(criaJogadorDto);

		return await jogadorCriado.save();
	}

	private async consultar(): Promise<Jogador[]> {
		return await this.jogadorModel.find().exec();
	}

	private async atualizar(criarJogadorDto: CriarJogadorDTO): Promise<Jogador> {
		const { nome, email } = criarJogadorDto;

		return await this.jogadorModel.findOneAndUpdate({ email }, { nome }).exec();
	}
}
