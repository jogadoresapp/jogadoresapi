import { NotFoundException } from '@nestjs/common';

export function validateExistence(
  entity: any,
  entityName: any,
  entityId: string | number,
): void {
  if (!entity) {
    throw new NotFoundException(
      `${entityName} com ID ${entityId} não encontrado`,
    );
  }
}
