// Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

import { isRef, ref, toValue, watch, type Ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import { EnumOrderDirection } from '#shared/graphql/types.ts'
import type { QueryHandler } from '#shared/server/apollo/handler/index.ts'
import type { OperationQueryResult } from '#shared/types/server/apollo/handler.ts'

import type { OperationVariables } from '@apollo/client/core'

export const useSorting = <
  TQueryResult extends OperationQueryResult = OperationQueryResult,
  TQueryVariables extends OperationVariables = OperationVariables & {
    orderBy: string
    orderDirection: EnumOrderDirection
  },
>(
  query: QueryHandler<TQueryResult, TQueryVariables>,
  orderByParam: string | Ref<string>,
  orderDirectionParam: EnumOrderDirection | Ref<EnumOrderDirection>,
  scrollContainer?: Ref<HTMLElement | null>,
) => {
  // Local refs that you'll work with inside this composable
  const orderBy = ref<string>(toValue(orderByParam))
  const orderDirection = ref<EnumOrderDirection>(toValue(orderDirectionParam))

  if (isRef(orderByParam)) {
    watch(orderByParam, (newValue) => {
      orderBy.value = newValue
    })
  }

  if (isRef(orderDirectionParam)) {
    watch(orderDirectionParam, (newValue) => {
      orderDirection.value = newValue
    })
  }

  const isSorting = ref(false)
  const sort = (
    column: string,
    direction: EnumOrderDirection,
    additionalVariables: Partial<TQueryVariables> = {},
  ) => {
    isSorting.value = true
    // It's fine to parse only partial variables, in this case the original variables values are used for
    // not given variables.
    query
      .refetch({
        orderBy: column,
        orderDirection: direction,
        ...additionalVariables,
      })
      .finally(() => {
        isSorting.value = false

        requestAnimationFrame(() => {
          scrollContainer?.value?.scrollTo({ top: 0 })
        })
      })

    orderBy.value = column
    orderDirection.value = direction
  }

  onBeforeRouteUpdate(() => {
    orderBy.value = toValue(orderByParam)
    orderDirection.value = toValue(orderDirectionParam)
  })

  return {
    sort,
    isSorting,
    orderBy,
    orderDirection,
  }
}
