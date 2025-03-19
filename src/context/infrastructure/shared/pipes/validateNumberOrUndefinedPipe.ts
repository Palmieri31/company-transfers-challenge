import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export default class ValidateNumberOrUndefinedPipe
  implements PipeTransform<any, number>
{
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`${metadata.data} must be a valid number`);
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        `${metadata.data} must be a positive number`,
      );
    }

    return parsedValue;
  }
}
