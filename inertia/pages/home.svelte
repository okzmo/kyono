<script lang="ts">
  import Kyodo from './components/logos/kyodo.svelte'
  import Card from './components/user/card.svelte'

  let { user, links } = $props()
</script>

<svelte:head>
  <title>Homepage</title>
</svelte:head>

<a href="/signin">
  <Kyodo
    height={22}
    width={28}
    class="fixed left-1/2 -translate-x-1/2 top-8 text-zinc-50/20 hover:text-zinc-50 active:text-zinc-50/70 transition-colors duration-75"
  />
</a>

{#if user}
  <div
    class="flex flex-col items-center fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-[42%]"
  >
    <Card presentation userNotFound={false} isOwner={false} {user} {links} />
    <a
      href="/signin"
      class="font-serif italic text-2xl text-zinc-50/50 hover:text-zinc-50 mt-8 md:mt-16 transition-colors"
      >Create your own</a
    >
  </div>
{/if}
