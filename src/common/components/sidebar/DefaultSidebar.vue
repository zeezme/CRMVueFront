<script lang="ts">
import { globalStore } from '@/common/config/globalStore'
import router from '@/router'
import { routes, type IDefaultRoutes } from '@/router/routes'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'DefaultSidebar',
  props: {},
  setup() {
    const { username } = globalStore.getState()

    const menuItens = routes.filter((route) => route.showInMenu)

    const footerPopoverRef = ref()

    const userMenuItems = ref([
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          globalStore.clearState()

          router.push({ name: 'login' })
        },
      },
    ])

    const menuItensByGroup = menuItens.reduce<Record<string, IDefaultRoutes[]>>((acc, item) => {
      if (!item.group) {
        item.group = 'Normal'
      }
      if (!acc[item.group]) {
        acc[item.group] = []
      }

      acc[item.group].push(item)

      return acc
    }, {})

    const isSidebarOpen = ref(false)

    const hoveredItem = ref<string | null>(null)

    const screenWidth = ref(window.innerWidth)

    const handleRedirect = (routeName: string) => {
      router.push({ name: routeName })

      isSidebarOpen.value = false
    }

    const updateScreenWidth = () => {
      screenWidth.value = window.innerWidth
    }

    onMounted(() => {
      window.addEventListener('resize', updateScreenWidth)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateScreenWidth)
    })

    return {
      isSidebarOpen,
      username,
      hoveredItem,
      screenWidth,
      menuItensByGroup,
      footerPopoverRef,
      userMenuItems,
      handleRedirect,
    }
  },
})
</script>

<template>
  <Card
    v-if="screenWidth > 550 || isSidebarOpen"
    class="sidebar flex flex-col p-2 gap-2 bg-gray-200 text-gray-950 !p-0 !pe-1 transition-all"
    :class="{ 'sidebar-open': isSidebarOpen }"
    @mouseenter="isSidebarOpen = true"
    @mouseleave="isSidebarOpen = false"
    :pt="{
      root: {
        class: [
          '!shadow-sm !shadow-slate-950/100  !rounded-none',
          screenWidth > 550 && '!rounded-e-2xl',
        ],
      },
      body: {
        class: '!p-2 !h-full justify-between w-full',
      },
    }"
  >
    <template #content>
      <div class="flex items-center h-8 cursor-pointer !mb-5 !mt-5 !justify-center">
        <Avatar label="BW" shape="square" />

        <span v-if="isSidebarOpen" class="text-sm !ms-2 wrap"
          >BagualWare
          <p class="text-xs">Solutions ™</p></span
        >
      </div>

      <div class="border-gray-400 border-opacity-50 border-b-1 !mb-2" />

      <div v-for="(menuItem, index) in menuItensByGroup" :key="index">
        <span v-if="isSidebarOpen" class="text-xs font-medium opacity-50 !ms-2">{{
          menuItem[0].group
        }}</span>
        <div
          v-for="item in menuItem"
          :key="item.name"
          :class="[
            'p-2 flex items-center h-8 cursor-pointer w-full relative',
            !isSidebarOpen ? '!justify-center' : '!justify-start',
          ]"
          @mouseover="hoveredItem = item.name"
          @mouseleave="hoveredItem = null"
          @click="handleRedirect(item.name)"
        >
          <i :class="[item.icon, 'text-lg']" />

          <span v-if="isSidebarOpen" class="text-sm !ms-2">{{ item.label }}</span>

          <i class="pi pi-circle-fill absolute !right-0 text-lg" v-if="hoveredItem === item.name" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="border-gray-400 border-opacity-50 border-b-1 !mb-5" />

      <div class="footer">
        <div :class="[' flex items-center justify-center', !isSidebarOpen && 'w-full']">
          <SpeedDial
            :model="userMenuItems"
            direction="up"
            :transitionDelay="80"
            :pt="{
              list: { class: `min-w-[100px] !absolute bottom-20 left-2 flex flex-row ` },
              item: {
                class: 'w-full',
              },
            }"
          >
            <template #button="{ toggleCallback }">
              <Button outlined variant="text" class="border" @click="toggleCallback">
                <Avatar :label="username.charAt(0).toUpperCase()" shape="circle" />
              </Button>
            </template>
            <template #item="{ item, toggleCallback }">
              <Button fluid @click="toggleCallback" size="small">
                <span :class="item.icon" />
                {{ item.label }}
              </Button>
            </template>
          </SpeedDial>
          <span v-if="isSidebarOpen" class="text-sm">{{
            username.charAt(0).toUpperCase() + username.slice(1)
          }}</span>
        </div>

        <Button v-if="screenWidth < 550" @click="isSidebarOpen = !isSidebarOpen">
          Fechar Menu
        </Button>
      </div>
    </template>
  </Card>

  <div v-if="screenWidth < 550 && !isSidebarOpen" class="absolute top-0 left-0 p-5 z-10">
    <Button @click="isSidebarOpen = !isSidebarOpen" rounded icon="pi pi-bars" severity="contrast" />
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 90px;
  height: 100vh;
}

.sidebar-open {
  width: 205px;
  align-items: flex-start;
}
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

@media (max-width: 550px) {
  .sidebar-open {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
  }
  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
