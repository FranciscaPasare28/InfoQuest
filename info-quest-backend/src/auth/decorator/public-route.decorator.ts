import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE = 'PublicRoute';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE, true);
