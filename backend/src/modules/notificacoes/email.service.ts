import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
      }
    });
    this.logger.log(`SMTP de teste criado: ${testAccount.user}`);
  }
  async onModuleDestroy() {
    this.transporter = null;
    this.logger.log('Transporter destruído');
  }

  async NovoStatusPedido(cliente: Prisma.ClienteCreateInput, status: PedidoStatus) {
    if (!this.transporter) {
      this.logger.error('Transporter não inicializado ainda');
      return;
    }
    const empresaNome = "Loja Online";
    const logoUrl = "https://c.pxhere.com/images/dc/ee/f872c1e9c6ea6d87ec04fb011214-1446677.jpg!d";
    const dataHoje = new Date().toLocaleDateString("pt-BR");

    const html = `<!DOCTYPE html>
                  <html lang="pt-BR">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
        <title>${empresaNome} • seu pedido mudou de status</title>
      </head>
      <body style="margin:0;padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F6F8;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <!-- Card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E6E8EB;">
                <!-- Header -->
                <tr>
                  <td style="padding:20px 24px;background:#0EA5E9;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle">
                          <img src="${logoUrl}" width="140" height="40" alt="${empresaNome}" style="display:block;border:0;outline:none;text-decoration:none;height:40px;width:auto;" />
                        </td>
                        <td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#EAF6FF;">
                          ${dataHoje}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td style="padding:24px 24px 8px 24px;font-family:Arial,Helvetica,sans-serif;">
                    <h1 style="margin:0;font-size:20px;line-height:28px;color:#111111;">Os seguintes produtos estão com estoque baixo</h1>
                    <p style="margin:8px 0 0 0;font-size:14px;line-height:20px;color:#4B5563;">
                      Revise e reponha para evitar rupturas. Abaixo a lista atual:
                    </p>
                  </td>
                </tr>

                <!-- Products Table -->
                <tr>
                  <td style="padding:8px 16px 16px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background:#FFFFFF;border:1px solid #ECECEC;border-radius:8px;overflow:hidden;">
                      <tr>
                        <th align="left" style="padding:12px 16px;border-bottom:1px solid #ECECEC;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.02em;text-transform:uppercase;color:#6B7280;background:#F9FAFB;">
                          Produto
                        </th>
                        <th align="right" style="padding:12px 16px;border-bottom:1px solid #ECECEC;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.02em;text-transform:uppercase;color:#6B7280;background:#F9FAFB;">
                          Quantidade
                        </th>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td align="center" style="padding:4px 24px 24px 24px;">
                    <!-- Botão em Tabela para compatibilidade -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6B7280;background:#FAFAFA;">
                    <p style="margin:0;">
                      Você está recebendo este alerta porque faz parte da lista de notificações de estoque do <strong>${empresaNome}</strong>.
                    </p>
                    <p style="margin:8px 0 0 0;">
                      © ${new Date().getFullYear()} ${empresaNome}. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
              </table>
              <!-- /Card -->
            </td>
          </tr>
        </table>
        <!-- /Container -->
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