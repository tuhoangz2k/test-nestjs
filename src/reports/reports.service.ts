import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}
  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportDto);
    report.user = user;
    return this.reportsRepository.save(report);
  }
  delete(id: number) {
    return this.reportsRepository.delete(id);
  }
  async changeApproval(id: number, approved: boolean) {
    console.log('service', id);
    const report = await this.reportsRepository.findOne({ where: { id } });
    console.log(report);
    if (!report) throw new NotFoundException('report not found');
    console.log('hello');
    report.approved = approved;
    return this.reportsRepository.save(report);
  }
}
