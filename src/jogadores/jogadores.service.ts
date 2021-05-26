import { Model } from 'mongoose';
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { AtualizarJogadorDTO } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
	constructor(
		@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
	) {}
	private readonly logger = new Logger(JogadoresService.name);

	async criarJogador(criaJogadorDto: CriarJogadorDTO): Promise<Jogador> {
		const { email } = criaJogadorDto;

		const jogadorEncontrado = await this.jogadorModel
			.findOne({
				email,
			})
			.exec();

		if (jogadorEncontrado) {
			throw new BadRequestException('Já possui um cadastro com esse email');
		}

		const jogador = new this.jogadorModel(criaJogadorDto);

		return await jogador.save();
	}

	async atualizarJogador(
		_id: string,
		jogadotDto: AtualizarJogadorDTO,
	): Promise<Jogador> {
		await this.consultarJogadoresPorId(_id);

		const { nome, telefoneCelular } = jogadotDto;

		const jogador = await this.jogadorModel
			.findByIdAndUpdate({ _id }, { telefoneCelular, nome })
			.exec();

		return jogador;
	}

	async consultarTodosJogadores(): Promise<Jogador[]> {
		return await this.consultar();
	}

	async consultarJogadoresPorId(_id: string): Promise<Jogador> {
		const jogadorEncontrado = await this.jogadorModel
			.findOne({
				_id,
			})
			.exec();
		if (!jogadorEncontrado) {
			throw new NotFoundException('Jogador não encontrado');
		}
		this.logger.log(`consultar: ${JSON.stringify(jogadorEncontrado)}`);
		return jogadorEncontrado;
	}

	async deletarJogador(_id: string): Promise<void> {
		await this.consultarJogadoresPorId(_id);

		await this.jogadorModel.findOneAndDelete({ _id }).exec();
	}

	private async consultar(): Promise<Jogador[]> {
		return await this.jogadorModel.find().exec();
	}
}
