import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { Request } from 'express';
import { QuotationsService } from './quotations.service';

@Controller('quotations')
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    @Post()
    create(@Body() createQuotationDto: any) {
        return this.quotationsService.create(createQuotationDto);
    }

    @Get()
    findAll() {
        return this.quotationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quotationsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateQuotationDto: any) {
        return this.quotationsService.update(+id, updateQuotationDto);
    }

    @Get(':id/pdf')
    generatePdf(@Param('id') id: string) {
        return this.quotationsService.generatePdf(+id);
    }

    // --- Approval Workflow ---

    @UseGuards(AccessTokenGuard)
    @Post(':id/submit')
    submit(@Param('id') id: string, @Req() req: Request) {
        return this.quotationsService.submit(+id, (req as any).user);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/approve')
    approve(@Param('id') id: string, @Req() req: Request, @Body('remarks') remarks: string) {
        return this.quotationsService.approve(+id, (req as any).user, remarks);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/reject')
    reject(@Param('id') id: string, @Req() req: Request, @Body('remarks') remarks: string) {
        return this.quotationsService.reject(+id, (req as any).user, remarks);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/final-approve')
    finalApprove(@Param('id') id: string, @Req() req: Request) {
        return this.quotationsService.finalApprove(+id, (req as any).user);
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id/approvals')
    getApprovalHistory(@Param('id') id: string) {
        return this.quotationsService.getApprovalHistory(+id);
    }
}
