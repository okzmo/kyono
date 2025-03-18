<script lang="ts">
  import SolarPenBoldDuotone from '~icons/solar/pen-bold-duotone'
  import SolarCheckCircleBoldDuotone from '~icons/solar/check-circle-bold-duotone'
  import { twJoin } from 'tailwind-merge'

  interface Props {
    ownerIsEditing: boolean
    editingDescription: boolean
    description: string | null
    editingAvatar: boolean
  }

  let {
    description = $bindable(),
    editingDescription = $bindable(),
    ownerIsEditing,
    editingAvatar,
  }: Props = $props()
</script>

<div
  class={twJoin('flex gap-x-2 items-center', ownerIsEditing && !editingAvatar && 'group !gap-x-3')}
>
  {#if editingDescription && !editingAvatar}
    <input
      type="text"
      bind:value={description}
      class="font-sans text-white/65 ml-5 w-[calc(100%-4rem)] focus-visible:outline-none border-b border-b-white/50"
    />
  {:else}
    <p class="font-sans text-white/65 md:pl-5">{description || 'add a description'}</p>
  {/if}

  {#if ownerIsEditing && !editingAvatar}
    <button
      onclick={() => (editingDescription = !editingDescription)}
      aria-label="Edit description"
      class="opacity-0 focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100 transition-opacity hover:cursor-pointer"
    >
      {#if editingDescription}
        <SolarCheckCircleBoldDuotone height={18} width={18} />
      {:else}
        <SolarPenBoldDuotone height={14} width={14} />
      {/if}
    </button>
  {/if}
</div>
