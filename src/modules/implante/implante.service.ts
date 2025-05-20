import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Implante } from 'src/config/entities/implantes.entity'; 
import { RegisterImplanteDto } from './createdto'; 
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

@Injectable()
export class ImplanteService {
      constructor(
    @InjectRepository(Implante)
    private readonly implanteRepo: Repository<Implante>,
  ) {}

async registerImplante(dto: RegisterImplanteDto): Promise<{ implante: Implante; qrBase64: string }> {
  const codigoQR = uuidv4();

  const implante = this.implanteRepo.create({
    ...dto,
    CodigoQR: codigoQR,
  });

  const saved = await this.implanteRepo.save(implante);

  const urlFrontend = `http://localhost:4200/implantes/${codigoQR}`;
  const qrBase64 = await QRCode.toDataURL(urlFrontend);

  console.log('🟢 UUID generado:', codigoQR);
  console.log('🌐 URL QR:', urlFrontend);
  console.log('🖼️ Base64 QR (truncado):', qrBase64.substring(0, 80) + '...');

  return { implante: saved, qrBase64 };
}



    async findByCodigo(CodigoQR: string): Promise<Implante | null> {
    return await this.implanteRepo.findOneBy({ CodigoQR });
  }
}

