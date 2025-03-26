import { MessageResponse, MessageEnvelope, buildMessageResponse } from './app-messaging.js';
import { CreateLocalUserAccountResult } from '@hai/core-service';

export type LocalUserAccountCreateMessage = {
  type: 'LocalUserAccount.Create';
} & MessageEnvelope<undefined>;

export type LocalUserAccountCreateResponseMessage = {
  type: 'LocalUserAccount.Create.Response';
} & MessageResponse<LocalUserAccountCreateResponsePayload>;
export type LocalUserAccountCreateResponsePayload = {
  id: string;
};

export type LocalUserAccountDeleteMessage = {
  type: 'LocalUserAccount.Delete';
} & MessageEnvelope<undefined>;

export type LocalUserAccountDeleteResponseMessage = {
  type: 'LocalUserAccount.Delete.Response';
} & MessageResponse<undefined>;

export type LocalUserAccountGetMessage = {
  type: 'LocalUserAccount.Get';
} & MessageEnvelope<undefined>;

export type LocalUserAccountGetResponseMessage = {
  type: 'LocalUserAccount.Get.Response';
} & MessageResponse<LocalUserAccountGetResponsePayload>;
export type LocalUserAccountGetResponsePayload = {
  id: string;
};

export function asLocalUserAccountCreateResponseMessage(
  res: CreateLocalUserAccountResult,
  correlationId: string,
): LocalUserAccountCreateResponseMessage {
  if (res.success) {
    return buildMessageResponse(
      'LocalUserAccount.Create.Response',
      'success',
      {
        payload: res.data,
        correlationId
      },
    )
  } else {
    return buildMessageResponse('LocalUserAccount.Create.Response', 'error', {
      payload: {
        title: 'Error',
        detail:
          res.error.details || 'Something went wrong creating the user account.',
      },
      correlationId,
    });
  }
}
