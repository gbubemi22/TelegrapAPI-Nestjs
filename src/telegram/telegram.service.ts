import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as MTProto from '@mtproto/core';
import * as prompt from 'prompt';
import { Subject } from 'rxjs';
import { Message } from './message';
import { CONSTANTS } from './constant';

@Injectable()
export class TelegramService {
  private readonly api_id = CONSTANTS.api_id;
  private readonly api_hash = CONSTANTS.api_hash;
  public mtProto: any;
  public logger = new Logger('TelegramService');
  public telegramMessages$ = new Subject<Message>();

  constructor() {
    this.mtProto = new MTProto({
      api_id: this.api_id,
      api_hash: this.api_hash,
      test: false,

      storageOptions: {
        path: path.resolve(__dirname, './1.json'),
      },
    });
    this.subScribeToUpdates();
  }

  public subScribeToUpdates() {
    this.mtProto.updates.on('updates', (updateInfo) => {
      updateInfo.forEach((update: any) => {
        this.telegramMessages$.next(update?.message as Message);
      });
    });
  }

  public sendCode(mobile: string): Promise<any> {
    return this.mtProto.call('auth.sendCode', {
      phone_number: mobile,
      settings: {
        _: 'codeSettings',
      },
    });
  }

  public async signIn({ code, mobile, phone_code_hash }) {
    try {
      return await this.mtProto.call('auth.signIn', {
        phone_code: code,
        phone_number: mobile,
        phone_code_hash: phone_code_hash,
      });
    } catch (error) {
      this.logger.log(error);
      if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
        return;
      }
    }
  }

  public async auth(mobile: string): Promise<void> {
    prompt.start();

    try {
      this.logger.log('Calling getHistory...');
      await this.getHistory('slimbewo22');
      this.logger.log('getHistory completed.');
    } catch (error) {
      this.logger.error('Error in getHistory:', error);

      this.logger.log('Calling sendCode...');
      const { phone_code_hash } = await this.sendCode(mobile);
      this.logger.log('sendCode completed.');

      this.logger.log('Calling prompt.get...');
      const { code } = await prompt.get(['code']);
      this.logger.log('prompt.get completed.');

      this.logger.log('Calling signIn...');
      await this.signIn({ code, mobile, phone_code_hash });
      this.logger.log('signIn completed.');
    }
  }

  public async getHistory(username: string): Promise<Message[]> {
    this.logger.log(`Fetch history messages of : ${username}`);

    try {
      const resloveGroup = await this.mtProto.call('contacts.resolveUsername', {
        username: username.replace('@', ''),
      });

      const { access_hash, id } = resloveGroup.chats[0];

      const limit = 10;

      const response = await this.mtProto.call('messages.getHistory', {
        peer: {
          _: 'inputPeerChannel', // Typo corrected from 'imputpeerChannel'
          channel_id: id,
          access_hash,
        },
        max_id: 0,
        offset: 0,
        limit,
      });

      return response.messages;
    } catch (error) {
      this.logger.error('Error in getHistory:', error);
      throw error; // Re-throw the error to be caught in the calling code
    }
  }
}
