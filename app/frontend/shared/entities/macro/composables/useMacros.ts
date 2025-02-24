// Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

import { computed, onBeforeUnmount, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { MacroById } from '#shared/entities/macro/types.ts'
import { useMacrosQuery } from '#shared/graphql/queries/macros.api.ts'
import { EnumTicketScreenBehavior } from '#shared/graphql/types.ts'
import { QueryHandler } from '#shared/server/apollo/handler/index.ts'
import { useMacroStore } from '#shared/stores/macro.ts'

export const macroScreenBehaviourMapping: Record<
  string,
  EnumTicketScreenBehavior
> = {
  next_task: EnumTicketScreenBehavior.CloseTab,
  next_from_overview: EnumTicketScreenBehavior.CloseNextInOverview,
  next_task_on_close: EnumTicketScreenBehavior.CloseTabOnTicketClose,
  none: EnumTicketScreenBehavior.StayOnTab,
}

export const useMacros = (
  groupId: Ref<ID | undefined>,
  isTicketEditable: Ref<boolean>,
) => {
  const macroFeatureActive = computed(() =>
    Boolean(isTicketEditable.value && groupId.value),
  )

  const macroQuery = new QueryHandler(
    useMacrosQuery(
      () => ({
        groupId: groupId.value as string,
      }),
      () => ({ enabled: macroFeatureActive.value }),
    ),
  )

  const { activate, deactivate } = useMacroStore()

  const route = useRoute()

  // TODO: Drop this mechanism once Apollo implements an effective deduplication of subscriptions on the client level.
  //   More information: https://github.com/apollographql/apollo-client/issues/10117
  const usageKey = route.meta.taskbarTabEntityKey ?? 'apply-template'

  watch(
    macroFeatureActive,
    (active) => {
      if (active) {
        activate(usageKey, macroQuery)
      } else {
        deactivate(usageKey)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    deactivate(usageKey)
  })

  const result = macroQuery.result()

  const macros = computed(() => result.value?.macros)

  return { macros }
}

export const useTicketMacros = (formSubmit: () => void) => {
  const activeMacro = ref<MacroById>()

  const executeMacro = async (macro: MacroById) => {
    activeMacro.value = macro
    formSubmit()
  }

  const disposeActiveMacro = () => {
    activeMacro.value = undefined
  }

  return { activeMacro, executeMacro, disposeActiveMacro }
}
