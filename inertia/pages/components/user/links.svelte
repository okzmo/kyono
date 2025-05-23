<script lang="ts">
  import { router } from '@inertiajs/svelte'
  import { Dialog } from 'bits-ui'
  import { twJoin } from 'tailwind-merge'
  import SolarCloseCircleBoldDuotone from '~icons/solar/close-circle-bold-duotone'
  import emblaCarouselSvelte from 'embla-carousel-svelte'
  import CustomDialogContent from '../shared/CustomDialogContent.svelte'
  import CustomDialogOverlay from '../shared/CustomDialogOverlay.svelte'
  import CrossIcon from '../shared/CrossIcon.svelte'
  import { getRandomId } from '~/utils/id'
  import SwapIcon from '../shared/SwapIcon.svelte'

  interface Link {
    id: number
    url: string
    label: string
  }

  interface Props {
    ownerIsEditing: boolean
    userId: number
    links: Link[]
    newLinks: {
      id: number
      userId: number
      url: string
      label: string
    }[]
    editingAvatar: boolean
  }

  let {
    userId,
    links = $bindable(),
    newLinks = $bindable(),
    ownerIsEditing,
    editingAvatar,
  }: Props = $props()

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
      {
        id: getRandomId(),
        label: newLink.label,
        url: normalizeUrl(newLink.url),
        userId: newLink.userId,
      },
    ]

    newLink.url = ''
    newLink.label = ''
  }

  function onDelete(linkId: number) {
    const linkIdx = links.findIndex((l) => l.id === linkId)
    const newLinkIdx = newLinks.findIndex((l) => l.id === linkId)
    if (newLinkIdx >= 0) {
      newLinks.splice(newLinkIdx, 1)
      links.splice(linkIdx, 1)
    } else if (linkIdx >= 0) {
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

  function swap(idx: number) {
    const temp = links[idx]
    links[idx] = links[idx + 1]
    links[idx + 1] = temp
  }
</script>

<Dialog.Root open={modalOpen}>
  <div
    class="overflow-hidden mt-3 escaped pr-5 hidden md:block w-full"
    use:emblaCarouselSvelte={{
      options: { loop: false, align: 'start', dragFree: false },
      plugins: [],
    }}
    onemblaInit={onInit}
  >
    <ul class="flex relative">
      {#if links.length > 0}
        {#each links as link, idx}
          <li
            class="group first:ml-5 ml-1.5 flex flex-[0_0_auto] items-center justify-center bg-zinc-50/20 rounded-full text-sm leading-none hover:bg-zinc-50/40 focus-within:bg-zinc-50/40 transition-colors duration-75 gap-x-2"
            class:pr-1={ownerIsEditing && !editingAvatar}
          >
            <a
              href={link.url}
              class={twJoin(
                'inset-0 py-2 select-none focus-visible:outline-none',
                ownerIsEditing && !editingAvatar ? 'pl-4 pointer-events-none' : 'px-4 '
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
          {#if ownerIsEditing && !editingAvatar && idx !== links.length - 1}
            <button onclick={() => swap(idx)} class="ml-1.5 hover:cursor-pointer">
              <SwapIcon height={16} width={16} />
            </button>
          {/if}
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
    <CustomDialogOverlay />
    <CustomDialogContent>
      <Dialog.Title class="flex w-full items-center text-lg font-semibold tracking-tight">
        Add a link
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
        >
          Add my link
        </button>
      </form>

      <Dialog.Close
        onclick={() => (modalOpen = false)}
        class="hover:cursor-pointer hover:bg-zinc-50/10 h-[24px] w-[24px] flex justify-center items-center focus-visible:outline-hidden absolute right-5 top-5 rounded-md transition-colors duration-100"
      >
        <CrossIcon />
      </Dialog.Close>
    </CustomDialogContent>
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
