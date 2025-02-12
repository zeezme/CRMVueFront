<script setup lang="ts">
import { ref } from 'vue'
import VCodeBlock from '@wdns/vue-code-block'
import inputStore from './inputStore'
import DefaultEmailInput from '@/common/components/Inputs/DefaultEmailInput.vue'
import DefaultPasswordInput from '@/common/components/Inputs/DefaultPasswordInput.vue'
import DefaultTextInput from '@/common/components/Inputs/DefaultTextInput.vue'

const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL
const store = inputStore.getState()
</script>

<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-6">
        <Panel header="📌 InputStore em Tempo Real" toggleable collapsed>
          <div class="grid grid-cols-3">
            <div class="flex items-center border p-2">
              <strong class="w-40">Campo Email:</strong>
              <span>{{ store.campoEmail }}</span>
            </div>
            <div class="flex items-center border p-2">
              <strong class="w-40">Campo Username:</strong>
              <span>{{ store.campoUsername }}</span>
            </div>
            <div class="flex items-center border p-2">
              <strong class="w-40">Campo Password:</strong>
              <span>{{ store.campoPassword }}</span>
            </div>
          </div>
          <div class="flex items-center border p-2">
            <strong class="w-40">Erros</strong>
            <span>{{ store.errors }}</span>
          </div>
        </Panel>

        <!-- Seção: Apresentação -->
        <Panel toggleable>
          <template #header>
            <div class="flex items-center gap-3">
              <Avatar :image="avatarLogoUrl" shape="circle" />
              <span class="text-lg font-bold">Lucas Menezes</span>
            </div>
          </template>

          <p class="text-justify">
            Desenvolvi os <strong class="!font-bold">Inputs</strong> para facilitar a inserção e
            alteração de dados na store, além de padronizar os componentes e garantir a consistência
            do design.
          </p>

          <div class="flex flex-row !w-full gap-3 !mt-5">
            <DefaultEmailInput
              class="!w-full"
              label="E-mail"
              placeholder="Digite seu e-mail"
              field="campoEmail"
              :store="inputStore"
              required
            />

            <DefaultTextInput
              class="!w-full"
              label="Nome"
              placeholder="Digite seu nome"
              field="campoUsername"
              :store="inputStore"
              required
            />

            <DefaultPasswordInput
              class="!w-full"
              label="Senha"
              placeholder="Digite sua senha"
              field="campoPassword"
              :store="inputStore"
              required
            />
          </div>
        </Panel>

        <!-- Seção: O que os Inputs têm em Comum -->
        <Panel header="📖 O que os Inputs têm em Comum" toggleable collapsed>
          <p class="!mb-3">
            Os componentes de input (<strong>DefaultEmailInput</strong>,
            <strong>DefaultPasswordInput</strong> e <strong>DefaultTextInput</strong>) compartilham
            uma estrutura e comportamento semelhantes, garantindo consistência e facilidade de uso.
          </p>

          <div class="flex flex-col gap-5 !mb-5">
            <h3 class="text-lg font-semibold">🔹 Integração com a Store</h3>
            <p>
              Todos os inputs são projetados para se integrar diretamente com o
              <strong>StateManager</strong>. Eles utilizam a propriedade <code>store</code> para
              atualizar o estado global da aplicação.
            </p>
            <p>
              Quando o valor do input é alterado, o método <code>setFieldValue</code> da store é
              chamado para atualizar o campo correspondente no estado.
            </p>

            <VCodeBlock
              code="// Exemplo de atualização da store
const handleChange = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).value
  store.setFieldValue(field, newValue)
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Validação</h3>
            <p>
              Todos os inputs possuem mecanismos de validação integrados. Eles validam o valor do
              campo e, em caso de erro, atualizam a store com a mensagem de erro correspondente.
            </p>
            <p>
              Os erros são armazenados na store e podem ser acessados através da propriedade
              <code>errors</code>.
            </p>

            <VCodeBlock
              code="// Exemplo de validação
const handleValidate = (value: string) => {
  if (required && !value) {
    store.addError('Campo obrigatório')
  } else {
    store.clearErrors()
  }
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mb-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Propriedades Comuns</h3>
            <p>Todos os inputs aceitam as seguintes propriedades:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li><strong>label</strong>: Rótulo exibido acima do input.</li>
              <li><strong>placeholder</strong>: Texto de placeholder dentro do input.</li>
              <li><strong>field</strong>: Nome do campo no estado da store.</li>
              <li><strong>store</strong>: Instância do <code>StateManager</code>.</li>
              <li><strong>required</strong>: Define se o campo é obrigatório.</li>
              <li><strong>error</strong>: Mensagem de erro personalizada.</li>
            </ul>
          </div>
        </Panel>

        <!-- Seção: Input de Email -->
        <Panel header="📖 Input de Email" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>DefaultEmailInput</strong> é utilizado para capturar endereços de
            e-mail, com validação integrada para garantir que o formato seja válido.
          </p>

          <div class="flex flex-col gap-5 !mb-5">
            <h3 class="text-lg font-semibold">🔹 Como Usar</h3>
            <p>
              Para utilizar o input de e-mail, importe o componente e passe as propriedades
              necessárias, como <code>label</code>, <code>placeholder</code>, <code>field</code> e
              <code>store</code>.
            </p>

            <VCodeBlock
              code="<template>
  <DefaultEmailInput
    label='E-mail'
    placeholder='Digite seu e-mail'
    field='email'
    :store='userStore'
    required
  />
</template>"
              highlightjs
              lang="html"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Validação</h3>
            <p>
              O input de e-mail valida automaticamente o formato do e-mail utilizando a biblioteca
              <code>Yup</code>. Caso o e-mail seja inválido, uma mensagem de erro será exibida.
            </p>
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Métodos</h3>
            <p>O componente oferece os seguintes métodos:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li>
                <strong class="text-red-400 !font-bold">handleChange</strong>: Atualiza o valor do
                campo no estado da store.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">handleValidateEmail</strong>: Valida o
                formato do e-mail e exibe erros, se necessário.
              </li>
            </ul>
          </div>
        </Panel>

        <!-- Seção: Input de Senha -->
        <Panel header="📖 Input de Senha" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>DefaultPasswordInput</strong> é utilizado para capturar senhas, com
            opções para exibir/ocultar a senha e medir a força da senha.
          </p>

          <div class="flex flex-col gap-5 !mb-5">
            <h3 class="text-lg font-semibold">🔹 Como Usar</h3>
            <p>
              Para utilizar o input de senha, importe o componente e passe as propriedades
              necessárias, como <code>label</code>, <code>placeholder</code>, <code>field</code> e
              <code>store</code>.
            </p>

            <VCodeBlock
              code="<template>
  <DefaultPasswordInput
    label='Senha'
    placeholder='Digite sua senha'
    field='password'
    :store='userStore'
    required
    enableStrengthMeter
  />
</template>"
              highlightjs
              lang="html"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Validação e Força da Senha</h3>
            <p>
              O input de senha valida a obrigatoriedade do campo e, se habilitado, mede a força da
              senha utilizando a biblioteca <code>zxcvbn</code>. A força da senha é exibida em um
              popover.
            </p>
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Métodos</h3>
            <p>O componente oferece os seguintes métodos:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li>
                <strong class="text-red-400 !font-bold">handleChange</strong>: Atualiza o valor do
                campo no estado da store.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">handleValidatePassword</strong>: Valida a
                senha e exibe erros, se necessário.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">handleTogglePasswordVisibility</strong>:
                Alterna a visibilidade da senha.
              </li>
            </ul>
          </div>
        </Panel>

        <!-- Seção: Input de Texto -->
        <Panel header="📖 Input de Texto" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>DefaultTextInput</strong> é utilizado para capturar textos
            genéricos, com suporte para validação de campo obrigatório.
          </p>

          <div class="flex flex-col gap-5 !mb-5">
            <h3 class="text-lg font-semibold">🔹 Como Usar</h3>
            <p>
              Para utilizar o input de texto, importe o componente e passe as propriedades
              necessárias, como <code>label</code>, <code>placeholder</code>, <code>field</code> e
              <code>store</code>.
            </p>

            <VCodeBlock
              code="<template>
  <DefaultTextInput
    label='Nome'
    placeholder='Digite seu nome'
    field='name'
    :store='userStore'
    required
  />
</template>"
              highlightjs
              lang="html"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Validação</h3>
            <p>
              O input de texto valida se o campo é obrigatório e exibe uma mensagem de erro caso o
              campo esteja vazio.
            </p>
          </div>

          <div class="flex flex-col gap-5 !mb-5 mt-5">
            <h3 class="text-lg font-semibold">🔹 Métodos</h3>
            <p>O componente oferece os seguintes métodos:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li>
                <strong class="text-red-400 !font-bold">handleChange</strong>: Atualiza o valor do
                campo no estado da store.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">handleValidate</strong>: Valida se o campo é
                obrigatório e exibe erros, se necessário.
              </li>
            </ul>
          </div>
        </Panel>
      </div>
    </template>
  </Card>
</template>
