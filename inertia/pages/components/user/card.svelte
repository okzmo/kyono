<script lang="ts">
  import { useForm } from '@inertiajs/svelte'
  import Description from './description.svelte'
  import DisplayName from './display-name.svelte'
  import Avatar from './avatar.svelte'
  import Status from './status.svelte'
  import Links from './links.svelte'
  import Banner from './banner.svelte'
  import { twJoin } from 'tailwind-merge'

  interface Props {
    presentation?: boolean
    userNotFound: boolean
    isOwner: boolean
    user: {
      id: number
      username: string
      displayName: string
      bannerUrl: string
      avatarUrl: string
      description: string | null
      status: string | null
    }
    links: {
      id: number
      label: string
      url: string
    }[]
  }

  let { userNotFound, isOwner, user, links, presentation = false }: Props = $props()

  let userState = useForm({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    description: user.description,
    status: user.status,
    avatar: null,
    banner: null,
    newLinks: [],
    allLinks: links,
    details: { x: 0, y: 0, width: 0, height: 0 },
  })

  let editing: Record<string, boolean> = $state({
    global: false,
    avatar: false,
    banner: false,
    displayName: false,
    description: false,
    status: false,
  })

  let ownerIsEditing = $derived(isOwner && editing.global)
  let allLinks = $state([...links, ...$userState.newLinks])

  $effect(() => {
    allLinks = [...links, ...$userState.newLinks]
  })
</script>

<div class="flex flex-col-reverse items-center w-fit">
  {#if userNotFound}
    <h1>This user doesn't exist</h1>
  {:else}
    {#if isOwner}
      <button
        onclick={() => {
          if (editing.global) {
            $userState
              .transform((data) => ({
                ...data,
                allLinks: allLinks,
              }))
              .post('/edit', {
                preserveState: true,
                onSuccess: () => {
                  if (!editing.global) {
                    for (const key of Object.keys(editing)) {
                      editing[key] = false
                    }
                  }
                  $userState.reset('newLinks', 'details', 'avatar', 'banner')
                },
              })
          }
          editing.global = !editing.global
        }}
        class="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 focus-visible:outline-none focus-visible:border-zinc-700 focus-visible:bg-zinc-800 transition-colors duration-75 hover:cursor-pointer w-fit mt-12 hidden md:block"
      >
        {!editing.global
          ? 'Edit'
          : editing.banner
            ? 'Save banner'
            : editing.avatar
              ? 'Save avatar'
              : 'Save'}
      </button>
    {/if}

    <main
      class={twJoin(
        'md:w-[26.56rem] md:h-[18.75rem] bg-zinc-900 relative before:absolute before:inset-0 before:border before:border-zinc-50/10 before:content-normal before:z-10 before:pointer-events-none',
        presentation
          ? 'w-[calc(100vw-2rem)] h-[calc(100vh-20rem)] rounded-xl md:rounded-none before:rounded-xl before:md:rounded-none overflow-hidden'
          : 'w-dvw h-dvh before:hidden before:md:block'
      )}
    >
      <img
        role="presentation"
        src={user.bannerUrl}
        alt="vehicle"
        class="hidden md:block w-[26.56rem] h-[18.75rem] object-cover absolute blur-3xl opacity-65 select-none"
      />

      <Banner
        {presentation}
        {ownerIsEditing}
        bind:editingBanner={editing.banner}
        currentBanner={user.bannerUrl}
        bind:newBanner={$userState.banner}
        bind:details={$userState.details}
        editingAvatar={editing.avatar}
      />

      {#if !editing.banner}
        <div
          role="presentation"
          class={twJoin(
            'h-full w-full absolute bg-zinc-950/50 progressive-blur',
            presentation ? 'rounded-xl md:rounded-none' : ''
          )}
        ></div>
        <div
          class={twJoin(
            'relative flex flex-col z-1 md:justify-end items-center md:items-start h-full md:py-4 overflow-auto md:pt-0',
            presentation ? 'py-[2rem]' : 'pt-[8rem] pb-[2rem]'
          )}
        >
          <Status
            {ownerIsEditing}
            bind:status={$userState.status}
            bind:editingStatus={editing.status}
            editingAvatar={editing.avatar}
          />

          <Avatar
            {ownerIsEditing}
            avatarUrl={user.avatarUrl}
            bind:editingAvatar={editing.avatar}
            bind:newAvatar={$userState.avatar}
            bind:details={$userState.details}
          />

          <DisplayName
            {ownerIsEditing}
            bind:displayName={$userState.displayName}
            bind:editingDisplayName={editing.displayName}
            editingAvatar={editing.avatar}
          />

          {#if user.description || ownerIsEditing}
            <Description
              {ownerIsEditing}
              bind:description={$userState.description}
              bind:editingDescription={editing.description}
              editingAvatar={editing.avatar}
            />
          {/if}

          {#if links.length > 0 || ownerIsEditing}
            <Links
              userId={user.id}
              bind:links={allLinks}
              bind:newLinks={$userState.newLinks}
              {ownerIsEditing}
              editingAvatar={editing.avatar}
            />
          {/if}
        </div>
      {/if}
    </main>
  {/if}
</div>
