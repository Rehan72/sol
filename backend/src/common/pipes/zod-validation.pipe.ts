import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
        if (error.errors) {
            const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            console.error('--- ZOD VALIDATION FAILED ---');
            console.error('Payload:', value);
            console.error('Errors:', messages);
            throw new BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        }
      throw new BadRequestException('Validation failed');
    }
  }
}
