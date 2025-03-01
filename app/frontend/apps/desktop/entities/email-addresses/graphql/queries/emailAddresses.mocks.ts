import * as Types from '#shared/graphql/types.ts';

import * as Mocks from '#tests/graphql/builders/mocks.ts'
import * as Operations from './emailAddresses.api.ts'
import * as ErrorTypes from '#shared/types/error.ts'

export function mockEmailAddressesQuery(defaults: Mocks.MockDefaultsValue<Types.EmailAddressesQuery, Types.EmailAddressesQueryVariables>) {
  return Mocks.mockGraphQLResult(Operations.EmailAddressesDocument, defaults)
}

export function waitForEmailAddressesQueryCalls() {
  return Mocks.waitForGraphQLMockCalls<Types.EmailAddressesQuery>(Operations.EmailAddressesDocument)
}

export function mockEmailAddressesQueryError(message: string, extensions: {type: ErrorTypes.GraphQLErrorTypes }) {
  return Mocks.mockGraphQLResultWithError(Operations.EmailAddressesDocument, message, extensions);
}
