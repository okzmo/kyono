<script lang="ts">
  import Card from './components/user/card.svelte'

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
</script>

<svelte:head>
  {#if userNotFound}
    <title>404</title>
  {:else}
    <title>
      {user.displayName} | {user.status}
    </title>
  {/if}
</svelte:head>

<Card {userNotFound} {isOwner} {user} {links} />
