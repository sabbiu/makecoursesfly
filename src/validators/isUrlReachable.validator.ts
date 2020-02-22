import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as isReachable from 'is-reachable';

@ValidatorConstraint({ name: 'isUrlReachable', async: true })
export class IsURLReachable implements ValidatorConstraintInterface {
  async validate(url: string) {
    return await isReachable(url, { timeout: 10000 });
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Url '${validationArguments.value}' is not reachable`;
  }
}
