import { PartialType } from '@nestjs/swagger';
import { CreatePlantAdminDto } from './create-plant-admin.dto';

export class UpdatePlantAdminDto extends PartialType(CreatePlantAdminDto) { }
