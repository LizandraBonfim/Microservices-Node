import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
@Module({
	imports: [
		MongooseModule.forRoot(
			'mongodb+srv://admin:UFOirMCwOr5zGlKL@cluster0.63xni.mongodb.net/smartranking?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			},
		),
		JogadoresModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
