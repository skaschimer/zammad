<!-- Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'

import CommonImageViewer from '#shared/components/CommonImageViewer/CommonImageViewer.vue'
import CommonNotifications from '#shared/components/CommonNotifications/CommonNotifications.vue'
import DynamicInitializer from '#shared/components/DynamicInitializer/DynamicInitializer.vue'
import useAuthenticationChanges from '#shared/composables/authentication/useAuthenticationUpdates.ts'
import useFormKitConfig from '#shared/composables/form/useFormKitConfig.ts'
import useAppMaintenanceCheck from '#shared/composables/useAppMaintenanceCheck.ts'
import useMetaTitle from '#shared/composables/useMetaTitle.ts'
import usePushMessages from '#shared/composables/usePushMessages.ts'
import { initializeDefaultObjectAttributes } from '#shared/entities/object-attributes/composables/useObjectAttributes.ts'
import { useApplicationStore } from '#shared/stores/application.ts'
import { useAuthenticationStore } from '#shared/stores/authentication.ts'
import { useLocaleStore } from '#shared/stores/locale.ts'
import { useSessionStore } from '#shared/stores/session.ts'
import emitter from '#shared/utils/emitter.ts'

import { initializeConfirmationDialog } from '#desktop/components/CommonConfirmationDialog/initializeConfirmationDialog.ts'
import { useTicketOverviewsStore } from '#desktop/entities/ticket/stores/ticketOverviews.ts'
import { useUserCurrentTaskbarTabsStore } from '#desktop/entities/user/current/stores/taskbarTabs.ts'

const router = useRouter()

const authentication = useAuthenticationStore()
const session = useSessionStore()

useMetaTitle().initializeMetaTitle()

const application = useApplicationStore()
onBeforeMount(() => {
  application.setLoaded()
})

useAppMaintenanceCheck()
usePushMessages()

// Add a check for authenticated changes (e.g. login/logout in a other
// browser tab or maintenance mode switch).
useAuthenticationChanges()

// We need to trigger a manual translation update for the form related strings.
const formConfig = useFormKitConfig()
useLocaleStore().$subscribe(() => {
  formConfig.locale = 'staticLocale'
})

// The handling for invalid sessions. The event will be emitted, when from the server a "NotAuthorized"
// response is received.
emitter.on('sessionInvalid', async () => {
  if (authentication.authenticated) {
    await authentication.clearAuthentication()

    router.replace({
      name: 'Login',
      query: {
        invalidatedSession: '1',
      },
    })
  }
})

initializeConfirmationDialog()

// Initialize the user taskbar tabs store after a valid session is present on
// the app level, so that the query keeps alive.
watch(
  () => session.initialized,
  (newValue, oldValue) => {
    if (!newValue || oldValue) return

    useUserCurrentTaskbarTabsStore()
    useTicketOverviewsStore()
    initializeDefaultObjectAttributes()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  emitter.off('sessionInvalid')
})
</script>

<template>
  <template v-if="application.loaded">
    <CommonNotifications />
    <Teleport to="body">
      <CommonImageViewer />
    </Teleport>
    <RouterView />

    <DynamicInitializer name="dialog" />
    <DynamicInitializer name="flyout" />
  </template>
</template>
