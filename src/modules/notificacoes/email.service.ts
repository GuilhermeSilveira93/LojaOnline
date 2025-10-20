import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PedidoStatus, Prisma } from '@prisma/client';
import nodemailer, { Transporter } from 'nodemailer';
import { EnvService } from 'src/common/Env/env.service';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly envService: EnvService) { }
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  async onModuleInit() {
    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.envService.get('EMAIL_FROM'),
        pass: this.envService.get('EMAIL_PASS'),
      },
    });
    this.logger.log(`SMTP de teste criado: ${testAccount.user}`);
  }
  async onModuleDestroy() {
    this.transporter = null;
    this.logger.log('Transporter destruído');
  }

  async NovoStatusPedido(
    cliente: Prisma.ClienteCreateInput,
    status: PedidoStatus,
    idPedido: string,
  ) {
    if (!this.transporter) {
      this.logger.error('Transporter não inicializado ainda');
      return;
    }
    const empresaNome = 'Loja Online';
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    const html = `<!DOCTYPE html>
                  <html lang="pt-BR">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
    <title>Atualização do pedido</title>
    <style>
      /* Clients ignore <style> often; inline styles used below.
         This block is only for a couple of safe resets in modern clients */
      body { margin:0; padding:0; background:#F5F7FA; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#F5F7FA;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#F5F7FA;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background:#FFFFFF; border-radius:12px; overflow:hidden; border:1px solid #E9EDF3;">
            <tr>
              <td align="left" style="padding:16px 20px; background:#0EA5E9;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left" valign="middle">
                      <span style="display:inline-block; font-family:Arial,Helvetica,sans-serif; font-size:16px; font-weight:bold; color:#FFFFFF; letter-spacing:.2px;">
                        ${empresaNome}
                      </span>
                    </td>
                    <td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#EAF6FF;">
                      ${dataHoje}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px; font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0; font-size:20px; line-height:28px; color:#111827;">
                  Olá ${cliente.nome}, seu pedido mudou de status
                </h1>
                <p style="margin:8px 0 0 0; font-size:14px; line-height:20px; color:#4B5563;">
                  O pedido <strong>#${idPedido}</strong> agora está:
                </p>
                <div style="margin-top:12px;">
                  <span style="display:inline-block; padding:8px 12px; border-radius:999px; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:bold; letter-spacing:.3px; background:#DCFCE7; color:#166534; border:1px solid #BBF7D0;">
                    {{status}}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 0 24px; font-family:Arial,Helvetica,sans-serif;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #EEF2F7; border-radius:8px; overflow:hidden;">
                  <tr>
                    <td style="padding:12px 16px; font-size:13px; color:#111827; border-bottom:1px solid #EEF2F7;">
                      <strong>Resumo do pedido</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-size:13px; color:#374151;">
                      Nº do pedido: <strong>#${idPedido}</strong><br/>
                      Cliente: <strong>${cliente.nome}</strong><br/>
                      Última atualização: <strong>${cliente.updatedAt?.toLocaleString('pt-BR')}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 20px 24px; background:#F9FAFB; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; color:#6B7280;">
                <p style="margin:0;">
                  Esta é uma notificação automática do <strong>Loja Online</strong>.
                </p>
                <p style="margin:6px 0 0 0;">
                  © 2025 Loja Online. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    return this.transporter.sendMail({
      from: '"Loja Online" <guilherme.padovani93@gmail.com>',
      to: cliente.email,
      subject: `Pedido - ${status}`,
      html,
    });
  }
}
