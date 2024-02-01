import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './database/entities/tokens.entity';
import { UsersEntity } from './database/entities/users.entity';
import { TokensModule } from './tokens/tokens.module';
import { PostsModule } from './posts/posts.module';
import { PostsEntity } from './database/entities/posts.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      logging: true,
      replication: {
        master: {
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT_OUTSIDE),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
        },
        slaves: [
          {
            host: process.env.POSTGRES_HOST2,
            port: Number(process.env.POSTGRES_PORT_OUTSIDE2),
            username: process.env.POSTGRES_USER2,
            password: process.env.POSTGRES_PASSWORD2,
            database: process.env.POSTGRES_DB2,
          },
        ],
      },
      entities: [UsersEntity, TokensEntity, PostsEntity],
      synchronize: false,
    }),
    TokensModule,
    PostsModule,
  ],
})
export class AppModule {}
