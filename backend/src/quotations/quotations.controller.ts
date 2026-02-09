import { Controller, Get, Post, Body, Param, Put, UseGuards, Req, BadRequestException } from '@nestjs/common';
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
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.findOne(quotationId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateQuotationDto: any) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.update(quotationId, updateQuotationDto);
    }

    @Get(':id/pdf')
    generatePdf(@Param('id') id: string) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.generatePdf(quotationId);
    }

    // --- Approval Workflow ---

    @UseGuards(AccessTokenGuard)
    @Post(':id/submit')
    submit(@Param('id') id: string, @Req() req: Request) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.submit(quotationId, (req as any).user);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/approve')
    approve(@Param('id') id: string, @Req() req: Request, @Body('remarks') remarks: string) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.approve(quotationId, (req as any).user, remarks);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/reject')
    reject(@Param('id') id: string, @Req() req: Request, @Body('remarks') remarks: string) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.reject(quotationId, (req as any).user, remarks);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/final-approve')
    finalApprove(@Param('id') id: string, @Req() req: Request) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.finalApprove(quotationId, (req as any).user);
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id/approvals')
    getApprovalHistory(@Param('id') id: string) {
        const quotationId = parseInt(id, 10);
        if (isNaN(quotationId)) throw new BadRequestException('Invalid quotation ID');
        return this.quotationsService.getApprovalHistory(quotationId);
    }
}
