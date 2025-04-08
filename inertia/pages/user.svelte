<script lang="ts">
  import { twJoin } from 'tailwind-merge'
  import Card from './components/user/card.svelte'
  import Kyodo from './components/logos/kyodo.svelte'

  interface Props {
    userNotFound: boolean
    isOwner: boolean
    user: {
      id: number
      username: string
      displayName: string
      bannerUrl: string
      avatarUrl: string
      metaImgUrl: string
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
</script>

<svelte:head>
  <title>
    {userNotFound ? '404' : `${user.displayName} | ${user.status}`}
  </title>
  {#if !userNotFound}
    <meta property="og:title" content={`${user.displayName} | ${user.status}`} />
    <meta property="og:description" content={user.description} />
    <meta property="og:image" content={user.metaImgUrl} />
    <meta name="twitter:card" content="summary_large_image" />
  {:else}
    <meta property="og:title" content="Profile not found" />
    <meta property="og:description" content="The requested user profile could not be found" />
  {/if}
</svelte:head>

<div
  class={twJoin(
    'md:fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
    isOwner && 'md:mt-12'
  )}
>
  <Card {userNotFound} {isOwner} {user} {links} />
</div>

<a href="/signin">
  <Kyodo
    height={22}
    width={28}
    class="fixed left-1/2 -translate-x-1/2 top-8 md:bottom-8 text-zinc-50/75 md:text-zinc-50/20 hover:text-zinc-50 active:text-zinc-50/70 transition-colors duration-75"
  />
</a>
