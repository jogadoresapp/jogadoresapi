import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseConfig = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
});
