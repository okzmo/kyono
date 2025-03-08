<script lang="ts">
  import SolarPenBoldDuotone from '~icons/solar/pen-bold-duotone'
  import SolarCheckCircleBoldDuotone from '~icons/solar/check-circle-bold-duotone'
  import { twJoin } from 'tailwind-merge'

  interface Props {
    ownerIsEditing: boolean
    editingDisplayName: boolean
    displayName: string
    editingAvatar: boolean
  }

  let {
    displayName = $bindable(),
    editingDisplayName = $bindable(),
    ownerIsEditing,
    editingAvatar,
  }: Props = $props()
</script>

<div class={twJoin('mt-3 flex gap-x-3 items-center', ownerIsEditing && !editingAvatar && 'group')}>
  {#if editingDisplayName && !editingAvatar}
    <input
      type="text"
      bind:value={displayName}
      class="italic font-serif text-3xl ml-5 w-[calc(100%-4rem)] focus-visible:outline-none border-b border-b-white/50"
    />
  {:else}
    <h1 class="italic font-serif text-3xl pl-5">{displayName}</h1>
  {/if}

  {#if ownerIsEditing && !editingAvatar}
    <button
      onclick={() => (editingDisplayName = !editingDisplayName)}
      aria-label="Edit display name"
      class="opacity-0 focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100 transition-opacity hover:cursor-pointer"
    >
      {#if editingDisplayName}
        <SolarCheckCircleBoldDuotone height={20} width={20} />
      {:else}
        <SolarPenBoldDuotone height={18} width={18} />
      {/if}
    </button>
  {/if}
</div>
