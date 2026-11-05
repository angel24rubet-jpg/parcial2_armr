import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecintosModule } from './recintos/recintos.module';
import { EventosCulturalesModule } from './eventos-culturales/eventos-culturales.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'usrparcial2',
      password: 'P4rc14L2-2026',
      database: 'parcial2_armr',
      entities: [__dirname + '*/**/*.entitys{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),

    RecintosModule,

    EventosCulturalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
