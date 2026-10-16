import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.pool = new Pool({
      host: this.config.get<string>('DB_HOST'),
      port: parseInt(this.config.get<string>('DB_PORT') ?? '5432', 10),
      user: this.config.get<string>('DB_USER'),
      password: this.config.get<string>('DB_PASSWORD'),
      database: this.config.get<string>('DB_NAME'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      this.logger.error('Erro no pool de conexões', err);
    });

    this.logger.log('Pool de conexões PostgreSQL iniciado');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log(' Pool de conexões fechado');
  }

  async query<T extends QueryResultRow = any>(
    sql: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    const result = await this.pool.query<T>(sql, params);
    const duration = Date.now() - start;
    this.logger.debug(`Query em ${duration}ms: ${sql.substring(0, 80)}...`);
    return result;
  }

  async getClient() {
    return this.pool.connect();
  }
}