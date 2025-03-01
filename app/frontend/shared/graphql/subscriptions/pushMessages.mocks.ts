import * as Types from '#shared/graphql/types.ts';

import * as Mocks from '#tests/graphql/builders/mocks.ts'
import * as Operations from './pushMessages.api.ts'
import * as ErrorTypes from '#shared/types/error.ts'

export function getPushMessagesSubscriptionHandler() {
  return Mocks.getGraphQLSubscriptionHandler<Types.PushMessagesSubscription>(Operations.PushMessagesDocument)
}
