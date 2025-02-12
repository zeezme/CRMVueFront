<template>
  <div class="!p-0 md:p-8 font-sans flex justify-center items-center">
    <!-- Container Principal -->
    <div
      class="max-w-4xl mx-auto !bg-white shadow-lg rounded-lg !p-4 md:p-8 flex flex-col items-start justify-start !gap-4"
    >
      <!-- Cabeçalho -->
      <div
        class="text-center !mb-4 w-full !bg-blue-500/50 p-4 rounded-lg flex flex-col justify-center items-center"
      >
        <h1 class="text-4xl !font-bold text-gray-800 !font-semibold">
          LUCAS AUGUSTO MUNIZ MENEZES
        </h1>

        <img
          :src="avatarLogoUrl"
          alt="Lucas Menezes"
          class="w-32 h-32 rounded-full mx-auto !my-5"
        />

        <p class="text-lg text-gray-800 !font-semibold">Desenvolvedor de Software</p>
        <div
          class="flex flex-wrap justify-center gap-4 !mt-4 flex items-center gap-1 justify-center"
        >
          <p class="text-gray-800">📍 Caxias do Sul - RS - Brasil</p>
          <p class="text-gray-800">📧 menezlucas@icloud.com</p>
          <p class="text-gray-800">📱 (54) 99323-7555</p>
          <a
            href="https://linkedin.com/in/meneluca"
            target="_blank"
            class="!text-gray-800 hover:underline"
            >🔗 linkedin.com/in/meneluca</a
          >
          <Button
            @click="
              () => {
                router.push({ name: 'home' })
              }
            "
            text
            class="!text-gray-800 !font-semibold !hover:!bg-blue-500"
          >
            <v-icon name="bi-code-square" />

            Portfolio
          </Button>
        </div>
      </div>

      <!-- Objetivo -->
      <section class="!mb-8">
        <h2 class="text-2xl !font-bold text-gray-800 !mb-4">Objetivo</h2>
        <p class="text-gray-700 leading-relaxed !bg-gray-200 p-4 rounded-lg">
          Sou Desenvolvedor de Software com 4 anos de experiência no desenvolvimento de aplicações
          web e sistemas diversos, incluindo ERP, PDV e soluções fiscais. Tenho expertise em
          desenvolvimento Full Stack e integração de sistemas, com foco em criar soluções
          escaláveis, automatizadas e de alto desempenho. Busco uma oportunidade para aplicar meu
          conhecimento na construção de softwares eficientes que otimizem processos e gerem impacto
          positivo.
        </p>
      </section>

      <!-- Formação Acadêmica -->
      <section class="!mb-8">
        <h2 class="text-2xl !font-bold text-gray-800 !mb-4">Formação Acadêmica</h2>
        <div class="!bg-gray-200 p-4 rounded-lg">
          <h3 class="text-xl !font-semibold text-gray-700">
            Tecnólogo em Análise e Desenvolvimento de Sistemas
          </h3>
          <p class="text-gray-600">Universidade de Caxias do Sul | Cursando</p>
        </div>
      </section>

      <!-- Competências Técnicas -->
      <section class="!mb-8">
        <h2 class="text-2xl !font-bold text-gray-800 !mb-4">Competências Técnicas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Linguagens de Programação</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>Java</li>
              <li>Python</li>
            </ul>
          </div>
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Tecnologias e Frameworks</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>React, React Native, Svelte</li>
              <li>NestJS, Express, Spring Boot</li>
              <li>Redux, Redux Toolkit, Sequelize</li>
              <li>Tailwind CSS, Puppeteer, HTML, CSS, Bootstrap</li>
              <li>Docker, Jest, AWS, Vue</li>
            </ul>
          </div>
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Banco de Dados</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>PostgreSQL</li>
              <li>SQL</li>
              <li>SQLite</li>
            </ul>
          </div>
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Metodologias Ágeis</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>Scrum</li>
              <li>Kanban</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Experiências Profissionais -->
      <section class="!mb-8">
        <h2 class="text-2xl !font-bold text-gray-800 !mb-4">Experiências Profissionais</h2>
        <div class="space-y-6 flex flex-col !gap-4">
          <!-- Experiência 1 -->
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Desenvolvedor Full Stack</h3>
            <p class="text-gray-600">Cia Sistemas — nov 2023 – dez 2024</p>
            <ul class="list-disc list-inside text-gray-600 !mt-2">
              <li>
                Desenvolvimento de aplicação full stack para automação de processos fiscais, como
                cálculo de impostos automatizados, emissão de NF-e e controle de obrigações fiscais.
              </li>
              <li>
                Implementação de integrações com APIs fiscais e outros sistemas de gestão, usando
                tecnologias como Node.js, React, PostgreSQL e ORM Sequelize.
              </li>
              <li>
                Automação de cálculos fiscais, emissão de notas e controle de tributos, assegurando
                conformidade com a legislação vigente.
              </li>
              <li>
                Desenvolvimento e implementação de testes automatizados do backend, utilizando Jest.
              </li>
            </ul>
          </div>

          <!-- Experiência 2 -->
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Desenvolvedor Full Stack</h3>
            <p class="text-gray-600">Moderniza Group — out 2022 – jun 2023</p>
            <ul class="list-disc list-inside text-gray-600 !mt-2">
              <li>
                Desenvolvimento de uma plataforma unificada para integração de sistemas internos,
                focando em eficiência operacional.
              </li>
              <li>
                Implementação de melhorias e manutenção de sistemas utilizando JavaScript, React,
                Node.js e Redux Toolkit.
              </li>
            </ul>
          </div>

          <!-- Experiência 3 -->
          <div class="!bg-gray-200 p-4 rounded-lg">
            <h3 class="text-xl !font-semibold text-gray-700">Estagiário de Desenvolvimento</h3>
            <p class="text-gray-600">Central IT — nov 2021 – nov 2022</p>
            <ul class="list-disc list-inside text-gray-600 !mt-2">
              <li>Desenvolvimento e manutenção de plataforma de chatbots.</li>
              <li>
                Utilizando React, Socket.io, TypeScript e Docker para funcionalidades em tempo real
                e escalabilidade.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Projetos Freelancer -->
      <section>
        <h2 class="text-2xl !font-bold text-gray-800 !mb-4">Projetos Freelancer</h2>
        <div class="!bg-gray-200 p-4 rounded-lg">
          <h3 class="text-xl !font-semibold text-gray-700">Desenvolvedor Freelancer</h3>
          <p class="text-gray-600">JumpVerso — jun 2024 – nov 2024</p>
          <ul class="list-disc list-inside text-gray-600 !mt-2">
            <li>
              Desenvolvimento de sistemas avançados de scraping com Python e Puppeteer voltados para
              redes sociais.
            </li>
            <li>
              Automação de envio de mensagens com a API do WhatsApp utilizando Node.js e TypeScript.
            </li>
            <li>
              Implementação de sistema de rotação de proxies dinâmicos com integração a APIs de
              inteligência artificial (IA).
            </li>
            <li>Participação em processos de CI/CD e integrações com sistemas existentes.</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL
</script>
