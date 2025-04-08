<script lang="ts">
  import Kyono from './components/logos/Kyono.svelte'
  import Noise from './components/shared/Noise.svelte'

  // let { user, links } = $props()
</script>

<svelte:head>
  <title>Homepage</title>
</svelte:head>

<main class="h-screen w-screen bg-accent">
  <h1 class="sr-only">Nosync</h1>
  <div
    class="fixed mx-3 mt-2 lg:left-1/2 lg:top-1/2 lg:mx-0 lg:mt-6 lg:-translate-x-1/2 lg:-translate-y-1/2"
  >
    <Kyono class="not-sr-only w-full lg:w-[940px]" />
    <p class="relative mt-4 font-medium text-white md:max-w-[44rem] lg:mt-6">
      A gorgeous alternative to share with the world who you are. Your name, a description, links,
      avatar, banner, status and plenty more will be coming soon. Take care.
    </p>
  </div>

  <Noise animation={false} />

  <div class="hidden lg:block">
    <span class="fixed left-2 top-2 h-2 w-8 bg-white"></span>
    <span class="fixed -left-1 top-5 h-2 w-8 rotate-90 bg-white"></span>
    <span class="fixed right-2 top-2 h-2 w-8 bg-white"></span>
    <span class="fixed -right-1 top-5 h-2 w-8 rotate-90 bg-white"></span>

    <span class="fixed bottom-2 left-2 h-2 w-8 bg-white"></span>
    <span class="fixed -left-1 bottom-5 h-2 w-8 rotate-90 bg-white"></span>
    <span class="fixed bottom-2 right-2 h-2 w-8 bg-white"></span>
    <span class="fixed -right-1 bottom-5 h-2 w-8 rotate-90 bg-white"></span>
  </div>

  <a
    href="/signin"
    class="group fixed bottom-4 left-1/2 -translate-x-1/2 font-bebas text-4xl uppercase text-white/50 transition-colors duration-75 hover:text-white"
  >
    Create your own
    <div
      class="absolute left-1/2 top-1/2 h-[5px] w-[0px] -translate-x-1/2 -translate-y-1/2 bg-white transition-all delay-75 duration-75 group-hover:w-[calc(100%+0.25rem)]"
    ></div>
  </a>
</main>
