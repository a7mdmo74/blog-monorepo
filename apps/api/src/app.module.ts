import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/index.js';
import { AuthModule } from './auth/auth.module.js';
import { PostModule } from './post/post.module.js';
import { CommentModule } from './comment/comment.module.js';
import { UploadModule } from './upload/upload.module.js';
import { UserModule } from './user/user.module.js';
import { CategoryModule } from './category/category.module.js';
import { TagModule } from './tag/tag.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      csrfPrevention: false,
      bodyParserConfig: { limit: '10mb' },
      cors: {
        origin: true,
        credentials: false,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
    }),
    PrismaModule,
    AuthModule,
    PostModule,
    CommentModule,
    UploadModule,
    UserModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
