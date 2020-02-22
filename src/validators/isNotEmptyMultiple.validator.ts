import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotEmptyMultiple(
  property: string[],
  validationOptions?: ValidationOptions
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: property,
      options: validationOptions,
      validator: {
        validate(_, args: ValidationArguments) {
          let atLeastOne = false;
          args.constraints.forEach((key: string) => {
            if (args.object[key]) {
              atLeastOne = atLeastOne || args.object[key].length;
            }
          });

          return atLeastOne;
        },
      },
    });
  };
}
