<script lang="ts">
  import { router } from '@inertiajs/svelte'
  import { Dialog } from 'bits-ui'
  import { twJoin } from 'tailwind-merge'
  import SolarCloseCircleBoldDuotone from '~icons/solar/close-circle-bold-duotone'
  import emblaCarouselSvelte from 'embla-carousel-svelte'

  interface Props {
    ownerIsEditing: boolean
    userId: number
    links: {
      id: number
      url: string
      label: string
    }[]
    newLinks: {
      userId: number
      url: string
      label: string
    }[]
    editingAvatar: boolean
  }

  let { userId, links, newLinks = $bindable(), ownerIsEditing, editingAvatar }: Props = $props()

  let emblaApi = $state()

  function onInit(event: any) {
    emblaApi = event.detail
  }

  let modalOpen = $state(false)
  let newLink = $state({
    userId,
    label: '',
    url: '',
  })

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()

    modalOpen = false
    newLinks = [
      ...newLinks,
      { label: newLink.label, url: normalizeUrl(newLink.url), userId: newLink.userId },
    ]

    newLink.url = ''
    newLink.label = ''
  }

  function onDelete(linkId: number) {
    const linkIdx = links.findIndex((l) => l.id === linkId)
    if (linkIdx >= 0) {
      links.splice(linkIdx, 1)
      router.post('/link/delete', {
        userId,
        linkId,
      })
    }
  }

  function normalizeUrl(url: string): string {
    let normalizedUrl = ''

    if (!url.includes('https://') && !url.includes('http://')) {
      normalizedUrl = `https://${url}`
    } else if (url.includes('http://')) {
      const onlyUrl = url.slice(6)
      normalizedUrl = `https://${onlyUrl}`
    } else {
      normalizedUrl = url
    }

    return normalizedUrl
  }
</script>

<Dialog.Root open={modalOpen}>
  <div
    class="overflow-hidden mt-3 escaped pr-5 hidden md:block w-full"
    use:emblaCarouselSvelte={{
      options: { loop: false, align: 'start', dragFree: true },
      plugins: [],
    }}
    onemblaInit={onInit}
  >
    <ul class="flex relative">
      {#if links.length > 0}
        {#each links as link}
          <li
            class="group first:ml-5 ml-3 flex flex-[0_0_auto] items-center justify-center bg-zinc-50/20 rounded-full text-sm leading-none hover:bg-zinc-50/40 focus-within:bg-zinc-50/40 transition-colors duration-75 gap-x-2"
            class:pr-1={ownerIsEditing && !editingAvatar}
          >
            <a
              href={link.url}
              class={twJoin(
                'inset-0 py-2 select-none focus-visible:outline-none',
                ownerIsEditing && !editingAvatar ? 'pl-4 ' : 'px-4 '
              )}
              target="_blank"
              rel="noreferrer noopener"
            >
              {link.label}
            </a>
            {#if ownerIsEditing && !editingAvatar}
              <button
                onclick={() => onDelete(link.id)}
                class="rounded-full hover:cursor-pointer transition-colors flex items-center justify-center hover:text-red-400/75"
              >
                <SolarCloseCircleBoldDuotone height={22} width={22} />
              </button>
            {/if}
          </li>
        {/each}
      {/if}
      {#if ownerIsEditing && !editingAvatar}
        <li class="first:ml-5 ml-3">
          <Dialog.Trigger
            onclick={() => (modalOpen = true)}
            class="flex items-center justify-center bg-zinc-50/20 px-4 py-2 rounded-full text-sm leading-none hover:bg-zinc-50/40 transition-colors duration-75 hover:cursor-pointer focus-visible:bg-zinc-50/40 focus-visible:outline-none active:bg-zinc-50/30"
          >
            +
          </Dialog.Trigger>
        </li>
      {/if}
    </ul>
  </div>
  <Dialog.Portal>
    <Dialog.Overlay class="absolute inset-0 z-50 bg-black/80" />
    <Dialog.Content
      class="rounded-lg bg-zinc-900 shadow-xl outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border border-zinc-800 p-5 sm:max-w-[490px] md:w-full"
    >
      <Dialog.Title class="flex w-full items-center text-lg font-semibold tracking-tight">
        Create a new link
      </Dialog.Title>
      <form onsubmit={onSubmit} class="w-full flex flex-col mt-3 gap-y-2">
        <div class="flex flex-col gap-y-1">
          <label for="link-label" class="text-sm font-semibold">Link label</label>
          <input
            id="link-label"
            bind:value={newLink.label}
            type="text"
            placeholder="GitHub"
            class="focus-visible:outline-none border border-zinc-800 bg-zinc-900 py-2 px-3 rounded-md"
          />
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="link-url" class="text-sm font-semibold">Link URL</label>
          <input
            id="link-url"
            bind:value={newLink.url}
            type="text"
            placeholder="https://github.com"
            class="focus-visible:outline-none border border-zinc-800 bg-zinc-900 py-2 px-3 rounded-md"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-zinc-200 hover:bg-zinc-100 active:bg-zinc-300 transition-colors text-zinc-950 py-2 rounded-md mt-4 hover:cursor-pointer font-bold"
          >Create</button
        >
      </form>

      <Dialog.Close
        onclick={() => (modalOpen = false)}
        class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        X
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<!-- MOBILE -->
{#if links.length > 0}
  <ul class="flex flex-col md:hidden w-full gap-y-3 px-4 mt-5">
    {#each links as link}
      <li
        class="flex items-center justify-center bg-zinc-50/15 rounded-lg leading-none hover:bg-zinc-50/40 transition-colors duration-75 backdrop-blur-xl"
      >
        <a
          href={link.url}
          class="inset-0 py-4 select-none w-full flex items-center justify-center"
          target="_blank"
          rel="noreferrer noopener"
        >
          {link.label}
        </a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .escaped {
    mask-image: linear-gradient(
      90deg,
      rgba(250, 250, 250, 0) 0%,
      #fafafa 5%,
      #fafafa 95%,
      rgba(250, 250, 250, 0) 100%
    );
  }
</style>
