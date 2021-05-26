import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria-dto';
import { CriarCategoriaDTO } from './dtos/criar-categoria-dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
	constructor(private readonly categoriaService: CategoriasService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async criarCategoria(
		@Body() criarCategoriaDto: CriarCategoriaDTO,
	): Promise<Categoria> {
		return await this.categoriaService.criar(criarCategoriaDto);
	}

	@Get()
	async consultarCategorias(): Promise<Categoria[]> {
		return await this.categoriaService.consultarTodasAsCategorias();
	}

	@Get('/:_id')
	async consultarCategoriaPorId(@Param('_id') _id: string): Promise<Categoria> {
		return await this.categoriaService.consultarCategoriaPorId(_id);
	}

	@Put('/:_id')
	@UsePipes(ValidationPipe)
	async atualizarCategoria(
		@Param('_id') _id: string,
		@Body() atualizarCategoriaDto: AtualizarCategoriaDTO,
	): Promise<Categoria> {
		const categoria = await this.categoriaService.atualizarCategoriaPeloId(
			_id,
			atualizarCategoriaDto,
		);

		return categoria;
	}

	@Post('/:idCategoria/jogadores/:idJogador')
	async atribuirCategoriaAoJogador(@Param() params: string[]): Promise<void> {
		return await this.categoriaService.atribuirCategoriaAoJogador(params);
	}
}
