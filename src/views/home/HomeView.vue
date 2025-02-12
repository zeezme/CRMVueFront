<script setup lang="ts">
const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL
</script>

<template>
  <main class="flex h-[90vh] items-center justify-center p-4">
    <Card class="max-w-xl w-full shadow-lg rounded-2xl p-6">
      <template #title>
        <h1 class="text-center text-2xl !font-semibold">Bem-vindo!</h1>
      </template>
      <template #content>
        <Panel toggleable>
          <template #header>
            <div class="flex items-center gap-3">
              <Avatar :image="avatarLogoUrl" shape="circle" />
              <span class="text-lg font-bold">Lucas Menezes</span>
            </div>
          </template>

          <p class="text-md leading-relaxed">
            Esta dashboard foi construída com <strong>Vue 3</strong>, <strong>Tailwind CSS</strong>,
            <strong>Pinia</strong> e <strong>Vite</strong>, seguindo uma arquitetura escalável e
            modular. Diversas abstrações foram implementadas para garantir flexibilidade e facilitar
            a manutenção, tornando o projeto uma base sólida para aplicações complexas. Além disso,
            ele serve como uma prova de conceito, demonstrando boas práticas e organização eficiente
            do código.
          </p>
        </Panel>

        <Panel class="!mt-5" :pt="{ header: { class: `!p-1 !m-0` } }">
          <template #header>
            <div class="w-full flex flex-row items-end justify-end">
              <Tag severity="success" value="Dica"></Tag>
            </div>
          </template>
          <div class="flex flex-row items-center jsutify-center !w-full">
            <div class="flex justify-center items-center w-1/10">
              <p class="pi pi-arrow-left text-green-500" />
            </div>
            <p class="text-md text-center w-9/10">Utilize o menu lateral para navegar.</p>
          </div>
        </Panel>
      </template>
    </Card>
  </main>
</template>
