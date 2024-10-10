import { NotFoundException } from '@nestjs/common';

export function validateExistence(
  entity: any,
  entityName: string,
  entityId: string | number,
): void {
  if (!entity) {
    throw new NotFoundException(`${entityName} with ID ${entityId} not found`);
  }
}
