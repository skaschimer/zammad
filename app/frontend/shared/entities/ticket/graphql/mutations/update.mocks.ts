import * as Types from '#shared/graphql/types.ts';

import * as Mocks from '#tests/graphql/builders/mocks.ts'
import * as Operations from './update.api.ts'
import * as ErrorTypes from '#shared/types/error.ts'

export function mockTicketUpdateMutation(defaults: Mocks.MockDefaultsValue<Types.TicketUpdateMutation, Types.TicketUpdateMutationVariables>) {
  return Mocks.mockGraphQLResult(Operations.TicketUpdateDocument, defaults)
}

export function waitForTicketUpdateMutationCalls() {
  return Mocks.waitForGraphQLMockCalls<Types.TicketUpdateMutation>(Operations.TicketUpdateDocument)
}

export function mockTicketUpdateMutationError(message: string, extensions: {type: ErrorTypes.GraphQLErrorTypes }) {
  return Mocks.mockGraphQLResultWithError(Operations.TicketUpdateDocument, message, extensions);
}
