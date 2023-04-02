import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApproveReport, CreateReportDto, ReportDto } from './dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards';
import { CurrentUser } from '@/users/decorators';
import { User } from '../users/user.entity';
import { Serialize } from '@/interceptors';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
  @Patch('/:id')
  @UseGuards(AuthGuard)
  approveReport(@Body() body: ApproveReport, @Param('id') id: string) {
    return this.reportsService.changeApproval(Number(id), body.approved);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteReport(@Param('id') id) {
    return this.reportsService.delete(id);
  }
}
