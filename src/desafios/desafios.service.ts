import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio-dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio, DesafioStatus } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
	constructor(
		@InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
		private readonly jogadoresService: JogadoresService,
		private readonly categoriasService: CategoriasService,
	) {}

	async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
		const { solicitante, jogadores } = criarDesafioDto;

		const primeiroJogador = jogadores[0]._id;
		const segundoJogador = jogadores[1]._id;

		await this.jogadoresService.consultarJogadoresPorId(String(solicitante));
		await this.jogadoresService.consultarJogadoresPorId(
			String(primeiroJogador),
		);
		await this.jogadoresService.consultarJogadoresPorId(String(segundoJogador));

		const categoriaDoJogador =
			await this.categoriasService.consultarCategoriaDoJogador(
				String(solicitante),
			);

		const desafio = new this.desafioModel(criarDesafioDto);

		desafio.categoria = categoriaDoJogador.categoria;
		desafio.status = DesafioStatus.PENDENTE;
		desafio.dataHoraDesafio = new Date();

		const novoDesafio = await desafio.save();

		return novoDesafio;
	}

	async consultarDesafios(): Promise<Desafio[]> {
		const desafios = await this.desafioModel
			.find()
			.populate('solicitante')
			.populate('jogadores')
			.populate('partida')
			.exec();

		if (!desafios) {
			throw new BadRequestException('Não possui desafio disponivel');
		}

		return desafios;
	}

	async consultarDesafioPorId(_id: string): Promise<Desafio> {
		const desafio = await this.desafioModel.findOne({ _id });

		if (!desafio) {
			throw new BadRequestException('Não possui desafio disponivel');
		}

		return desafio;
	}

	async consultarDesafioDoJogador(_id: any): Promise<Desafio | Desafio[]> {
		await this.jogadoresService.consultarJogadoresPorId(_id);

		const desafio = await this.desafioModel
			.find()
			.where('jogadores')
			.in(_id)
			.exec();

		if (!desafio) {
			throw new BadRequestException('Não possui desafio disponivel');
		}

		return desafio;
	}

	async atualizarDesafioPartida(
		_id: string,
		atualizarDesafioDto: AtualizarDesafioDTO,
	): Promise<void> {
		console.log({ atualizarDesafioDto });

		const { dataHoraDesafio, status } = atualizarDesafioDto;
		await this.consultarDesafioPorId(_id);
		await this.desafioModel
			.findByIdAndUpdate({ _id }, { dataHoraDesafio, status })
			.exec();
	}

	async deletarDesafio(_id: string): Promise<void> {
		await this.desafioModel.findOneAndDelete({ _id }).exec();
	}
}
