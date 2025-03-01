import * as Types from '#shared/graphql/types.ts';

import * as Mocks from '#tests/graphql/builders/mocks.ts'
import * as Operations from './update.api.ts'
import * as ErrorTypes from '#shared/types/error.ts'

export function mockTagAssignmentUpdateMutation(defaults: Mocks.MockDefaultsValue<Types.TagAssignmentUpdateMutation, Types.TagAssignmentUpdateMutationVariables>) {
  return Mocks.mockGraphQLResult(Operations.TagAssignmentUpdateDocument, defaults)
}

export function waitForTagAssignmentUpdateMutationCalls() {
  return Mocks.waitForGraphQLMockCalls<Types.TagAssignmentUpdateMutation>(Operations.TagAssignmentUpdateDocument)
}

export function mockTagAssignmentUpdateMutationError(message: string, extensions: {type: ErrorTypes.GraphQLErrorTypes }) {
  return Mocks.mockGraphQLResultWithError(Operations.TagAssignmentUpdateDocument, message, extensions);
}
