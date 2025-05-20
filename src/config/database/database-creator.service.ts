import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseCreatorService {
  constructor(private readonly configService: ConfigService) {}

  async createDatabaseIfNotExists(): Promise<void> {
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<number>('DB_PORT');
    const user = this.configService.get<string>('DB_USER');
    const password = this.configService.get<string>('DB_PASS');
    const dbName = this.configService.get<string>('DB_NAME');

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`✅ Base de datos '${dbName}' verificada o creada`);
  }
}
