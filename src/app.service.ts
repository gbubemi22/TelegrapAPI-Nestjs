import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { CONSTANTS } from './telegram/constant';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private telegramService: TelegramService) {}

  public async onModuleInit(): Promise<void> {
    await this.telegramService.auth(CONSTANTS.phoneNumber);

    this.telegramService.telegramMessages$.subscribe((message) => {
      console.log('Message of Telegram', message);
    });
  }
}
