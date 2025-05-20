import { Controller,Post,Body,Get,Param,NotFoundException } from '@nestjs/common';
import { ImplanteService } from './implante.service';
import { Implante } from 'src/config/entities/implantes.entity';
import { RegisterImplanteDto } from './createdto';

@Controller('implante')
export class ImplanteController {

  constructor(private readonly implantesService: ImplanteService) {}

@Post('register')
async registerImplante(
  @Body() dto: RegisterImplanteDto,
): Promise<{ implante: Implante; qrBase64: string }> {
  return await this.implantesService.registerImplante(dto);
}

// implantes.controller.ts

@Get(':codigoQR')
async getImplanteByCodigo(@Param('codigoQR') codigoQR: string): Promise<Implante | null> {
  return this.implantesService.findByCodigo(codigoQR);
}


}
