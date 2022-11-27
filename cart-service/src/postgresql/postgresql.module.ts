import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from 'src/cart/entities/carts';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: +process.env.PGPORT,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [Carts],
      logging: true,

    }),
    TypeOrmModule.forFeature([Carts]),
  ],
  exports: [TypeOrmModule],
})
export class PostgreSQLModule {};