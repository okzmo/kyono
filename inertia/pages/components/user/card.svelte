<script lang="ts">
  import { useForm } from '@inertiajs/svelte'
  import Description from './description.svelte'
  import DisplayName from './display-name.svelte'
  import Avatar from './avatar.svelte'
  import Status from './status.svelte'
  import Links from './links.svelte'
  import Banner from './banner.svelte'

  interface Props {
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

  let { userNotFound, isOwner, user, links }: Props = $props()

  let userState = useForm({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    description: user.description,
    status: user.status,
    avatar: null,
    banner: null,
    links: [],
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
  let allLinks = $derived([...links, ...$userState.links])
</script>

<div
  class="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col-reverse items-center w-fit mt-12"
>
  {#if userNotFound}
    <h1>This user doesn't exist</h1>
  {:else}
    {#if isOwner}
      <button
        onclick={() => {
          if (editing.global) {
            $userState.post('/edit', {
              preserveState: true,
              onSuccess: () => {
                if (!editing.global) {
                  for (const key of Object.keys(editing)) {
                    editing[key] = false
                  }
                }
                $userState.reset('links', 'details', 'avatar', 'banner')
              },
            })
          }
          editing.global = !editing.global
        }}
        class="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-colors duration-75 hover:cursor-pointer w-fit mt-12"
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
      class="w-[26.56rem] h-[18.75rem] bg-zinc-900 relative before:absolute before:inset-0 before:border before:border-zinc-50/10 before:content-normal before:z-10 before:pointer-events-none"
    >
      <img
        role="presentation"
        src={user.bannerUrl}
        alt="vehicle"
        class="w-[26.56rem] h-[18.75rem] object-cover absolute blur-3xl opacity-65 select-none"
      />

      <Banner
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
          class="h-full w-full absolute bg-zinc-950/50 progressive-blur"
        ></div>
        <div class="relative flex flex-col z-1 justify-end h-full py-4">
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

          {#if user.description}
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
              links={allLinks}
              bind:newLinks={$userState.links}
              {ownerIsEditing}
              editingAvatar={editing.avatar}
            />
          {/if}
        </div>
      {/if}
    </main>
  {/if}
</div>

<style>
  .progressive-blur {
    backdrop-filter: blur(64px);
    mask-image: radial-gradient(
      100% 100% at 50% 0%,
      rgba(250, 250, 250, 0) 55%,
      rgba(250, 250, 250, 0.524324) 65%,
      rgba(250, 250, 250, 0.778248) 75%,
      rgba(250, 250, 250, 0.927378) 85%,
      #fafafa 95%
    );
  }
</style>
