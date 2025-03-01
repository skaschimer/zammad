<!-- Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
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
import { registerSW } from '#shared/sw/register.ts'
import emitter from '#shared/utils/emitter.ts'

import CommonConfirmation from '#mobile/components/CommonConfirmation/CommonConfirmation.vue'

import { useTicketOverviewsStore } from './entities/ticket/stores/ticketOverviews.ts'

const router = useRouter()

const authentication = useAuthenticationStore()
const session = useSessionStore()

useMetaTitle().initializeMetaTitle()

const application = useApplicationStore()
onMounted(() => {
  // If Zammad was not properly set up yet, redirect to desktop front end.
  if (!application.config.system_init_done) {
    window.location.pathname = '/'
  } else {
    application.setLoaded()
  }
})

const updateServiceWorker = registerSW({
  path: '/mobile/sw.js',
  scope: '/mobile/',
})

useAppMaintenanceCheck({ onNeedRefresh: () => updateServiceWorker(true) })
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

// Initialize the ticket overview store after a valid session is present on
// the app level, so that the query keeps alive.
watch(
  () => session.initialized,
  (newValue, oldValue) => {
    if (!newValue || oldValue) return

    useTicketOverviewsStore()
    initializeDefaultObjectAttributes()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  emitter.off('sessionInvalid')
})

// Do not animate transitions in the test mode.
const transition = VITE_TEST_MODE
  ? undefined
  : {
      enterActiveClass: 'duration-300 ease-out',
      enterFromClass: 'opacity-0 translate-y-3/4',
      enterToClass: 'opacity-100 translate-y-0',
      leaveActiveClass: 'duration-200 ease-in',
      leaveFromClass: 'opacity-100 translate-y-0',
      leaveToClass: 'opacity-0 translate-y-3/4',
    }
</script>

<template>
  <template v-if="application.loaded">
    <CommonNotifications />
    <CommonConfirmation />
    <Teleport to="body">
      <CommonImageViewer />
    </Teleport>
  </template>
  <div
    v-if="application.loaded"
    class="h-full min-w-full bg-black font-sans text-sm text-white antialiased"
  >
    <RouterView />
  </div>
  <DynamicInitializer name="dialog" :transition="transition" />
</template>
