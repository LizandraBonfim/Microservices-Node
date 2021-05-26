import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria-dto';
import { CriarCategoriaDTO } from './dtos/criar-categoria-dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
	constructor(
		@InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
		private readonly jogadoresService: JogadoresService,
	) {}
	async criar(categoriaDto: CriarCategoriaDTO) {
		const { categoria } = categoriaDto;

		const categoriaEncontrada = await this.categoriaModel
			.findOne({ categoria })
			.exec();

		if (categoriaEncontrada) {
			throw new BadRequestException(`Categoria ${categoria} já cadastrada.`);
		}

		const categoriaCriada = new this.categoriaModel(categoriaDto);
		return await categoriaCriada.save();
	}

	async consultarTodasAsCategorias(): Promise<Categoria[]> {
		return await this.categoriaModel.find().populate('jogadores').exec();
	}

	async consultarCategoriaPorId(_id: string): Promise<Categoria> {
		const categoriaEncontrada = await this.categoriaModel
			.findById({ _id })
			.exec();

		if (!categoriaEncontrada) {
			throw new BadRequestException(`Categoria não encontrada.`);
		}
		return categoriaEncontrada;
	}

	async atualizarCategoriaPeloId(
		_id: string,
		categoriaDto: AtualizarCategoriaDTO,
	): Promise<Categoria> {
		await this.consultarCategoriaPorId(_id);

		const categoriaAtualizada = await this.categoriaModel
			.findByIdAndUpdate({ _id }, { $set: categoriaDto })
			.exec();

		return categoriaAtualizada;
	}

	async atribuirCategoriaAoJogador(params: string[]): Promise<void> {
		const idCategoria = params['idCategoria'];
		const idJogador = params['idJogador'];

		const categoriaEncontrada = await this.consultarCategoriaPorId(idCategoria);

		if (categoriaEncontrada.jogadores.includes(idJogador)) {
			throw new BadRequestException(
				'Esse jogador já está cadastrado nessa categoria',
			);
		}

		await this.jogadoresService.consultarJogadoresPorId(idJogador);

		await this.categoriaModel
			.findByIdAndUpdate(
				{ _id: idCategoria },
				{ $addToSet: { jogadores: idJogador } },
			)
			.exec();
	}
}
