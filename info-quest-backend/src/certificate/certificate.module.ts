// src/leave-request/leave-request.module.ts
import { Module } from '@nestjs/common';
import { CertificateController } from "./certificate.controller";
import { CertificateService } from "./certificate.service";


@Module({
  imports: [],
  controllers: [CertificateController], // Include the controller
  providers: [CertificateService], // Include the service
})
export class CertificateModule {}
