import { Controller, Get, Post, Body, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParceirosService } from './parceiros.service.js';
import { CreateParceiroDto } from './dto/create-parceiro.dto.js';
import { UpdateParceiroDto } from './dto/update-parceiro.dto.js';
import { LoginParceiroDto } from './dto/login-parceiro.dto.js';

@ApiTags('Parceiros')
@Controller('parceiros')
export class ParceirosController {
  constructor(private readonly parceirosService: ParceirosService) {}

  @Post()
  @ApiOperation({ summary: 'Registar um novo parceiro' })
  criar(@Body() dto: CreateParceiroDto) {
    return this.parceirosService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar parceiros aprovados' })
  listarAprovados() {
    return this.parceirosService.listarAprovados();
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar parceiros pendentes (Admin)' })
  listarPendentes() {
    return this.parceirosService.listarPendentes();
  }

  // Usamos ParseUUIDPipe para garantir que o ID enviado é um UUID válido
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um parceiro por ID' })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.parceirosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um parceiro' })
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateParceiroDto) {
    return this.parceirosService.atualizar(id, dto);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ summary: 'Aprovar um parceiro' })
  aprovar(@Param('id', ParseUUIDPipe) id: string) {
    return this.parceirosService.aprovar(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do parceiro' })
  login(@Body() dto: LoginParceiroDto) {
    return this.parceirosService.login(dto);
  }
}